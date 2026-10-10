window.CampusMemberCard=function(user,course='Choose your course',name=user.name){
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const initials=String(name||'Student').trim().split(/\s+/).slice(0,2).map(n=>Array.from(n)[0]||'').join('').toUpperCase();
const joined=new Date(user.created_at);
const date=Number.isNaN(joined.getTime())?'Member since signup':joined.toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'});
return `<article class="campus-pass" aria-label="Your Collexion Campus member card"><div class="pass-slot" aria-hidden="true"></div><div class="pass-brand"><strong>Collexion<br>Campus</strong><span>MEMBER PASS</span></div><div class="pass-person"><div class="pass-avatar" aria-hidden="true">${esc(initials)}</div><div><span class="pass-label">NAME</span><h3>${esc(name||'Student')}</h3><span class="pass-label">LEARNING PATH</span><p>${esc(course)}</p></div></div><div class="pass-bottom"><div><span class="pass-label">JOINED</span><p>${esc(date)}</p></div><span class="pass-seal" aria-hidden="true">✦<small>YOU’RE IN</small></span></div><p class="pass-disclaimer">Your campus journey starts here.<br>Website membership · Not an official college ID</p></article>`;
};

window.mountStudent=async function(payload){
'use strict';
const root=document.getElementById('hologram-collexion-demo'),screen=root.querySelector('#hologram-campus-screen');
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icon=n=>`<i data-lucide="${n}" aria-hidden="true"></i>`;
const link=(u,t,cls='')=>`<a class="${cls}" href="${esc(u)}" target="_blank" rel="noopener noreferrer">${t}</a>`;
const yt=id=>'https://www.youtube.com/playlist?list='+id;
const rupees=p=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:2}).format(p/100);
const intMoney=v=>Math.round(Number(v)*100);
const btn=(t,a,v='',primary=false)=>`<button type="button" class="c-btn ${primary?'c-primary':''} cursor-interaction" data-action="${a}" data-value="${esc(v)}">${t}</button>`;
const field=(label,id,value='',type='text',extra='')=>`<div class="c-field"><label for="hologram-${id}">${label}</label><input id="hologram-${id}" type="${type}" value="${esc(value)}" ${extra}></div>`;
const select=(label,id,values,selected='')=>`<div class="c-field"><label for="hologram-${id}">${label}</label><select id="hologram-${id}">${values.map(v=>`<option ${v===selected?'selected':''}>${esc(v)}</option>`).join('')}</select></div>`;
const hero=(k,t,d,n)=>`<div class="c-hero"><div><div class="c-eyebrow">${k}</div><h2>${t}</h2><p>${d}</p></div><aside class="c-note">${n}</aside></div>`;
const sources={ignou:{name:'IGNOU · BCA programme',url:'https://www.ignou.ac.in/schools/programme/BCA_NEW'},christ:{name:'CHRIST · BCA programme',url:'https://bkc.christuniversity.in/courses/Nzc3'},du:{name:'University of Delhi · Computer Science',url:'https://academicaffairs.du.ac.in/syllabi/department-of-computer-science/'},vtu:{name:'VTU · Engineering schemes and syllabuses',url:'https://vtu.ac.in/en/b-e-scheme-syllabus/'},msu:{name:'Manonmaniam Sundaranar University · CS & IT, 2024–25',url:'https://www.msuniv.ac.in/images/academic/centre%20academic%20affairs/revised%20syllabus/2024-25-Batch/UG_Part-III-Major-C-Science/BScCS_IT.pdf'},bba:{name:'IGNOU · BBA programme',url:'https://www.ignou.ac.in/schools/programme/BBA'},com:{name:'University of Delhi · B.Com programme',url:'https://academicaffairs.du.ac.in/syllabi/b-com-p/'},econ:{name:'University of Delhi · Economics',url:'https://academicaffairs.du.ac.in/syllabi/department-of-economics/'},math:{name:'University of Delhi · Mathematics',url:'https://academicaffairs.du.ac.in/syllabi/department-of-mathematics/'},stats:{name:'University of Delhi · Statistics',url:'https://academicaffairs.du.ac.in/syllabi/department-of-statistics/'}};
const resources={
c:["C programming", "CodeWithHarry", "Hindi", "PLu0W_9lII9aiXlHcLx-mDH1Qul38wD3aR"],
cpp:["Object-oriented programming with C++", "CodeWithHarry", "Hindi", "PLu0W_9lII9agpFUAlPFe_VNSlXW5uE0YL"],
java:["Java programming", "CodeWithHarry", "Hindi", "PLu0W_9lII9agS67Uits0UnJyrYiXhDS6q"],
web:["Web development: HTML, CSS and more", "CodeWithHarry", "Hindi", "PLu0W_9lII9agq5TrH9XLIKQvv0iaF2X3w"],
javascript:["JavaScript programming", "CodeWithHarry", "Hindi", "PLu0W_9lII9ahR1blWXxgSlL4y9iQBnLpR"],
php:["PHP and web applications", "CodeWithHarry", "Hindi", "PLu0W_9lII9aikXkRE0WxDt1vozo3hnmtR"],
discrete:["Discrete mathematics", "Gate Smashers", "Hindi", "PLxCzCOWd7aiH2wwES9vPWsEL6ipTaUSl3"],
algo_hi:["Design and analysis of algorithms", "Gate Smashers", "Hindi", "PLxCzCOWd7aiHcmS4i14bI0VrMbZTUvlTa"],
ai_found:["Artificial intelligence foundations", "Gate Smashers", "Hindi", "PLxCzCOWd7aiHGhOHV-nwb0HR5US5GFKFI"],
cloud:["Cloud computing", "Gate Smashers", "Hindi", "PLxCzCOWd7aiHRHVUtR-O52MsrdUSrzuy4"],
toc:["Theory of computation", "Gate Smashers", "Hindi", "PLxCzCOWd7aiFM9Lj5G9G_76adtyb4ef7i"],

python:['Programming with Python','CodeWithHarry','Hindi','PLu0W_9lII9agwh1XjRt242xIpHhPT2llg'],
ds:['Data structures','Gate Smashers','Hindi','PLxCzCOWd7aiEwaANNt3OqJPVIxwp2ebiT'],
db:['Database management','Gate Smashers','Hindi','PLxCzCOWd7aiFAN6I8CuViBuCdJgiOkT2Y'],
os:['Operating systems','Gate Smashers','Hindi','PLxCzCOWd7aiGz9donHRrE9I3Mwn6XdP8p'],
cn:['Computer networks','Gate Smashers','Hindi','PLxCzCOWd7aiGFBD2-2joCpWOLUrDLvVV_'],
coa:['Computer architecture','Gate Smashers','Hindi','PLxCzCOWd7aiHMonh3G6QNKq53C6oNXGrX'],
se:['Software engineering','Gate Smashers','Hindi','PLxCzCOWd7aiEed7SKZBnC6ypFDWYLRvB2'],
algo:['Algorithms','Abdul Bari','English','PLDN4rrl48XKpZkf03iYFl-O29szjTrs_O'],
digital:['Digital electronics','Neso Academy','English','PLBlnK6fEyqRjMH3mWf6kwqiTbT798eAOm'],
linear:['Linear algebra','3Blue1Brown','English','PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab'],
calculus:['Calculus','3Blue1Brown','English','PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr'],
stats:['Statistics fundamentals','StatQuest','English','PLblh5JKOoLUK0FLuzwntyYI10UQFUhsY9'],
regression:['Regression and models','StatQuest','English','PLblh5JKOoLUIzaEkCLIUxQFjPIlapw8nU'],
ml:['Machine learning','StatQuest','English','PLblh5JKOoLUICTaGLRoHQDuF_7q2GfuJF'],
accounting:['Financial accounting basics','Accounting Stuff','English','PL5zKSeS09l339nB6ujJPQ9Rsv99_b-aTb'],
econ:['Economics foundations','CrashCourse','English','PL8dPuuaLjXtPNZwz5_o_5uirJ8gQXnhEO'],
enterprise:['Entrepreneurship foundations','CrashCourse','English','PL8dPuuaLjXtNamNKW5qlS-nKgA0on7Qze']
};
const courses=[
  [
    "bca",
    "BCA",
    "Computer Applications",
    "Computing",
    "cs",
    [
      "ignou",
      "christ"
    ],
    [
      "c",
      "python",
      "cpp",
      "java",
      "ds",
      "db",
      "os",
      "coa",
      "cn",
      "se",
      "web",
      "javascript",
      "php",
      "discrete",
      "algo_hi",
      "digital",
      "linear",
      "stats",
      "ai_found",
      "cloud"
    ],
    "Build and explain a small application with a database."
  ],
  [
    "bsc-cs",
    "B.Sc Computer Science",
    "Computer Science",
    "Computing",
    "cs",
    [
      "du",
      "msu"
    ],
    [
      "c",
      "python",
      "cpp",
      "java",
      "discrete",
      "linear",
      "ds",
      "db",
      "coa",
      "os",
      "cn",
      "algo_hi",
      "toc",
      "se",
      "web"
    ],
    "Create a software project and explain the computing ideas behind it."
  ],
  [
    "bsc-it",
    "B.Sc IT",
    "Information Technology",
    "Computing",
    "cs",
    [
      "msu"
    ],
    [
      "c",
      "python",
      "java",
      "ds",
      "db",
      "os",
      "cn",
      "web",
      "javascript",
      "php",
      "se",
      "cloud"
    ],
    "Build an IT support or information-management project."
  ],
  [
    "cse",
    "B.E. / B.Tech CSE",
    "Computer Science & Engineering",
    "Engineering",
    "cs",
    [
      "vtu",
      "du"
    ],
    [
      "c",
      "cpp",
      "python",
      "java",
      "discrete",
      "ds",
      "coa",
      "digital",
      "os",
      "db",
      "cn",
      "algo_hi",
      "toc",
      "se",
      "web",
      "cloud"
    ],
    "Build a complete application, test it, and explain your design choices."
  ],
  [
    "ise",
    "B.E. Information Science",
    "Information Science & Engineering",
    "Engineering",
    "cs",
    [
      "vtu"
    ],
    [
      "c",
      "python",
      "java",
      "ds",
      "db",
      "cn",
      "os",
      "discrete",
      "algo_hi",
      "se",
      "web",
      "cloud"
    ],
    "Build an information system with a clear data model."
  ],
  [
    "ai",
    "B.E. / B.Tech AI & ML",
    "Artificial Intelligence & Machine Learning",
    "Engineering",
    "ai",
    [
      "vtu"
    ],
    [
      "python",
      "linear",
      "stats",
      "ds",
      "db",
      "algo_hi",
      "ai_found",
      "ml",
      "regression"
    ],
    "Build a small model and report its limitations and evaluation results."
  ],
  [
    "aids",
    "B.E. / B.Tech AI & DS",
    "Artificial Intelligence & Data Science",
    "Engineering",
    "ai",
    [
      "vtu"
    ],
    [
      "python",
      "linear",
      "stats",
      "ds",
      "db",
      "algo_hi",
      "ai_found",
      "regression",
      "ml"
    ],
    "Clean a dataset, build a baseline, and explain your findings."
  ],
  [
    "data",
    "B.E. / B.Tech CSE (DS)",
    "Computer Science \u00b7 Data Science",
    "Engineering",
    "ai",
    [
      "vtu"
    ],
    [
      "python",
      "stats",
      "linear",
      "db",
      "ds",
      "algo_hi",
      "regression",
      "ai_found",
      "ml"
    ],
    "Turn a dataset into a clear report with reproducible analysis."
  ],
  [
    "cyber",
    "B.E. / B.Tech CSE (Cyber)",
    "Computer Science \u00b7 Cyber Security",
    "Engineering",
    "security",
    [
      "vtu"
    ],
    [
      "c",
      "python",
      "ds",
      "os",
      "cn",
      "db",
      "discrete",
      "web",
      "cloud"
    ],
    "Document security checks in a lab you own or have permission to use."
  ],
  [
    "iot",
    "B.E. / B.Tech CSE (IoT)",
    "Computer Science \u00b7 Internet of Things",
    "Engineering",
    "hardware",
    [
      "vtu"
    ],
    [
      "c",
      "cpp",
      "python",
      "digital",
      "coa",
      "cn",
      "os",
      "db",
      "cloud"
    ],
    "Build a sensor-to-dashboard prototype or a simulation."
  ],
  [
    "csbs",
    "B.E. / B.Tech CS & Business",
    "Computer Science & Business Systems",
    "Engineering",
    "cs",
    [
      "vtu"
    ],
    [
      "python",
      "java",
      "ds",
      "db",
      "cn",
      "se",
      "web",
      "stats",
      "econ"
    ],
    "Build a business-facing software project with a simple cost case."
  ],
  [
    "csd",
    "B.E. / B.Tech CS & Design",
    "Computer Science & Design",
    "Engineering",
    "cs",
    [
      "vtu"
    ],
    [
      "c",
      "python",
      "java",
      "ds",
      "db",
      "se",
      "web",
      "javascript"
    ],
    "Design and test an interface, then build its main flow."
  ],
  [
    "ce",
    "B.E. Computer Engineering",
    "Computer Engineering",
    "Engineering",
    "hardware",
    [
      "vtu"
    ],
    [
      "c",
      "cpp",
      "python",
      "ds",
      "coa",
      "digital",
      "os",
      "cn",
      "algo_hi"
    ],
    "Build a small system and explain how software meets hardware."
  ],
  [
    "ece",
    "B.E. / B.Tech ECE",
    "Electronics & Communication",
    "Engineering",
    "hardware",
    [
      "vtu"
    ],
    [
      "calculus",
      "linear",
      "digital",
      "python"
    ],
    "Prepare a tested electronics or communication-system project."
  ],
  [
    "ee",
    "B.E. / B.Tech EEE",
    "Electrical & Electronics",
    "Engineering",
    "hardware",
    [
      "vtu"
    ],
    [
      "calculus",
      "linear",
      "digital"
    ],
    "Prepare a circuit or control-system simulation with clear results."
  ],
  [
    "mca",
    "MCA",
    "Master of Computer Applications",
    "Postgraduate",
    "cs",
    [],
    [
      "java",
      "python",
      "ds",
      "db",
      "os",
      "cn",
      "algo_hi",
      "toc",
      "se",
      "web",
      "cloud"
    ],
    "Build a deployed application with tests and a clear design report."
  ],
  [
    "msc-cs",
    "M.Sc Computer Science",
    "Master of Science in Computer Science",
    "Postgraduate",
    "cs",
    [],
    [
      "python",
      "java",
      "discrete",
      "ds",
      "db",
      "os",
      "cn",
      "algo_hi",
      "toc",
      "ai_found"
    ],
    "Compare two computing approaches and document a working research prototype."
  ],
  [
    "msc-it",
    "M.Sc IT",
    "Master of Science in Information Technology",
    "Postgraduate",
    "cs",
    [],
    [
      "python",
      "java",
      "db",
      "os",
      "cn",
      "se",
      "web",
      "javascript",
      "cloud"
    ],
    "Build a secure information system and document deployment and testing."
  ],
  [
    "msc-ds",
    "M.Sc Data Science",
    "Master of Science in Data Science",
    "Postgraduate",
    "ai",
    [],
    [
      "python",
      "linear",
      "stats",
      "db",
      "ds",
      "algo_hi",
      "regression",
      "ai_found",
      "ml"
    ],
    "Compare models on a documented dataset and explain errors and data limits."
  ],
  [
    "msc-ai",
    "M.Sc Artificial Intelligence",
    "Master of Science in Artificial Intelligence",
    "Postgraduate",
    "ai",
    [],
    [
      "python",
      "linear",
      "stats",
      "ds",
      "algo_hi",
      "ai_found",
      "regression",
      "ml"
    ],
    "Evaluate an AI prototype against a simple baseline and report its limitations."
  ],
  [
    "btech-it",
    "B.E. / B.Tech IT",
    "Information Technology",
    "Engineering",
    "cs",
    [],
    [
      "c",
      "cpp",
      "python",
      "java",
      "ds",
      "db",
      "os",
      "cn",
      "se",
      "algo_hi",
      "web",
      "cloud"
    ],
    "Build and deploy a tested campus information system."
  ],
  [
    "bsc-ds",
    "B.Sc Data Science",
    "Data Science",
    "Computing",
    "ai",
    [],
    [
      "python",
      "linear",
      "stats",
      "db",
      "ds",
      "regression",
      "ai_found",
      "ml"
    ],
    "Clean a public dataset and present an analysis with reproducible code."
  ],
  [
    "bsc-ai",
    "B.Sc Artificial Intelligence",
    "Artificial Intelligence",
    "Computing",
    "ai",
    [],
    [
      "python",
      "linear",
      "stats",
      "ds",
      "db",
      "algo_hi",
      "ai_found",
      "ml"
    ],
    "Build a small classifier and show where it makes mistakes."
  ],
  [
    "bsc-cyber",
    "B.Sc Cyber Security",
    "Computer Science and Cyber Security",
    "Computing",
    "security",
    [],
    [
      "c",
      "python",
      "ds",
      "db",
      "os",
      "cn",
      "discrete",
      "web",
      "cloud"
    ],
    "Write a security report from a practice lab you own or may use."
  ],
  [
    "pgdca",
    "PGDCA",
    "Postgraduate Diploma in Computer Applications",
    "Diploma",
    "cs",
    [],
    [
      "c",
      "python",
      "java",
      "ds",
      "db",
      "os",
      "cn",
      "web",
      "se"
    ],
    "Build a small database application and explain how it works."
  ]
].map(([id,title,name,group,family,refs,subjects,project])=>({id,title,name,group,family,refs,subjects,project}));
const socialVideos=[
{title:'How to speak so that people want to listen',creator:'Julian Treasure · TED',lang:'English',id:'eIho2S0ZahI',tag:'Speaking with confidence',keys:'speak speaking speech public presentation stage nervous confidence communicate communication class',why:'A talk about voice, clarity, and how you come across when speaking.'},
{title:'Extraordinary Communication Skills',creator:'Sandeep Maheshwari',lang:'Hindi',id:'VczVqHJW0gg',tag:'Speaking with confidence',keys:'confidence shy shyness communication communicate speak speaking hindi nervous dar baat bolna',why:'A Hindi session about expressing yourself and communicating with others.'},
{title:'10 ways to have a better conversation',creator:'Celeste Headlee · TED',lang:'English',id:'R1vskiVDwl4',tag:'Starting conversations',keys:'conversation conversations friends friendship friend talking talk listen listening awkward social baat dost',why:'Ideas for listening and having more thoughtful conversations.'},
{title:'How to introduce yourself',creator:'BBC Learning English',lang:'English',id:'I_tRSrPru94',tag:'Speaking English',keys:'english introduce introduction first meeting new college friends language fluent fluency conversation',why:'An example conversation for introducing yourself in English.'},
{title:'Inside the mind of a master procrastinator',creator:'Tim Urban · TED',lang:'English',id:'arj7oStGLkU',tag:'Procrastination',keys:'procrastination procrastinate delaying delay focus distracted distractions motivation lazy deadline study studying habits',why:'An accessible talk about putting things off; a perspective, not a guaranteed fix.'}
];
const sections=[['courses','College Courses','Your degree → roadmap → subject playlists.','graduation-cap','lilac','Find my course'],['social','Social & Confidence','Find a useful video for what’s on your mind.','messages-square','peach','Find some guidance'],['business','Entrepreneurship','Plan an idea, check costs, and organise your team.','lightbulb','yellow','Work on my idea'],['money','Student Money','Track spending, save towards a goal, and split bills.','wallet','mint','Manage my money'],['service','Service Studio','Explain your problem and request personal help. Free.','hand-heart','blue','Ask for free help']];
let state={section:'home',course:null,courseTab:'roadmap',query:'',group:'All courses',lang:'All',socialQuery:'',socialLang:'All',businessTab:'team',moneyTab:'tracker',serviceTab:'student'};
let progress={},idea={name:'',audience:'',problem:'',solution:'',test:''},ideaResult='',team={size:'3',skills:'',roles:[]},teamResult='';
let budget=0,expenses=[],goal={name:'',target:0,saved:0},moneyDemo=false;
let draft={category:'Budget planning',name:'',description:'',timing:'Flexible'},files=[],requests=[],activeRequest=null,requestCounter=0;
function get(id){return screen.querySelector('#hologram-'+id);}function on(id,type,fn){const el=get(id);if(el)el.addEventListener(type,fn);}
function save(){queueSave();}
function restore(s){const m=s?.modelContent,p=s?.privateContent;if(m?.design&&m.design!=='Hologram Lab')return;if(m&&['home','profile','settings','portfolio',...sections.map(s=>s[0])].includes(m.section))state.section=m.section;if(m?.course&&courses.some(c=>c.id===m.course))state.course=m.course;if(['roadmap','syllabus','roles','portfolio'].includes(m?.courseTab))state.courseTab=m.courseTab;if(['cost','team'].includes(p?.businessTab))state.businessTab=p.businessTab;if(['tracker','savings','split'].includes(p?.moneyTab))state.moneyTab=p.moneyTab;state.serviceTab='student';}
state.section='home';
const techRoles=[
['web','Web Developer','Build websites, connect data, and fix bugs.','HTML & CSS → JavaScript → databases → backend → testing','Build a campus event site with working sign-up and an admin view.','Show the live demo, repository, tests, and the part you built.'],
['mobile','App Developer','Build phone screens, save data, and test on devices.','Programming → mobile UI → APIs → storage → device testing','Build a student timetable app with reminders.','Show a screen recording, source code, and device test notes.'],
['data','Data Analyst','Clean data, answer questions, and explain results.','Spreadsheets → SQL → statistics → Python → dashboards','Analyse a public dataset about education or transport.','Show the dataset source, queries, charts, and limits of your findings.'],
['ai','AI / ML Developer','Prepare data, test models, and check where they fail.','Python → maths & statistics → baseline models → evaluation → deployment','Build a text classifier and compare it with a simple baseline.','Show evaluation results, mistakes, and reproducible code.'],
['security','Cybersecurity Analyst','Review alerts, investigate issues, and document fixes.','Networks → Linux → security basics → legal practice labs → reports','Investigate a sample incident in a local practice lab.','Show lab notes, findings, and fixes without exposing real credentials.'],
['embedded','Embedded Developer','Write code that works with electronics and sensors.','C programming → circuits → microcontrollers → sensors → testing','Build or simulate a room temperature monitor.','Show a circuit diagram, code, readings, and test results.']
].map(([id,title,work,path,project,proof])=>({id,title,work,path,project,proof}));
let selectedRole=null,portfolioTab='profile';
let profile={name:'',about:'',skills:'',github:'',goal:''},projects=[],updates=[];
let teamPost={idea:'',need:'',time:''},teamPostText='';
const whatsappGroup='';
function safeUrl(value,githubOnly=false){if(!value.trim())return '';try{const u=new URL(value);if(u.protocol!=='https:'||u.username||u.password)return null;if(githubOnly&&u.hostname!=='github.com')return null;return u.href;}catch{return null;}}
function roleView(){const r=techRoles.find(x=>x.id===selectedRole);return `<div class="c-row"><div><h3>Explore Tech Roles</h3><p>See the work, a learning path, and what you can build to show your skills.</p></div></div><div class="c-grid c-tools">${techRoles.map(x=>`<button type="button" class="c-card ${selectedRole===x.id?'c-lilac':''} cursor-interaction" aria-pressed="${selectedRole===x.id}" data-action="role" data-value="${x.id}"><h4>${x.title}</h4><p>${x.work}</p><span class="c-go">Explore this role →</span></button>`).join('')}</div>${r?`<section class="c-card c-tools"><span class="c-pill c-mint">Role guide</span><h3>${r.title}</h3><h4>What to learn, in order</h4><p>${r.path}</p><div class="c-two c-tools"><div><h4>A starter project</h4><p>${r.project}</p></div><div><h4>Proof to keep</h4><p>${r.proof}</p></div></div><p class="c-small">A starting guide. Eligibility and hiring requirements depend on the employer.</p>${btn('Use as my career goal →','role-goal',r.id,true)}</section>`:'<p class="c-banner">Choose a role to see a project idea and the evidence to collect.</p>'}`;}
function proofLinks(p){return [p.repo?link(p.repo,'GitHub repository ↗'):'',p.demo?link(p.demo,'Demo / evidence ↗'):''].filter(Boolean).join(' · ');}
function projectCards(){return projects.length?projects.map(p=>`<article class="c-subject"><span class="c-pill c-mint">${esc(p.status)}</span><h4>${esc(p.title)}</h4><p class="c-pre">${esc(p.description)}</p><p><strong>My contribution:</strong> ${esc(p.contribution)}</p><p class="c-small">Skills: ${esc(p.skills)}</p><p>${proofLinks(p)}</p>${btn('Remove project','project-remove',p.id)}</article>`).join(''):'<div class="c-empty">Your first project belongs here. Add what you built and what you personally did.</div>';}
function portfolioView(c=courses.find(x=>x.id===state.course)||{title:'Course not selected'}){let h=`<div class="c-row"><div><h3>My Work Portfolio</h3><p>Your résumé, backed by your work.</p></div><span class="c-pill c-mint">${icon('lock-keyhole')} Private by default</span></div><p class="c-small">Your profile, projects and updates are saved to your account. Sharing is your choice.</p><div class="c-tabs">${[['profile','Profile'],['projects','Projects & proof'],['updates','Work updates'],['resume','Résumé preview']].map(([id,t])=>`<button type="button" class="c-btn cursor-interaction" aria-pressed="${portfolioTab===id}" data-action="portfolio-tab" data-value="${id}">${t}</button>`).join('')}</div>`;
if(portfolioTab==='profile')h+=`<div class="c-cols"><form id="hologram-profile-form" class="c-card"><h4>Introduce yourself</h4>${field('Your name','pf-name',profile.name,'text','required maxlength="80"')}${field('Career goal','pf-goal',profile.goal,'text','maxlength="100" placeholder="Explore Tech Roles to choose one"')}${field('Skills you can explain','pf-skills',profile.skills,'text','maxlength="250" placeholder="Python, SQL, UI design…"')}${field('GitHub profile · optional','pf-github',profile.github,'url','placeholder="https://github.com/your-name"')}<label for="hologram-pf-about">A short introduction</label><textarea id="hologram-pf-about" maxlength="500">${esc(profile.about)}</textarea><button class="c-btn c-primary c-tools" type="submit">Save profile</button><p id="hologram-profile-message" role="status"></p></form><aside class="c-card c-lilac"><h3>A résumé with receipts.</h3><p>Add projects and explain your own contribution. Link your code, live demo, or a document showing your results.</p><h4>Updates show your progress</h4><p>“Added expense categories today. Fixed a total that counted removed entries.”</p><p class="c-small">Updates are your notes, not verified GitHub commits. No account connection is needed.</p></aside></div>`;
if(portfolioTab==='projects')h+=`<div class="c-cols"><form id="hologram-project-form" class="c-card"><h4>Add a project</h4>${field('Project name','pj-title','','text','required maxlength="100"')}${select('Status','pj-status',['In progress','Completed'])}${field('What does it do?','pj-description','','text','required maxlength="500"')}${field('What did YOU build?','pj-contribution','','text','required maxlength="500"')}${field('Skills used','pj-skills','','text','required maxlength="200"')}${field('GitHub repository · optional','pj-repo','','url','placeholder="https://github.com/you/project"')}${field('Live demo or evidence link · optional','pj-demo','','url','placeholder="https://…"')}<button type="submit" class="c-btn c-primary">Add project</button><p id="hologram-project-error" role="alert"></p></form><section><h4>Your work</h4>${projectCards()}</section></div>`;
if(portfolioTab==='updates')h+=`<div class="c-cols"><form id="hologram-update-form" class="c-card"><h4>Post a work update</h4>${projects.length?`<label for="hologram-up-project">Project</label><select id="hologram-up-project">${projects.map(p=>`<option value="${p.id}">${esc(p.title)}</option>`).join('')}</select><div class="c-field"><label for="hologram-up-text">What did you build, fix, or learn?</label><textarea id="hologram-up-text" required maxlength="1000" placeholder="Explain one real change and how you checked it."></textarea></div>${field('Commit or evidence link · optional','up-link','','url','placeholder="https://…"')}<button type="submit" class="c-btn c-primary">Add private update</button><p id="hologram-update-error" role="alert"></p>`:`<p>Add a project before posting an update.</p>${btn('Add a project →','portfolio-tab','projects',true)}`}</form><section><h4>Work history · ${updates.length} update${updates.length===1?'':'s'}</h4>${updates.length?updates.map(u=>`<article class="c-subject"><span class="c-small">${esc(u.date)} · ${esc(projects.find(p=>p.id===u.project)?.title||'Project')}</span><p class="c-pre">${esc(u.text)}</p>${u.link?link(u.link,'View evidence ↗'):''}${btn('Remove update','update-remove',u.id)}</article>`).join(''):'<p>No updates yet. Your real progress will appear here.</p>'}</section></div>`;
if(portfolioTab==='resume')h+=`<article class="c-card"><div class="c-row"><div><h2>${esc(profile.name||'Your name')}</h2><p>${esc(profile.goal||'Your career goal')} · ${esc(c.title)}</p></div><span class="c-pill">My résumé</span></div><p class="c-pre">${esc(profile.about||'Add your introduction in Profile.')}</p>${profile.github?link(profile.github,'GitHub profile ↗'):''}<hr><h3>Skills</h3><p>${esc(profile.skills||'Add skills you can explain and demonstrate.')}</p><h3>Projects & personal contributions</h3>${projects.length?projects.map(p=>`<section class="c-subject"><h4>${esc(p.title)} · ${esc(p.status)}</h4><p>${esc(p.description)}</p><p><strong>My contribution:</strong> ${esc(p.contribution)}</p><p class="c-small">${esc(p.skills)}</p><p>${proofLinks(p)}</p><span class="c-small">${updates.filter(u=>u.project===p.id).length} recorded work updates</span></section>`).join(''):'<p>Add a project to show evidence of your work.</p>'}</article><p class="c-small">Use the sharing controls below to choose who can see your portfolio.</p>`;
return h+`<section class="live-share"><h4>${shareToken?'Shared by link':'Private portfolio'}</h4><p>${shareToken?'Anyone with your link can see your name, skills, projects and work updates. Money records and help requests are never included.':'Only you can see your portfolio. Sharing is your choice.'}</p>${shareToken?`<input readonly aria-label="Portfolio share link" value="${esc(location.origin+'/?portfolio='+shareToken)}">`:''}${btn(shareToken?'Make private':'Share my portfolio by link','live-share')}${portfolioTab==='resume'?btn('Print / save résumé as PDF','live-print'):''}</section>`; }
function findTeam(){return `<div class="c-cols"><section class="c-card c-mint"><h3>Stay connected. Build together.</h3><p>Follow Collexion Campus for updates and opportunities.</p>${payload.content.settings.channel?link(payload.content.settings.channel,'Follow Collexion Campus ↗','c-btn c-primary'):''}<p class="c-small">This is a WhatsApp channel. It is not a group where students can post ideas.</p><h4>Looking for teammates?</h4><p>Send your idea, the skills you need, and your available time through Service Studio. The organiser can discuss team building and online promotion, depending on availability.</p>${btn('Ask for team-building help →','nav','service')}</section><form id="hologram-find-team-form" class="c-card"><h4>Prepare your idea brief</h4>${field('Your idea','ft-idea',teamPost.idea,'text','required maxlength="350"')}${field('Who do you need?','ft-need',teamPost.need,'text','required maxlength="200"')}${field('Time you can give','ft-time',teamPost.time,'text','required maxlength="100"')}<button type="submit" class="c-btn c-primary">Create my brief</button><div id="hologram-team-post-output" ${teamPostText?'':'hidden'}><label for="hologram-team-post">Copy into your Service Studio request</label><textarea id="hologram-team-post" readonly>${esc(teamPostText)}</textarea></div></form></div>`;}
function bindAdditions(){
on('profile-form','submit',e=>{e.preventDefault();const url=safeUrl(get('pf-github').value,true);if(url===null){get('profile-message').textContent='Use a valid https://github.com/ profile link.';return;}profile={name:get('pf-name').value.trim(),goal:get('pf-goal').value.trim(),skills:get('pf-skills').value.trim(),about:get('pf-about').value.trim(),github:url};get('profile-message').textContent='Saving your private profile…';queueSave();});
on('project-form','submit',e=>{e.preventDefault();const repo=safeUrl(get('pj-repo').value,true),demo=safeUrl(get('pj-demo').value);if(repo===null||demo===null){get('project-error').textContent='Use HTTPS links, with github.com for the repository.';return;}const p={id:'p'+Date.now()+Math.random(),title:get('pj-title').value.trim(),description:get('pj-description').value.trim(),contribution:get('pj-contribution').value.trim(),skills:get('pj-skills').value.trim(),status:get('pj-status').value,repo,demo};if(!p.title||!p.description||!p.contribution||!p.skills){get('project-error').textContent='Add the project details and your contribution.';return;}projects.unshift(p);render();});
on('update-form','submit',e=>{e.preventDefault();if(!projects.length)return;const url=safeUrl(get('up-link').value),text=get('up-text').value.trim();if(url===null||!text){get('update-error').textContent='Add an update and use an HTTPS evidence link if provided.';return;}updates.unshift({id:'u'+Date.now()+Math.random(),project:get('up-project').value,text,link:url,date:new Date().toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})});render();});
on('find-team-form','submit',e=>{e.preventDefault();teamPost={idea:get('ft-idea').value.trim(),need:get('ft-need').value.trim(),time:get('ft-time').value.trim()};teamPostText=`My idea: ${teamPost.idea}\n\nLooking for: ${teamPost.need}\n\nTime I can give: ${teamPost.time}\n\nInterested? Reply here and tell me what you would like to work on.`;get('team-post').value=teamPostText;get('team-post-output').hidden=false;});
}

