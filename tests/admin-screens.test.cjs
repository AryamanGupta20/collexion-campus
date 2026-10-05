const fs=require('fs'),vm=require('vm'),assert=require('assert');
const nodes=new Map();const decode=s=>s.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'");
class El{constructor(){this.handlers={};this.value='';this.dataset={};this.attrs={};}setAttribute(k,v){this.attrs[k]=v;}addEventListener(k,f){this.handlers[k]=f;}querySelector(s){return nodes.get(s.slice(1));}set innerHTML(v){this.html=v;for(const m of v.matchAll(/<(input|textarea|select|p)[^>]*id="([^"]+)"[^>]*>/g)){const el=new El;el.value=decode((m[0].match(/value="([^"]*)"/)||[])[1]||'');if(m[1]==='textarea')el.value=decode(v.slice(m.index+m[0].length).split('</textarea>')[0]);if(m[1]==='select'){const body=v.slice(m.index+m[0].length).split('</select>')[0];const opts=[...body.matchAll(/<option([^>]*)>(.*?)<\/option>/g)];el.value=decode((opts.find(x=>x[1].includes('selected'))||opts[0])[2]);}nodes.set(m[2],el);}}get innerHTML(){return this.html;}}
const root=new El,screen=new El;nodes.set('admin-screen',screen);nodes.set('admin-nav',new El);nodes.set('admin-feedback',new El);

(async()=>{
const Campus={catalog:[],catalogVideos:[],fatal(e){throw e},async api(path,method,data){if(path.includes('/logins'))return{logins:[]};if(path==='/admin/content')return{id:data.id||'new-course'};return{};}};
const ctx={document:{getElementById:()=>root},window:{addEventListener(){}},Campus,URL,console};vm.createContext(ctx);vm.runInContext(fs.readFileSync(__dirname+'/../public/admin.js','utf8'),ctx);
await ctx.window.mountAdmin({students:[],requests:[],content:{items:[],settings:{}}});
async function page(value){await root.handlers.click({target:{closest:s=>s==='[data-page]'?{dataset:{page:value}}:null}});}
async function click(action,value){await root.handlers.click({target:{closest:s=>s==='[data-action]'?{dataset:{action,value}}:null}});}
for(const p of ['overview','students','requests','courses','videos','settings']){await page(p);assert(screen.innerHTML.length>100);}
await page('courses');await click('edit-content','new');
const put=(id,value)=>{assert(nodes.has(id),id);nodes.get(id).value=value;};
put('content-title','Test course');put('content-roadmap','Learn basics\nBuild a project');put('content-subject','Programming');put('content-url','https://www.youtube.com/playlist?list=example');
await root.handlers.submit({preventDefault(){},target:{id:'content-form'}});assert(screen.innerHTML.includes('Test course'));
await ctx.window.mountAdmin({students:[{id:'u1',name:'Student',email:'student@example.test',created_at:'2026-10-05',login_count:2}],requests:[{id:'r1',user_id:'u1',category:'Project help',description:'Help with my project',status:'New',messages:[],files:[],created_at:'2026-10-05'}],content:{items:[],settings:{}}});
await page('students');await click('student','u1');assert(screen.innerHTML.includes('student@example.test'));assert(screen.innerHTML.includes('Passwords are never visible'));
await click('request','r1');put('reply-text','Please describe what you tried.');await root.handlers.submit({preventDefault(){},target:{id:'reply-form'}});assert(screen.innerHTML.includes('Please describe what you tried.'));
console.log('PASS: empty admin screens, student details, real API content and reply wiring. DOM stub only; browser visuals unverified.');
})().catch(e=>{console.error(e);process.exitCode=1});
