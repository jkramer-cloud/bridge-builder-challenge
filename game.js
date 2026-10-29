(()=>{
'use strict';
const $=q=>document.querySelector(q),svg=$('#stage');
// Forty-eight DIFFERENT vehicle scenarios in strictly increasing total crossing mass.
// All masses are approximate educational scenario values (vehicle + people/cargo).
// Named Ford and NASA examples use the cited published mass plus stated occupancy,
// or a rounded published equipment mass. Never use these as bridge-design loads.
const VEHICLE_FLEET = [{"name":"City commuter bicycle","kg":90,"kind":"bike","icon":"🚲","note":"Bicycle plus rider","source":""},{"name":"Trail mountain bicycle","kg":96,"kind":"bike","icon":"🚵","note":"Mountain bicycle plus rider","source":""},{"name":"Touring bicycle","kg":103,"kind":"bike","icon":"🚴","note":"Touring bicycle with bags and rider","source":""},{"name":"Electric commuter bicycle","kg":117,"kind":"bike","icon":"🚲","note":"E-bike with rider","source":""},{"name":"Two-person tandem bicycle","kg":168,"kind":"bike","icon":"🚴","note":"Tandem with two riders","source":""},{"name":"Electric cargo bicycle","kg":188,"kind":"bike","icon":"🚲","note":"Cargo e-bike with rider and parcels","source":""},{"name":"Recumbent touring trike","kg":203,"kind":"trike","icon":"🚲","note":"Three-wheel recumbent plus rider and gear","source":""},{"name":"Delivery cargo tricycle","kg":248,"kind":"trike","icon":"🛺","note":"Loaded cargo trike and operator","source":""},{"name":"50cc moped","kg":260,"kind":"motor","icon":"🛵","note":"Moped with rider","source":""},{"name":"Urban motor scooter","kg":283,"kind":"motor","icon":"🛵","note":"Scooter with rider","source":""},{"name":"Off-road dirt bike","kg":303,"kind":"motor","icon":"🏍️","note":"Dirt bike with rider and kit","source":""},{"name":"Street motorcycle","kg":370,"kind":"motor","icon":"🏍️","note":"Street motorcycle with rider","source":""},{"name":"Electric sport motorcycle","kg":430,"kind":"motor","icon":"🏍️","note":"Electric sport motorcycle with rider","source":""},{"name":"Touring motorcycle","kg":510,"kind":"motor","icon":"🏍️","note":"Touring motorcycle with rider and luggage","source":""},{"name":"Motorcycle with sidecar","kg":650,"kind":"sidecar","icon":"🏍️","note":"Motorcycle, sidecar and two riders","source":""},{"name":"Four-wheel ATV","kg":850,"kind":"atv","icon":"🛞","note":"All-terrain vehicle with rider and gear","source":""},{"name":"Utility side-by-side buggy","kg":1040,"kind":"utv","icon":"🚙","note":"Loaded utility off-road buggy","source":""},{"name":"Micro city car","kg":1110,"kind":"micro","icon":"🚙","note":"Car with driver","source":""},{"name":"Compact hatchback","kg":1350,"kind":"car","icon":"🚗","note":"Representative small hatchback with driver","source":""},{"name":"Family sedan","kg":1510,"kind":"car","icon":"🚘","note":"Representative compact family sedan with driver","source":""},{"name":"2025 Ford Mustang GT","kg":1816,"kind":"sports","icon":"🏎️","note":"Ford GT manual curb weight 3,827 lb plus representative 80 kg driver","source":"https://www.fromtheroad.ford.com/content/dam/fordmediasite/us/en/library/2025/specs/2025_Mustang_Technical_Specs.pdf"},{"name":"Compact crossover SUV","kg":2000,"kind":"suv","icon":"🚙","note":"Representative crossover with passengers","source":""},{"name":"Electric family crossover","kg":2260,"kind":"suv","icon":"🚙","note":"Representative electric crossover with passengers","source":""},{"name":"2025 Ford F-150 Lariat","kg":2390,"kind":"pickup","icon":"🛻","note":"Ford Lariat curb weight about 2,303 kg plus representative driver","source":"https://f150europe.com/-/media/project/hedin/navigo/f150europesite/pdf/pdf_my25/f150-technical-specification-my25-eng.pdf?rev=91ea9f2b91154a27a56c71f14b16de54"},{"name":"Family minivan","kg":2600,"kind":"van","icon":"🚐","note":"Representative minivan plus occupants","source":""},{"name":"Police patrol SUV","kg":3050,"kind":"police","icon":"🚓","note":"SUV with police equipment and crew","source":""},{"name":"Expedition pickup 4×4","kg":3350,"kind":"pickup","icon":"🛻","note":"Loaded off-road pickup with passengers","source":""},{"name":"Recreational motorhome","kg":5100,"kind":"rv","icon":"🚐","note":"Medium RV with passengers and supplies","source":""},{"name":"Rescue ambulance","kg":6200,"kind":"ambulance","icon":"🚑","note":"Equipped ambulance with crew","source":""},{"name":"Loaded parcel delivery van","kg":7300,"kind":"van","icon":"🚚","note":"Loaded cargo van with driver","source":""},{"name":"Regional box delivery truck","kg":10200,"kind":"box","icon":"🚚","note":"Loaded medium box truck","source":""},{"name":"Full-size school bus","kg":12800,"kind":"bus","icon":"🚌","note":"Illustrative loaded bus with passengers","source":""},{"name":"Ladder fire engine","kg":19000,"kind":"fire","icon":"🚒","note":"Equipped fire apparatus","source":""},{"name":"Loaded concrete mixer","kg":26000,"kind":"mixer","icon":"🚛","note":"Mixer with concrete load","source":""},{"name":"Aggregate dump truck","kg":32000,"kind":"dump","icon":"🚛","note":"Loaded heavy dump truck","source":""},{"name":"Loaded highway semi-truck","kg":36300,"kind":"semi","icon":"🚛","note":"Illustrative fully loaded semitrailer","source":""},{"name":"Timber log transport","kg":40500,"kind":"logs","icon":"🚛","note":"Loaded regional log truck","source":""},{"name":"Equipment flatbed hauler","kg":56500,"kind":"haul","icon":"🚛","note":"Prime mover, trailer and machinery","source":""},{"name":"Triple-trailer log hauler","kg":76500,"kind":"triplelogs","icon":"🚛","note":"Imaginary route with oversize loaded timber convoy","source":""},{"name":"Heavy mobile crane","kg":100000,"kind":"crane","icon":"🏗️","note":"Illustrative crane configured for transport","source":""},{"name":"Tracked recovery transport","kg":115000,"kind":"tank","icon":"🚜","note":"Very heavy recovery equipment convoy","source":""},{"name":"Heavy diesel locomotive","kg":130000,"kind":"train","icon":"🚂","note":"Representative locomotive on a purpose-built rail bridge","source":""},{"name":"Locomotive and passenger coach","kg":245000,"kind":"traincar","icon":"🚆","note":"Combined rail vehicles on a special rail bridge","source":""},{"name":"Giant mining haul truck","kg":363000,"kind":"mine","icon":"🚜","note":"Representative ultra-class mining dump truck","source":""},{"name":"Wide-body jet on transporter","kg":480000,"kind":"plane","icon":"✈️","note":"Illustrative aircraft plus modular moving platform","source":""},{"name":"Mega excavator carrier","kg":950000,"kind":"excavator","icon":"🚜","note":"Fantasy transport of a gigantic mining excavator","source":""},{"name":"NASA Crawler-Transporter 2","kg":3000000,"kind":"crawler","icon":"🚀","note":"NASA reports approx. 6.6 million lb crawler; value rounded","source":"https://www.nasa.gov/humans-in-space/exploration-ground-systems/the-crawlers/"},{"name":"NASA crawler + mobile launcher","kg":8200000,"kind":"crawlerload","icon":"🚀","note":"NASA crawler with mobile launcher, combined published approximate masses","source":"https://www.nasa.gov/humans-in-space/exploration-ground-systems/mobile-launcher/"}];
const REGIONS=['Pedal Power','Small Motors','Road Machines','Family & Utility','Commercial Traffic','Freight Routes','Extreme Transport','Engineering Beyond Roads'];
const LEVELS=VEHICLE_FLEET.map((v,i)=>{
  const tier=Math.floor(i/6), progress=i/47;
  return {id:i+1,title:`${REGIONS[tier]} · ${v.name}`,vehicle:v.name,type:v.kind,emoji:v.icon,
   mass:v.kg/1000,kg:v.kg,note:v.note,source:v.source,
   panels:Math.min(8,5+Math.floor(i/9)),span:Math.min(840,560+i*6),
   budget:630+i*34+(i>=30?70:0),required:.68+1.76*Math.pow(progress,1.10),
   desc:`${v.note}. Build a reliable bridge for a crossing of approximately ${Math.round(v.kg*2.20462262).toLocaleString('en-US')} lb. ${i>=41?'Special fictional engineering scenario—not an ordinary public road bridge.':'Watch the simulated deck deformation and improve your structure.'}`};
});
const VEHICLE_KG = LEVELS.map(v=>v.kg);
if(LEVELS.length!==48 || VEHICLE_KG.some((v,i)=>i&&v<=VEHICLE_KG[i-1]))throw Error('Fleet must increase by weight every level.');
const massLabel=kg=>`${Math.round(kg*2.20462262).toLocaleString('en-US')} lb (${kg>=1000?(kg/1000).toLocaleString('en-US',{maximumFractionDigits:2}):Math.round(kg)} ${kg>=1000?'metric t':'kg'})`;
// Game-scaled material properties. Tension is pulling; compression is pushing.
// Values are comparative classroom units, not engineering-grade specifications.
const MAT={
 wood:    {label:'Wood',    cost:.31,tension:1.10,compression:.86,stiffness:.90,mass:.55,buckle:.52,color:'#d5a271',note:'Affordable and fairly light. Long compression beams can buckle.'},
 steel:   {label:'Steel',   cost:.62,tension:2.05,compression:1.86,stiffness:1.85,mass:1.48,buckle:.22,color:'#a0d9eb',note:'Strong in both pulling and pushing; expensive and heavy.'},
 cable:   {label:'Cable',   cost:.38,tension:1.82,compression:.015,stiffness:1.25,mass:.19,buckle:0,color:'#ffdc83',note:'Excellent at pulling, almost useless at pushing. Best as a tie.'},
 concrete:{label:'Concrete',cost:.44,tension:.33,compression:2.38,stiffness:1.25,mass:2.60,buckle:.10,color:'#d7d9df',note:'Very strong under compression; weak under tension and very heavy.'},
 chain:   {label:'Chain',   cost:.52,tension:2.25,compression:.012,stiffness:1.0,mass:1.54,buckle:0,color:'#f6b67b',note:'Extremely strong when pulled; links go slack when pushed. Heavy.'},
 aluminum:{label:'Aluminum',cost:.57,tension:1.38,compression:1.02,stiffness:1.28,mass:.32,buckle:.78,color:'#92e8c6',note:'Very light with good tension strength, but long columns buckle.'}
};
const STORE='naches_bridge_builder_v2',OLD='nvhub_bridge_v1';
const blank=()=>({unlocked:1,best:{},current:1,drafts:{},lab:{},scienceGate:null,scienceRecoveryGoal:null,scienceRestoreGate:null,scienceRolls:{},scienceStats:{correct:0,wrong:0,skipped:0,questions:0}});
let saved=blank();try{const v=JSON.parse(localStorage.getItem(STORE)||'null');if(v&&typeof v==='object'){saved={...blank(),...v,drafts:v.drafts||{},lab:v.lab||{}};}else{const old=JSON.parse(localStorage.getItem(OLD)||'null');if(old){saved.unlocked=Math.min(48,Math.max(1,old.unlocked||1));saved.best=old.best||{};saved.current=1;}}}catch{}
// Preserve accomplishments from the original campaign, but not incompatible old bridge shapes.
if(saved.vehicleSequenceVersion!==2){saved.drafts={};saved.vehicleSequenceVersion=2;}
saved.unlocked=Math.max(1,Math.min(48,Number(saved.unlocked)||1));
// A recovery gate restricts CURRENT play, but never deletes historic stars/unlocks.
// Old v4.2 saves migrate without losing previously completed missions.
saved.scienceGate=clampSave(saved.scienceGate==null?saved.unlocked:saved.scienceGate,1,saved.unlocked);
saved.scienceRolls=saved.scienceRolls||{};
saved.scienceStats={correct:0,wrong:0,skipped:0,questions:0,...(saved.scienceStats||{})};
function clampSave(x,a,b){return Math.max(a,Math.min(b,Number(x)||a));}
let level=Math.min(saved.scienceGate,Math.max(1,Number(saved.current)||1));
let trussSide='below',prediction=null,answeredLab=false,selectedBeam=null,analysisHighlight=-1,reviewDone=false,reviewOutcome=null,report=null;
let nodes=[],bars=[],history=[],tool='triangle',material='wood',hints=true,selectedJoint=null,hover=null,pointerOrigin=null,pointerCurrent=null;
let showForces=true;let busy=false,testState='idle',revision=0,passRevision=-1,vehicleX=null,progress=0,collapseIndex=-1,collapseT=0,stressProfile=[],lastStress=0,sound=true,audio=null,aniId=0,lastResult=null;
const colorStress=r=>r>=1?'#ff7278':r>.79?'#ffd26c':'#6be9be';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const config=()=>LEVELS[level-1],left=()=>500-config().span/2,step=()=>config().span/config().panels;
const fmt=n=>Math.round(n).toLocaleString('en-US');
function save(){saved.current=level;try{localStorage.setItem(STORE,JSON.stringify(saved));}catch{}}
function soundFx(type){if(!sound)return;try{audio=audio||new (window.AudioContext||window.webkitAudioContext)();const t=audio.currentTime,o=audio.createOscillator(),g=audio.createGain();o.type=type==='crash'?'sawtooth':'triangle';let f=type==='pass'?650:type==='crash'?165:type==='click'?470:310;o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(type==='pass'?980:Math.max(48,f*.48),t+(type==='crash'?.52:.11));g.gain.setValueAtTime(type==='crash'?.09:.035,t);g.gain.exponentialRampToValueAtTime(.001,t+(type==='crash'?.55:.14));o.connect(g);g.connect(audio.destination);o.start(t);o.stop(t+(type==='crash'?.55:.15));}catch{}}
function position(i){return nodes.find(n=>n.id===i)}
function distance(b){const a=position(b.a),z=position(b.b);return a&&z?Math.hypot(a.x-z.x,a.y-z.y):0}
function used(){return bars.filter(b=>!b.fixed).reduce((sum,b)=>sum+distance(b)*MAT[b.mat].cost,0)}
function remaining(){return config().budget-used()}
function snapshot(){return JSON.stringify({nodes,bars})}
function remember(){history.push(snapshot());if(history.length>75)history.shift();}
function message(text,kind=''){const el=$('#message');el.textContent=text;el.className='notice '+(kind||'')}
function savedDraft(){saved.drafts[level]={nodes,bars};save()}
function fresh(){const c=config(),x=left(),dx=step();nodes=Array.from({length:c.panels+1},(_,i)=>({id:i,x:x+i*dx,y:216,deck:true,anchor:i===0||i===c.panels}));bars=Array.from({length:c.panels},(_,i)=>({a:i,b:i+1,mat:'deck',fixed:true}));}
function loadMission(num,eraseDraft=false){if(busy)return;level=clamp(num,1,Math.min(saved.unlocked,saved.scienceGate));fresh();if(!eraseDraft&&saved.drafts?.[level]){try{const d=saved.drafts[level];if(Array.isArray(d.nodes)&&Array.isArray(d.bars)&&d.nodes.length>=config().panels+1){nodes=structuredClone(d.nodes);bars=structuredClone(d.bars)}}catch{fresh();}}history=[];revision++;invalidate();$('#missionLabel').textContent=`MISSION ${String(level).padStart(2,'0')} / 48`;$('#missionName').textContent=config().title;$('#missionDescription').textContent=config().desc;$('#vehicleIcon').textContent=config().emoji;
 const portrait=$('#vehiclePreview'),kind=config().type;
 portrait.setAttribute('viewBox',kind==='crawlerload'?'0 -120 240 250':(['plane','crane','excavator'].includes(kind)?'0 -48 240 176':'0 -12 240 135'));
 portrait.innerHTML=vehicleSvg(config(),120,75,0);$('#vehicleName').textContent=config().vehicle;$('#vehicleMass').textContent=`Approx. ${massLabel(config().kg)} crossing load`;
 $('#vehicleFacts').textContent=config().note+' · Representative/rounded mass; classroom simulation.';
 const citation=$('#vehicleSource');citation.hidden=!config().source;if(config().source)citation.href=config().source;
 $('#nextVehicle').textContent=level<48?`Next: ${LEVELS[level].vehicle} · ${massLabel(LEVELS[level].kg)}`:'Final vehicle reached';refreshUnlocks();renderLab();renderLevels();updateCoach();draw();save();}
function invalidate(){selectedBeam=null;analysisHighlight=-1;reviewDone=false;reviewOutcome=null;testState='idle';passRevision=-1;lastResult=null;busy=false;vehicleX=null;progress=0;collapseIndex=-1;collapseT=0;stressProfile=[];lastStress=0;selectedJoint=null;hover=null;$('#driveFill').style.width='0%';$('#nextBtn').disabled=true;$('#replayBtn').disabled=true;$('#testBtn').disabled=false;$('#buildStatus').textContent='READY TO BUILD';$('#simProgress').textContent='Not tested';$('#stageHelp').textContent='Triangle helper: click a numbered roadway span to add support.';message('Select Triangle helper and click a numbered roadway span. Test the crossing when your design is ready.');}
function commit(){selectedBeam=null;analysisHighlight=-1;reviewDone=false;reviewOutcome=null;prediction=null;updatePrediction();revision++;testState='idle';passRevision=-1;busy=false;vehicleX=null;progress=0;collapseIndex=-1;collapseT=0;stressProfile=[];lastStress=0;selectedJoint=null;$('#nextBtn').disabled=true;$('#replayBtn').disabled=true;$('#testBtn').disabled=false;$('#driveFill').style.width='0%';$('#simProgress').textContent='Design changed · retest';$('#buildStatus').textContent='UPDATED DESIGN';savedDraft();updateCoach();draw();}
// Simplified load-path simulation, not finite-element structural analysis.
// A triangle needs BOTH a compression path and a tension path. Chains and
// cables offer almost no compression capacity, while concrete excels in it.
// Repeating a support in the same panel helps, but load-path efficiency,
// self-weight, member length and cost prevent unlimited strength stacking.
function roleForLeg(span,side,leg){
 const leftHalf=span<(config().panels/2);
 const inverted=side==='upper';
 const isTension=(leg===0)!==(leftHalf!==inverted);
 return isTension?'tension':'compression';
}
function memberCapacity(mat,role,len){
 const m=MAT[mat]||MAT.wood;
 const lengthRatio=Math.max(.4,len/135);
 // Buckling can strongly reduce a long compression member's safe load.
 const buckle=role==='compression'?1+m.buckle*Math.max(0,lengthRatio*lengthRatio-.35):1;
 return (m[role]*m.stiffness**.22)/buckle;
}
function score(){
 const c=config(),members=bars.filter(b=>!b.fixed),n=c.panels;
 const supports=Array(n).fill(.13),triangles=Array(n).fill(0),compression=Array(n).fill(0),tension=Array(n).fill(0),barForces=new Map();
 const extra=nodes.filter(x=>!x.deck),dx=step();
 let dead=0;
 for(const b of members){const m=MAT[b.mat]||MAT.wood;dead+=distance(b)*m.mass;}
 const weightPenalty=clamp(dead/(c.span*6)*.23,0,.46);
 for(let i=0;i<n;i++){
  const tris=[];
  for(const p of extra){
   const e1=members.find(b=>(b.a===i&&b.b===p.id)||(b.b===i&&b.a===p.id));
   const e2=members.find(b=>(b.a===i+1&&b.b===p.id)||(b.b===i+1&&b.a===p.id));
   if(!e1||!e2)continue;
   const height=Math.abs(p.y-216),offset=Math.abs(p.x-(nodes[i].x+nodes[i+1].x)/2);
   const geometry=clamp(height/105,.20,1.10)*clamp(1-offset/(dx*1.5),.24,1);
   const side=p.y<216?'upper':'lower';
   const role1=roleForLeg(i,side,0),role2=roleForLeg(i,side,1);
   const cap1=memberCapacity(e1.mat,role1,distance(e1)),cap2=memberCapacity(e2.mat,role2,distance(e2));
   barForces.set(e1,{role:role1,capacity:cap1,panel:i});
   barForces.set(e2,{role:role2,capacity:cap2,panel:i});
   const minCap=Math.min(cap1,cap2);
   // Members in series are only as useful as the weaker leg.
   const capacity=minCap*geometry*(side==='upper'?1.14:1.08);
   if(capacity>0){tris.push(capacity);compression[i]+=role1==='compression'?cap1:cap2;tension[i]+=role1==='tension'?cap1:cap2;}
  }
  tris.sort((a,b)=>b-a);
  // Every additional triangle brings less benefit in the same load path;
  // no fixed ban on doubling/tripling braces. Students may reinforce more,
  // but distributing the material often produces a stronger bridge per dollar.
  const multipliers=[1,.57,.34,.20,.12,.075,.045,.03];
  supports[i]+=tris.reduce((total,value,index)=>total+value*(multipliers[index]??.018),0);
  triangles[i]=tris.length;
 }
 // Custom beams linking upper/lower truss joints act as longitudinal ties.
 // Count their added stiffness only when anchored by already braced panels.
 for(const b of members){
  if(barForces.has(b))continue;
  const a=position(b.a),z=position(b.b);
  if(!a||!z)continue;
  const start=clamp(Math.floor((Math.min(a.x,z.x)-left())/dx),0,n-1);
  const end=clamp(Math.floor((Math.max(a.x,z.x)-left())/dx),0,n-1);
  const horizontal=Math.abs(a.x-z.x),vertical=Math.abs(a.y-z.y);
  const role=horizontal>=vertical?'tension':'compression';
  const cap=memberCapacity(b.mat,role,distance(b));
  barForces.set(b,{role,capacity:cap,panel:Math.floor((start+end)/2)});
  if(horizontal>dx*.55&&end-start<=3){
    for(let i=start;i<=end;i++)if(triangles[i]){
      // Horizontal connection improves load sharing, never substitutes
      // for the basic local triangle or creates support from nothing.
      supports[i]+=Math.min(.16,cap*.09)/(end-start+1);
    }
  }
 }
 const effective=supports.map((v,i)=>v+.035*Math.max(0,(supports[i-1]||.13)-.13)+.035*Math.max(0,(supports[i+1]||.13)-.13));
 // Heavy vehicles ask more of a structure, and concentrated load peaks
 // near midspan; dead load raises demand even with no vehicle on the bridge.
 const needs=effective.map((_,i)=>c.required*.86*(.82+.29*Math.sin(Math.PI*(i+.5)/n))*(1+weightPenalty));
 const ratios=effective.map((v,i)=>needs[i]/Math.max(.01,v));
 const worst=Math.max(...ratios),weak=ratios.indexOf(worst);
 return {supports:effective,needs,ratios,worst,weak,strength:1/Math.max(.01,worst),triangles,
  pass:worst<=1,capacity:effective[weak],required:needs[weak],weightPenalty,dead,barForces,compression,tension};
}
function findNode(p,r=18){return nodes.find(n=>Math.hypot(n.x-p.x,n.y-p.y)<r)}
function closestBeam(p){let chosen=null,dmin=15;for(const b of bars.filter(b=>!b.fixed)){const a=position(b.a),z=position(b.b);if(!a||!z)continue;const vx=z.x-a.x,vy=z.y-a.y,t=clamp(((p.x-a.x)*vx+(p.y-a.y)*vy)/(vx*vx+vy*vy),0,1),d=Math.hypot(p.x-a.x-vx*t,p.y-a.y-vy*t);if(d<dmin){chosen=b;dmin=d}}return chosen;}
function panelAt(p){const i=Math.floor((p.x-left())/step());return p.y>=60&&p.y<=365&&i>=0&&i<config().panels?i:-1;}
function point(ev){const r=svg.getBoundingClientRect();return{x:(ev.clientX-r.left)*1000/r.width,y:(ev.clientY-r.top)*500/r.height};}
function addTriangle(i,quiet=false){if(busy)return false;if(!material){message('Choose a material before placing a triangle.','bad');return false;}const c=config();if(i<0||i>=c.panels)return false;const existing=nodes.filter(n=>!n.deck&&Math.abs(n.x-(nodes[i].x+nodes[i+1].x)/2)<step()*.30&&Math.abs(n.y-216)>45&&(trussSide==='above'?n.y<216:n.y>216)).length;
 if(nodes.length>83){if(!quiet)message('Joint limit reached. Remove unnecessary braces before adding more.','bad');return false;}
 if(trussSide==='above'&&level<9){message('Above-deck trusses unlock at mission 9.','bad');return false;}const x=+(nodes[i].x+step()*(.5+((existing%5)-2)*.065)).toFixed(2);const y=trussSide==='above'?Math.max(65,114-Math.floor(existing/2)*10):Math.min(407,306+Math.floor(existing/2)*12);const id=Math.max(...nodes.map(n=>n.id))+1;const node={id,x,y,deck:false,anchor:false};const newbars=[{a:i,b:id,mat:material},{a:i+1,b:id,mat:material}];const price=newbars.reduce((a,b)=>{const z=b.a===i?nodes[i]:nodes[i+1];return a+Math.hypot(z.x-node.x,z.y-node.y)*MAT[material].cost},0);if(price>remaining()+.00001){if(!quiet)message('Not enough money for that triangle. Try wood or erase another beam.','bad');return false;}remember();nodes.push(node);bars.push(...newbars);commit();if(!quiet){message(`Added a ${MAT[material].label.toLowerCase()} triangle to span ${i+1}. Keep bracing other spans or test now.`);soundFx('click');}return true;
}
function connect(a,b){if(!material){message('Choose a material first.','bad');return false;}if(a===b){message('Select two different joints.','bad');return false;}if(bars.some(k=>(k.a===a&&k.b===b)||(k.a===b&&k.b===a))){message('Those joints are already connected. Add another brace nearby, or create a separate joint to reinforce this span.','bad');return false;}const n1=position(a),n2=position(b);if(!n1||!n2||Math.hypot(n1.x-n2.x,n1.y-n2.y)>260){message('Beam is too long. Add an intermediate joint.','bad');return false;}const cost=Math.hypot(n1.x-n2.x,n1.y-n2.y)*MAT[material].cost;if(cost>remaining()+.0001){message('That beam exceeds the budget. Choose cheaper material.','bad');return false;}remember();bars.push({a,b,mat:material});commit();soundFx('click');message('Beam connected. To keep drawing, select another pair of joints.');return true;}
function connectBlank(a,p){if(!material){message('Select a material first.','bad');return false;}p={x:Math.round(clamp(p.x,72,930)/10)*10,y:Math.round(clamp(p.y,70,410)/10)*10};if(p.y>172&&p.y<260)p.y=p.y<216?155:265;if(nodes.length>85){message('Maximum number of joints reached.','bad');return false;}const n=position(a),d=Math.hypot(n.x-p.x,n.y-p.y);if(d>250||d<20){message('Place the new joint 20–250 units from the starting joint.','bad');return false;}if(d*MAT[material].cost>remaining()){message('Not enough budget for this beam.','bad');return false;}remember();const id=Math.max(...nodes.map(z=>z.id))+1;nodes.push({id,...p,deck:false,anchor:false});bars.push({a,b:id,mat:material});commit();selectedJoint=id;draw();message('New joint created. Connect it to another joint to make a triangle.');soundFx('click');return true;}
function paintAt(p){if(!material){message('Choose the replacement material first.','bad');return;}const b=closestBeam(p);if(!b){message('Select an existing colored beam to change its material.','bad');return;}if(b.mat===material){message('That beam already uses this material.');return;}const newCost=distance(b)*MAT[material].cost,oldCost=distance(b)*MAT[b.mat].cost;if(newCost-oldCost>remaining()+.001){message(`Not enough budget to change this beam to ${MAT[material].label.toLowerCase()}.`,'bad');return;}remember();b.mat=material;commit();soundFx('click');message(`Updated beam to ${MAT[material].label}. Watch its pulling or pushing role.`);}
function eraseAt(p){const b=closestBeam(p);if(b){remember();bars=bars.filter(x=>x!==b);commit();message('Beam removed. Test again after editing.');return;}const n=findNode(p);if(n&&!n.deck){remember();nodes=nodes.filter(x=>x.id!==n.id);bars=bars.filter(x=>x.a!==n.id&&x.b!==n.id);commit();message('Joint and connected beams removed.');return;}message('Choose a colored beam or a green support joint to erase.');}
function stageAction(p,origin=null,drag=false){if(busy)return;if(tool==='inspect'){const found=closestBeam(p);selectedBeam=found===selectedBeam?null:found;updateBeamInspector();draw();message(selectedBeam?'Beam selected. Inspect it below the material tools.':'Selection cleared.');return;}if(tool==='triangle'){const i=panelAt(p);if(i<0){message('Select a yellow numbered span on the road to add a triangle.');return;}addTriangle(i);return;}
 if(tool==='erase'){eraseAt(p);return;}
 if(tool==='paint'){paintAt(p);return;}
 if(tool==='beam'){
  const node=findNode(p,22);if(drag&&origin!==null){if(node)connect(origin,node.id);else connectBlank(origin,p);return;}
  if(selectedJoint===null){if(node){selectedJoint=node.id;message('First joint selected. Click another joint—or below the bridge to create a joint.');draw();}else{message('Choose a joint first (a colored dot).','bad');}return;}
  if(node){if(node.id===selectedJoint){selectedJoint=null;draw();message('Selection cleared.');}else connect(selectedJoint,node.id);}
  else connectBlank(selectedJoint,p);
 }
}
svg.addEventListener('pointerdown',ev=>{if(busy||!ev.isPrimary)return;const p=point(ev);pointerOrigin={p,node:findNode(p,22)?.id??null};pointerCurrent=p;try{svg.setPointerCapture(ev.pointerId)}catch{};});
svg.addEventListener('pointermove',ev=>{if(busy)return;const p=point(ev);hover=tool==='triangle'?panelAt(p):-1;pointerCurrent=p;if(tool==='beam'||tool==='triangle'||tool==='paint')draw();});
svg.addEventListener('pointerup',ev=>{if(busy||!ev.isPrimary)return;const p=point(ev),org=pointerOrigin;pointerOrigin=null;pointerCurrent=null;hover=null;if(!org)return;const drag=Math.hypot(p.x-org.p.x,p.y-org.p.y)>22;stageAction(p,org.node,drag&&tool==='beam'&&org.node!==null);draw();});
svg.addEventListener('pointercancel',()=>{pointerOrigin=null;pointerCurrent=null;hover=null;draw()});
function updateCoach(){const c=config(),s=score(),has=bars.some(b=>!b.fixed);if(!has){$('#coachTitle').textContent='Start with triangles';$('#coachText').textContent='Choose Triangle helper and click any numbered roadway span. Repeat across the bridge to create a strong support pattern.';$('#coachNote').textContent=level>=9?'Compare the force roles of overhead and lower trusses.':level>=5?'Concrete is a strong compression strut, not a tension cable.':'A truss needs a way to resist both pushing and pulling.';}
 else if(s.worst>1){$('#coachTitle').textContent=`Reinforce span ${s.weak+1}`;$('#coachText').textContent=`Span ${s.weak+1} is at ${Math.round(s.worst*100)}% of its estimated capacity. Check the pulling and pushing legs. A chain or cable cannot replace a compression strut.`;$('#coachNote').textContent=`Adding another brace is allowed, but repeated braces have diminishing benefits. Try complementary materials or a different load path.`;}
 else{$('#coachTitle').textContent='Ready for a test drive';$('#coachText').textContent='The static estimate looks strong enough. Press Test crossing, then watch the bridge flex under your vehicle.';$('#coachNote').textContent='You still must finish the entire animated crossing to unlock the next mission.';}
 $('#fixBtn').disabled=busy||!has;
}
function renderLevels(){
 const playable=Math.min(saved.unlocked,saved.scienceGate);
 $('#levelGrid').innerHTML=LEVELS.map(c=>`<button type="button" data-level="${c.id}" title="${c.vehicle} · ${massLabel(c.kg)}${c.id>playable&&c.id<=saved.unlocked?' · Recover science credit to replay':''}" class="${level===c.id?'current':''}" ${c.id>playable?'disabled':''}><span>${c.id}</span><small>${c.id>playable?'🔒':saved.best[c.id]?'★'.repeat(saved.best[c.id]):'○'}</small></button>`).join('');
 const recovering=playable<saved.unlocked;
 $('#campaignCount').textContent=`${playable} / 48 playable${recovering?' · recovery active':''}`;
 $('#scienceProgress').textContent=recovering?`Recovery: clear science through level ${saved.scienceRecoveryGoal||saved.unlocked} to restore your prior access. Previous stars are saved.`:'Advance by passing both the bridge test and engineering check.';
 $('#scienceScore').textContent=`Science solved: ${saved.scienceStats.correct} · Corrections: ${saved.scienceStats.wrong} · Skips: ${saved.scienceStats.skipped}`;
 $('#fleetList').innerHTML=LEVELS.map(c=>`<button type="button" class="fleet-entry ${c.id===level?'active':''}" data-fleet="${c.id}" ${c.id>playable?'disabled':''} title="${c.note}"><span class="fleet-icon">${c.emoji}</span><span><strong>${String(c.id).padStart(2,'0')} · ${c.vehicle}</strong><small>${massLabel(c.kg)}</small></span><span class="fleet-tag">${c.id>playable?'LOCKED':'PLAY'}</span></button>`).join('');
}

function updateMetrics(){const c=config(),s=score(),total=used();$('#budgetStat').textContent='$'+fmt(Math.max(0,remaining()));$('#budgetStat').style.color=remaining()<0?'#ff817c':'';$('#budgetFill').style.width=clamp(remaining()/c.budget*100,0,100)+'%';$('#beamStat').textContent=bars.filter(b=>!b.fixed).length;$('#materialBreakdown').textContent=Object.keys(MAT).filter(k=>bars.some(b=>b.mat===k)).map(k=>`${bars.filter(b=>b.mat===k).length} ${MAT[k].label.toLowerCase()}`).join(' · ')||'Choose a material';
 $('#weakStat').textContent=bars.some(b=>!b.fixed)?`#${s.weak+1}`:'—';$('#weakSub').textContent=bars.some(b=>!b.fixed)?`${Math.round(s.worst*100)}% of estimated capacity`:'Add bracing to the deck';$('#starStat').textContent=saved.best[level]?'★'.repeat(saved.best[level]):'—';$('#unlockStat').textContent=level===48?'Final mission':`Level ${Math.min(48,level+1)} ${saved.unlocked>level?'unlocked':'locked'}`;
 $('#stressTrack').innerHTML=s.ratios.map((v,i)=>`<div class="span" data-label="${i+1}" title="Span ${i+1}: ${Math.round(v*100)}% estimated stress" style="background:${testState==='idle'?'#557585':colorStress(v)}"></div>`).join('');
 $('#deadLoadStat').textContent=`Self-weight: +${Math.round(s.weightPenalty*100)}% demand`;
 if(testState==='idle'){$('#stressValue').textContent='—';$('#stressValue').style.color='#b6cbd4';$('#stressStatus').textContent='Teaching-model estimate';}
 else{$('#stressValue').textContent=Math.round((lastStress||s.worst)*100)+'%';$('#stressValue').style.color=colorStress(lastStress||s.worst);$('#stressStatus').textContent=testState==='passed'?'Crossing passed':testState==='failed'?'Collapsed':`Moving ${c.vehicle.toLowerCase()}`;}
}
// Each of the 48 missions has its own vehicle identity. A small procedural
// SVG fleet keeps the game offline-friendly while preserving distinct profiles.
function vehicleSvg(v,x,y,rotation=0){
 const kind=v.type,n=v.id,ink='#142d3f',glass='#9be8ee';
 const colors=['#f6bb63','#53c5c3','#ed795e','#9fd0a8','#d3a4eb','#f4d36c','#83bddb','#f0a58e'];
 const main=colors[(n-1)%colors.length],light='#fce7bd',dark='#18384c',steel='#b4cbd1';
 const wheel=(cx,cy,r=12)=>`<circle cx="${cx}" cy="${cy}" r="${r}" fill="#15252d" stroke="#bdd3d4" stroke-width="2"/><circle cx="${cx}" cy="${cy}" r="${r*.45}" fill="#607f90"/><circle cx="${cx}" cy="${cy}" r="${r*.2}" fill="#d5eaed"/>`;
 const wheels=(positions,r=11)=>positions.map(a=>wheel(a,27,r)).join('');
 const visor=(a,b,w=42)=>`<path d="M${a} -13H${b-12}L${b} 3H${a}Z" fill="${glass}" stroke="#4c7385" stroke-width="2"/>`;
 let body='',width=140;
 if(kind==='bike'||kind==='trike'){
  const tandem=n===5,cargo=n===6||n===8,ebike=n===4||n===6,low=n===7,trike=kind==='trike';
  width=tandem?140:105;
  const x0=tandem?-65:-42,x1=tandem?72:43,middle=(x0+x1)/2;
  body=`${wheel(x0,20,17)}${wheel(x1,20,17)}<path d="M${x0} 20L${middle-8} -14L${middle+12} 20L${x0} 20L${middle-1} 0L${x1} 20L${middle+12} -20" fill="none" stroke="${main}" stroke-width="5" stroke-linejoin="round"/><path d="M${middle+12} -20L${x1-4} -26 M${middle-8} -14L${middle-10} -28 M${middle-20} -28h21" stroke="${steel}" stroke-width="4" fill="none"/>`;
  if(ebike)body+=`<rect x="${middle-10}" y="-7" width="24" height="11" rx="3" fill="#3c5368" stroke="${light}" stroke-width="2"/>`;
  if(tandem)body+=`<circle cx="-33" cy="-43" r="9" fill="#ffe4ba"/><path d="M-33 -34L-34 -12L-55 2" stroke="${light}" stroke-width="7" fill="none"/>`;
  if(low)body+=`<path d="M-18 -22h38l15 17h-45" stroke="${light}" fill="none" stroke-width="4"/>`;
  if(cargo)body+=`<rect x="${x0-3}" y="-27" width="34" height="18" rx="3" fill="#ac7642" stroke="#f9d79d" stroke-width="2"/>`;
  if(trike)body+=`<ellipse cx="${x0-6}" cy="29" rx="18" ry="6" fill="#08283777"/>${wheel(x0-12,31,13)}`;
  body+=`<circle cx="${middle-7}" cy="-48" r="9" fill="#ffe1bc"/><path d="M${middle-8} -39L${middle-10} -18L${middle+10} 0" stroke="${main}" stroke-width="8" fill="none"/>`;
 }
 else if(kind==='motor'||kind==='sidecar'){
  width=148;body=`${wheel(-48,23,16)}${wheel(46,23,16)}<path d="M-48 22L-16 -5L12 20H44L21 -19" fill="none" stroke="${steel}" stroke-width="6"/><path d="M-23 -14Q0 -26 26 -14L18 -4H-26Z" fill="${main}" stroke="${light}" stroke-width="3"/><rect x="-34" y="-17" width="25" height="6" rx="3" fill="${dark}"/><path d="M26 -20L35 -37" stroke="${steel}" stroke-width="4"/><circle cx="-2" cy="-51" r="10" fill="#ecddbf"/><path d="M-2 -39L-14 -18L13 5" stroke="${main}" stroke-width="9" fill="none"/>`;
  if(n===10||n===14)body+=`<path d="M18 -28Q36 -55 40 -53L43 -20" fill="#b8e7ee77" stroke="#83d0dd" stroke-width="3"/>`;
  if(n===13)body+=`<path d="M-22 -10Q12 -33 37 -8L19 6Z" fill="#548adb" opacity=".85"/>`;
  if(n===14)body+=`<rect x="-58" y="-31" width="22" height="18" fill="#836544"/>`;
  if(kind==='sidecar')body+=`<path d="M-8 3H95L90 23H0Z" fill="${main}"/>${wheel(86,24,13)}<ellipse cx="67" cy="0" rx="24" ry="13" fill="${light}"/>`;
 }
 else if(kind==='atv'||kind==='utv'){
  width=150;body=`<path d="M-64 7L-49 -15H38L61 6L62 21H-62Z" fill="${main}" stroke="${light}" stroke-width="3"/>${wheels([-47,45],16)}<path d="M-23 -14L-8 -38H28L41 -13" stroke="${steel}" stroke-width="5" fill="none"/>${kind==='utv'?'<path d="M-18 -36H33" stroke="#d9eef0" stroke-width="5"/>':''}<rect x="-51" y="-7" width="18" height="10" fill="${dark}"/>`;
 }
 else if(['micro','car','sports','suv','pickup','van','police','rv','ambulance','box','bus'].includes(kind)){
  const short=['micro','sports'].includes(kind),tall=['van','rv','ambulance','box','bus'].includes(kind),long=['rv','box','bus'].includes(kind);width=short?115:long?182:148;
  const half=width/2,roof=tall?-55:kind==='suv'?-35:kind==='pickup'?-30:-31;
  if(['box','bus','rv'].includes(kind))body=`<rect x="${-half}" y="${roof}" width="${width-9}" height="${24-roof}" rx="5" fill="${main}" stroke="${light}" stroke-width="3"/>${visor(half-49,half-4)}`;
  else if(kind==='van'||kind==='ambulance')body=`<path d="M${-half} 24V-45H${half-37}L${half} -16V24Z" fill="${main}" stroke="${light}" stroke-width="3"/>${visor(half-43,half-7)}`;
  else body=`<path d="M${-half} 23V-5L${-half+16} -12L${-half+35} ${roof}H${half-30}L${half-13} -8L${half} 4V23Z" fill="${main}" stroke="${light}" stroke-width="3"/>${visor(half-57,half-10)}`;
  const wheelx=short?[-half+24,half-23]:[-half+24,half-23];body+=wheels(wheelx,short?10:13);
  if(['bus','rv','van','box'].includes(kind))body+=[-half+15,-half+37,-half+58,-half+80].filter(k=>k<half-57).map(k=>`<rect x="${k}" y="${roof+8}" width="16" height="16" rx="2" fill="${glass}" stroke="#41637a" stroke-width="2"/>`).join('');
  if(kind==='pickup')body+=`<path d="M-45 -14H-5V13H-45Z" fill="#bb7f52" stroke="#f2d5a3" stroke-width="2"/><path d="M-40 -14V6" stroke="#f9d69a"/>`;
  if(kind==='sports')body+=`<path d="M-37 1H10" stroke="#192d41" stroke-width="4"/><path d="M-41 -26L-57 -29" stroke="${light}" stroke-width="4"/>`;
  if(kind==='police')body+=`<rect x="-17" y="${roof-10}" width="39" height="8" rx="3" fill="#ee5457"/><rect x="2" y="${roof-10}" width="19" height="8" fill="#76c9ff"/>`;
  if(kind==='ambulance')body+=`<path d="M-31 -26h15v-11h8v11H5v8H-8v11h-8v-11h-15Z" fill="#f5f1e9"/>`;
  if(kind==='bus')body+=`<path d="M-20 -37V7M18 -37V7" stroke="#224f68" stroke-width="4"/>`;
  if(kind==='rv')body+=`<rect x="-37" y="-30" width="36" height="15" rx="3" fill="#a8dce6"/>`;
  if(kind==='box')body+=`<rect x="-49" y="-30" width="53" height="23" rx="3" fill="#ffe4a2" opacity=".62"/>`;
 }
 else if(['fire','mixer','dump','semi','logs','haul','triplelogs','crane','tank'].includes(kind)){
  width=['triplelogs','haul','semi'].includes(kind)?212:175;
  const half=width/2;
  body=`<rect x="${half-57}" y="-25" width="53" height="50" rx="4" fill="${main}" stroke="${light}" stroke-width="3"/>${visor(half-52,half-7)}<path d="M${-half} 21H${half}V11H${-half}Z" fill="#566f7a"/>`;
  const axle=['semi','triplelogs','haul'].includes(kind)?[-half+22,-half+48,-half+73,half-36,half-17]:[-half+25,-half+55,half-30];body+=wheels(axle,11);
  if(kind==='fire')body+=`<rect x="${-half+3}" y="-28" width="90" height="39" rx="3" fill="#ed615e"/><path d="M${-half+10} -30H${half-66}" stroke="#e5eef3" stroke-width="5"/><path d="M${-half+12} -38H${half-64}" stroke="#e5eef3" stroke-width="5"/>`;
  if(kind==='mixer')body+=`<ellipse cx="-28" cy="-22" rx="46" ry="30" fill="#bcceda" stroke="#7d9fb4" stroke-width="4" transform="rotate(-14 -28 -22)"/><path d="M-58 -36L-8 -14" stroke="#ec9f62" stroke-width="8"/>`;
  if(kind==='dump')body+=`<path d="M${-half} -42L${half-66} -32V10H${-half}Z" fill="#d8a34d" stroke="#ffd88e" stroke-width="3"/><path d="M${-half+10} -30H${half-76}" stroke="#b7733a" stroke-width="6"/>`;
  if(kind==='semi')body+=`<rect x="${-half}" y="-38" width="${width-58}" height="48" rx="3" fill="#cedce1" stroke="#7099aa" stroke-width="3"/><path d="M${-half+8} -30H${half-66}" stroke="${main}" stroke-width="8"/>`;
  if(['logs','triplelogs'].includes(kind)){
   const logs=kind==='triplelogs'?[-68,-45,-22]:[-55,-30];
   body+=`<path d="M${-half+3} 5H${half-58}" stroke="#b59b6e" stroke-width="7"/>`;
   for(const j of logs)body+=`<rect x="${j-19}" y="-24" width="62" height="11" rx="5" fill="#886444" stroke="#e0b67e" stroke-width="2"/>`;
   if(kind==='triplelogs')body+=`<path d="M-75 -37H26" stroke="#f5bb78" stroke-width="4" stroke-dasharray="15 5"/>`;
  }
  if(kind==='haul')body+=`<rect x="-74" y="-5" width="100" height="17" rx="4" fill="#5b7182"/><path d="M-60 -9L-40 -51L0 -49L20 -12" fill="${main}" stroke="#e6c98a" stroke-width="4"/>${wheel(-46,2,11)}${wheel(-8,2,11)}`;
  if(kind==='crane')body+=`<rect x="-62" y="-17" width="66" height="32" fill="#e8b45c"/><path d="M-60 -30L24 -105L32 -96L-44 -23" stroke="#f2c36b" stroke-width="10" fill="none"/><path d="M25 -104V-55" stroke="#f1f2eb" stroke-width="3"/><path d="M14 -55H36" stroke="#7e929a" stroke-width="6"/>`;
  if(kind==='tank')body+=`<path d="M-80 -11H25L42 0V21H-78Z" fill="#60795d" stroke="#cee5b3" stroke-width="4"/><path d="M-45 -15L-24 -43H16L35 -26L-2 -13Z" fill="#879c7c"/><path d="M8 -38H82" stroke="#a2b6a1" stroke-width="9"/>`;
 }
 else if(kind==='train'||kind==='traincar'){
  width=210;body=`<rect x="-95" y="-58" width="112" height="78" rx="7" fill="#ce5759" stroke="${light}" stroke-width="3"/><rect x="-63" y="-82" width="52" height="26" rx="5" fill="#f8cb77"/><rect x="-56" y="-75" width="29" height="19" fill="${glass}"/>${wheels([-78,-50,-20,12,58,85],10)}<rect x="21" y="-33" width="82" height="53" rx="5" fill="${kind==='traincar'?'#b8cad8':'#f4ca78'}" stroke="#7fa3b4" stroke-width="3"/>${kind==='traincar'?[-0,23,46].map(k=>`<rect x="${31+k}" y="-24" width="18" height="20" fill="${glass}"/>`).join(''):'<rect x="35" y="-23" width="35" height="20" fill="#e28c48"/>'}<path d="M-110 26H110" stroke="#d5b77e" stroke-width="5"/>`;
 }
 else if(kind==='mine'){
  width=190;body=`<rect x="-99" y="-58" width="135" height="65" fill="#e8b34f" stroke="#f6d882" stroke-width="4"/><path d="M-99 -58H18L32 -86H-91Z" fill="#d9953f" stroke="#f6cf78" stroke-width="4"/>${wheel(-62,21,26)}${wheel(57,21,26)}<rect x="43" y="-58" width="47" height="65" rx="4" fill="#6b8a8e"/>${visor(49,84)}<path d="M-99 -41H28" stroke="#88663e" stroke-width="6"/>`;
 }
 else if(kind==='plane'){
  width=220;body=`<rect x="-104" y="6" width="208" height="17" rx="7" fill="#596d7f"/>${wheels([-82,-49,60,87],10)}<path d="M-115 -47Q-70 -69 71 -56L110 -43L72 -32H-112Z" fill="#e8f1f3" stroke="#76b7ca" stroke-width="3"/><path d="M-8 -50L-45 -103L5 -93L51 -49" fill="#9dcbd8" stroke="#6a9fac" stroke-width="3"/><path d="M-104 -52L-108 -100L-86 -101L-57 -52" fill="#dce9ec" stroke="#79aebe" stroke-width="3"/><path d="M53 -51L78 -63L103 -43H48" fill="#82b7ca"/><path d="M-65 -41H-3" stroke="#3c87a5" stroke-width="6"/>`;
 }
 else if(kind==='excavator'){
  width=195;body=`<rect x="-106" y="-8" width="180" height="31" rx="14" fill="#394a51" stroke="#d8bf72" stroke-width="3"/>${[-80,-54,-27,0,32,59].map(a=>wheel(a,9,9)).join('')}<rect x="-84" y="-49" width="95" height="45" rx="6" fill="#e2ac4d"/><rect x="-61" y="-76" width="36" height="31" fill="${glass}"/><path d="M-20 -42L65 -103L88 -76L108 -20" stroke="#e6b44d" stroke-width="14" fill="none"/><path d="M84 -72L123 -28L115 -5L92 6L88 -19" fill="#dba44f" stroke="#8b7447" stroke-width="3"/>`;
 }
 else if(kind==='crawler'||kind==='crawlerload'){
  width=220;body=`<rect x="-110" y="-15" width="220" height="35" rx="7" fill="#b5b5a3" stroke="#ffe1a0" stroke-width="4"/>${[-74,-27,27,74].map(a=>`<rect x="${a-17}" y="10" width="34" height="23" rx="7" fill="#283a4a" stroke="#e5cd8e" stroke-width="3"/>`).join('')}<path d="M-115 -20H115L98 -43H-100Z" fill="#d7b76f" stroke="#fff1b4" stroke-width="4"/><rect x="-93" y="-51" width="38" height="26" fill="#56879c"/><rect x="52" y="-51" width="38" height="26" fill="#56879c"/>`;
  if(kind==='crawlerload')body+=`<path d="M-51 -46V-122H53V-46" fill="none" stroke="#bdcfdb" stroke-width="8"/><rect x="-46" y="-119" width="91" height="78" fill="#9daab6" opacity=".9"/><path d="M4 -48L-20 -65L-10 -120L-5 -154L5 -173L17 -153L26 -118L33 -62Z" fill="#f7f7ee" stroke="#e8bd72" stroke-width="4"/><path d="M4 -120V-53" stroke="#d47555" stroke-width="7"/>`;
  else body+=`<path d="M-48 -53H48" stroke="#d4dbdb" stroke-width="7"/>`;
 }
 else body=`<rect x="-58" y="-18" width="120" height="39" rx="7" fill="${main}"/>${wheels([-35,39])}`;
 return `<g transform="translate(${x} ${y}) rotate(${rotation})" style="filter:drop-shadow(2px 5px 2px #08253488)">${body}</g>`;
}

function sagAt(i){if(testState!=='testing'&&testState!=='failed'&&testState!=='passed')return 0;const x=nodes[i].x,dx=Math.abs(x-vehicleX),spread=step()*2.2,near=Math.exp(-Math.pow(dx/spread,2));let stress=lastStress||score().worst;let dy=(testState==='passed'?5:clamp(stress*9,6,22))*near;if(testState==='failed'){const cx=left()+(collapseIndex+.5)*step(),w=step()*2.6;dy+=clamp(1-Math.abs(x-cx)/w,0,1)*collapseT*170;}return dy;}
const ENVIRONMENTS=[
 {sky:'#0b2945',horizon:'#396378',water:'#2c8ba5',waterDeep:'#0c496c',far:'#2d5062',near:'#345d5e',bank:'#52765a'},
 {sky:'#264e6e',horizon:'#7fa0ac',water:'#4c9cb3',waterDeep:'#235d79',far:'#64798a',near:'#52776e',bank:'#648d68'},
 {sky:'#0c3140',horizon:'#5b806e',water:'#2d8491',waterDeep:'#145363',far:'#31566a',near:'#3a715a',bank:'#39795c'},
 {sky:'#162d4b',horizon:'#799cb7',water:'#3d87aa',waterDeep:'#234e6e',far:'#657a93',near:'#4b6d81',bank:'#66786b'},
 {sky:'#183951',horizon:'#d4a57a',water:'#3a95b5',waterDeep:'#1e5875',far:'#927966',near:'#65745a',bank:'#887f53'},
 {sky:'#423652',horizon:'#e1a077',water:'#6095b1',waterDeep:'#31596d',far:'#927063',near:'#8d775e',bank:'#947e50'},
 {sky:'#19283e',horizon:'#8d797c',water:'#477f9e',waterDeep:'#2d5068',far:'#6b586e',near:'#755e61',bank:'#796b57'},
 {sky:'#111d36',horizon:'#566b89',water:'#34648b',waterDeep:'#182f57',far:'#405276',near:'#455a69',bank:'#526b64'}
];
function decorate(){const c=config(),theme=ENVIRONMENTS[Math.floor((level-1)/6)]||ENVIRONMENTS[0];let x0=left(),x1=x0+c.span;
let html=`<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop stop-color="${theme.sky}"/><stop offset="1" stop-color="${theme.horizon}"/></linearGradient><linearGradient id="water" x1="0" y1="0" x2="0" y2="1"><stop stop-color="${theme.water}"/><stop offset="1" stop-color="${theme.waterDeep}"/></linearGradient><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#ffffff" stroke-opacity=".05" stroke-width="1"/></pattern></defs><rect width="1000" height="500" fill="url(#sky)"/><path d="M0 145L110 65L200 135L310 36L415 127L532 78L620 144L740 54L860 125L936 78L1000 138V345H0Z" fill="${theme.far}"/><path d="M0 180L120 116L190 164L337 98L430 187L590 121L710 193L810 107L1000 175V350H0Z" fill="${theme.near}"/><path d="M0 299Q250 284 500 298T1000 299V500H0Z" fill="url(#water)"/><path d="M-10 348Q135 337 310 346T610 346T1020 348M-10 389Q135 377 310 385T610 390T1020 389M-10 435Q135 425 310 435T610 434T1020 435" fill="none" stroke="#b2eef9" stroke-opacity=".22" stroke-width="4"/><rect width="1000" height="500" fill="url(#grid)"/>`;
const bank=(a,b,flip)=>`<path d="M${a} 160L${b} 172L${b} 500H${a}Z" fill="${theme.bank}"/><path d="M${a} 210L${b} 210" stroke="#99ac7e" stroke-width="7"/>`;
html+=bank(0,x0-16)+bank(x1+16,1000);
for(const [tx,ty,scale] of [[36,150,1.0],[88,154,.72],[950,155,.85],[980,150,.65]])html+=`<g transform="translate(${tx} ${ty}) scale(${scale})"><rect x="-5" y="20" width="10" height="60" fill="#674e3d"/><path d="M0 -36L-22 25H22Z M0 -18L-30 46H30Z" fill="#3d7f69" stroke="#78b68e" stroke-width="2"/></g>`;
html+=`<path d="M0 212H${x0}M${x1} 212H1000" stroke="#c0b29b" stroke-width="18"/><path d="M0 205H${x0}M${x1} 205H1000" stroke="#e0d4bb" stroke-width="5"/>`;
return html;
}
function draw(){const c=config(),q=score(),num=c.panels,deckPts=nodes.filter(n=>n.deck).map(n=>({...n,dy:sagAt(n.id)}));let html=decorate();
if(hints&&!busy&&tool==='triangle'){for(let i=0;i<num;i++){const a=nodes[i],b=nodes[i+1],y=trussSide==='above'?102:324,x=(a.x+b.x)/2,count=q.triangles[i];if(count===0||i===hover){html+=`<path d="M${a.x} 219L${x} ${y}L${b.x} 219" stroke="${i===q.weak?'#ffd56e':'#80d6c9'}" stroke-width="3" stroke-dasharray="9 7" fill="none" opacity="${i===hover?.95:.32}"/>`;}}}
for(let i=0;i<num;i++){const a=deckPts[i],b=deckPts[i+1],stress=testState==='idle'?0:(stressProfile[i]??q.ratios[i]);const col=stress===0?'#94b8c4':colorStress(stress);html+=`<line x1="${a.x}" y1="${a.y+a.dy}" x2="${b.x}" y2="${b.y+b.dy}" stroke="#163744" stroke-width="20" stroke-linecap="round"/><line x1="${a.x}" y1="${a.y+a.dy}" x2="${b.x}" y2="${b.y+b.dy}" stroke="${col}" stroke-width="10" stroke-linecap="round"/><path d="M${a.x} ${a.y+a.dy-6}L${b.x} ${b.y+b.dy-6}" stroke="#e4f2eb" stroke-width="2" opacity=".7"/>`;
html+=`<g data-panel="${i}" class="panel-click" role="button" tabindex="-1"><rect x="${a.x+4}" y="171" width="${b.x-a.x-8}" height="88" fill="${tool==='triangle'&&!busy?'#fff2a2':'transparent'}" opacity="${tool==='triangle'&&!busy?(hover===i?.13:.04):0}"/><circle cx="${(a.x+b.x)/2}" cy="179" r="16" stroke="${tool==='triangle'&&!busy?'#f2deaa':'#65838e'}" stroke-width="1.8" fill="${tool==='triangle'&&!busy?'#e9b96a':'#38586b'}"/><text x="${(a.x+b.x)/2}" y="184" font-size="14" fill="#132a38" text-anchor="middle" font-weight="900">${i+1}</text></g>`;
}
const drawMembers=(upper)=>{let output='';for(const b of bars.filter(x=>!x.fixed)){
 const a=position(b.a),z=position(b.b);if(!a||!z)continue;
 const isUpper=(!a.deck&&a.y<216)||(!z.deck&&z.y<216);if(isUpper!==upper)continue;
 const xa=a.x,ya=a.y+(a.deck?sagAt(a.id):0),xb=z.x,yb=z.y+(z.deck?sagAt(z.id):0);
 let col=MAT[b.mat].color;
 if(testState==='testing'||testState==='failed'){const ix=clamp(Math.floor(((xa+xb)/2-left())/step()),0,num-1),str=stressProfile[ix]??q.ratios[ix];if(str>.99)col=colorStress(str);}
 if(b===selectedBeam)output+=`<line x1="${xa}" y1="${ya}" x2="${xb}" y2="${yb}" stroke="#fff4b2" stroke-width="19" stroke-linecap="round" opacity=".84"/>`;
 output+=`<line x1="${xa}" y1="${ya}" x2="${xb}" y2="${yb}" stroke="#132f40" stroke-width="11" stroke-linecap="round"/><line x1="${xa}" y1="${ya}" x2="${xb}" y2="${yb}" stroke="${col}" stroke-width="${b.mat==='concrete'?9:6.7}" stroke-linecap="round" ${b.mat==='cable'||b.mat==='chain'?'stroke-dasharray="9 5"':''}/>`;
 if(showForces){const f=q.barForces.get(b);if(f){const cx=(xa+xb)/2,cy=(ya+yb)/2,kind=f.role==='tension'?'T':'C',mark=f.role==='tension'?'#65eddf':'#ffcb75';output+=`<circle cx="${cx}" cy="${cy}" r="8" fill="#133544" stroke="${mark}" stroke-width="1.5"/><text x="${cx}" y="${cy+3.5}" text-anchor="middle" font-size="10" font-weight="bold" fill="${mark}">${kind}</text>`;}}
 }return output;};
if(analysisHighlight>=0){const aa=nodes[analysisHighlight],zz=nodes[analysisHighlight+1];html+=`<rect x="${aa.x}" y="91" width="${zz.x-aa.x}" height="240" fill="#ffdc7a" fill-opacity=".12" stroke="#ffe08c" stroke-width="3" stroke-dasharray="10 6"/><text x="${(aa.x+zz.x)/2}" y="77" fill="#fff1bb" font-size="17" font-weight="900" text-anchor="middle">INSPECT SPAN ${analysisHighlight+1}</text>`;}
html+=drawMembers(false);
for(const n of nodes.filter(n=>n.y>=216)){const y=n.y+(n.deck?sagAt(n.id):0),marked=selectedJoint===n.id;html+=`<circle cx="${n.x}" cy="${y}" r="${marked?13:n.deck?9:8}" fill="${n.anchor?'#ffd98e':n.deck?'#ccedef':'#64e1c3'}" stroke="${marked?'#fff1ae':'#14374a'}" stroke-width="3"/>`;}
if(tool==='beam'&&!busy&&selectedJoint!==null&&pointerCurrent){const a=position(selectedJoint);if(a)html+=`<line x1="${a.x}" y1="${a.y}" x2="${pointerCurrent.x}" y2="${pointerCurrent.y}" stroke="#f8d97e" stroke-dasharray="8 5" stroke-width="4"/>`;}
if(tool==='beam'&&!busy&&pointerOrigin?.node!==null&&pointerOrigin?.node!==undefined&&pointerCurrent&&Math.hypot(pointerOrigin.p.x-pointerCurrent.x,pointerOrigin.p.y-pointerCurrent.y)>20){const a=position(pointerOrigin.node);if(a)html+=`<line x1="${a.x}" y1="${a.y}" x2="${pointerCurrent.x}" y2="${pointerCurrent.y}" stroke="#f8d97e" stroke-dasharray="8 5" stroke-width="4"/>`;}
if(vehicleX!==null){const a=clamp(Math.floor((vehicleX-left())/step()),0,num-1),x0=nodes[a].x,x1=nodes[a+1].x,t=clamp((vehicleX-x0)/(x1-x0),0,1),surface=(1-t)*sagAt(a)+t*sagAt(a+1),extra=testState==='failed'?collapseT*78:0,carY=178+surface+extra;let rotation=testState==='failed'?collapseT*(collapseIndex%2===0?17:-19):0;html+=vehicleSvg(c,vehicleX,carY,rotation);}
html+=drawMembers(true);for(const n of nodes.filter(n=>n.y<216)){html+=`<circle cx="${n.x}" cy="${n.y}" r="9" fill="#ffdcae" stroke="#173a4b" stroke-width="3"/>`;}
if(testState==='failed'&&collapseT>0){const cx=left()+(collapseIndex+.5)*step(),cy=232+collapseT*160;for(let j=0;j<15;j++){const a=j*2.399,rad=collapseT*(30+(j%5)*14);html+=`<circle cx="${cx+Math.cos(a)*rad}" cy="${cy+Math.sin(a)*rad-collapseT*30}" r="${clamp(5-collapseT*2,1.8,5)}" fill="${j%3===0?'#fbd286':j%3===1?'#8bbfca':'#da9272'}" opacity="${1-collapseT*.42}"/>`;}
html+=`<text x="500" y="89" text-anchor="middle" fill="#ffbcb3" font-size="31" font-weight="900" stroke="#242b34" stroke-width="4" paint-order="stroke">STRUCTURAL FAILURE</text>`;}
if(testState==='passed')html+=`<text x="500" y="89" text-anchor="middle" fill="#b8ffdd" font-size="31" font-weight="900" stroke="#193b40" stroke-width="4" paint-order="stroke">CROSSING SUCCESSFUL</text>`;
html+=`<text x="20" y="36" font-size="13" fill="#dbebed">${tool==='inspect'?'◎ Click a beam to select; click again to deselect':tool==='triangle'?'△ Click a numbered span to install a triangle':tool==='beam'?'╱ Select or drag between joints to add a beam':tool==='paint'?'▣ Click a beam to replace its material':'⌫ Click a beam or green joint to remove it'}</text>`;
svg.innerHTML=html;updateMetrics();}
function setTool(t){if(busy)return;tool=t;selectedJoint=null;selectedBeam=null;updateBeamInspector();for(const [id,val] of [['inspectBtn','inspect'],['triangleBtn','triangle'],['beamBtn','beam'],['paintBtn','paint'],['eraseBtn','erase']]){$('#'+id).classList.toggle('active',t===val)}$('#stageHelp').textContent=t==='inspect'?'Click a beam to inspect it. Click the same beam to deselect.':t==='triangle'?'Select a numbered deck span to install a triangle on your chosen side.':t==='beam'?'Click a colored joint, then another. Or drag between joints.':t==='paint'?'Click a colored beam to replace its material. Painting changes cost and strength.':'Click a colored support beam or green joint to remove it.';draw();}

function activeStress(q,x){return q.ratios.map((r,i)=>{const mid=left()+(i+.5)*step(),spread=step()*1.8,proximity=Math.exp(-Math.pow((x-mid)/spread,2));return r*(.25+.75*proximity)});}
// Optional learning activities; they never prevent driving or progressing.
function labData(){const c=config();const idx=(level-1)%24,price=20+5*(Math.floor(level/8)%5),count=2+(Math.floor(level/6)%3),woodCount=2+(Math.floor(level/7)%4);
 const choices=[
 {q:'Why do engineers often use triangles in trusses?',a:['They keep their shape when forces act on them','They make a bridge float','They remove all weight'],correct:0,why:'A triangle resists changing shape, so its members can transfer forces.'},
 {q:`A beam costs $${price}. What is the cost of ${count} equal beams?`,a:[`$${price*(count-1)}`,`$${price*count}`,`$${price*(count+1)}`],correct:1,why:`${count} × $${price} = $${count*price}. Multiply unit cost by quantity.`},
 {q:'Which material is generally suited to carrying tension?',a:['A loose rock','A steel cable','Wet sand'],correct:1,why:'A cable resists being pulled apart (tension); it cannot push well.'},
 {q:'If a bridge supports a car, will a much heavier truck always be safe?',a:['Yes, always','Not necessarily; load increases','Only at night'],correct:1,why:'Heavier vehicles can increase member forces and deflection.'},
 {q:`A 100-unit wooden beam costs about $31 in this game. What would ${woodCount} beams cost?`,a:[`$${31*(woodCount-1)}`,`$${31*woodCount}`,`$${31*(woodCount+1)}`],correct:1,why:`${woodCount} × $31 = $${woodCount*31}. This is an approximate game-price exercise.`},
 {q:'Why might concrete increase a bridge’s dead load?',a:['It adds its own weight','It makes cars drive faster','It removes gravity'],correct:0,why:'The structure must carry its own weight as well as the vehicle.'},
 {q:'Where does a simply supported bridge often bend most under a centered load?',a:['Near its middle','Only in the water','Nowhere'],correct:0,why:'The middle often experiences the greatest bending under a centered load.'},
 {q:'Your design fails. What is the best next step?',a:['Ignore the results','Study the weak span and revise','Always buy every material'],correct:1,why:'Engineers test, analyze the failure, and improve the design.'},
 {q:'Why does a loose chain fail to support a pushing force?',a:['It gets shorter','Its links go slack or fold','It becomes steel'],correct:1,why:'Chain links can transmit tension, not compression.'},
 {q:'What is buckling?',a:['A long beam bending sideways when pushed','A beam getting hotter','A rope being stretched'],correct:0,why:'Long slender compression members can bend sideways and lose carrying capacity.'},
 {q:'Why might adding many concrete beams make the structure worse?',a:['More material always helps','Concrete can add a lot of dead load','Concrete is invisible'],correct:1,why:'A bridge must support its own weight in addition to vehicle load.'},
 {q:'If a span is already well braced, which choice may be more efficient?',a:['Keep piling up wood forever','Check another weak span or force direction','Remove the road'],correct:1,why:'Extra members in one path provide diminishing returns; a different path can be more efficient.'},
 {q:'A simply supported beam bends more under a moving heavy load. What property often reduces deflection?',a:['Higher stiffness','Brighter paint','Lower road signs'],correct:0,why:'Stiffer members and improved geometry can reduce bending under the same load.'},
 {q:'How does the number of support triangles affect force paths?',a:['Placement and connections matter','Only total triangle count matters','Triangles can replace foundations'],correct:0,why:'A completed, properly connected triangle distributes forces; piling triangles in one location may not help weak spans.'},
 {q:'A test truck brakes on a bridge. What extra effect can occur?',a:['Longitudinal forces from deceleration','Gravity turns off','The truck stops having mass'],correct:0,why:'Braking forces act along the bridge and can change structural demand.'},
 {q:'What does fatigue mean in structural materials?',a:['Damage that can develop under repeated stress cycles','A one-time change of paint','Weight disappearing at night'],correct:0,why:'Repeated loading can initiate and grow cracks over time even when loads are below static failure levels.'},
 {q:'Why do some bridges use expansion joints?',a:['To permit temperature-related movement','To reduce vehicle mass','To stop sunlight entirely'],correct:0,why:'Steel and concrete expand and contract as temperatures vary; joints allow controlled movement.'},
 {q:'How can a diagonal brace improve a rectangular frame?',a:['It helps resist sideways deformation','It turns the frame into water','It eliminates the need for connections'],correct:0,why:'Bracing creates triangular force paths, resisting racking.'},
 {q:'Which statement about the game force percentages is accurate?',a:['They are illustrative estimates from a simplified model','They certify real bridge safety','They are measured laboratory forces'],correct:0,why:'The game is for learning force paths, not real-world design approvals.'},
 {q:'Why do vehicle positions matter?',a:['Forces move across different spans during a crossing','Only the license plate changes','Loads do not reach support members'],correct:0,why:'Moving loads create changing forces across the bridge and its supports.'},
 {q:'When does tension occur?',a:['When a member is pulled','When a member is pushed shorter','Only when a vehicle is parked'],correct:0,why:'Tension pulls a member; compression pushes or shortens it.'},
 {q:'Why is drainage important on a bridge?',a:['It reduces standing water and some deterioration risks','It increases tire weight','It guarantees zero corrosion'],correct:0,why:'Good drainage limits water buildup, helping protect components and road surfaces.'},
 {q:'How would you compare two safe bridge designs fairly?',a:['Test both with the same simulated load','Use completely different conditions without noting them','Look only at color'],correct:0,why:'Controlled comparisons keep the load and test conditions consistent.'},
 {q:'What is an important limitation of your simulation?',a:['Real bridges must meet standards and undergo qualified analysis','A game bridge is already approved for construction','All materials always behave identically'],correct:0,why:'Simplified bridge behavior supports learning but does not replace structural engineering.'}
 ];return choices[idx];}
function renderLab(){answeredLab=Boolean(saved.lab?.[level]);prediction=null;updatePrediction();
 const q=labData();$('#labQuestion').textContent=q.q;
 $('#labAnswers').innerHTML=q.a.map((a,i)=>`<button type="button" data-answer="${i}" class="compact">${a}</button>`).join('');
 $('#labFeedback').textContent=answeredLab?'You earned the badge for this mission. You can still review the question.':'Choose one answer. This is practice, not a grade.';
 $('#labBadge').textContent=answeredLab?'◆ Engineering badge earned':'◇ Engineering badge not earned';$('#labBadge').classList.toggle('earned',answeredLab);
}
function updatePrediction(){for(const [id,v] of [['predictPass','pass'],['predictFail','fail']]){$('#'+id).classList.toggle('selected',prediction===v);}
 $('#predictionFeedback').textContent=prediction?'Prediction recorded. Test to compare with the outcome.':'Choose a prediction, then test your bridge.';
}
$('#predictPass').addEventListener('click',()=>{if(busy)return;prediction='pass';updatePrediction();});
$('#predictFail').addEventListener('click',()=>{if(busy)return;prediction='fail';updatePrediction();});
$('#labAnswers').addEventListener('click',ev=>{const b=ev.target.closest('button[data-answer]');if(!b)return;const q=labData(),choice=Number(b.dataset.answer);
 if(choice===q.correct){$('#labFeedback').textContent='Correct! '+q.why;saved.lab=saved.lab||{};saved.lab[level]=1;save();answeredLab=true;$('#labBadge').textContent='◆ Engineering badge earned';$('#labBadge').classList.add('earned');}
 else $('#labFeedback').textContent='Not quite. Hint: think about load, shape, or material behavior. Try again.';
 [...$('#labAnswers').children].forEach(k=>k.classList.toggle('selected',Number(k.dataset.answer)===choice));
});
function settlePrediction(passed){if(prediction){$('#predictionFeedback').textContent=`You predicted ${prediction.toUpperCase()}. The design ${passed?'PASSED':'FAILED'}. ${prediction===(passed?'pass':'fail')?'Nice engineering prediction!':'Compare your prediction to the stress bars and try another design.'}`;}}
async function test(){if(busy)return;const q=score(),c=config();if(bars.filter(b=>!b.fixed).length<2){message('Build at least one support triangle before testing.','bad');return;}
 if(remaining()<-.001){message('Over budget: remove or replace members before testing.','bad');return;}
 let myRev=revision;busy=true;testState='testing';passRevision=-1;$('#nextBtn').disabled=true;$('#testBtn').disabled=true;$('#replayBtn').disabled=true;$('#buildStatus').textContent='TESTING';$('#simProgress').textContent='Vehicle entering bridge';message(`Testing ${c.vehicle.toLowerCase()}… watch the deck bow and the stress colors.`);
 let start=performance.now(),dur=['crawler','crawlerload','train','traincar'].includes(c.type)?6800:c.type==='bike'?4200:4900;const begin=left()-95,end=left()+c.span+110;let willFail= q.pass?-1:q.weak;let failX=left()+(willFail+.5)*step();
 await new Promise(resolve=>{function frame(now){let t=clamp((now-start)/dur,0,1);vehicleX=begin+(end-begin)*t;progress=clamp((vehicleX-left())/c.span,0,1);stressProfile=activeStress(q,vehicleX);lastStress=Math.max(...stressProfile);$('#driveFill').style.width=Math.round(progress*100)+'%';$('#simProgress').textContent=Math.round(progress*100)+'% across';draw();if(willFail>=0 && vehicleX>=failX){collapseIndex=willFail;resolve();return;}if(t>=1){resolve();return;}aniId=requestAnimationFrame(frame)}aniId=requestAnimationFrame(frame)});
 if(willFail>=0){testState='failed';soundFx('crash');settlePrediction(false);message(`COLLAPSE at span ${q.weak+1}! Estimated load is ${Math.round(q.worst*100)}% of capacity. Reinforce this span, and test again.`,'bad');$('#buildStatus').textContent='FAILED TEST';const collapseStart=performance.now();await new Promise(resolve=>{function fall(now){collapseT=clamp((now-collapseStart)/900,0,1);lastStress=q.worst;draw();if(collapseT<1)aniId=requestAnimationFrame(fall);else resolve();}aniId=requestAnimationFrame(fall)});busy=false;$('#testBtn').disabled=false;$('#replayBtn').disabled=false;$('#simProgress').textContent='Bridge collapsed';updateCoach();draw();showTestReport(q,false);return;}
 // A successful crossing is committed ONLY after the vehicle reaches the far bank.
 progress=1;vehicleX=end;stressProfile=activeStress(q,vehicleX);lastStress=q.worst;testState='passed';busy=false;passRevision=myRev;settlePrediction(true);$('#driveFill').style.width='100%';let leftBudget=remaining()/c.budget;let stars=leftBudget>.25&&q.worst<.78?3:leftBudget>.12?2:1;saved.best[level]=Math.max(stars,saved.best[level]||0);save();renderLevels();$('#nextBtn').disabled=true;$('#testBtn').disabled=false;$('#replayBtn').disabled=false;$('#buildStatus').textContent='PASSED';$('#simProgress').textContent='100% crossing';$('#starStat').textContent='★'.repeat(saved.best[level]);message(`PASS! The ${c.vehicle.toLowerCase()} made it fully across. ${'★'.repeat(stars)} earned with $${fmt(remaining())} remaining. ${level===48?'Solve the final engineering check to finish!':'Complete the engineering check to unlock the next mission.'}`,'good');soundFx('pass');updateCoach();draw();$('#nextBtn').disabled=true;showTestReport(q,true);}
$('#testBtn').addEventListener('click',test);
$('#replayBtn').addEventListener('click',test);
$('#nextBtn').addEventListener('click',()=>{if(!reviewDone||reviewOutcome!=='correct'||busy||testState!=='passed'||passRevision!==revision||progress!==1||level>=48||level+1>saved.scienceGate)return;loadMission(level+1)});
$('#levelGrid').addEventListener('click',e=>{const b=e.target.closest('button[data-level]');if(!b||busy||b.disabled)return;loadMission(Number(b.dataset.level));});
$('#fleetBtn').addEventListener('click',()=>$('#fleetDialog').showModal());
$('#fleetClose').addEventListener('click',()=>$('#fleetDialog').close());
$('#fleetList').addEventListener('click',e=>{const b=e.target.closest('button[data-fleet]');if(!b||b.disabled||busy)return;$('#fleetDialog').close();loadMission(Number(b.dataset.fleet));});
$('#resetBtn').addEventListener('click',()=>{if(busy)return;if(confirm('Start this mission with an empty bridge? Best stars and unlocked levels are kept.')){delete saved.drafts[level];loadMission(level,true)}});
$('#undoBtn').addEventListener('click',()=>{if(busy||!history.length)return;const old=JSON.parse(history.pop());nodes=old.nodes;bars=old.bars;commit();message('Undid the last construction step. Previous test results no longer count.')});
$('#fixBtn').addEventListener('click',()=>{if(busy)return;const i=score().weak;analysisHighlight=analysisHighlight===i?-1:i;draw();message(analysisHighlight<0?'Weakest-span highlight cleared.':`Span ${i+1} highlighted. Choose a material and build your own reinforcement, or inspect the beams.`);});

function memberDiagnostic(q,b){
 const f=q.barForces.get(b);if(!f)return null;
 const n=clamp(f.panel,0,config().panels-1), r=q.ratios[n]||0;
 const penalty=f.role==='compression'&&MAT[b.mat].buckle>0?Math.max(1,distance(b)/130):1;
 const special=f.role==='compression'&&['chain','cable'].includes(b.mat);
 return {...f,ratio:r,problem:special?'Cannot push':(r>1?'Overloaded':r>.79?'Near limit':'Within estimate'),length:distance(b),penalty};
}
function updateBeamInspector(){
 const el=$('#beamInspector');el.classList.toggle('active',Boolean(selectedBeam));
 if(!selectedBeam){el.textContent='◎ Select a beam to inspect its material, estimated force direction, and available editing actions.';return;}
 const b=selectedBeam,m=MAT[b.mat],q=score(),f=memberDiagnostic(q,b);el.innerHTML=`<strong>${m.label} beam</strong> · ${f?.role==='tension'?'Tension (pulling)':'Compression (pushing)'} · span ${(f?.panel??0)+1} · length ${Math.round(distance(b))} · estimated span demand ${Math.round((f?.ratio||0)*100)}% <button id="inspectPaint" type="button">Change to selected material</button><button id="inspectErase" type="button">Remove beam</button><button id="inspectClear" type="button">Deselect</button>`;
 $('#inspectPaint').onclick=()=>{
  if(!material){message('Choose a material first.','bad');return;}
  if(b.mat===material){message('The selected beam already has that material.');return;}
  const delta=distance(b)*(MAT[material].cost-MAT[b.mat].cost);
  if(delta>remaining()+.001){message('Not enough budget to change the selected beam.','bad');return;}
  remember();b.mat=material;commit();soundFx('click');message('Changed the selected beam material. Test to see its effect.');
 };
 $('#inspectErase').onclick=()=>{remember();bars=bars.filter(x=>x!==b);commit();message('Selected beam removed.');};
 $('#inspectClear').onclick=()=>{selectedBeam=null;updateBeamInspector();draw();};
}
function makeCheck(q,passed){
 const weak=q.weak;
 const weakMembers=bars.filter(b=>!b.fixed).map(b=>({b,f:memberDiagnostic(q,b)})).filter(x=>x.f&&x.f.panel===weak);
 const chain=weakMembers.find(x=>x.f.role==='compression'&&['chain','cable'].includes(x.b.mat));
 const concrete=weakMembers.find(x=>x.f.role==='tension'&&x.b.mat==='concrete');
 const buckling=weakMembers.find(x=>x.f.role==='compression'&&['wood','aluminum'].includes(x.b.mat)&&x.f.length>125);
 if(chain)return {q:`A ${chain.b.mat} member in span ${weak+1} is being pushed. Why isn't it helping?`,a:['Chains and cables go slack under compression','They can only support concrete','They make cars heavier'],correct:0,why:`A ${chain.b.mat} resists pulling (tension) but provides almost no pushing (compression) capacity. Use a compression-ready material, or redesign the force path.`};
 if(concrete)return {q:`The force diagram places concrete in tension at span ${weak+1}. What is the concern?`,a:['Concrete is weaker when pulled than when pushed','Concrete weighs nothing','Concrete is always the best tension member'],correct:0,why:'Concrete is strong under compression but comparatively weak in tension. Choose a tensile material or change the member geometry.'};
 if(buckling)return {q:`What might happen to the long ${buckling.b.mat} member under compression?`,a:['It may buckle sideways','It becomes a cable','The force disappears'],correct:0,why:'Long slender members can buckle when pushed. Shorter braces or a more compression-resistant material can help.'};
 if(q.triangles[weak]===0)return {q:`Span ${weak+1} has no completed support triangle. What improvement is most relevant?`,a:['Build a complete brace with tension and compression paths','Add weight without adding supports','Remove the deck'],correct:0,why:'A complete triangular brace helps carry the vehicle load. Both legs need appropriate materials and connections.'};
 if(q.weightPenalty>.18)return {q:`Your bridge adds substantial self-weight. Why can more material sometimes hurt?`,a:['The bridge must also carry its own mass','Heavy material makes vehicles disappear','Only the paint color matters'],correct:0,why:'Added members contribute dead load as well as strength. Reinforcement helps only when the extra capacity outweighs its mass and cost.'};
 if(!passed)return {q:`Span ${weak+1} exceeded its estimated capacity. What should you examine first?`,a:['Its force paths, material, and geometry','Only the bridge color','Only the passing vehicle artwork'],correct:0,why:'Inspect the weak span, the T/C role of its members, the geometry and their material capacities before changing the design.'};
 return {q:`Your bridge passed with a maximum estimated demand of ${Math.round(q.worst*100)}%. Why is a passing test useful?`,a:['It shows the design worked under this simulated load','It proves the bridge would be safe in real life','It means materials no longer matter'],correct:0,why:'A completed test validates this simplified game scenario, but does not certify a real bridge. Engineers also investigate margins, deflection and different load cases.'};
}
function renderForceDiagram(q){
 const di=$('#forceDiagram'),xmin=left(),sc=760/1000;
 let out=`<rect width="760" height="275" fill="#153344"/><line x1="${(xmin-15)*sc}" y1="118" x2="${(xmin+config().span+15)*sc}" y2="118" stroke="#aac5d3" stroke-width="9"/>`;
 for(const b of bars.filter(x=>!x.fixed)){
  const a=position(b.a),z=position(b.b),f=memberDiagnostic(q,b);if(!a||!z)continue;
  const danger=f?.ratio>1||f?.problem==='Cannot push',col=danger?'#ff777a':f?.role==='tension'?'#60e4d7':'#ffd277';
  const y1=25+a.y*.43,y2=25+z.y*.43,x1=a.x*sc,x2=z.x*sc;
  out+=`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#142735" stroke-width="12" stroke-linecap="round"/><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}" stroke-width="6" stroke-linecap="round" ${['chain','cable'].includes(b.mat)?'stroke-dasharray="9 5"':''}/><text x="${(x1+x2)/2}" y="${(y1+y2)/2-6}" fill="#ffffff" font-size="11" text-anchor="middle" font-weight="bold">${f?.role==='tension'?'T':'C'}</text>`;
 }
 for(let i=0;i<config().panels;i++){const x=(xmin+(i+.5)*step())*sc;out+=`<text x="${x}" y="142" font-size="11" fill="${colorStress(q.ratios[i])}" text-anchor="middle" font-weight="bold">${Math.round(q.ratios[i]*100)}%</text>`;}
 const x1=(xmin+q.weak*step())*sc,x2=(xmin+(q.weak+1)*step())*sc;
 out+=`<rect x="${x1}" y="21" width="${x2-x1}" height="210" fill="#ffd274" fill-opacity=".08" stroke="#ffd274" stroke-width="2" stroke-dasharray="7 6"/><text x="${(x1+x2)/2}" y="252" fill="#ffe4a7" text-anchor="middle" font-size="12" font-weight="bold">SPAN ${q.weak+1}</text>`;
 di.innerHTML=out;
}
// Science checkpoint v4.3. A blend of numerical response and concept interpretation.
// Questions use genuine educational formulas with explicitly illustrative values;
// the game stress percentages are simplified model outputs, not real-world load predictions.
function numericQuestion(skill,stem,answer,unit,hint1,hint2,why,notes=''){
 return {type:'numeric',skill,q:stem,correct:Number(answer),unit,hints:[hint1,hint2],why,notes};
}
function conceptQuestion(skill,stem,choices,correct,hint1,hint2,why,notes=''){
 return {type:'choice',skill,q:stem,a:choices,correct,hints:[hint1,hint2],why,notes};
}
const scienceFamilies=[
 (q,v)=>{const peak=Math.round(q.worst*100);return numericQuestion('Data & safety margin',`Your bridge reached ${peak}% of its simulated capacity. How many percentage points remain before 100%?`,100-peak,'percentage points','Find the difference between the maximum (100%) and the reading.','Subtract the stress percentage from 100.',`100 − ${peak} = ${100-peak} percentage points. This is a simplified game-model margin.`);},
 (q,v)=>{let a=20+v*5,b=30+(v%5)*10;return numericQuestion('Adding loads',`Two classroom crates have masses of ${a} kg and ${b} kg. What is their total mass?`,a+b,'kg','The mass of two objects together is the sum of their masses.','Add the two kilogram values, without changing units.',`${a} + ${b} = ${a+b} kg. Adding cargo increases total supported mass.`);},
 (q,v)=>{let seconds=5+(v%4)*5,speed=3+(v%7),distance=seconds*speed;return numericQuestion('Speed = distance ÷ time',`An inspection cart travels ${distance} m in ${seconds} seconds. What is its average speed?`,speed,'m/s','Average speed is distance divided by elapsed time.','Divide meters by seconds to get meters per second.',`${distance} ÷ ${seconds} = ${speed} m/s. This assumes average speed across the trip.`);},
 (q,v)=>{let m=10+5*(v%7),a=2+(v%4);return numericQuestion('Newton’s second law',`A ${m} kg test cart accelerates at ${a} m/s². What net force acts on it?`,m*a,'N','Newton’s second law relates force, mass, and acceleration.','Multiply the mass in kilograms by acceleration in meters per second squared.',`F = m × a = ${m} × ${a} = ${m*a} newtons. This is a separate illustrative cart, not the bridge vehicle.`);},
 (q,v)=>{let area=2+(v%4),pressure=100+50*(v%5),force=area*pressure;return numericQuestion('Pressure = force ÷ area',`A support pad spreads ${force} N across ${area} m². What is the average pressure?`,pressure,'Pa','Pressure measures force divided by contact area.','Divide the newtons by square meters; 1 N/m² is 1 pascal.',`${force} ÷ ${area} = ${pressure} Pa. Doubling area with the same force would halve pressure.`);},
 (q,v)=>conceptQuestion('Tension & compression',`A diagonal member is being pushed (compression). Which change is most appropriate?`,['Replace a slack cable with a compression-capable strut','Add more dangling cable with no rigid path','Remove the support connection','Turn the vehicle around without changing the bridge'],0,'Pushing requires a member that resists shortening or buckling.','Compare how a solid strut behaves when pushed with how a loose cable behaves.', 'A connected strut can resist compression; a cable or chain carries tension but nearly no compression.'),
 (q,v)=>{const peak=Math.round(q.ratios[q.weak]*100);return conceptQuestion('Reading your stress diagram',`The highlighted span ${q.weak+1} reached ${peak}% of estimated capacity. What does a reading of ${peak}% tell the engineer?`,peak>=100?['The simulated demand exceeds or reaches the estimated limit','It has unlimited spare capacity','Its material has no mass','It will safely hold any future vehicle']:['It used part of its estimated capacity, but other load cases still matter','It is certified safe for real traffic','Its material can never buckle','Its stresses have disappeared'],0,'Use the percentage as a fraction of the model’s stated capacity.','A single simulated test does not certify any real bridge.',`The game’s percentage is estimated demand relative to capacity. ${peak}% is a model reading, not an inspection certificate.`);},
 (q,v)=>{let base=50+(v%7)*5,inc=5+(v%4)*5;return numericQuestion('Model percentages',`A hypothetical bridge model reads ${base}% stress. A new load raises the reading by ${inc} percentage points. What is the new reading?`,base+inc,'%','The question says percentage points, so add the numbers directly.','Add the starting reading and the increase.',`${base} + ${inc} = ${base+inc}%. This is hypothetical, not a prediction for an actual vehicle.`);},
 (q,v)=>{let qty=2+(v%4),price=15+5*(v%7);return numericQuestion('Engineering budget',`A classroom beam costs $${price}. How much do ${qty} identical beams cost?`,qty*price,'dollars','Total cost equals price per beam times how many you purchase.','Multiply the unit price by the quantity.',`$${price} × ${qty} = $${qty*price}. Real designs balance cost with strength.`);},
 (q,v)=>{let count=q.triangles.reduce((s,n)=>s+n,0);return numericQuestion('Structural geometry',`Your bridge model currently includes ${count} completed triangular braces. If you install 2 more, how many will it have?`,count+2,'triangles','Add the number of new braces to those already installed.','The additional braces change the total count by two.',`${count} + 2 = ${count+2} triangles. Where braces connect matters more than raw quantity.`);},
 (q,v)=>{let m=5+(v%8)*5;return numericQuestion('Mass & weight',`A ${m} kg object experiences approximately 10 N of gravitational force per kilogram on Earth. What is its approximate weight?`,m*10,'N','Mass is in kilograms; weight is a force measured in newtons.','Multiply kilograms by the given 10 N/kg approximation.',`${m} kg × 10 N/kg ≈ ${m*10} N. This is rounded from Earth’s actual gravity of about 9.8 N/kg.`);},
 (q,v)=>conceptQuestion('Dead load vs live load','Which example is a LIVE load acting on a bridge?',['A delivery truck driving onto the deck','The permanent concrete deck itself','The steel girders permanently holding the road','The bridge’s fixed guardrails'],0,'Think about what can arrive, depart, or vary in service.','A vehicle changes where its force is applied as it moves.','Moving vehicles are live loads; the bridge’s own permanent structure is dead load.'),
 (q,v)=>conceptQuestion('Buckling','A slender support column bends sideways while being pushed. What failure mechanism is illustrated?',['Compression buckling','A cable carrying tension','Uniform thermal expansion without loading','Improved bracing'],0,'Slender members can lose stability before the material itself crushes.','Look for sideways deflection caused by compression.','Buckling is a stability failure under compression; shorter bracing can help prevent it.'),
 (q,v)=>conceptQuestion('River erosion & foundations','After a flood, fast water has removed soil from around a bridge foundation. What should engineers investigate?',['Scour and loss of foundation support','Whether paint colors changed','Whether the river made the steel lighter','Whether the road signs changed'],0,'The ground around a pier helps transfer weight into the earth.','Removing supporting soil can undermine a foundation.','Scour is erosion around foundations, and it can threaten a bridge even when its deck is strong.'),
 (q,v)=>{let f=20+10*(v%6),distance=2+(v%4);return numericQuestion('Moment = force × distance',`A ${f} N downward force acts ${distance} m from a pivot. What is its moment about the pivot?`,f*distance,'N·m','A moment depends on force and perpendicular distance from the pivot.','Multiply the newtons by the lever arm in meters.',`${f} × ${distance} = ${f*distance} N·m. Moments can bend bridge components.`);},
 (q,v)=>{let low=Math.round(Math.min(...q.ratios)*100),high=Math.round(Math.max(...q.ratios)*100);return numericQuestion('Compare two measurements',`Your least-stressed span reads ${low}%; the most-stressed span reads ${high}%. What is the difference in percentage points?`,high-low,'percentage points','Subtract the smaller measurement from the larger one.','Use the two stress readings, not the vehicle mass.',`${high} − ${low} = ${high-low} percentage points. This uses your current bridge data.`);},
 (q,v)=>{let force=20+(v%7)*5,distance=2+(v%5);return numericQuestion('Work = force × displacement',`A steady ${force} N force moves a cart ${distance} m in its direction. How much work is done?`,force*distance,'J','For a force parallel to motion, work equals force times displacement.','Multiply N by m to get joules.',`${force} × ${distance} = ${force*distance} J. This example assumes a constant parallel force.`);},
 (q,v)=>{let supports=2+(v%3),each=100+50*(v%4);return numericQuestion('Equal load sharing',`In an idealized model, ${supports} identical supports share ${supports*each} N equally. How much force does each support carry?`,each,'N','Equal sharing means divide the combined force evenly.','Divide the total newtons by the number of supports.',`${supports*each} ÷ ${supports} = ${each} N per support. Actual bridge forces often are not shared equally.`);},
 (q,v)=>conceptQuestion('Structural testing','A bridge passes a static load test, but wind and moving trucks have not been considered. What is a responsible conclusion?',['The test is useful evidence, but additional load cases matter','The bridge is guaranteed safe under any conditions','No further inspections can be needed','Deflection and vibration are irrelevant'],0,'Engineers evaluate more than one type of load.','A successful result is specific to the conditions simulated.','A single simplified test cannot guarantee real-world safety across wind, vibration, fatigue, and varying loads.'),
 (q,v)=>conceptQuestion('Materials under force','Why are steel cables useful in some suspension or cable-stayed bridges?',['They efficiently transfer pulling forces','They act as rigid columns under pushing forces','They eliminate the need for anchor points','They prevent any motion of the deck'],0,'Consider what happens to a cable when it is pulled tight versus pushed.','Cables are effective in tension, not compression.','Anchored steel cables transmit tension to other structural members and foundations.')
];
function nextScienceQuestion(q,passed){
 saved.scienceRolls[level]=(saved.scienceRolls[level]||0)+1;
 const turn=saved.scienceRolls[level];
 if(!passed){
  const peak=Math.round(q.worst*100);
  if(turn%3===1&&peak>=100)return numericQuestion('Analyze a failure',`Your simulated bridge reached ${peak}% of capacity. By how many percentage points did it exceed 100%?`,peak-100,'percentage points','Read the maximum stress percentage in the report.','Subtract 100% from the reported percentage.',`${peak} − 100 = ${peak-100} percentage points over the simulated capacity.`);
  if(turn%3===2)return conceptQuestion('Redesign a weak span',`The highlighted span ${q.weak+1} is overloaded. Which approach should you test next?`,['Inspect that span’s member roles and try better connected bracing','Add random weight to a different span','Ignore the stress diagram and change only the deck color','Replace all rigid compression supports with loose cable'],0,'Think about the specific location that exceeded its capacity.','A targeted change to a force path is more useful than an unrelated decoration.','Inspect the weak span’s tension/compression paths and strengthen the appropriate connection before retesting.');
  return conceptQuestion('Interpret a failed simulation',`The ${config().vehicle.toLowerCase()} caused your current simulated bridge to fail. What is the most defensible conclusion?`,['The current design needs revision before that load can cross in the simulation','All bridges of this shape are unsafe under every possible load','All steel beams should be removed immediately','The vehicle’s speed is the only factor that matters'],0,'A failure is evidence about the current combination of design and test load.','Choose the conclusion that stays within what this one simulation actually tested.','The bridge needs changes for this modeled load; this result cannot establish safety or failure of every real bridge.');
 }
 // Replay uses a different family (including calculations). 20 topic families cycle without immediately repeating.
 const idx=((level-1)*9+(turn-1)*7)%scienceFamilies.length;
 const next={...scienceFamilies[idx](q,level),bankIndex:idx};
 // Contextualize the concept within this vehicle mission; recurring skills are revisited with new vehicles.
 if(next.type==='choice')next.q=`${config().vehicle}: ${next.q}`;
 return next;
}
function shuffledScienceOptions(question){
 if(question.type!=='choice')return;
 const orig=question.a.map((s,i)=>({s,i}));
 for(let i=orig.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[orig[i],orig[j]]=[orig[j],orig[i]];}
 question.a=orig.map(x=>x.s);question.correct=orig.findIndex(x=>x.i===question.correct);
}
function questionAnswerHtml(question){
 if(question.type==='numeric')return `<label for="resultNumber" class="answer-label">Your answer (${question.unit}):</label><div class="number-answer"><input id="resultNumber" type="number" step="1" inputmode="numeric" autocomplete="off" placeholder="Enter a number"/><button id="resultSubmit" type="button" class="primary">Check calculation</button></div>`;
 return question.a.map((s,i)=>`<button type="button" data-check="${i}">${String.fromCharCode(65+i)}. ${s}</button>`).join('');
}
function difficultyPenalty(kind){return kind==='skip'?Math.min(4,2+Math.floor((level-1)/16)):1+(level>=17?1:0);}
function recordScienceSuccess(){
 saved.scienceStats.correct++;saved.scienceStats.questions++;
 if(level===saved.scienceGate){saved.scienceGate=Math.min(48,level+1);}
 if(saved.scienceRecoveryGoal!=null&&saved.scienceGate>=saved.scienceRecoveryGoal){
  saved.scienceGate=Math.max(saved.scienceGate,saved.scienceRestoreGate||1);
  saved.scienceRecoveryGoal=null;saved.scienceRestoreGate=null;
 }
 saved.unlocked=Math.max(saved.unlocked,Math.min(48,level+1));
 saved.lab[level]=1;save();renderLevels();
 $('#labBadge').textContent='◆ Engineering badge earned';$('#labBadge').classList.add('earned');
}
function recordSciencePenalty(kind){
 saved.scienceStats[kind==='skip'?'skipped':'wrong']++;saved.scienceStats.questions++;
 const amount=difficultyPenalty(kind);const backTo=Math.max(1,level-amount);
 // Restore only the access earned BEFORE the setback once the lost missions are re-cleared.
 // Replaying a previously unlocked older mission must not erase dozens of unrelated missions.
 saved.scienceRecoveryGoal=Math.max(saved.scienceRecoveryGoal||level,level);
 saved.scienceRestoreGate=Math.max(saved.scienceRestoreGate||saved.scienceGate,saved.scienceGate);
 saved.scienceGate=Math.min(saved.scienceGate,backTo);
 save();renderLevels();return {amount,backTo};
}
function showTestReport(q,passed){
 const d=$('#resultDialog');reviewDone=false;reviewOutcome=null;
 report={q,passed,question:nextScienceQuestion(q,passed),hintStep:0,penalty:null};
 $('#resultTitle').textContent=passed?'Bridge passed — engineering clearance required':'Bridge failed — engineering analysis';
 $('#resultSummary').textContent=`${config().vehicle} · ${bars.filter(b=>!b.fixed).length} beams · peak estimated demand ${Math.round(q.worst*100)}% · weak span ${q.weak+1}`;
 renderForceDiagram(q);
 $('#forceExplanation').textContent=`Highlighted span ${q.weak+1}: estimated demand ${Math.round(q.needs[q.weak]*100)/100}, capacity ${Math.round(q.supports[q.weak]*100)/100}. T marks tension (pulling); C marks compression (pushing). This game uses illustrative units, not real engineering calculations.`;
 renderSciencePrompt();
 $('#resultDismiss').textContent=passed?'Review design':'Back to building';$('#resultDismiss').disabled=true;$('#resultClose').disabled=true;
 d.showModal();
}
function renderSciencePrompt(){
 const question=report.question;shuffledScienceOptions(question);
 $('#resultSkill').textContent=`ENGINEERING CHALLENGE · ${question.skill.toUpperCase()}`;
 $('#resultQuestion').textContent=question.q;
 $('#resultAnswers').innerHTML=questionAnswerHtml(question);
 $('#resultHintText').textContent='';$('#resultHintBtn').disabled=false;$('#resultHintBtn').textContent='Show a hint (1 of 2)';
 $('#resultFeedback').textContent=report.passed?'Solve this checkpoint to advance. Wrong: return 1–2 levels. Skip: return 2–4 levels.':'Diagnostic practice after a failed bridge test. No level penalty for a failed build.';
 $('#resultPenalty').textContent=report.passed?`Wrong answer: −${difficultyPenalty('wrong')} level(s). Skip: −${difficultyPenalty('skip')} level(s). Hints have no penalty.`:'This bridge already needs redesign. Answers here do not reduce progress.';
 $('#resultAction').textContent='Solve to continue';$('#resultAction').disabled=true;
 $('#resultSkip').hidden=!report.passed;$('#resultSkip').disabled=false;
 $('#resultDismiss').disabled=true;$('#resultClose').disabled=true;
}
$('#resultHintBtn').addEventListener('click',()=>{if(!report||reviewDone)return;const hints=report.question.hints||[];report.hintStep=Math.min(hints.length,report.hintStep+1);$('#resultHintText').textContent=hints.slice(0,report.hintStep).map((h,i)=>`Step ${i+1}: ${h}`).join('\n');$('#resultHintBtn').disabled=report.hintStep>=hints.length;$('#resultHintBtn').textContent=report.hintStep<hints.length?'Show another hint':'All hints shown';});
function finishScienceAnswer(isCorrect,kind){
 if(!report||reviewDone)return;
 const q=report.question;reviewDone=true;reviewOutcome=isCorrect?'correct':kind;
 $('#resultSubmit')?.setAttribute('disabled','');$('#resultNumber')?.setAttribute('disabled','');
 $('#resultHintBtn').disabled=true;$('#resultSkip').disabled=true;
 $('#resultAnswers').querySelectorAll('button[data-check]').forEach(b=>{b.disabled=true;if(Number(b.dataset.check)===q.correct)b.classList.add('correct');});
 let msg=(isCorrect?'Correct. ':kind==='skip'?'Skipped. ':'Not quite. ')+q.why;
 if(report.passed){
  if(isCorrect){recordScienceSuccess();msg+=level===48?' All 48 engineering missions completed!':' Next mission cleared.';$('#resultAction').textContent=level===48?'Final mission completed':'Next mission →';$('#nextBtn').disabled=level===48;}
  else {report.penalty=recordSciencePenalty(kind);msg+=` Recovery required: go to level ${report.penalty.backTo}, then pass the missed bridge and science checks to restore your prior access. Previously earned stars stay saved.`;$('#resultAction').textContent=level===1?'Practice again with a new question':`Start recovery · level ${report.penalty.backTo}`;$('#nextBtn').disabled=true;}
 }else{$('#resultAction').textContent='Return to building';}
 $('#resultFeedback').textContent=msg;
 $('#resultAction').disabled=false;$('#resultDismiss').disabled=Boolean(report.passed&&reviewOutcome!=='correct'&&level===1);$('#resultClose').disabled=Boolean(report.passed&&reviewOutcome!=='correct'&&level===1);
}
$('#resultAnswers').addEventListener('click',ev=>{
 if(!report||reviewDone)return;
 const button=ev.target.closest('button[data-check]');
 if(button){const right=Number(button.dataset.check)===report.question.correct;if(!right)button.classList.add('incorrect');finishScienceAnswer(right,right?'correct':'wrong');}
 if(ev.target.id==='resultSubmit')submitNumber();
});
$('#resultAnswers').addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.id==='resultNumber'){e.preventDefault();submitNumber();}});
function submitNumber(){if(!report||reviewDone||report.question.type!=='numeric')return;const el=$('#resultNumber');if(!el||!el.value.trim()||!Number.isFinite(el.valueAsNumber)){el?.focus();$('#resultFeedback').textContent='Enter a number before checking your calculation. The two hints are free.';return;}const right=el.valueAsNumber===report.question.correct;el.classList.toggle('incorrect',!right);finishScienceAnswer(right,right?'correct':'wrong');}
$('#resultSkip').addEventListener('click',()=>{if(!report||reviewDone||!report.passed)return;const n=difficultyPenalty('skip');if(confirm(`Skip the engineering question? You will return ${n} level(s) and must pass the bridge tests and checks again. Hints are free.`))finishScienceAnswer(false,'skip');});
function dismissResult(){if(!reviewDone){$('#resultFeedback').textContent='Solve the question, use the free hints, or accept the skip penalty. You cannot pass the checkpoint without answering.';return;}if(report?.passed&&reviewOutcome!=='correct'&&level===1){$('#resultFeedback').textContent+=' Answer another question to regain clearance.';return;}if($('#resultDialog').open)$('#resultDialog').close();if(report?.passed&&reviewOutcome!=='correct'&&level>saved.scienceGate)loadMission(report.penalty.backTo);}
$('#resultClose').onclick=dismissResult;$('#resultDismiss').onclick=dismissResult;
$('#resultAction').onclick=()=>{if(!reviewDone||!report)return;
 if(report.passed&&reviewOutcome==='correct'&&level<48){dismissResult();loadMission(level+1);}
 else if(report.passed&&reviewOutcome!=='correct'){
  if(level===1){reviewDone=false;reviewOutcome=null;report.question=nextScienceQuestion(report.q,true);report.hintStep=0;renderSciencePrompt();}
  else dismissResult();
 }else dismissResult();
};
$('#resultDialog').addEventListener('cancel',e=>{if(!reviewDone||(report?.passed&&reviewOutcome!=='correct'&&level===1)){e.preventDefault();$('#resultFeedback').textContent='Work through the question or use Skip and accept the stated mission penalty. Level 1 requires another question if you miss one.';}});