function home(){
const chosen=courses.find(c=>c.id===state.course);
const features=['Degree roadmaps · Playlists · Tech roles · Portfolio','Problem search · Hindi & English videos','Cost calculator · Find a Team','Expenses · Savings goals · Split bills','Describe a problem · Attach files · Get help'];
const descriptions=['Choose your tech degree. Know what to learn, what to build, and how to prepare for placement.','Find videos for confidence, conversations, English, or whatever is on your mind.','Check your costs and find people who want to build an idea with you.','Know where your money goes. Make room for the things you need.','Need personal help? Share your problem with the campus admin.'];
return `<section class="dash-welcome"><div class="dash-intro"><div class="dash-kicker">YOUR COLLEXION CAMPUS</div><h1>Welcome,<br><em>${esc(profile.name||payload.user.name||'student')}.</em></h1><p>Learn something. Build something. Find your people. Your campus tools are ready when you are.</p>${btn(chosen?'Continue my roadmap →':'Choose my course →','dashboard-course','',true)}</div><div class="pass-stage">${window.CampusMemberCard(payload.user,chosen?.title||'Choose your course',profile.name)}<p class="pass-caption">Your own space to learn, build and grow.</p></div></section><div class="dash-heading"><h2>Where do you want to begin?</h2><span>Five spaces. Built around you.</span></div><section class="dash-grid" aria-label="Your five campus spaces">${sections.map(([id,title,desc,ic,color,cta],i)=>`<button type="button" class="dash-tile cursor-interaction reveal-card" style="--delay:${i*.06}s" data-action="nav" data-value="${id}"><span class="dash-art" aria-hidden="true">${icon(ic)}</span>${id==='service'?'<span class="dash-free">ALWAYS FREE</span>':`<span class="dash-num">0${i+1}</span>`}<h3>${title}</h3><p>${descriptions[i]}</p><span class="dash-features">${features[i]}</span><span class="dash-link">${cta}<span aria-hidden="true">↗</span></span></button>`).join('')}</section><section class="dash-bottom"><div class="dash-update"><h3>${icon('route')} Your learning path</h3><p>${chosen?esc(chosen.name)+' · '+(progress[chosen.id]||[]).length+' of 6 roadmap stages marked complete.':'Choose your degree to start your own roadmap. No course is selected for you.'}</p>${btn(chosen?'Continue roadmap':'Explore courses','dashboard-course')}</div><div class="dash-update"><h3>${icon('message-circle')} Your help requests</h3><p>${requests.length?requests.length+' request(s) in your account. Open Service Studio to see their status.':'No requests yet. When you ask for help, your request and replies will appear here.'}</p>${btn('Open Service Studio','nav','service')}</div></section>`;
}
let dashboardMotion=!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
try{if(window.localStorage?.getItem('campus-motion')==='off')dashboardMotion=false;}catch{}
root.setAttribute('data-motion',dashboardMotion?'on':'off');
function dashboardProfile(){return hero('Your account','Your space. Your details.','Add your name and build a profile that reflects your own work.','<strong>Private by default.</strong><p>Your portfolio becomes public only when you choose to share its link.</p>')+`<div class="profile-pass-wrap">${window.CampusMemberCard(payload.user,courses.find(c=>c.id===state.course)?.title||'Choose your course',profile.name)}</div><form id="hologram-dashboard-profile" class="c-card">${field('Your name','account-name',profile.name,'text','required maxlength="80"')}<p class="c-small">Signed in with ${esc(payload.user.email)}. Your email cannot be changed here.</p><button type="submit" class="c-btn c-primary">Save profile</button><p id="hologram-account-status" role="status"></p></form><div class="c-card c-tools"><h3>My Work Portfolio</h3><p>Add skills, projects, your contribution, and GitHub evidence.</p>${btn('Open my portfolio →','dashboard-portfolio')}</div>`;}
function dashboardSettings(){return hero('Settings','Make yourself at home.','Manage your account and motion preferences.','<strong>Your account stays yours.</strong><p>Private records are protected by your login.</p>')+`<section class="c-card"><p>Signed in as ${esc(payload.user.email)}</p><label class="dash-setting" for="hologram-dashboard-motion">Scene animations<input id="hologram-dashboard-motion" type="checkbox" ${dashboardMotion?'checked':''}></label><form class="live-password-form"><h3>Change password</h3><label>Current password<input name="current" type="password" required minlength="10" autocomplete="current-password"></label><label>New password<input name="password" type="password" required minlength="10" maxlength="128" autocomplete="new-password"></label><button type="submit" class="c-btn c-primary">Change password</button><p role="status"></p></form><p class="c-small">For account deletion or data corrections, contact aryamangupta55@gmail.com. Never send your password.</p></section>`;}
function bindDashboard(){
on('dashboard-profile','submit',e=>{e.preventDefault();const name=get('account-name').value.trim();if(!name){get('account-status').textContent='Please enter your name.';return;}profile.name=name;get('account-status').textContent='Saving your profile…';queueSave();});
on('dashboard-motion','change',e=>{dashboardMotion=e.target.checked;try{window.localStorage?.setItem('campus-motion',dashboardMotion?'on':'off');}catch{}root.setAttribute('data-motion',dashboardMotion?'on':'off');});
}

