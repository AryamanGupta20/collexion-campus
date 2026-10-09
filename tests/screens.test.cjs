const fs=require('fs'),vm=require('vm'),assert=require('assert');
const elements=new Map();
const decode=s=>s.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>');
class Element{constructor(id){this.id=id;this.value='';this.handlers={};this.style={};this.hidden=false;this.dataset={};this.attributes={};this.parentElement={setAttribute(){}};this._html='';}addEventListener(t,f){(this.handlers[t]??=[]).push(f);}setAttribute(k,v){this.attributes[k]=v;}set innerHTML(v){this._html=v;if(this.id==='hologram-campus-screen')elements.clear();for(const m of v.matchAll(/<(input|select|textarea|div|form|p|button|section|aside|span)[^>]*\bid="([^"]+)"[^>]*>/g)){const el=new Element(m[2]);const attr=m[0];el.hidden=/\bhidden\b/.test(attr);if(m[1]==='input'){el.value=decode((attr.match(/\bvalue="([^"]*)"/)||[])[1]||'');}if(m[1]==='textarea'){el.value=decode(v.slice(m.index+m[0].length).split('</textarea>')[0]);}if(m[1]==='select'){const body=v.slice(m.index+m[0].length).split('</select>')[0];const opts=[...body.matchAll(/<option([^>]*)>([\s\S]*?)<\/option>/g)];el.value=decode((opts.find(o=>o[1].includes('selected'))||opts[0]||[])[2]||'');}elements.set(el.id,el);}}get innerHTML(){return this._html;}querySelector(s){return elements.get(s.slice(1))||null;}querySelectorAll(){return [];} }
const screen=new Element('hologram-campus-screen');const root=new Element('root');root.querySelector=s=>s==='#hologram-campus-screen'?screen:null;root.querySelectorAll=()=>[];root.contains=()=>true;

(async()=>{
let code=fs.readFileSync(__dirname+'/../public/student.js','utf8');
code=code.replace('render();\nreturn Campus.controller;', 'globalThis.testApi={state,courses,stages,render};render();return Campus.controller;');
const writes=[];let version=0;
const Campus={status(){},fatal(e){throw e},async api(path,method,data){writes.push({path,method,data});if(path==='/state')return {version:++version};if(path==='/portfolio/share')return{token:data.enabled?'test-token':null};throw Error('Unexpected route '+path);}};
const context={document:{getElementById:()=>root},window:{addEventListener(){},removeEventListener(){},print(){}},Campus,location:{origin:"https://example.test"},Intl,console,Date,Math,URL,setTimeout,clearTimeout};vm.createContext(context);vm.runInContext(code,context);
const ctl=await context.window.mountStudent({data:{},user:{name:'Test Student',email:'test@example.test'},version:0,requests:[],content:{items:[],settings:{channel:'https://whatsapp.com/channel/test'}}});
const t=context.testApi;assert.equal(t.state.course,null);
async function action(a,v=''){for(const f of root.handlers.click)await f({target:{closest:s=>s==='[data-action]'?{dataset:{action:a,value:v}}:null}});}
assert.equal(t.courses.length,15);
for(const c of t.courses){await action('course',c.id);await action('nav','courses');assert(screen.innerHTML.includes('Your roadmap'));await action('course-tab','syllabus');assert(screen.innerHTML.includes('playlist'));}
for(const section of ['home','social','business','money','service','profile','settings','portfolio']){await action('nav',section);assert(screen.innerHTML.length>100);}
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
await ctl.flush();assert(writes.some(w=>w.path==='/state'));assert.equal(writes.findLast(w=>w.path==='/state').data.data.course,t.state.course);
await action('nav','portfolio');await action('live-share');assert(writes.some(w=>w.path==='/portfolio/share'&&w.data.enabled));await action('live-share');assert(writes.some(w=>w.path==='/portfolio/share'&&!w.data.enabled));
ctl.dispose();
console.log('PASS: 15 student course screens, all primary sections, database save wiring, private portfolio sharing and revocation. DOM stub only; browser visuals unverified.');
})().catch(e=>{console.error(e);process.exitCode=1});