function updateMatInfo(){const m=MAT[material];if(!m){$('#matInfo').innerHTML='<strong>No material selected</strong><span>Click a material to activate it. Click again to deselect.</span>';return;}$('#matInfo').innerHTML=`<strong>${m.label}</strong><span>Pull ${m.tension.toFixed(2)} · Push ${m.compression.toFixed(2)} · Weight ${m.mass.toFixed(2)} · Cost $${m.cost.toFixed(2)}/unit</span><small>${m.note}</small>`;}
function refreshUnlocks(){
 const concrete=$('#concreteBtn'),over=$('#aboveBtn');
 concrete.disabled=level<5;concrete.querySelector('small').textContent=level<5?'Unlocks at 5':'Compression';concrete.title=level<5?'Unlock on mission 5':'Concrete supports';
 over.disabled=level<9;
 over.textContent=level<9?'Above roadway · unlock 9':'Above roadway';
 if(level<9)trussSide='below';if(level<5&&material==='concrete')material='wood';
 $('#belowBtn').classList.toggle('active-layer',trussSide==='below');$('#aboveBtn').classList.toggle('active-layer',trussSide==='above');
 $('#trussHint').textContent=level<9?'Build underneath first. Upper trusses unlock at mission 9.':'Upper trusses stand in front of the passing vehicle. Compare them with bottom supports.';
 document.querySelectorAll('[data-mat]').forEach(b=>b.classList.toggle('active',b.dataset.mat===material));updateMatInfo();
}
$('#belowBtn').addEventListener('click',()=>{if(busy)return;trussSide='below';refreshUnlocks();draw();});
$('#aboveBtn').addEventListener('click',()=>{if(busy||level<9)return;trussSide='above';refreshUnlocks();draw();});
$('#triangleBtn').addEventListener('click',()=>setTool('triangle'));$('#beamBtn').addEventListener('click',()=>setTool('beam'));$('#paintBtn').addEventListener('click',()=>setTool('paint'));$('#eraseBtn').addEventListener('click',()=>setTool('erase'));
document.querySelectorAll('[data-mat]').forEach(b=>b.addEventListener('click',()=>{if(busy)return;material=material===b.dataset.mat?null:b.dataset.mat;document.querySelectorAll('[data-mat]').forEach(k=>k.classList.toggle('active',k===b));updateMatInfo();message(material?`${MAT[material].label}: ${MAT[material].note}`:'Material deselected. Choose a material before building.');}));
$('#clearMaterialBtn').addEventListener('click',()=>{if(busy)return;material=null;document.querySelectorAll('[data-mat]').forEach(k=>k.classList.remove('active'));updateMatInfo();message('Material deselected. Use Select beam to inspect, or choose a material to build.');});
$('#inspectBtn').addEventListener('click',()=>setTool('inspect'));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&selectedBeam){selectedBeam=null;updateBeamInspector();draw();}});
$('#hintsToggle').addEventListener('change',e=>{hints=e.target.checked;draw();});
$('#forcesToggle').addEventListener('change',e=>{showForces=e.target.checked;draw();});
$('#soundBtn').addEventListener('click',()=>{sound=!sound;$('#soundBtn').textContent=sound?'♪ Sound on':'♪ Sound off';$('#soundBtn').setAttribute('aria-pressed',String(sound));});
$('#helpBtn').addEventListener('click',()=>$('#helpDialog').showModal());$('#helpClose').addEventListener('click',()=>$('#helpDialog').close());$('#helpGo').addEventListener('click',()=>$('#helpDialog').close());
window.bridgeFleetDebug={fleet:()=>LEVELS.map(c=>({id:c.id,name:c.vehicle,kg:c.kg,required:c.required,budget:c.budget,panels:c.panels})),vehicleSvg:(id)=>vehicleSvg(LEVELS[id-1],500,178),level:()=>level};
loadMission(level);
})();
