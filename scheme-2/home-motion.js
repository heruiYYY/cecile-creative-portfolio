(()=>{'use strict';
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),wall=document.querySelector('.work-wall'),dialog=document.querySelector('#project-dialog'),cards=[...document.querySelectorAll('.art-card')];
if(!wall||!cards.length)return;
const animations=new Set();
function motion(el,frames,options){const a=el.animate(frames,{fill:'none',...options});animations.add(a);a.finished.catch(()=>{}).finally(()=>animations.delete(a));return a;}
function setup(){if(reduced.matches)return;
const title=document.querySelector('.hero-name h1');
if(scrollY<30&&!location.hash){motion(title,[{transform:'translateY(75vh) scale(1.12)',opacity:0,offset:0},{transform:'translateY(-12px) scale(1.12)',opacity:1,offset:.47},{transform:'translateY(0) scale(1)',opacity:1,offset:1}],{duration:1500,easing:'cubic-bezier(.65,0,.35,1)'});motion(wall,[{transform:'translateY(70vh)'},{transform:'translateY(0)'}],{duration:800,delay:650,easing:'cubic-bezier(.65,0,.35,1)',fill:'backwards'});document.querySelectorAll('.site-nav,.hero-credit').forEach(el=>motion(el,[{opacity:0,translate:'0 14px'},{opacity:1,translate:'0 0'}],{duration:650,delay:950,fill:'backwards',easing:'ease-out'}));}
}
new MutationObserver(()=>{if(dialog.open)animations.forEach(a=>a.finish());}).observe(dialog,{attributes:true,attributeFilter:['open']});
reduced.addEventListener('change',()=>{if(reduced.matches)animations.forEach(a=>a.cancel());});
window.addEventListener('pagehide',()=>{animations.forEach(a=>a.cancel());});setup();
})();
