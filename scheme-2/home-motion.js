(()=>{'use strict';
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),title=document.querySelector('.hero-name h1'),wall=document.querySelector('.work-wall'),nav=document.querySelector('.site-nav');
if(!title||!wall||reduced.matches||scrollY>30||(location.hash&&location.hash!=='#home'))return;
const animations=new Set();let stopped=false,veil=null,clone=null;
const previousVisibility=title.style.visibility;title.style.visibility='hidden';
veil=document.createElement('div');veil.className='intro-veil';veil.setAttribute('aria-hidden','true');Object.assign(veil.style,{position:'fixed',inset:nav.getBoundingClientRect().bottom+'px 0 0',background:'#fff',zIndex:'90',pointerEvents:'none'});document.body.append(veil);
function finish(){if(stopped)return;stopped=true;animations.forEach(a=>a.cancel());animations.clear();veil?.remove();clone?.remove();title.style.visibility=previousVisibility;window.removeEventListener('wheel',interrupt);window.removeEventListener('touchstart',interrupt);window.removeEventListener('keydown',onKey);document.removeEventListener('pointerdown',interrupt);}
const interrupt=()=>finish(),onKey=e=>{if(['Escape','Tab','ArrowDown','PageDown','End',' '].includes(e.key))finish();};
function animate(el,frames,options){const a=el.animate(frames,{fill:'both',...options});animations.add(a);return a;}
async function start(){try{
await Promise.race([document.fonts.ready,new Promise(resolve=>setTimeout(resolve,1400))]);if(stopped)return;
if(reduced.matches||scrollY>30){finish();return;}
const style=getComputedStyle(title),rect=title.getBoundingClientRect(),range=document.createRange();range.selectNodeContents(title);const ink=range.getBoundingClientRect(),size=innerWidth<=750?18:25;
clone=title.cloneNode(true);clone.removeAttribute('id');clone.className='intro-title';clone.setAttribute('aria-hidden','true');
Object.assign(clone.style,{visibility:'visible',position:'fixed',left:rect.left+'px',top:rect.top+'px',margin:'0',width:'max-content',fontFamily:style.fontFamily,fontSize:style.fontSize,fontWeight:style.fontWeight,letterSpacing:style.letterSpacing,lineHeight:style.lineHeight,color:style.color,whiteSpace:'nowrap',transformOrigin:'0 0',zIndex:'91',pointerEvents:'none'});
document.body.append(clone);
const scale=Math.max(1,(innerWidth-size*2)/ink.width),largeY=Math.max(nav.getBoundingClientRect().bottom+30,innerHeight-ink.height*scale-36),dx=size-rect.left;
const first=animate(clone,[{transform:`translate(${dx}px,${innerHeight-rect.top+30}px) scale(${scale})`},{transform:`translate(${dx}px,${largeY-rect.top}px) scale(${scale})`}],{duration:750,easing:'cubic-bezier(.65,0,.35,1)'});
animate(wall,[{transform:`translateY(${Math.max(0,innerHeight-wall.getBoundingClientRect().top)}px)`},{transform:'translateY(0)'}],{duration:900,delay:900,easing:'cubic-bezier(.65,0,.35,1)'});
animate(veil,[{clipPath:'inset(0 0 0 0)'},{clipPath:'inset(0 0 100% 0)'}],{duration:900,delay:900,easing:'cubic-bezier(.65,0,.35,1)'});
await first.finished;if(stopped)return;
const settle=animate(clone,[{transform:`translate(${dx}px,${largeY-rect.top}px) scale(${scale})`},{transform:'translate(0,0) scale(1)'}],{duration:950,delay:150,easing:'cubic-bezier(.65,0,.35,1)'});
animate(document.querySelector('.hero-credit'),[{opacity:0},{opacity:1}],{duration:450,delay:700});
await settle.finished;finish();
}catch{finish();}}
window.addEventListener('wheel',interrupt,{passive:true});window.addEventListener('touchstart',interrupt,{passive:true});window.addEventListener('keydown',onKey);document.addEventListener('pointerdown',interrupt);window.addEventListener('resize',finish,{once:true});window.addEventListener('pagehide',finish,{once:true});reduced.addEventListener('change',()=>{if(reduced.matches)finish();});start();
})();
