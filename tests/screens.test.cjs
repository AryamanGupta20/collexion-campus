const fs=require('fs'),vm=require('vm'),assert=require('assert');
const elements=new Map();
const decode=s=>s.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>');
class Element{constructor(id){this.id=id;this.value='';this.handlers={};this.style={};this.hidden=false;this.dataset={};this.attributes={};this.parentElement={setAttribute(){}};this._html='';}addEventListener(t,f){(this.handlers[t]??=[]).push(f);}setAttribute(k,v){this.attributes[k]=v;}set innerHTML(v){this._html=v;if(this.id==='hologram-campus-screen')elements.clear();for(const m of v.matchAll(/<(input|select|textarea|div|form|p|button|section|aside|span)[^>]*\bid="([^"]+)"[^>]*>/g)){const el=new Element(m[2]);const attr=m[0];el.hidden=/\bhidden\b/.test(attr);if(m[1]==='input'){el.value=decode((attr.match(/\bvalue="([^"]*)"/)||[])[1]||'');}if(m[1]==='textarea'){el.value=decode(v.slice(m.index+m[0].length).split('</textarea>')[0]);}if(m[1]==='select'){const body=v.slice(m.index+m[0].length).split('</select>')[0];const opts=[...body.matchAll(/<option([^>]*)>([\s\S]*?)<\/option>/g)];el.value=decode((opts.find(o=>o[1].includes('selected'))||opts[0]||[])[2]||'');}elements.set(el.id,el);}}get innerHTML(){return this._html;}querySelector(s){return elements.get(s.slice(1))||null;}querySelectorAll(){return [];} }
const screen=new Element('hologram-campus-screen');const root=new Element('root');root.querySelector=s=>s==='#hologram-campus-screen'?screen:null;root.querySelectorAll=()=>[];root.contains=()=>true;

