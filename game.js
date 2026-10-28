(()=>{
'use strict';
const $=q=>document.querySelector(q),svg=$('#stage');
const types=[
 ['First Pedal','Bicycle','bike','🚲',0.15,5,565,490,.67,'A bicycle is light. Brace each numbered section of the roadway, then watch where it flexes.'],
 ['Town Crossing','Compact car','car','🚗',1.2,5,580,520,.82,'A family car weighs more. Support every panel, not just the center.'],
 ['Orchard Pickup','Pickup truck','pickup','🛻',2.4,5,600,570,.92,'A pickup carries a load of apples. Find the weak spots before testing.'],
 ['Delivery Day','Delivery van','van','🚐',3.5,6,620,660,.99,'A delivery vehicle must cross a wider river. Use a repeating truss pattern.'],
 ['Family Road Trip','Camper','camper','🚐',5.8,6,640,740,1.07,'More mass and a longer deck. Choose a strong but affordable design.'],
 ['School Route','School bus','bus','🚌',10,6,650,780,1.14,'Carry a school bus safely. A center-only brace will not work.'],
 ['Big Freight','Semi truck','semi','🚛',18,7,675,940,1.19,'Heavy freight loads spread across multiple axles. Steel may be worth its cost.'],
 ['Rescue Crossing','Fire engine','fire','🚒',22,7,695,1020,1.27,'A fire engine needs a crossing that works across its whole length.'],
 ['Construction Convoy','Dump truck','dump','🚚',28,7,710,1090,1.36,'Construction materials push deck stress higher. Watch the heat map.'],
 ['Heavy Machinery','Crane truck','crane','🏗️',38,8,730,1270,1.45,'Long spans and heavy machinery demand reinforced joints.'],
 ['Armored Challenge','Tank','tank','🛡️',50,8,745,1420,1.55,'A tank applies a very heavy test load. Reinforce weak panels and conserve budget.'],
 ['Railway Finale','Train','train','🚆',100,8,750,1520,1.63,'Final challenge: build a steel-ready crossing for a locomotive and rail car.']
];
const REGIONS=['River Basics','Town Roads','Forest Crossings','Mountain Passes','Coastal Routes','Desert Highways','Canyon Engineering','Grand Finale'];
const LEVELS=Array.from({length:48},(_,i)=>{const base=types[i%types.length],tier=Math.floor(i/types.length),phase=Math.floor(i/6);return {id:i+1,title:tier?`${REGIONS[phase]} · ${base[0]}`:base[0],vehicle:base[1],type:base[2],emoji:base[3],mass:base[4]*(1+tier*.12),panels:Math.min(8,base[5]+(tier>1?1:0)),span:Math.min(840,base[6]+tier*29),budget:base[7]+tier*235+(tier>1?115:0),required:base[8]*(1+tier*.095),desc:tier?`${base[9]} Region: ${REGIONS[phase]}. ${tier>0?'Try different trusses, predict the result, and compare materials.':''}`:base[9]};});
const MAT={wood:{label:'Wood',cost:.31,strength:1.00,color:'#d5a271'},steel:{label:'Steel',cost:.61,strength:1.62,color:'#a0d9eb'},cable:{label:'Cable',cost:.40,strength:.78,color:'#ffdc83'},concrete:{label:'Concrete',cost:.44,strength:1.22,color:'#d7d9df'}};
const STORE='naches_bridge_builder_v2',OLD='nvhub_bridge_v1';
const blank=()=>({unlocked:1,best:{},current:1,drafts:{},lab:{}});
let saved=blank();try{const v=JSON.parse(localStorage.getItem(STORE)||'null');if(v&&typeof v==='object'){saved={...blank(),...v,drafts:v.drafts||{},lab:v.lab||{}};}else{const old=JSON.parse(localStorage.getItem(OLD)||'null');if(old){saved.unlocked=Math.min(48,Math.max(1,old.unlocked||1));saved.best=old.best||{};saved.current=1;}}}catch{}
saved.unlocked=Math.max(1,Math.min(48,Number(saved.unlocked)||1));
let level=Math.min(saved.unlocked,Math.max(1,Number(saved.current)||1));
let trussSide='below',prediction=null,answeredLab=false;
let nodes=[],bars=[],history=[],tool='triangle',material='wood',hints=true,selectedJoint=null,hover=null,pointerOrigin=null,pointerCurrent=null;
let busy=false,testState='idle',revision=0,passRevision=-1,vehicleX=null,progress=0,collapseIndex=-1,collapseT=0,stressProfile=[],lastStress=0,sound=true,audio=null,aniId=0,lastResult=null;
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
function loadMission(num,eraseDraft=false){if(busy)return;level=clamp(num,1,48);fresh();if(!eraseDraft&&saved.drafts?.[level]){try{const d=saved.drafts[level];if(Array.isArray(d.nodes)&&Array.isArray(d.bars)&&d.nodes.length>=config().panels+1){nodes=structuredClone(d.nodes);bars=structuredClone(d.bars)}}catch{fresh();}}history=[];revision++;invalidate();$('#missionLabel').textContent=`MISSION ${String(level).padStart(2,'0')} / 48`;$('#missionName').textContent=config().title;$('#missionDescription').textContent=config().desc;$('#vehicleIcon').textContent=config().emoji;$('#vehicleName').textContent=config().vehicle;$('#vehicleMass').textContent=`Approx. ${Number(config().mass.toFixed(1))} t challenge load`;refreshUnlocks();renderLab();renderLevels();updateCoach();draw();save();}
function invalidate(){testState='idle';passRevision=-1;lastResult=null;busy=false;vehicleX=null;progress=0;collapseIndex=-1;collapseT=0;stressProfile=[];lastStress=0;selectedJoint=null;hover=null;$('#driveFill').style.width='0%';$('#nextBtn').disabled=true;$('#replayBtn').disabled=true;$('#testBtn').disabled=false;$('#buildStatus').textContent='READY TO BUILD';$('#simProgress').textContent='Not tested';$('#stageHelp').textContent='Triangle helper: click a numbered roadway span to add support.';message('Select Triangle helper and click a numbered roadway span. Test the crossing when your design is ready.');}
function commit(){prediction=null;updatePrediction();revision++;testState='idle';passRevision=-1;busy=false;vehicleX=null;progress=0;collapseIndex=-1;collapseT=0;stressProfile=[];lastStress=0;selectedJoint=null;$('#nextBtn').disabled=true;$('#replayBtn').disabled=true;$('#testBtn').disabled=false;$('#driveFill').style.width='0%';$('#simProgress').textContent='Design changed · retest';$('#buildStatus').textContent='UPDATED DESIGN';savedDraft();updateCoach();draw();}
// A deliberately simplified teaching model, not an engineering safety solver.
// Load peaks around midspan. Braced triangles carry the load; the material on
// the weaker leg limits the triangle. Upper trusses work in the same way.
// Concrete adds dead load, and cable is ineffective where compression is needed.
function memberCapacity(mat,orientation){
 if(mat==='cable')return orientation==='upper'?.39:.55;
 if(mat==='concrete')return orientation==='upper'?.98:1.10;
 return MAT[mat]?.strength||1;
}
function score(){const c=config(),supports=Array(c.panels).fill(.16),triangles=Array(c.panels).fill(0),members=bars.filter(b=>!b.fixed),extraNodes=nodes.filter(n=>!n.deck);
 let concreteLen=0;
 for(const b of members)if(b.mat==='concrete')concreteLen+=distance(b);
 for(let i=0;i<c.panels;i++){
  for(const p of extraNodes){
   const e1=members.find(b=>(b.a===i&&b.b===p.id)||(b.b===i&&b.a===p.id));
   const e2=members.find(b=>(b.a===i+1&&b.b===p.id)||(b.b===i+1&&b.a===p.id));
   if(e1&&e2){const height=Math.abs(p.y-216),mid=(nodes[i].x+nodes[i+1].x)/2,offset=Math.abs(p.x-mid),upper=p.y<216;
    const shape=clamp(height/105,.26,1.12)*clamp(1-offset/(step()*1.75),.42,1);
    const type=upper?'upper':'lower';
    const limiting=Math.min(memberCapacity(e1.mat,type),memberCapacity(e2.mat,type));
    supports[i]+=limiting*shape*(upper?1.12:1.05);triangles[i]++;
   }
  }
 }
 const weightPenalty=Math.min(.16,concreteLen/(c.span*7)*.26);
 const effective=supports.map((s,i)=>s+Math.min(.075,Math.max(0,(supports[i-1]||0)-.16)*.06)+Math.min(.075,Math.max(0,(supports[i+1]||0)-.16)*.06));
 const needs=effective.map((_,i)=>c.required*(.86+.24*Math.sin(Math.PI*(i+.5)/c.panels))*(1+weightPenalty));
 const ratios=effective.map((v,i)=>needs[i]/Math.max(.01,v));
 const worst=Math.max(...ratios),weak=ratios.indexOf(worst),strength=1/Math.max(.01,worst);
 return {supports:effective,needs,ratios,worst,weak,strength,triangles,pass:worst<=1,capacity:effective[weak],required:needs[weak],weightPenalty};
}
function findNode(p,r=18){return nodes.find(n=>Math.hypot(n.x-p.x,n.y-p.y)<r)}
function closestBeam(p){let chosen=null,dmin=15;for(const b of bars.filter(b=>!b.fixed)){const a=position(b.a),z=position(b.b);if(!a||!z)continue;const vx=z.x-a.x,vy=z.y-a.y,t=clamp(((p.x-a.x)*vx+(p.y-a.y)*vy)/(vx*vx+vy*vy),0,1),d=Math.hypot(p.x-a.x-vx*t,p.y-a.y-vy*t);if(d<dmin){chosen=b;dmin=d}}return chosen;}
function panelAt(p){const i=Math.floor((p.x-left())/step());return p.y>=60&&p.y<=365&&i>=0&&i<config().panels?i:-1;}
function point(ev){const r=svg.getBoundingClientRect();return{x:(ev.clientX-r.left)*1000/r.width,y:(ev.clientY-r.top)*500/r.height};}
function addTriangle(i,quiet=false){if(busy)return false;const c=config();if(i<0||i>=c.panels)return false;const existing=nodes.filter(n=>!n.deck&&Math.abs(n.x-(nodes[i].x+nodes[i+1].x)/2)<step()*.30&&Math.abs(n.y-216)>45&&(trussSide==='above'?n.y<216:n.y>216)).length;
 if(existing>=3){if(!quiet)message(`Span ${i+1} has several braces. Try stronger steel or reinforce a different span.`,'bad');return false;}
 if(trussSide==='above'&&level<9){message('Above-deck trusses unlock at mission 9.','bad');return false;}const x=+(nodes[i].x+step()*.5+(existing===1?-step()*.12:existing===2?step()*.12:0)).toFixed(2);const y=trussSide==='above'?104-existing*13:316+existing*22;const id=Math.max(...nodes.map(n=>n.id))+1;const node={id,x,y,deck:false,anchor:false};const newbars=[{a:i,b:id,mat:material},{a:i+1,b:id,mat:material}];const price=newbars.reduce((a,b)=>{const z=b.a===i?nodes[i]:nodes[i+1];return a+Math.hypot(z.x-node.x,z.y-node.y)*MAT[material].cost},0);if(price>remaining()+.00001){if(!quiet)message('Not enough money for that triangle. Try wood or erase another beam.','bad');return false;}remember();nodes.push(node);bars.push(...newbars);commit();if(!quiet){message(`Added a ${MAT[material].label.toLowerCase()} triangle to span ${i+1}. Keep bracing other spans or test now.`);soundFx('click');}return true;
}
function connect(a,b){if(a===b){message('Select two different joints.','bad');return false;}if(bars.some(k=>(k.a===a&&k.b===b)||(k.a===b&&k.b===a))){message('Those joints are already connected.','bad');return false;}const n1=position(a),n2=position(b);if(!n1||!n2||Math.hypot(n1.x-n2.x,n1.y-n2.y)>260){message('Beam is too long. Add an intermediate joint.','bad');return false;}const cost=Math.hypot(n1.x-n2.x,n1.y-n2.y)*MAT[material].cost;if(cost>remaining()+.0001){message('That beam exceeds the budget. Choose cheaper material.','bad');return false;}remember();bars.push({a,b,mat:material});commit();soundFx('click');message('Beam connected. To keep drawing, select another pair of joints.');return true;}
function connectBlank(a,p){p={x:Math.round(clamp(p.x,72,930)/10)*10,y:Math.round(clamp(p.y,70,410)/10)*10};if(p.y>172&&p.y<260)p.y=p.y<216?155:265;if(nodes.length>85){message('Maximum number of joints reached.','bad');return false;}const n=position(a),d=Math.hypot(n.x-p.x,n.y-p.y);if(d>250||d<20){message('Place the new joint 20–250 units from the starting joint.','bad');return false;}if(d*MAT[material].cost>remaining()){message('Not enough budget for this beam.','bad');return false;}remember();const id=Math.max(...nodes.map(z=>z.id))+1;nodes.push({id,...p,deck:false,anchor:false});bars.push({a,b:id,mat:material});commit();selectedJoint=id;draw();message('New joint created. Connect it to another joint to make a triangle.');soundFx('click');return true;}
function eraseAt(p){const b=closestBeam(p);if(b){remember();bars=bars.filter(x=>x!==b);commit();message('Beam removed. Test again after editing.');return;}const n=findNode(p);if(n&&!n.deck){remember();nodes=nodes.filter(x=>x.id!==n.id);bars=bars.filter(x=>x.a!==n.id&&x.b!==n.id);commit();message('Joint and connected beams removed.');return;}message('Choose a colored beam or a green support joint to erase.');}
function stageAction(p,origin=null,drag=false){if(busy)return;if(tool==='triangle'){const i=panelAt(p);if(i<0){message('Select a yellow numbered span on the road to add a triangle.');return;}addTriangle(i);return;}
 if(tool==='erase'){eraseAt(p);return;}
 if(tool==='beam'){
  const node=findNode(p,22);if(drag&&origin!==null){if(node)connect(origin,node.id);else connectBlank(origin,p);return;}
  if(selectedJoint===null){if(node){selectedJoint=node.id;message('First joint selected. Click another joint—or below the bridge to create a joint.');draw();}else{message('Choose a joint first (a colored dot).','bad');}return;}
  if(node){if(node.id===selectedJoint){selectedJoint=null;draw();message('Selection cleared.');}else connect(selectedJoint,node.id);}
  else connectBlank(selectedJoint,p);
 }
}
svg.addEventListener('pointerdown',ev=>{if(busy||!ev.isPrimary)return;const p=point(ev);pointerOrigin={p,node:findNode(p,22)?.id??null};pointerCurrent=p;try{svg.setPointerCapture(ev.pointerId)}catch{};});
svg.addEventListener('pointermove',ev=>{if(busy)return;const p=point(ev);hover=tool==='triangle'?panelAt(p):-1;pointerCurrent=p;if(tool==='beam'||tool==='triangle')draw();});
svg.addEventListener('pointerup',ev=>{if(busy||!ev.isPrimary)return;const p=point(ev),org=pointerOrigin;pointerOrigin=null;pointerCurrent=null;hover=null;if(!org)return;const drag=Math.hypot(p.x-org.p.x,p.y-org.p.y)>22;stageAction(p,org.node,drag&&tool==='beam'&&org.node!==null);draw();});
svg.addEventListener('pointercancel',()=>{pointerOrigin=null;pointerCurrent=null;hover=null;draw()});
function updateCoach(){const c=config(),s=score(),has=bars.some(b=>!b.fixed);if(!has){$('#coachTitle').textContent='Start with triangles';$('#coachText').textContent='Choose Triangle helper and click any numbered roadway span. Repeat across the bridge to create a strong support pattern.';$('#coachNote').textContent=level>=9?'Try an overhead truss and watch the vehicle pass behind it.':level>=5?'Concrete can strengthen a span, but adds weight and cost.':'Tip: Wood triangles work well on the early missions.';}
 else if(s.worst>1){$('#coachTitle').textContent=`Reinforce span ${s.weak+1}`;$('#coachText').textContent=`The weakest part is span ${s.weak+1}. Its estimated stress is ${Math.round(s.worst*100)}% of capacity. Add a triangle or switch to stronger steel.`;$('#coachNote').textContent=`Mission: ${c.vehicle}. Every panel needs enough strength, not only the center.`;}
 else{$('#coachTitle').textContent='Ready for a test drive';$('#coachText').textContent='The static estimate looks strong enough. Press Test crossing, then watch the bridge flex under your vehicle.';$('#coachNote').textContent='You still must finish the entire animated crossing to unlock the next mission.';}
 $('#fixBtn').disabled=busy||remaining()<22;
}
function renderLevels(){$('#levelGrid').innerHTML=LEVELS.map(c=>`<button type="button" data-level="${c.id}" title="${c.title}" class="${level===c.id?'current':''}" ${c.id>saved.unlocked?'disabled':''}><span>${c.id}</span><small>${saved.best[c.id]?'★'.repeat(saved.best[c.id]):c.id>saved.unlocked?'🔒':'○'}</small></button>`).join('');$('#campaignCount').textContent=`${saved.unlocked} / 48 unlocked`}
function updateMetrics(){const c=config(),s=score(),total=used();$('#budgetStat').textContent='$'+fmt(Math.max(0,remaining()));$('#budgetStat').style.color=remaining()<0?'#ff817c':'';$('#budgetFill').style.width=clamp(remaining()/c.budget*100,0,100)+'%';$('#beamStat').textContent=bars.filter(b=>!b.fixed).length;$('#materialBreakdown').textContent=`${bars.filter(b=>b.mat==='steel').length} steel · ${bars.filter(b=>b.mat==='wood').length} wood · ${bars.filter(b=>b.mat==='cable').length} cable · ${bars.filter(b=>b.mat==='concrete').length} concrete`;
 $('#weakStat').textContent=bars.some(b=>!b.fixed)?`#${s.weak+1}`:'—';$('#weakSub').textContent=bars.some(b=>!b.fixed)?`${Math.round(s.worst*100)}% estimated load`:'Add bracing to the deck';$('#starStat').textContent=saved.best[level]?'★'.repeat(saved.best[level]):'—';$('#unlockStat').textContent=level===48?'Final mission':`Level ${Math.min(48,level+1)} ${saved.unlocked>level?'unlocked':'locked'}`;
 $('#stressTrack').innerHTML=s.ratios.map((v,i)=>`<div class="span" data-label="${i+1}" title="Span ${i+1}: ${Math.round(v*100)}% estimated stress" style="background:${testState==='idle'?'#557585':colorStress(v)}"></div>`).join('');
 if(testState==='idle'){$('#stressValue').textContent='—';$('#stressValue').style.color='#b6cbd4';$('#stressStatus').textContent='Teaching-model estimate';}
 else{$('#stressValue').textContent=Math.round((lastStress||s.worst)*100)+'%';$('#stressValue').style.color=colorStress(lastStress||s.worst);$('#stressStatus').textContent=testState==='passed'?'Crossing passed':testState==='failed'?'Collapsed':`Moving ${c.vehicle.toLowerCase()}`;}
}
function vehicleSvg(type,x,y,rotation=0){let body='';const main='#f9b965',light='#ffe0a1',dark='#173747',glass='#8ed7e9';
const wheel=(cx,cy,r=13)=>`<circle cx="${cx}" cy="${cy}" r="${r}" fill="#1a2d38" stroke="#dbeaf0" stroke-width="3"/><circle cx="${cx}" cy="${cy}" r="${r*.38}" fill="#8bafc0"/>`;
if(type==='bike'){body=`<path d="M-38 14L-14 -15L11 14L-38 14M-14 -15L-1 -24M-14 -15L-30 -23" fill="none" stroke="${light}" stroke-width="5"/>${wheel(-38,15,17)}${wheel(12,15,17)}<circle cx="-6" cy="-43" r="9" fill="#ffe0b6"/><path d="M-6 -32L-14 -14L7 1" stroke="${main}" stroke-width="8" fill="none"/>`}
else if(type==='tank'){body=`<path d="M-60 10L64 10L57 27L-52 27Z" fill="#425c42" stroke="#c0d0a1" stroke-width="3"/><rect x="-44" y="-15" width="90" height="28" rx="10" fill="#738a54"/><path d="M-10 -20L28 -20L40 -10L-18 -10Z" fill="#97a977"/><rect x="28" y="-16" width="58" height="6" rx="3" fill="#96aa78"/>${[-40,-15,10,35].map(k=>wheel(k,21,10)).join('')}`}
else if(type==='train'){body=`<rect x="-76" y="-34" width="92" height="55" rx="5" fill="#ce4c50"/><rect x="17" y="-12" width="68" height="33" rx="4" fill="#e5a445"/><rect x="-61" y="-58" width="46" height="26" rx="4" fill="#e2b75f"/><rect x="-48" y="-54" width="22" height="18" fill="${glass}"/><rect x="-75" y="-39" width="40" height="7" fill="#fff1bc"/><path d="M-85 24H90" stroke="#e0b56c" stroke-width="6"/>${[-59,-28,8,40,70].map(k=>wheel(k,24,10)).join('')}`}
else{const long=['semi','bus','fire','crane','dump'].includes(type),w=long?150:112,half=w/2;
body=`<rect x="${-half}" y="-16" width="${w*.58}" height="41" rx="7" fill="${main}"/><path d="M${-half+w*.54} -16 L${half-12} -16 L${half} 2 L${half} 25 L${-half+w*.54} 25 Z" fill="${type==='fire'?'#ef625c':type==='dump'?'#edb34d':main}" stroke="${light}" stroke-width="2"/><path d="M${half-41} -12H${half-17}L${half-7} 4H${half-41}Z" fill="${glass}"/>${wheel(-half+25,27,12)}${wheel(half-23,27,12)}`;
if(long)body+=wheel(-half+56,27,12);
if(type==='camper')body+=`<rect x="-30" y="-29" width="48" height="18" fill="#edf1da"/><rect x="-19" y="-26" width="18" height="14" fill="${glass}"/>`;
if(type==='crane')body+=`<path d="M-40 -25L25 -86L32 -78L-23 -16" fill="none" stroke="#fad37f" stroke-width="9"/><path d="M25 -85V-56" stroke="#e7eaf0" stroke-width="3"/>`;
if(type==='dump')body+=`<path d="M${-half} -36L${-half+64} -28V-13H${-half}Z" fill="#d99d52"/>`;
if(type==='fire')body+=`<path d="M-65 -19H-8M-65 -27H-8" stroke="#dfe4e6" stroke-width="4"/><rect x="25" y="-33" width="17" height="15" fill="#f9e7ba"/>`;
if(type==='bus')body+=`<rect x="-67" y="-9" width="83" height="18" fill="${glass}"/><path d="M-40 -9V9M-14 -9V9" stroke="#244757" stroke-width="3"/>`;
if(type==='pickup')body+=`<path d="M-52 -14H-10V5H-52Z" fill="#e1a64b"/>`;
}
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
 if(testState==='testing'||testState==='failed'){const ix=clamp(Math.floor(((xa+xb)/2-left())/step()),0,num-1),str=stressProfile[ix]??q.ratios[ix];if(str>.85)col=colorStress(str);}
 output+=`<line x1="${xa}" y1="${ya}" x2="${xb}" y2="${yb}" stroke="#132f40" stroke-width="11" stroke-linecap="round"/><line x1="${xa}" y1="${ya}" x2="${xb}" y2="${yb}" stroke="${col}" stroke-width="${b.mat==='concrete'?9:6.7}" stroke-linecap="round" ${b.mat==='cable'?'stroke-dasharray="9 5"':''}/>`;
 }return output;};
html+=drawMembers(false);
for(const n of nodes.filter(n=>n.y>=216)){const y=n.y+(n.deck?sagAt(n.id):0),marked=selectedJoint===n.id;html+=`<circle cx="${n.x}" cy="${y}" r="${marked?13:n.deck?9:8}" fill="${n.anchor?'#ffd98e':n.deck?'#ccedef':'#64e1c3'}" stroke="${marked?'#fff1ae':'#14374a'}" stroke-width="3"/>`;}
if(tool==='beam'&&!busy&&selectedJoint!==null&&pointerCurrent){const a=position(selectedJoint);if(a)html+=`<line x1="${a.x}" y1="${a.y}" x2="${pointerCurrent.x}" y2="${pointerCurrent.y}" stroke="#f8d97e" stroke-dasharray="8 5" stroke-width="4"/>`;}
if(tool==='beam'&&!busy&&pointerOrigin?.node!==null&&pointerOrigin?.node!==undefined&&pointerCurrent&&Math.hypot(pointerOrigin.p.x-pointerCurrent.x,pointerOrigin.p.y-pointerCurrent.y)>20){const a=position(pointerOrigin.node);if(a)html+=`<line x1="${a.x}" y1="${a.y}" x2="${pointerCurrent.x}" y2="${pointerCurrent.y}" stroke="#f8d97e" stroke-dasharray="8 5" stroke-width="4"/>`;}
if(vehicleX!==null){const a=clamp(Math.floor((vehicleX-left())/step()),0,num-1),x0=nodes[a].x,x1=nodes[a+1].x,t=clamp((vehicleX-x0)/(x1-x0),0,1),surface=(1-t)*sagAt(a)+t*sagAt(a+1),extra=testState==='failed'?collapseT*78:0,carY=178+surface+extra;let rotation=testState==='failed'?collapseT*(collapseIndex%2===0?17:-19):0;html+=vehicleSvg(c.type,vehicleX,carY,rotation);}
html+=drawMembers(true);for(const n of nodes.filter(n=>n.y<216)){html+=`<circle cx="${n.x}" cy="${n.y}" r="9" fill="#ffdcae" stroke="#173a4b" stroke-width="3"/>`;}
if(testState==='failed'&&collapseT>0){const cx=left()+(collapseIndex+.5)*step(),cy=232+collapseT*160;for(let j=0;j<15;j++){const a=j*2.399,rad=collapseT*(30+(j%5)*14);html+=`<circle cx="${cx+Math.cos(a)*rad}" cy="${cy+Math.sin(a)*rad-collapseT*30}" r="${clamp(5-collapseT*2,1.8,5)}" fill="${j%3===0?'#fbd286':j%3===1?'#8bbfca':'#da9272'}" opacity="${1-collapseT*.42}"/>`;}
html+=`<text x="500" y="89" text-anchor="middle" fill="#ffbcb3" font-size="31" font-weight="900" stroke="#242b34" stroke-width="4" paint-order="stroke">STRUCTURAL FAILURE</text>`;}
if(testState==='passed')html+=`<text x="500" y="89" text-anchor="middle" fill="#b8ffdd" font-size="31" font-weight="900" stroke="#193b40" stroke-width="4" paint-order="stroke">CROSSING SUCCESSFUL</text>`;
html+=`<text x="20" y="36" font-size="13" fill="#dbebed">${tool==='triangle'?'△ Click a numbered span to install a triangle':tool==='beam'?'╱ Select or drag between joints to add a beam':'⌫ Click a beam or green joint to remove it'}</text>`;
svg.innerHTML=html;updateMetrics();}
function setTool(t){if(busy)return;tool=t;selectedJoint=null;for(const [id,val] of [['triangleBtn','triangle'],['beamBtn','beam'],['eraseBtn','erase']]){$('#'+id).classList.toggle('active',t===val)}$('#stageHelp').textContent=t==='triangle'?'Select a numbered deck span to install a triangle on your chosen side.':t==='beam'?'Click a colored joint, then another. Or drag between joints.':'Click a colored support beam or green joint to remove it.';draw();}