function courseList(){return hero('College Courses','Your course comes first.','Choose a degree. Start with its roadmap, then find subject-wise playlists.','<strong>Tech course paths</strong><p>Undergraduate, postgraduate and diploma paths.</p>')+`<div class="c-search"><div><label for="hologram-course-query">Search your degree</label><input id="hologram-course-query" placeholder="Try BCA, B.Tech, AI, cybersecurity…" value="${esc(state.query)}"></div><div><label for="hologram-course-group">Browse by field</label><select id="hologram-course-group">${['All courses','Computing','Engineering','Postgraduate','Diploma'].map(g=>`<option ${state.group===g?'selected':''}>${g}</option>`).join('')}</select></div></div><div id="hologram-course-results"></div><p class="c-small">General guides, not one universal Indian syllabus. Use your own college syllabus to check the subjects for your batch.</p>`;}
function paintCourses(){const q=state.query.toLowerCase().replace(/maths/g,'math');const found=courses.filter(c=>(state.group==='All courses'||c.group===state.group)&&[c.title,c.name,c.group].join(' ').toLowerCase().includes(q));get('course-results').innerHTML=`<p class="c-small" aria-live="polite">${found.length} course${found.length===1?'':'s'} found</p><div class="c-grid">${found.map(c=>`<button type="button" class="c-card cursor-interaction" data-action="course" data-value="${c.id}"><span class="c-pill c-lilac">${c.group}</span><h3>${c.title}</h3><p>${c.name}</p><span class="c-go">Open roadmap ${icon('arrow-right')}</span></button>`).join('')}</div>${found.length?'':'<div class="c-empty">No course matches yet. Try a broader name or another field.</div>'}`;icons();}
function stages(c){if(c.liveRoadmap)return c.liveRoadmap.map((x,i)=>[esc(x),"Follow this stage at your own pace."]);let foundation,core,tools;switch(c.family){case 'business':foundation='Start with business terms, basic calculations, and clear writing.';core='Work through accounting, economics, management, and statistics in your own syllabus.';tools='Use spreadsheets for costs, reports, and simple analysis. Practise explaining a business case.';break;case 'quant':foundation='Refresh algebra, functions, graphs, and mathematical notation.';core='Work through the mathematical or economic core of your degree, with regular problem-solving.';tools='Learn spreadsheets and a data tool such as Python or R. Explain assumptions and interpret results.';break;case 'hardware':foundation='Refresh mathematics and physics. Learn basic programming alongside your lab work.';core='Follow your branch’s circuits, systems, hardware, and related computing subjects.';tools='Learn a relevant simulation tool, document measurements, and practise reading technical diagrams.';break;case 'ai':foundation='Build a programming base, then refresh linear algebra and probability.';core='Study data structures, databases, statistics, and your AI or data-science subjects.';tools='Work with datasets, simple baselines, model evaluation, and clear reports.';break;case 'security':foundation='Learn basic programming, computer systems, and how networks communicate.';core='Study operating systems, networks, databases, and your security subjects.';tools='Use legal practice labs, keep clear notes, and learn to explain both a problem and its fix.';break;default:foundation='Learn computer basics and one programming language. Start with small programs.';core='Work through data structures, databases, operating systems, and networks as your syllabus introduces them.';tools='Use Git, debugging, testing, and a development stack that suits your project.';}
return [['Build your base',foundation],['Learn your core subjects',core],['Build useful skills',tools],['Create proof of your work',c.project],['Explore internships','Prepare a short résumé, show your work, check eligibility, and keep a list of applications and follow-ups.'],['Prepare for placements',c.family==='business'?'Practise role-specific cases, spreadsheet tasks, aptitude where required, and explaining your projects.':c.family==='quant'?'Practise analytical questions, explain your methods, and prepare for the role you choose. Further study is another option.':'Revise relevant core subjects, practise role-specific technical questions, and explain your project clearly. Add coding or aptitude preparation when the employer requires it.']];}
function courseDetail(){const c=courses.find(c=>c.id===state.course);if(!c){state.course=null;return courseList();}let html=btn('← All courses','all-courses')+hero(c.group+' / General course guide',c.title,esc(c.name),' <strong>From starting point<br>to placement preparation.</strong><p>Move at your own pace. Your college’s official syllabus stays the reference.</p>');html+=`<div class="c-tabs" aria-label="Course guide">${[['roadmap','1. Roadmap'],['syllabus','2. Syllabus & playlists'],['roles','3. Explore Tech Roles'],['portfolio','4. My Work Portfolio']].map(([v,t])=>`<button type="button" class="c-btn cursor-interaction" aria-pressed="${state.courseTab===v}" data-action="course-tab" data-value="${v}">${t}</button>`).join('')}</div>`;
if(state.courseTab==='roadmap'){const steps=stages(c),done=progress[c.id]||[];html+=`<div class="c-cols"><section class="c-card"><div class="c-row"><h3>Your roadmap</h3><span id="hologram-roadmap-count" class="c-small">${done.length} of ${stages(c).length} marked complete</span></div><div class="c-progress" role="progressbar" aria-label="Roadmap progress" aria-valuemin="0" aria-valuemax="6" aria-valuenow="${done.length}"><div id="hologram-roadmap-fill" style="width:${done.length/stages(c).length*100}%"></div></div>${steps.map(([t,d],i)=>`<div class="c-step"><span class="c-step-number">${i+1}</span><div><h4>${t}</h4><p>${d}</p><label class="c-check"><input type="checkbox" data-progress="${i}" ${done.includes(i)?'checked':''}>Mark this stage complete</label></div></div>`).join('')}</section><aside><div class="c-card c-lilac"><span class="c-icon">${icon('route')}</span><h3>Know what comes next.</h3><p>This is a suggested learning and career-preparation path. It is not an admission rule, semester schedule, or placement guarantee.</p>${btn('Open syllabus & playlists →','course-tab','syllabus',true)}</div><div class="c-card c-mint c-tools"><h3>A project to work towards</h3><p>${c.project}</p></div></aside></div>`;}
if(state.courseTab==='syllabus'){const r=c.subjects.map(k=>resources[k]);html+=`<div class="c-banner"><strong>General subject guide.</strong> Mostly Hindi playlists, with clearly labelled English options. These support learning; they do not cover every paper or elective. Check the official syllabus for your batch.</div><div class="c-row"><h3>Subjects → complete playlists</h3>${select('Playlist language','playlist-lang',['All','Hindi','English'],state.lang)}</div><div id="hologram-playlist-results">${playlistRows(c)}</div>`;}
if(state.courseTab==='roles')html+=roleView();
if(state.courseTab==='portfolio')html+=portfolioView(c);
return html;}
function sourceLinks(c){return c.refs.map(k=>link(sources[k].url,esc(sources[k].name)+' ↗','c-source')).join('');}
function playlistRows(c){if(c.livePlaylist){const extra=`<article class="c-subject"><h4>${esc(c.livePlaylist.subject)}</h4>${link(c.livePlaylist.url,"Open full playlist ↗","c-btn")}</article>`;return extra+playlistRows({...c,livePlaylist:null,subjects:c.subjects.filter(k=>resources[k][0]!==c.livePlaylist.subject)});}const rows=c.subjects.map(k=>resources[k]).filter(r=>state.lang==='All'||r[2]===state.lang);return rows.length?rows.map(r=>`<article class="c-subject"><div class="c-row"><div><h4>${r[0]}</h4>${c.id==='bca'&&[resources.ai_found,resources.cloud].includes(r)?'<span class="c-pill c-mint">Extra learning · optional</span>':''}<span class="c-small">${r[1]} · ${r[2]} · Full playlist</span></div>${link(yt(r[3]),icon('play')+' Open playlist','c-btn')}</div></article>`).join(''):'<div class="c-empty">No selected playlist in this language for this course yet. Choose “All” to see the available resources.</div>';}
function social(){return hero('Social & Confidence','Something on your mind?','Common student situations. Clear video choices. No public scores.','<strong>Find an explanation<br>that speaks to you.</strong><p>Search a problem or choose one of the four starting points.</p>')+`<div class="c-two">${[['Speaking with confidence','“I get nervous speaking in class.”','lilac'],['Starting conversations','“I don’t know how to start talking.”','peach'],['Speaking English','“I want to express myself in English.”','blue'],['Procrastination','“I keep leaving things until later.”','mint']].map(([t,d,color])=>`<button type="button" class="c-card c-${color} cursor-interaction" data-action="social-topic" data-value="${t}"><h3>${d}</h3><span class="c-small">${t} →</span></button>`).join('')}</div><form id="hologram-social-form"><div class="c-search"><div><label for="hologram-social-query">Something else? Search your problem</label><input id="hologram-social-query" placeholder="Try making friends, communication, English…" value="${esc(state.socialQuery)}" maxlength="200"></div><div><label for="hologram-social-lang">Video language</label><select id="hologram-social-lang">${['All','Hindi','English'].map(l=>`<option ${state.socialLang===l?'selected':''}>${l}</option>`).join('')}</select></div></div><button class="c-btn c-primary cursor-interaction" type="submit">${icon('search')} Find videos</button></form><div id="hologram-social-results" class="c-tools" aria-live="polite"></div>`;}
function socialResults(){const q=state.socialQuery.trim().toLowerCase();const stop=new Set(['i','am','is','the','a','to','my','how','do','can','in','of','with','and','want','not','dont','don','t','me','it','get']);const tokens=q.replace(/[^a-z0-9\s]/g,' ').split(/\s+/).filter(x=>x.length>1&&!stop.has(x));const scored=socialVideos.map(v=>({v,score:tokens.reduce((n,t)=>n+Number((v.keys+' '+v.tag+' '+v.title).toLowerCase().includes(t)),0)}));const rows=scored.filter(({v,score})=>(state.socialLang==='All'||v.lang===state.socialLang)&&(!q||score>0)).sort((a,b)=>b.score-a.score).map(x=>x.v);get('social-results').innerHTML=`<div class="c-row"><h3>${q?'Videos for your search':'Selected videos'}</h3><span class="c-small">${rows.length} match${rows.length===1?'':'es'} in our collection</span></div><div class="c-grid">${rows.map(v=>`<article class="c-card"><div class="c-video-art">${icon('play')} ${v.lang} · YouTube</div><h4>${esc(v.title)}</h4><p>${esc(v.why)}</p><p class="c-small">${esc(v.creator)}</p>${link('https://www.youtube.com/watch?v='+v.id,'Watch on YouTube ↗','c-btn')}</article>`).join('')}</div>${rows.length?'':'<div class="c-empty">No selected video matches this search and language yet.</div>'}${q?`<div class="c-banner">Want more options? ${link('https://www.youtube.com/results?search_query='+encodeURIComponent(state.socialQuery+' '+(state.socialLang==='All'?'':state.socialLang)),'Search this problem on YouTube ↗')}<p class="c-small">Opens a live YouTube search. Those results are not reviewed by Collexion Campus.</p></div>`:''}<p class="c-small">Videos offer general perspectives and skills. They are not personal counselling or a promise to solve every problem.</p>`;icons();}
function business(){let html=hero('Entrepreneurship','Make your idea<br>more than a thought.','Shape your idea, check your costs, and find potential teammates.','<strong>Leave with something useful.</strong><p>Your idea brief, cost estimate, or a post for the team-finding group.</p>');html+=`<div class="c-tabs">${[['team','Find a Team'],['cost','Cost calculator']].map(([v,t])=>`<button type="button" class="c-btn cursor-interaction" aria-pressed="${state.businessTab===v}" data-action="business-tab" data-value="${v}">${t}</button>`).join('')}</div>`;
if(state.businessTab==='idea'){html+=`<div class="c-cols"><form class="c-card" id="hologram-idea-form"><h3>Describe your idea</h3><p class="c-small">Use your own idea or load an example.</p><div class="c-choices">${btn('Book exchange','idea-example','books')}${btn('Student design help','idea-example','design')}</div>${field('Idea name','idea-name',idea.name,'text','required maxlength="100"')}${field('Who would use it?','idea-audience',idea.audience,'text','required maxlength="180"')}${field('What problem do they face?','idea-problem',idea.problem,'text','required maxlength="250"')}${field('What would you offer?','idea-solution',idea.solution,'text','required maxlength="250"')}${field('How will you check whether people want it?','idea-test',idea.test,'text','required maxlength="250"')}<button type="submit" class="c-btn c-primary cursor-interaction">Create my idea brief</button></form><aside><div class="c-card c-yellow"><h3>Your idea, clearly explained.</h3><p>Organise your answers into a brief you can share with a classmate or teacher.</p></div><div id="hologram-idea-output" class="c-result c-pre" ${ideaResult?'':'hidden'}>${esc(ideaResult)}</div><div class="c-card c-tools"><h4>Learn the basics</h4><p>Business: Entrepreneurship · CrashCourse · English</p>${link(yt(resources.enterprise[3]),'Open the playlist ↗','c-btn')}</div></aside></div>`;}
if(state.businessTab==='cost'){html+=`<div class="c-cols"><form id="hologram-cost-form" class="c-card"><h3>Check the numbers</h3><p class="c-small">Enter your own estimates. Results are calculations, not a sales forecast.</p>${field('One-time setup cost (₹)','cost-fixed','500','number','required min="0" max="100000000" step="0.01"')}${field('Cost per item or service (₹)','cost-unit','40','number','required min="0" max="100000000" step="0.01"')}${field('Price per item or service (₹)','cost-price','100','number','required min="0" max="100000000" step="0.01"')}${field('Number you expect to sell','cost-count','20','number','required min="0" max="100000" step="1"')}<button class="c-btn c-primary cursor-interaction" type="submit">Calculate</button></form><div id="hologram-cost-output" class="c-card c-mint" aria-live="polite"><h3>Will the numbers work?</h3><p>Calculate revenue, total costs, the amount left over, and how many sales cover setup costs.</p></div></div>`;}
if(state.businessTab==='team')html+=findTeam();
return html;}
function totalExpenses(){return expenses.reduce((a,e)=>a+e.amount,0);}
function money(){let html=hero('Student Money','Make room for<br>what matters to you.','Track everyday spending, plan a saving goal, and split shared expenses.','<strong>Your numbers. Your control.</strong><p>No bank connection. Your expense records are private.</p>');html+=`<div class="c-tabs">${[['tracker','Budget & expenses'],['savings','Savings goal'],['split','Split a bill']].map(([v,t])=>`<button type="button" class="c-btn cursor-interaction" aria-pressed="${state.moneyTab===v}" data-action="money-tab" data-value="${v}">${t}</button>`).join('')}</div>`;
if(state.moneyTab==='tracker'){const spent=totalExpenses();html+=`<div class="c-grid"><div class="c-card c-blue"><span class="c-small">Monthly spending budget</span><div class="c-metric">${rupees(budget)}</div></div><div class="c-card c-peach"><span class="c-small">Recorded expenses</span><div class="c-metric">${rupees(spent)}</div></div><div class="c-card c-mint"><span class="c-small">${spent>budget?'Over budget':'Budget remaining'}</span><div class="c-metric">${rupees(Math.abs(budget-spent))}</div></div></div><div class="c-cols c-tools"><div><form class="c-card" id="hologram-budget-form"><h3>Set your monthly budget</h3>${field('Amount available for spending (₹)','money-budget',budget/100,'number','required min="0" max="10000000" step="0.01"')}<button type="submit" class="c-btn">Update budget</button></form><form class="c-card c-tools" id="hologram-expense-form"><h3>Add an expense</h3>${field('What was it for?','expense-name','','text','required maxlength="90" placeholder="Lunch, bus pass, printing…"')}<div class="c-two">${field('Amount (₹)','expense-amount','','number','required min="0.01" max="10000000" step="0.01"')}${select('Category','expense-category',['Food','Travel','Study','Shopping','Other'])}</div><button type="submit" class="c-btn c-primary">Add expense</button></form></div><aside class="c-card"><div class="c-row"><h3>Your expenses</h3></div><p class="c-small">${moneyDemo?'Includes clearly labelled sample entries.':'Saved to your private account.'}</p>${expenses.length?expenses.map(e=>`<div class="c-listrow"><span>${esc(e.name)}<small>${e.category}${e.sample?' · Sample':''}</small></span><span>${rupees(e.amount)} ${btn('Remove','expense-remove',e.id)}</span></div>`).join(''):'<p>No expenses added yet.</p>'}<div class="c-tools"><h4>Spending by category</h4>${['Food','Travel','Study','Shopping','Other'].map(cat=>{const amount=expenses.filter(e=>e.category===cat).reduce((a,e)=>a+e.amount,0);return amount?`<div class="c-row c-small"><span>${cat}</span><span>${rupees(amount)}</span></div><div class="c-progress" style="margin:5px 0 12px"><div style="width:${spent?amount/spent*100:0}%"></div></div>`:'';}).join('')}</div></aside></div>`;}
if(state.moneyTab==='savings'){const pct=goal.target?Math.min(100,goal.saved/goal.target*100):0;html+=`<div class="c-cols"><form id="hologram-goal-form" class="c-card"><h3>Something you’re saving for?</h3>${field('Goal','goal-name',goal.name,'text','required maxlength="90" placeholder="Headphones, books, a course…"')}${field('Target amount (₹)','goal-target',goal.target?goal.target/100:'','number','required min="0.01" max="10000000" step="0.01"')}${field('Already saved (₹)','goal-saved',goal.saved/100,'number','required min="0" max="10000000" step="0.01"')}<button type="submit" class="c-btn c-primary">Update goal</button></form><div class="c-card c-mint" aria-live="polite"><h3>${goal.name?esc(goal.name):'Your savings goal'}</h3><div class="c-metric">${rupees(goal.saved)}</div><p>of ${rupees(goal.target)} target</p><div class="c-progress" role="progressbar" aria-label="Savings progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(pct)}"><div style="width:${pct}%"></div></div><p>${goal.target?(goal.saved>=goal.target?'You’ve reached your target.':rupees(goal.target-goal.saved)+' still to save.'):'Set a target to start.'}</p><p class="c-small">A separate savings record. Updating this does not add an expense or move money.</p></div></div>`;}
if(state.moneyTab==='split'){html+=`<div class="c-cols"><form id="hologram-split-form" class="c-card"><h3>Split it fairly</h3>${field('Total bill (₹)','split-total','100','number','required min="0.01" max="10000000" step="0.01"')}${field('Number of people','split-people','3','number','required min="1" max="50" step="1"')}<button type="submit" class="c-btn c-primary">Split equally</button></form><div id="hologram-split-output" class="c-card c-yellow" aria-live="polite"><h3>One less awkward calculation.</h3><p>See each person’s share, including any rounding to the nearest paise.</p><p class="c-small">This calculates shares; it does not send money.</p></div></div>`;}
return html;}
function service(){let html=hero('Service Studio / Free help','A little stuck?<br>Tell me what’s going on.','Explain your problem and attach files or photos. Request personal guidance at no charge.','<span class="c-pill">₹0 · Free only</span><h3>No service budget.<br>No payment step.</h3><p>Help is reviewed personally. Timing depends on availability.</p>');html+=`<div class="c-tabs">${[['student','Ask for help']].map(([v,t])=>`<button type="button" class="c-btn cursor-interaction" aria-pressed="${state.serviceTab===v}" data-action="service-tab" data-value="${v}">${t}</button>`).join('')}</div><div class="c-banner">Your request and files are shared with the campus admin. Replies appear here. Refresh to check for updates.</div>`;
if(state.serviceTab==='student'){html+=`<div class="c-grid">${[['Budget planning','“My monthly money runs out too soon.”','mint'],['Portfolio & presentation','“I need help presenting my work.”','lilac'],['Technical guidance','“I’m stuck with an error in my project.”','peach']].map(([v,t,col])=>`<button type="button" class="c-card c-${col} cursor-interaction" data-action="service-kind" data-value="${v}"><h4>${t}</h4><p>${v} →</p></button>`).join('')}</div><div class="c-cols c-tools"><form id="hologram-service-form" class="c-card"><h3>Request free help</h3><div class="c-two">${field('Name for this request','service-name',draft.name,'text','required maxlength="80" placeholder="Your name"')}${select('Type of help','service-kind',['Budget planning','Portfolio & presentation','Technical guidance','Something else'],draft.category)}</div><div class="c-field"><label for="hologram-service-description">Describe your problem</label><textarea id="hologram-service-description" required minlength="15" maxlength="2500" placeholder="What happened? What have you tried? What help would you like?">${esc(draft.description)}</textarea></div><div class="c-upload"><label for="hologram-service-files">Files or photos · Optional</label><input id="hologram-service-files" type="file" multiple accept=".jpg,.jpeg,.png,.webp,.pdf,.docx,.xlsx,.txt"><p class="c-small">Up to 5 files, 1 MB each. Selected file names only; nothing is uploaded in your account.</p><div id="hologram-service-file-list"></div><p id="hologram-file-error" class="c-danger" role="alert"></p></div>${select('Preferred timing','service-timing',['Flexible','Within a week, if available','This month'],draft.timing)}<p class="c-small">Service charge: <strong>Free</strong>. Share only details needed to understand the problem.</p><button type="submit" class="c-btn c-primary">Send request →</button><p id="hologram-service-confirm" role="status"></p></form><aside class="c-card"><h3>Your requests</h3><div id="hologram-student-requests">${studentRequests()}</div></aside></div>`;}
return html;}
function studentRequests(){return requests.length?requests.map(r=>`<article class="c-subject"><span class="c-pill">${esc(r.status)} · Free</span><h4>${esc(r.category)}</h4><p class="c-pre">${esc(r.description)}</p>${r.files.map(f=>`<p><a href="/api/files/${encodeURIComponent(f.id)}" target="_blank" rel="noopener">Download ${esc(f.name)}</a></p>`).join('')}${r.messages.map(m=>`<div class="c-bubble ${m.role==='admin'?'owner':''}"><strong>${m.role==='admin'?'Admin':'You'}</strong><br>${esc(m.text)}</div>`).join('')}<form class="student-followup" data-request="${r.id}"><label>Reply or add more details<textarea name="reply" required maxlength="1500" class="live-reply"></textarea></label><button type="submit" class="c-btn">Send reply</button><p role="status"></p></form></article>`).join(''):'<p class="c-small">No requests yet. Your messages and replies will appear here.</p>';}
function icons(){if(globalThis.lucide)globalThis.lucide.createIcons({attrs:{width:17,height:17}});}
function render(){root.querySelectorAll('.c-nav [data-nav]').forEach(b=>b.setAttribute('aria-pressed',String(state.section===b.dataset.nav)));screen.innerHTML=state.section==='home'?home():state.section==='profile'?dashboardProfile():state.section==='settings'?dashboardSettings():state.section==='portfolio'?portfolioView():state.section==='courses'?(state.course?courseDetail():courseList()):state.section==='social'?social():state.section==='business'?business():state.section==='money'?money():service();icons();bind();queueSave();}
function bind(){bindDashboard();bindAdditions();if(state.section==='courses'&&!state.course){paintCourses();on('course-query','input',e=>{state.query=e.target.value;paintCourses();});on('course-group','change',e=>{state.group=e.target.value;paintCourses();});}
on('playlist-lang','change',e=>{state.lang=e.target.value;get('playlist-results').innerHTML=playlistRows(courses.find(c=>c.id===state.course));icons();});
screen.querySelectorAll('[data-progress]').forEach(el=>el.addEventListener('change',()=>{const i=Number(el.dataset.progress);let done=progress[state.course]||[];done=el.checked?[...new Set([...done,i])]:done.filter(x=>x!==i);progress[state.course]=done;get('roadmap-count').textContent=done.length+' of '+stages(courses.find(c=>c.id===state.course)).length+' marked complete';get('roadmap-fill').style.width=done.length/stages(courses.find(c=>c.id===state.course)).length*100+'%';get('roadmap-fill').parentElement.setAttribute('aria-valuenow',String(done.length));queueSave();}));
if(state.section==='social'){socialResults();on('social-query','input',e=>state.socialQuery=e.target.value);on('social-lang','change',e=>{state.socialLang=e.target.value;socialResults();});on('social-form','submit',e=>{e.preventDefault();state.socialQuery=get('social-query').value;socialResults();});}
['name','audience','problem','solution','test'].forEach(k=>on('idea-'+k,'input',e=>idea[k]=e.target.value));on('idea-form','submit',e=>{e.preventDefault();ideaResult=`${idea.name}\n\nFor: ${idea.audience}\n\nProblem: ${idea.problem}\n\nProposed solution: ${idea.solution}\n\nFirst check: ${idea.test}\n\nNext: record what people say, revise the idea, then estimate your costs.`;get('idea-output').textContent=ideaResult;get('idea-output').hidden=false;});
on('cost-form','submit',e=>{e.preventDefault();const fixed=intMoney(get('cost-fixed').value),unit=intMoney(get('cost-unit').value),price=intMoney(get('cost-price').value),count=Number(get('cost-count').value),revenue=price*count,cost=fixed+unit*count,margin=price-unit;get('cost-output').innerHTML=`<h3>Your estimate</h3><div class="c-listrow"><span>Revenue</span><strong>${rupees(revenue)}</strong></div><div class="c-listrow"><span>Total cost</span><strong>${rupees(cost)}</strong></div><div class="c-listrow"><span>${revenue>=cost?'Amount left over':'Estimated loss'}</span><strong>${rupees(Math.abs(revenue-cost))}</strong></div><div class="c-result"><strong>${margin>0?Math.ceil(fixed/margin)+' sales to cover setup costs':margin===0?(fixed===0?'Revenue equals costs at this price.':'No break-even: each sale only covers its own unit cost.'):'No break-even: each sale costs more than its price.'}</strong></div><p class="c-small">Excludes any costs you have not entered, including tax or your time.</p>`;});
on('team-form','submit',e=>{e.preventDefault();const roles=Array.from(screen.querySelectorAll('[name="team-role"]:checked')).map(x=>x.value);if(!roles.length){get('team-error').textContent='Choose at least one area of work.';return;}team={size:get('team-size').value,skills:get('team-skills').value,roles};const members=Number(team.size);teamResult=`Team size: ${members}\nYour existing skills: ${team.skills}\n\nSuggested work allocation to discuss:\n`+roles.map((r,i)=>`Person ${i%members+1}: ${r}`).join('\n')+`\n\n${members>roles.length?'Some people have no assigned area yet. Decide where extra help is useful.':'Check each person’s availability and skills before assigning work.'}\nAgree on a small first deliverable and a check-in date.`;get('team-error').textContent='';get('team-output').textContent=teamResult;get('team-output').hidden=false;});
on('budget-form','submit',e=>{e.preventDefault();budget=intMoney(get('money-budget').value);render();});on('expense-form','submit',e=>{e.preventDefault();expenses.push({id:'e'+Date.now()+Math.random().toString(36).slice(2,5),name:get('expense-name').value.trim(),amount:intMoney(get('expense-amount').value),category:get('expense-category').value,sample:false});render();});
on('goal-form','submit',e=>{e.preventDefault();goal={name:get('goal-name').value.trim(),target:intMoney(get('goal-target').value),saved:intMoney(get('goal-saved').value)};render();});on('split-form','submit',e=>{e.preventDefault();const total=intMoney(get('split-total').value),n=Number(get('split-people').value),base=Math.floor(total/n),extra=total%n;get('split-output').innerHTML=`<h3>${rupees(total)} between ${n} people</h3><p>${extra?`${extra} ${extra===1?'person pays':'people pay'} ${rupees(base+1)}; ${n-extra} ${n-extra===1?'person pays':'people pay'} ${rupees(base)}.`:`Each person pays ${rupees(base)}.`}</p><p class="c-small">Total shares equal the bill exactly. No payment is sent.</p>`;});
['name','description','timing'].forEach(k=>on('service-'+k,'input',e=>draft[k]=e.target.value));on('service-kind','change',e=>draft.category=e.target.value);if(get('service-file-list'))paintFiles();on('service-files','change',e=>{const errors=[];for(const f of e.target.files){if(files.length>=5){errors.push('Maximum 5 files.');break;}if(f.size>1024*1024){errors.push(f.name+': exceeds 1 MB.');continue;}if(!/\.(jpe?g|png|webp|pdf|docx|xlsx|txt)$/i.test(f.name)){errors.push(f.name+': unsupported file type.');continue;}files.push(f);}e.target.value='';paintFiles();get('file-error').textContent=errors.join(' ');});
on('service-form','submit',async e=>{e.preventDefault();const submit=e.target.querySelector('[type=submit]');submit.disabled=true;try{const data=new FormData();data.set('category',draft.category);data.set('description',get('service-description').value);data.set('timing',get('service-timing').value);files.forEach(f=>data.append('files',f));await Campus.api('/requests','POST',data);requests=(await Campus.api('/requests')).requests;draft={category:'Budget planning',name:payload.user.name,description:'',timing:'Flexible'};files=[];render();get('service-confirm').textContent='Your request was saved and is visible to the admin.';}catch(error){get('service-confirm').textContent=error.message;}finally{submit.disabled=false;}});

}
function paintFiles(){get('service-file-list').innerHTML=files.map((f,i)=>`<div class="c-listrow c-small"><span>${esc(f.name)}</span>${btn('Remove','file-remove',i)}</div>`).join('');}
root.addEventListener('click',e=>{const nav=e.target.closest('[data-nav]');if(nav&&root.contains(nav)){state.section=nav.dataset.nav;render();save();return;}const b=e.target.closest('[data-action]');if(!b||!root.contains(b))return;const a=b.dataset.action,v=b.dataset.value;if(a==='dashboard-course'){state.section='courses';state.courseTab='roadmap';}if(a==='dashboard-portfolio'){state.section='portfolio';portfolioTab='profile';}if(a==='role')selectedRole=v;if(a==='role-goal'){const r=techRoles.find(x=>x.id===v);if(r){profile.goal=r.title;state.courseTab='portfolio';portfolioTab='profile';}}if(a==='portfolio-tab')portfolioTab=v;if(a==='project-remove'){projects=projects.filter(p=>p.id!==v);updates=updates.filter(u=>u.project!==v);}if(a==='update-remove')updates=updates.filter(u=>u.id!==v);if(a==='nav')state.section=v;if(a==='course'){state.course=v;state.courseTab='roadmap';state.lang='All';}if(a==='all-courses')state.course=null;if(a==='course-tab')state.courseTab=v;if(a==='social-topic'){state.socialQuery=v;render();save();return;}if(a==='business-tab')state.businessTab=v;if(a==='money-tab')state.moneyTab=v;if(a==='service-tab')state.serviceTab=v;if(a==='idea-example'){idea=v==='books'?{name:'Campus Book Exchange',audience:'Students looking for affordable used course books',problem:'Finding the right edition nearby takes too much time',solution:'A simple board showing book title, edition, condition, and seller contact by consent',test:'Ask five classmates how they currently find used books'}:{name:'Student Design Help',audience:'Student clubs and event organisers',problem:'They need clear posters but have little design time',solution:'A small design service with agreed formats and revision limits',test:'Show three sample posters to two club organisers and ask for feedback'};ideaResult='';}if(a==='expense-remove')expenses=expenses.filter(x=>x.id!==v);if(a==='service-kind')draft.category=v;if(a==='request-open')activeRequest=v;if(a==='file-remove'){files.splice(Number(v),1);paintFiles();return;}render();save();});
const initial=payload.data||{};
progress=initial.progress||{};profile={name:payload.user.name,about:'',skills:'',github:'',goal:'',...initial.profile};projects=initial.projects||[];updates=initial.updates||[];budget=initial.budget||0;expenses=initial.expenses||[];goal=initial.goal||{name:'',target:0,saved:0};state.course=initial.course||null;requests=payload.requests||[];draft.name=payload.user.name;
let shareToken=payload.shareToken||null,version=payload.version||0,timer=null,saving=null,saveError=null,disposed=false;
function snapshot(){return JSON.stringify({course:state.course,profile,projects,updates,progress,budget,expenses,goal});}
let savedSnapshot=snapshot();
Campus.catalog=courses.map(c=>({id:c.id,title:c.title,roadmap:stages(c).map(s=>s[0]+': '+s[1]).join('\n'),subject:resources[c.subjects[0]]?.[0]||'Programming',url:resources[c.subjects[0]]?'https://www.youtube.com/playlist?list='+resources[c.subjects[0]][3]:'https://www.youtube.com/playlist?list=PLu0W_9lII9agwh1XjRt242xIpHhPT2llg',status:'Ready'}));
Campus.catalogVideos=socialVideos.map((v,i)=>({id:'base-video-'+i,title:v.title,topic:v.tag,language:v.lang,url:'https://www.youtube.com/watch?v='+v.id,status:'Ready'}));
async function flush(){clearTimeout(timer);if(saving)await saving;const next=snapshot();if(next===savedSnapshot)return;if(saveError?.status===409)throw saveError;Campus.status('Saving…');saving=(async()=>{try{const r=await Campus.api('/state','PUT',{data:JSON.parse(next),version});version=r.version;savedSnapshot=next;saveError=null;Campus.status('All changes saved');}catch(e){saveError=e;Campus.status('Not saved — '+e.message,true);throw e;}finally{saving=null;}})();await saving;if(snapshot()!==savedSnapshot)return flush();}
function queueSave(){if(disposed||snapshot()===savedSnapshot)return;clearTimeout(timer);Campus.status('Unsaved changes');timer=setTimeout(()=>flush().catch(()=>{}),350);}
const unload=e=>{if(snapshot()!==savedSnapshot){e.preventDefault();e.returnValue='';}};window.addEventListener('beforeunload',unload);
for(const item of payload.content.items||[]){if(item.status!=='Ready')continue;if(item.kind==='course'){let c=courses.find(c=>c.id===item.id||c.title===item.title);if(!c){c={id:item.id,title:esc(item.title),name:esc(item.title),group:'Computing',family:'cs',subjects:[],refs:[],project:'Build a project that shows what you learned.'};courses.push(c);}c.title=esc(item.title);c.liveRoadmap=item.roadmap.split('\n').filter(s=>s.trim());c.livePlaylist={subject:item.subject,url:item.url};}if(item.kind==='video'){const u=new URL(item.url);const id=u.hostname==='youtu.be'?u.pathname.slice(1):u.searchParams.get('v');if(id){const video={title:esc(item.title),creator:'Selected by Collexion Campus',lang:item.language,id,tag:item.topic,keys:item.topic.toLowerCase(),why:'Selected learning resource.'};const base=/^base-video-(\d+)$/.exec(item.id);if(base&&socialVideos[Number(base[1])])socialVideos[Number(base[1])]=video;else socialVideos.push(video);}}}
root.addEventListener('submit',async e=>{const form=e.target;if(form.matches('.student-followup')){e.preventDefault();const button=form.querySelector('button');button.disabled=true;const status=form.querySelector('[role=status]');try{await Campus.api('/requests/'+encodeURIComponent(form.dataset.request)+'/reply','POST',{text:form.elements.reply.value});requests=(await Campus.api('/requests')).requests;render();}catch(err){status.textContent=err.message;}finally{button.disabled=false;}}if(form.matches('.live-password-form')){e.preventDefault();const button=form.querySelector('button');button.disabled=true;try{await flush();const result=await Campus.api('/auth/password','POST',{current:form.elements.current.value,password:form.elements.password.value});form.reset();await Campus.signedIn(result);}catch(err){form.querySelector('[role=status]').textContent=err.message;}finally{button.disabled=false;}}});
root.addEventListener('click',async e=>{const b=e.target.closest('[data-action]');if(!b)return;if(b.dataset.action==='live-print'){window.print();return;}if(b.dataset.action==='live-share'){b.disabled=true;try{await flush();const r=await Campus.api('/portfolio/share','POST',{enabled:!shareToken});shareToken=r.token;render();}catch(err){Campus.fatal(err);}finally{b.disabled=false;}}});
Campus.controller={flush,dispose(){disposed=true;clearTimeout(timer);window.removeEventListener('beforeunload',unload);}};

render();
return Campus.controller;

};