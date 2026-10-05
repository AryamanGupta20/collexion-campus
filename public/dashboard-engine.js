(async()=>{
const roots=[...document.querySelectorAll('.campus-world')];
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let THREE;
try{THREE=await import('https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js');}
catch{roots.forEach(r=>{const label=r.querySelector('.scene-label');if(label)label.textContent='Animated illustration · 3D could not load';});return;}
const palette={purple:0xb6a0f9,light:0xece6ff,blue:0x637de2,dark:0x172a53,ink:0x071124,cyan:0x83dce9,pink:0xe6a9dc,gold:0xe7d1a2};
let live=null,last=0;
function create(root,stage){
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(35,1,.1,100);
const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.setClearColor(0,0);
renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.35;
stage.appendChild(renderer.domElement);renderer.domElement.setAttribute('aria-label','Interactive decorative 3D campus scene');renderer.domElement.setAttribute('role','img');stage.dataset.loaded='true';
scene.add(new THREE.HemisphereLight(0xcac2ff,0x22345b,2.4));
const key=new THREE.DirectionalLight(0xf0e8ff,4);key.position.set(-4,7,5);scene.add(key);
const rim=new THREE.PointLight(0x67bbff,40,20);rim.position.set(4,3,-3);scene.add(rim);
const world=new THREE.Group();scene.add(world);
const moves=[];let targetX=0,targetY=0;
const mat=(c,metal=.2)=>new THREE.MeshStandardMaterial({color:palette[c]??c,metalness:metal,roughness:.3});
const materials=Object.fromEntries(Object.keys(palette).map(k=>[k,mat(k)]));
const glow=new THREE.MeshBasicMaterial({color:palette.cyan});
function mesh(g,m,parent=world,x=0,y=0,z=0){const o=new THREE.Mesh(g,typeof m==='string'?materials[m]:m);o.position.set(x,y,z);parent.add(o);return o;}
const box=(w,h,d,m,p,x=0,y=0,z=0)=>mesh(new THREE.BoxGeometry(w,h,d),m,p,x,y,z);
const ball=(r,m,p,x=0,y=0,z=0)=>mesh(new THREE.SphereGeometry(r,28,20),m,p,x,y,z);
const cyl=(a,b,h,m,p,x=0,y=0,z=0)=>mesh(new THREE.CylinderGeometry(a,b,h,48),m,p,x,y,z);
function ring(r,t,m,p,x=0,y=0,z=0){return mesh(new THREE.TorusGeometry(r,t,12,80),m,p,x,y,z);}
function float(o,rate=1,amp=.12){moves.push({o,y:o.position.y,rate,amp});return o;}
function planet(p,x,y,z,s=1){const g=new THREE.Group();p.add(g);g.position.set(x,y,z);ball(s*.4,'purple',g);const r=ring(s*.66,s*.035,'gold',g);r.rotation.x=1.2;r.rotation.y=.3;float(g,.7,.14);return g;}
function book(p,x,y,z,color='purple',s=1){const g=new THREE.Group();p.add(g);g.position.set(x,y,z);g.scale.setScalar(s);box(.65,.11,.9,color,g,0,-.09,0);box(.61,.18,.84,'light',g);box(.65,.06,.9,color,g,0,.12,0);box(.06,.25,.9,color,g,-.31,0,0);return g;}
function coin(p,x,y,z){const g=new THREE.Group();p.add(g);g.position.set(x,y,z);const c=cyl(.22,.22,.065,'gold',g);c.rotation.x=Math.PI/2;const r=ring(.15,.016,'light',g,0,0,.04);return g;}
function laptop(p,x,y,z,s=1){const g=new THREE.Group();p.add(g);g.position.set(x,y,z);g.scale.setScalar(s);box(.85,.065,.6,'purple',g);const lid=box(.85,.55,.045,'blue',g,0,.28,-.25);lid.rotation.x=-.14;box(.73,.42,.02,'ink',g,0,.28,-.21);for(let i=0;i<3;i++)box(.35-i*.06,.025,.025,'cyan',g,-.1,.36-i*.09,-.18);for(let i=0;i<4;i++)box(.64,.012,.045,'dark',g,0,.04,-.14+i*.08);return g;}
function robot(p,x,y,z,s=1){const g=new THREE.Group();p.add(g);g.position.set(x,y,z);g.scale.setScalar(s);ball(.3,'light',g,0,.52,0);box(.44,.21,.15,'ink',g,0,.54,.22);ball(.04,glow,g,-.11,.55,.31);ball(.04,glow,g,.11,.55,.31);box(.42,.43,.31,'purple',g,0,.1,0);ball(.09,'cyan',g,0,.12,.2);for(const dir of [-1,1]){const arm=box(.13,.38,.14,'light',g,dir*.31,.14,0);arm.rotation.z=dir*.45;box(.14,.24,.19,'blue',g,dir*.13,-.22,0);}return g;}
function rocket(p,x,y,z,s=1){const g=new THREE.Group();p.add(g);g.position.set(x,y,z);g.scale.setScalar(s);cyl(.25,.3,1.05,'light',g);mesh(new THREE.ConeGeometry(.25,.43,40),'purple',g,0,.74,0);ball(.145,'blue',g,0,.18,.25);ring(.15,.025,'gold',g,0,.18,.25);for(const a of [0,2.094,4.189]){const fin=mesh(new THREE.ConeGeometry(.2,.48,3),'blue',g,Math.sin(a)*.28,-.4,Math.cos(a)*.28);fin.rotation.y=a;}const flame=mesh(new THREE.ConeGeometry(.18,.6,24),'cyan',g,0,-.82,0);flame.rotation.z=Math.PI;return g;}
function observatory(p,x=0,y=0,z=0){const g=new THREE.Group();p.add(g);g.position.set(x,y,z);cyl(.88,.92,.55,'blue',g,0,-.1,0);mesh(new THREE.SphereGeometry(.88,40,24,0,Math.PI*2,0,Math.PI/2),'purple',g,0,.18,0);for(let i=0;i<8;i++){const a=i*Math.PI/4;const w=box(.12,.23,.035,'cyan',g,Math.sin(a)*.9,-.1,Math.cos(a)*.9);w.rotation.y=a;}const tele=new THREE.Group();g.add(tele);tele.position.set(.2,.65,.2);tele.rotation.z=-.9;const tube=cyl(.12,.14,.9,'light',tele,0,.23,0);cyl(.16,.16,.1,'dark',tele,0,.7,0);ring(1.04,.045,'gold',g,0,-.4,0).rotation.x=Math.PI/2;return g;}
function platform(p,x,y,z,s=1){const g=new THREE.Group();p.add(g);g.position.set(x,y,z);g.scale.setScalar(s);cyl(1.3,1.1,.2,'blue',g);cyl(1.13,.55,.45,'dark',g,0,-.29,0);const r=ring(1.32,.024,'cyan',g,0,.04,0);r.rotation.x=Math.PI/2;return g;}
const kind=root.dataset.world;
if(kind==='orbital'){
platform(world,0,-.7,0,1.2);observatory(world,0,-.08,0);
for(let i=0;i<3;i++){const r=ring(1.65+i*.3,.018,i%2?'blue':'purple');r.rotation.x=1.15+i*.3;r.rotation.y=.35*i;r.userData.spin=.12+i*.08;}
planet(world,1.8,1.35,-.5,.8);float(laptop(world,-1.7,.6,.5,.8));float(book(world,.9,-.05,1.6,'pink',.8));float(robot(world,-.4,-.2,1.15,.55));camera.position.set(4,2.6,6.8);
}else if(kind==='hologram'){
platform(world,0,-1,0,1.1);const core=mesh(new THREE.IcosahedronGeometry(.62,0),mat('cyan',.55),world,0,.6,0);core.userData.spin=.4;
for(let i=0;i<3;i++){const r=ring(1.15+i*.25,.026,i%2?'purple':'cyan',world,0,.6,0);r.rotation.set(i*.7,.6+i*.7,.3);r.userData.spin=.25+i*.1;}
float(robot(world,0,-.4,.7,.8));for(let i=0;i<5;i++){const a=i*Math.PI*2/5;const g=new THREE.Group();world.add(g);g.position.set(Math.cos(a)*1.9,.35+Math.sin(a)*.3,Math.sin(a)*1.6);const panel=box(.65,.85,.08,'dark',g);box(.57,.045,.02,'cyan',g,0,.33,.05);for(let n=0;n<3;n++)box(.4-n*.07,.035,.02,'purple',g,-.04,.13-n*.13,.05);g.rotation.y=-a+.8;float(g,1+i*.14,.16);}camera.position.set(3,1.8,7.8);
}else if(kind==='library'){
platform(world,0,-1,0,1.3);for(let i=0;i<5;i++){const b=book(world,-.6,-.65+i*.23,0,i%2?'blue':'purple',1.3);b.rotation.y=i*.12;}
const open=new THREE.Group();world.add(open);open.position.set(.6,.6,.3);for(const dir of [-1,1]){const page=book(open,dir*.31,0,0,'light',.9);page.rotation.z=dir*-.28;}float(open,.8,.15);
float(laptop(world,.8,-.25,.6,1.2),1,.13);float(robot(world,-1.5,.1,.4,.75));for(let i=0;i<7;i++){const a=i*.9;const b=book(world,Math.cos(a)*2,.55+Math.sin(a)*.4,Math.sin(a)*1.2,i%2?'pink':'purple',.55);b.rotation.set(.1,a,.3);float(b,.7+i*.1,.13);}planet(world,1.8,1.4,-.9,.6);camera.position.set(3,2.6,8);
}else if(kind==='island'){
const p=platform(world,0,-.5,0,1.2);observatory(p,0,.5,-.25);
for(let i=0;i<5;i++){const a=i*1.257;const g=platform(world,Math.cos(a)*2,.05+Math.sin(a)*.2,Math.sin(a)*1.6,.45);if(i===0)laptop(g,0,.3,0);if(i===1)robot(g,0,.5,0,.7);if(i===2)rocket(g,0,.7,0,.5);if(i===3){for(let n=0;n<3;n++)coin(g,n*.19-.2,.4+n*.13,0);}if(i===4)book(g,0,.3,0);float(g,.6+i*.1,.09);const bridge=box(1.2,.07,.18,'purple',world,Math.cos(a)*1.35,-.35,Math.sin(a)*1.1);bridge.rotation.y=-a;}
for(let i=0;i<6;i++){const c=ball(.32,'light',world,-2+i*.8,-1.2,-.5+(i%2));c.scale.set(1.6,.45,1);}
planet(world,1.8,1.8,-1,.65);camera.position.set(4,3.8,7.6);
}else{
platform(world,0,-1,0,1.1);const r=rocket(world,0,.3,0,1.4);r.rotation.z=-.15;float(r,.8,.2);for(let i=0;i<4;i++){const g=ring(.7+i*.25,.03,i%2?'purple':'cyan',world,0,-.8-i*.13,0);g.rotation.x=Math.PI/2;g.userData.spin=.25;}
float(robot(world,-1.4,-.45,.4,.7));float(laptop(world,1.35,0,.2,.75));planet(world,-1.3,1.4,-1,.7);for(let i=0;i<10;i++){const b=box(.025,.35+Math.random()*.3,.025,'cyan',world,(Math.random()-.5)*3.5,Math.random()*3-1,-.9);b.userData.drift=true;}camera.position.set(3,1.7,7.2);
}
const stars=new THREE.BufferGeometry();const positions=[];let seed=53;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};for(let i=0;i<150;i++)positions.push((rnd()-.5)*12,(rnd()-.5)*8,(rnd()-.5)*8-3);stars.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));const dust=new THREE.Points(stars,new THREE.PointsMaterial({color:palette.light,size:.018,transparent:true,opacity:.75}));scene.add(dust);
camera.lookAt(0,.1,0);
function resize(){const w=Math.max(stage.clientWidth,1),h=Math.max(stage.clientHeight,1);renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
const ro=new ResizeObserver(resize);ro.observe(stage);resize();
const pointer=e=>{const b=stage.getBoundingClientRect();targetX=(e.clientX-b.left)/b.width-.5;targetY=(e.clientY-b.top)/b.height-.5;};const leave=()=>{targetX=targetY=0;};stage.addEventListener('pointermove',pointer);stage.addEventListener('pointerleave',leave);
const label=stage.querySelector('.scene-label');if(label)label.textContent='MOVE YOUR POINTER TO EXPLORE';
return{root,stage,render(t){const motion=!reduced.matches&&root.dataset.motion!=='off';const time=motion?t:0;for(const m of moves)m.o.position.y=m.y+Math.sin(time*m.rate)*m.amp;world.rotation.y+=( (motion?targetX*.35+Math.sin(time*.12)*.06:0)-world.rotation.y)*.05;world.rotation.x+=((motion?targetY*.12:0)-world.rotation.x)*.05;world.traverse(o=>{if(o.userData.spin&&motion)o.rotation.z+=o.userData.spin*.015;if(o.userData.drift&&motion)o.position.y=(o.position.y+.014)%3;});dust.rotation.y=motion?time*.018:0;renderer.render(scene,camera);},dispose(){ro.disconnect();stage.removeEventListener('pointermove',pointer);stage.removeEventListener('pointerleave',leave);const gs=new Set(),ms=new Set();scene.traverse(o=>{if(o.geometry)gs.add(o.geometry);if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>ms.add(m));});gs.forEach(g=>g.dispose());ms.forEach(m=>m.dispose());renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove();delete stage.dataset.loaded;}};
}
function frame(ts){if(!document.getElementById('campus-dashboard-worlds')){live?.dispose();return;}if(ts-last>32&&!document.hidden){last=ts;const root=roots.find(r=>r.isConnected&&!r.closest('[data-variant]').hidden);const stage=root?.querySelector('.dash-cosmos');if(live?.stage!==stage){live?.dispose();live=null;if(stage&&!stage.dataset.failed){try{live=create(root,stage);}catch{stage.dataset.failed='true';const label=stage.querySelector('.scene-label');if(label)label.textContent='Animated illustration · 3D unavailable';}}}live?.render(ts/1000);}requestAnimationFrame(frame);}
requestAnimationFrame(frame);
for(const root of roots){root.addEventListener('pointermove',e=>{const tile=e.target.closest('.dash-tile');if(!tile||reduced.matches||root.dataset.motion==='off')return;const b=tile.getBoundingClientRect();tile.style.setProperty('--tilt-x',(-(e.clientY-b.top-b.height/2)/b.height*8)+'deg');tile.style.setProperty('--tilt-y',((e.clientX-b.left-b.width/2)/b.width*10)+'deg');});root.addEventListener('pointerout',e=>{const tile=e.target.closest('.dash-tile');if(tile&&!tile.contains(e.relatedTarget)){tile.style.setProperty('--tilt-x','0deg');tile.style.setProperty('--tilt-y','0deg');}});}
})();