function activeStress(q,x){return q.ratios.map((r,i)=>{const mid=left()+(i+.5)*step(),spread=step()*1.8,proximity=Math.exp(-Math.pow((x-mid)/spread,2));return r*(.25+.75*proximity)});}
// Optional learning activities; they never prevent driving or progressing.
function labData(){const c=config();const idx=(level-1)%8,price=20+5*(Math.floor(level/8)%5),count=2+(Math.floor(level/6)%3),woodCount=2+(Math.floor(level/7)%4);
 const choices=[
 {q:'Why do engineers often use triangles in trusses?',a:['They keep their shape when forces act on them','They make a bridge float','They remove all weight'],correct:0,why:'A triangle resists changing shape, so its members can transfer forces.'},
 {q:`A beam costs $${price}. What is the cost of ${count} equal beams?`,a:[`$${price*(count-1)}`,`$${price*count}`,`$${price*(count+1)}`],correct:1,why:`${count} × $${price} = $${count*price}. Multiply unit cost by quantity.`},
 {q:'Which material is generally suited to carrying tension?',a:['A loose rock','A steel cable','Wet sand'],correct:1,why:'A cable resists being pulled apart (tension); it cannot push well.'},
 {q:'If a bridge supports a car, will a much heavier truck always be safe?',a:['Yes, always','Not necessarily; load increases','Only at night'],correct:1,why:'Heavier vehicles can increase member forces and deflection.'},
 {q:`A 100-unit wooden beam costs about $31 in this game. What would ${woodCount} beams cost?`,a:[`$${31*(woodCount-1)}`,`$${31*woodCount}`,`$${31*(woodCount+1)}`],correct:1,why:`${woodCount} × $31 = $${woodCount*31}. This is an approximate game-price exercise.`},
 {q:'Why might concrete increase a bridge’s dead load?',a:['It adds its own weight','It makes cars drive faster','It removes gravity'],correct:0,why:'The structure must carry its own weight as well as the vehicle.'},
 {q:'Where does a simply supported bridge often bend most under a centered load?',a:['Near its middle','Only in the water','Nowhere'],correct:0,why:'The middle often experiences the greatest bending under a centered load.'},
 {q:'Your design fails. What is the best next step?',a:['Ignore the results','Study the weak span and revise','Always buy every material'],correct:1,why:'Engineers test, analyze the failure, and improve the design.'}
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
 let start=performance.now(),dur=c.type==='train'?6000:c.type==='bike'?4100:4900;const begin=left()-95,end=left()+c.span+110;let willFail= q.pass?-1:q.weak;let failX=left()+(willFail+.5)*step();
 await new Promise(resolve=>{function frame(now){let t=clamp((now-start)/dur,0,1);vehicleX=begin+(end-begin)*t;progress=clamp((vehicleX-left())/c.span,0,1);stressProfile=activeStress(q,vehicleX);lastStress=Math.max(...stressProfile);$('#driveFill').style.width=Math.round(progress*100)+'%';$('#simProgress').textContent=Math.round(progress*100)+'% across';draw();if(willFail>=0 && vehicleX>=failX){collapseIndex=willFail;resolve();return;}if(t>=1){resolve();return;}aniId=requestAnimationFrame(frame)}aniId=requestAnimationFrame(frame)});
 if(willFail>=0){testState='failed';soundFx('crash');settlePrediction(false);message(`COLLAPSE at span ${q.weak+1}! Estimated load is ${Math.round(q.worst*100)}% of capacity. Reinforce this span, and test again.`,'bad');$('#buildStatus').textContent='FAILED TEST';const collapseStart=performance.now();await new Promise(resolve=>{function fall(now){collapseT=clamp((now-collapseStart)/900,0,1);lastStress=q.worst;draw();if(collapseT<1)aniId=requestAnimationFrame(fall);else resolve();}aniId=requestAnimationFrame(fall)});busy=false;$('#testBtn').disabled=false;$('#replayBtn').disabled=false;$('#simProgress').textContent='Bridge collapsed';updateCoach();draw();return;}
 // A successful crossing is committed ONLY after the vehicle reaches the far bank.
 progress=1;vehicleX=end;stressProfile=activeStress(q,vehicleX);lastStress=q.worst;testState='passed';busy=false;passRevision=myRev;settlePrediction(true);$('#driveFill').style.width='100%';let leftBudget=remaining()/c.budget;let stars=leftBudget>.25&&q.worst<.78?3:leftBudget>.12?2:1;saved.best[level]=Math.max(stars,saved.best[level]||0);saved.unlocked=Math.max(saved.unlocked,Math.min(48,level+1));save();renderLevels();$('#nextBtn').disabled=level===48||passRevision!==revision;$('#testBtn').disabled=false;$('#replayBtn').disabled=false;$('#buildStatus').textContent='PASSED';$('#simProgress').textContent='100% crossing';$('#starStat').textContent='★'.repeat(saved.best[level]);message(`PASS! The ${c.vehicle.toLowerCase()} made it fully across. ${'★'.repeat(stars)} earned with $${fmt(remaining())} remaining. ${level===48?'You completed all 48 missions!':'Next mission unlocked.'}`,'good');soundFx('pass');updateCoach();draw();}
$('#testBtn').addEventListener('click',test);
$('#replayBtn').addEventListener('click',test);
$('#nextBtn').addEventListener('click',()=>{if(busy||testState!=='passed'||passRevision!==revision||progress!==1||level>=48)return;loadMission(level+1)});
$('#levelGrid').addEventListener('click',e=>{const b=e.target.closest('button[data-level]');if(!b||busy||b.disabled)return;loadMission(Number(b.dataset.level));});
$('#resetBtn').addEventListener('click',()=>{if(busy)return;if(confirm('Start this mission with an empty bridge? Best stars and unlocked levels are kept.')){delete saved.drafts[level];loadMission(level,true)}});
$('#undoBtn').addEventListener('click',()=>{if(busy||!history.length)return;const old=JSON.parse(history.pop());nodes=old.nodes;bars=old.bars;commit();message('Undid the last construction step. Previous test results no longer count.')});
$('#fixBtn').addEventListener('click',()=>{if(busy)return;const i=score().weak;if(addTriangle(i)){message(`Added a ${MAT[material].label.toLowerCase()} support to the estimated weakest span (${i+1}). Retest to see whether it holds.`);}});
function refreshUnlocks(){
 const concrete=$('#concreteBtn'),over=$('#aboveBtn');
 concrete.disabled=level<5;concrete.querySelector('small').textContent=level<5?'Unlocks at 5':'Heavy · strong';concrete.title=level<5?'Unlock on mission 5':'Concrete supports';
 over.disabled=level<9;
 over.textContent=level<9?'Above roadway · unlock 9':'Above roadway';
 if(level<9)trussSide='below';if(level<5&&material==='concrete')material='wood';
 $('#belowBtn').classList.toggle('active-layer',trussSide==='below');$('#aboveBtn').classList.toggle('active-layer',trussSide==='above');
 $('#trussHint').textContent=level<9?'Build underneath first. Upper trusses unlock at mission 9.':'Upper trusses stand in front of the passing vehicle. Compare them with bottom supports.';
 document.querySelectorAll('[data-mat]').forEach(b=>b.classList.toggle('active',b.dataset.mat===material));
}
$('#belowBtn').addEventListener('click',()=>{if(busy)return;trussSide='below';refreshUnlocks();draw();});
$('#aboveBtn').addEventListener('click',()=>{if(busy||level<9)return;trussSide='above';refreshUnlocks();draw();});
$('#triangleBtn').addEventListener('click',()=>setTool('triangle'));$('#beamBtn').addEventListener('click',()=>setTool('beam'));$('#eraseBtn').addEventListener('click',()=>setTool('erase'));
document.querySelectorAll('[data-mat]').forEach(b=>b.addEventListener('click',()=>{if(busy)return;material=b.dataset.mat;document.querySelectorAll('[data-mat]').forEach(k=>k.classList.toggle('active',k===b));message(`${MAT[material].label} selected. ${material==='steel'?'More expensive but stronger.':material==='wood'?'Lower cost, lower strength.':'Best used for tension bracing.'}`)}));
$('#hintsToggle').addEventListener('change',e=>{hints=e.target.checked;draw();});
$('#soundBtn').addEventListener('click',()=>{sound=!sound;$('#soundBtn').textContent=sound?'♪ Sound on':'♪ Sound off';$('#soundBtn').setAttribute('aria-pressed',String(sound));});
$('#helpBtn').addEventListener('click',()=>$('#helpDialog').showModal());$('#helpClose').addEventListener('click',()=>$('#helpDialog').close());$('#helpGo').addEventListener('click',()=>$('#helpDialog').close());
loadMission(level);
})();
