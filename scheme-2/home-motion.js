(()=>{'use strict';
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),wall=document.querySelector('.work-wall'),dialog=document.querySelector('#project-dialog'),cards=[...document.querySelectorAll('.art-card')];
if(!wall||!cards.length)return;
let timer=null,observer=null,disposed=false;const visible=new Set(),revealed=new WeakSet(),positions=new WeakMap(),animations=new Set();
function motion(el,frames,options){const a=el.animate(frames,{fill:'none',...options});animations.add(a);a.finished.catch(()=>{}).finally(()=>animations.delete(a));return a;}
function reveal(card,index){if(revealed.has(card)||reduced.matches)return;revealed.add(card);motion(card,[{opacity:0,scale:'.05'},{opacity:1,scale:'1'}],{duration:700,delay:Math.floor(index/3)*130,fill:'backwards',easing:'cubic-bezier(.16,1,.3,1)'});}
async function swap(card,index){if(disposed||reduced.matches||document.hidden||dialog.open||card.matches(':hover,:focus-within'))return;
const project=window.PORTFOLIO_PROJECTS.find(p=>p.id===card.dataset.project),img=card.querySelector('img');if(!project||!img)return;
const gallery=[...new Set([img.getAttribute('src'),...project.images.map(i=>i.thumb||i.src)])];if(gallery.length<2)return;
const current=positions.get(card)||0,next=(current+1)%gallery.length,src=gallery[next],preload=new Image();preload.src=src;try{await preload.decode();}catch{return;}
if(disposed||reduced.matches||document.hidden||dialog.open||!visible.has(card)||card.matches(':hover,:focus-within'))return;
const out=motion(card,[{opacity:1,scale:'1'},{opacity:0,scale:'.05'}],{duration:350,delay:Math.floor(index/3)*140,easing:'cubic-bezier(.55,0,1,.45)',fill:'forwards'});
try{await out.finished;}catch{return;}
img.src=src;positions.set(card,next);out.cancel();motion(card,[{opacity:0,scale:'.05'},{opacity:1,scale:'1'}],{duration:700,easing:'cubic-bezier(.16,1,.3,1)'});
}
function schedule(){clearInterval(timer);timer=null;if(!disposed&&!reduced.matches&&!document.hidden&&!dialog.open&&visible.size)timer=setInterval(()=>[...visible].forEach(swap),5000);}
function setup(){if(reduced.matches)return;
const title=document.querySelector('.hero-name h1');
if(scrollY<30&&!location.hash){motion(title,[{transform:'translateY(75vh) scale(1.12)',opacity:0,offset:0},{transform:'translateY(-12px) scale(1.12)',opacity:1,offset:.47},{transform:'translateY(0) scale(1)',opacity:1,offset:1}],{duration:1500,easing:'cubic-bezier(.65,0,.35,1)'});motion(wall,[{transform:'translateY(70vh)'},{transform:'translateY(0)'}],{duration:800,delay:650,easing:'cubic-bezier(.65,0,.35,1)',fill:'backwards'});document.querySelectorAll('.site-nav,.hero-credit').forEach(el=>motion(el,[{opacity:0,translate:'0 14px'},{opacity:1,translate:'0 0'}],{duration:650,delay:950,fill:'backwards',easing:'ease-out'}));}
observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){visible.add(entry.target);reveal(entry.target,cards.indexOf(entry.target));}else visible.delete(entry.target);});schedule();},{threshold:.15});cards.forEach(c=>observer.observe(c));
}
new MutationObserver(()=>{if(dialog.open)animations.forEach(a=>a.finish());schedule();}).observe(dialog,{attributes:true,attributeFilter:['open']});
document.addEventListener('visibilitychange',schedule);reduced.addEventListener('change',()=>{if(reduced.matches){animations.forEach(a=>a.cancel());observer?.disconnect();visible.clear();schedule();}else{observer?.disconnect();setup();}});
window.addEventListener('pagehide',()=>{disposed=true;clearInterval(timer);observer?.disconnect();animations.forEach(a=>a.cancel());});setup();
})();