(async()=>{
let code=fs.readFileSync(__dirname+'/../public/student.js','utf8');
code=code.replace('render();\nreturn Campus.controller;', 'globalThis.testApi={state,courses,resources,playlistRows,stages,render,careerTools};render();return Campus.controller;');
const writes=[];let version=0;
const Campus={status(){},fatal(e){throw e},async api(path,method,data){writes.push({path,method,data});if(path==='/state')return {version:++version};if(path==='/portfolio/share')return{token:data.enabled?'test-token':null};throw Error('Unexpected route '+path);}};
const context={document:{getElementById:()=>root},window:{addEventListener(){},removeEventListener(){},print(){}},Campus,location:{origin:"https://example.test"},Intl,console,Date,Math,URL,setTimeout,clearTimeout};vm.createContext(context);for(const file of ['career-data.js','career-tools.js'])vm.runInContext(fs.readFileSync(__dirname+'/../public/'+file,'utf8'),context);vm.runInContext(code,context);
const ctl=await context.window.mountStudent({data:{},user:{name:'Test Student',email:'test@example.test'},version:0,requests:[],content:{items:[],settings:{channel:'https://whatsapp.com/channel/test'}}});
const t=context.testApi;assert.equal(t.state.course,null);
assert(screen.innerHTML.includes('Welcome,'));assert(screen.innerHTML.includes('Test Student'));
const member=context.window.CampusMemberCard({name:'<img src=x>',created_at:'2026-10-10T00:00:00Z',email:'private@example.test',recoveryCode:'secret'});
assert(member.includes('&lt;img src=x&gt;'));assert(!member.includes('private@example.test'));assert(!member.includes('secret'));
assert(member.includes('Not an official college ID'));assert(member.includes('10 Oct 2026'));
assert(member.includes('Choose your course'));

async function action(a,v=''){for(const f of root.handlers.click)await f({target:{closest:s=>s==='[data-action]'?{dataset:{action:a,value:v}}:null}});}
assert.equal(t.courses.length,25);
for(const c of t.courses){await action('course',c.id);await action('nav','courses');assert(screen.innerHTML.includes('Your roadmap'));await action('course-tab','syllabus');assert(screen.innerHTML.includes('playlist'));}
assert.equal(new Set(t.courses.map(c=>c.id)).size,25);
const bca=t.courses.find(c=>c.id==='bca');
assert.equal(bca.subjects.length,20);
assert.equal(bca.subjects.filter(k=>t.resources[k][2]==='Hindi').length,17);
for(const c of t.courses){
 assert.equal(new Set(c.subjects).size,c.subjects.length);
 t.state.lang='All';const html=t.playlistRows(c);
 for(const key of c.subjects){assert(t.resources[key],key);assert(html.includes('https://www.youtube.com/playlist?list='+t.resources[key][3]),c.id+' '+key);}
 assert(t.stages(c).length>0);
}
await action('course','bca');await action('course-tab','syllabus');
const lang=elements.get('hologram-playlist-lang');
for(const handler of lang.handlers.change)handler({target:{value:'Hindi'}});
let rows=elements.get('hologram-playlist-results').innerHTML;
assert.equal((rows.match(/class="c-subject"/g)||[]).length,17);assert(!rows.includes('· English ·'));
assert(rows.includes('Extra learning · optional'));
for(const handler of lang.handlers.change)handler({target:{value:'English'}});
rows=elements.get('hologram-playlist-results').innerHTML;
assert.equal((rows.match(/class="c-subject"/g)||[]).length,3);assert(!rows.includes('· Hindi ·'));
t.state.lang='All';await action('all-courses');
const group=elements.get('hologram-course-group');
for(const handler of group.handlers.change)handler({target:{value:'Postgraduate'}});
assert(elements.get('hologram-course-results').innerHTML.includes('5 courses found'));
for(const handler of group.handlers.change)handler({target:{value:'Diploma'}});
assert(elements.get('hologram-course-results').innerHTML.includes('PGDCA'));
for(const handler of group.handlers.change)handler({target:{value:'All courses'}});
for(const handler of elements.get('hologram-course-query').handlers.input)handler({target:{value:'MCA'}});
assert(elements.get('hologram-course-results').innerHTML.includes('1 course found'));
for(const section of ['home' ,'social','business','money','service','profile','settings','portfolio']){await action('nav',section);assert(screen.innerHTML.length>100);}
await action('nav','resume');
assert(screen.innerHTML.includes('Résumé Builder'));
await action('tool-add','education');
for(const handler of root.handlers.input)handler({target:{dataset:{resumeField:'education.0.degree'},value:'BCA'}});
for(const handler of root.handlers.input)handler({target:{dataset:{resumeField:'education.0.institution'},value:'Example College'}});
for(const handler of root.handlers.input)handler({target:{dataset:{resumeField:'role'},value:'Frontend Developer'}});
for(const handler of root.handlers.input)handler({target:{dataset:{resumeField:'linkedin'},value:'https://www.linkedin.com/in/example'}});
assert(t.careerTools.resumeDocument().includes('Example College'));
assert(!t.careerTools.resumeDocument().includes('<h2>Work experience</h2>'));
await action('tool-remove','education:0');assert(!t.careerTools.resumeDocument().includes('Example College'));
await action('tool-undo');assert(t.careerTools.resumeDocument().includes('Example College'));
for(const handler of root.handlers.input)handler({target:{dataset:{resumeField:'summary'},value:'<script>alert(1)</script>'}});
assert(!t.careerTools.resumeDocument().includes('<script>'));
assert(t.careerTools.resumeDocument().includes('&lt;script&gt;'));
await action('nav','roadmaps');
assert.equal(t.careerTools.matches('back end').length,1);
assert.equal(t.careerTools.matches('full-stack').length,1);
assert.equal(t.careerTools.matches('astronaut').length,0);
for(const role of context.window.CAMPUS_CAREERS.roles){await action('tool-role',role.id);assert(screen.innerHTML.includes(role.title));assert(screen.innerHTML.includes('https://www.youtube.com/playlist?list='));}
await action('tool-role','frontend');
for(const handler of root.handlers.change)handler({target:{dataset:{careerStep:'web'},checked:true}});
assert(t.careerTools.snapshot().career.progress.frontend.includes('web'));
await action('tool-use-role','backend');assert.equal(t.state.section,'resume');assert(t.careerTools.resumeDocument().includes('Backend Developer'));
const printable=t.careerTools.printDocument();assert(printable.includes('@page{size:A4'));assert(!printable.includes('Save now'));assert(!printable.includes('account-bar'));
await ctl.flush();assert.equal(writes.findLast(w=>w.path==='/state').data.data.resume.education[0].degree,'BCA');
assert.equal(writes.findLast(w=>w.path==='/state').data.data.career.role,'frontend');
await action('nav','business');
const briefForm=elements.get('hologram-find-team-form');
assert(briefForm,'Idea brief form must use the real dashboard ID');
assert(briefForm.handlers.submit?.length,'Create my brief must have a submit handler');
elements.get('hologram-ft-idea').value='Campus book exchange';
elements.get('hologram-ft-need').value='A designer';
elements.get('hologram-ft-time').value='Weekends';
let prevented=false;
for(const handler of briefForm.handlers.submit)await handler({preventDefault(){prevented=true;},target:briefForm});
assert(prevented,'Submitting must not reload the page');
assert.equal(elements.get('hologram-team-post-output').hidden,false);
assert(elements.get('hologram-team-post').value.includes('Campus book exchange'));
assert(elements.get('hologram-team-post').value.includes('A designer'));
await action('business-tab','cost');await action('business-tab','team');
assert.equal(elements.get('hologram-ft-idea').value,'Campus book exchange');
assert.equal(elements.get('hologram-team-post-output').hidden,false);
await action('course','bca');await ctl.flush();assert(writes.some(w=>w.path==='/state'));assert.equal(writes.findLast(w=>w.path==='/state').data.data.course,t.state.course);
await action('nav','portfolio');await action('live-share');assert(writes.some(w=>w.path==='/portfolio/share'&&w.data.enabled));await action('live-share');assert(writes.some(w=>w.path==='/portfolio/share'&&!w.data.enabled));
ctl.dispose();
console.log('PASS: 25 student course screens, 20 BCA playlists and language filters, all primary sections, database save wiring, private portfolio sharing and revocation. DOM stub only; browser visuals unverified.');
})().catch(e=>{console.error(e);process.exitCode=1});
