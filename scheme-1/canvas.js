(() => {
  'use strict';
  const width=1920,height=width*1344/3168;
  const frame=document.querySelector('#portfolio-canvas');
  const guide=document.querySelector('#computer-guide');
  const link=document.querySelector('#computer-link');
  const phone=!!navigator.userAgentData?.mobile || /iPhone|iPod|Android.*Mobile|Windows Phone|IEMobile|Opera Mini/i.test(navigator.userAgent) || (matchMedia('(pointer:coarse)').matches&&Math.min(screen.width,screen.height)<600&&!/Macintosh|Windows NT|X11|CrOS/i.test(navigator.userAgent));
  const updateLink=()=>{link.value=new URL('./',location.href).href+location.hash;};
  updateLink();
  if(phone){
    guide.hidden=false;
    document.querySelector('#copy-computer-link').addEventListener('click',async()=>{
      const status=document.querySelector('#copy-status');
      try{await navigator.clipboard.writeText(link.value);status.textContent='链接已复制，请在电脑浏览器中打开。';}
      catch{link.focus();link.select();status.textContent='请长按或选中上方链接复制。';}
    });
    window.addEventListener('hashchange',updateLink);
    return;
  }
  const fit=()=>{
    const scale=Math.min(window.innerWidth/width,window.innerHeight/height);
    document.documentElement.style.setProperty('--canvas-scale',String(scale));
  };
  const syncRoute=()=>{
    updateLink();
    const child=frame.contentWindow;
    if(child&&child.location.hash!==location.hash)child.location.replace(location.hash||'#home');
  };
  fit();
  frame.src='desktop.html'+(location.hash||'#home');
  frame.hidden=false;
  frame.addEventListener('load',syncRoute);
  window.addEventListener('resize',fit);
  window.addEventListener('hashchange',syncRoute);
  window.addEventListener('message',event=>{
    if(event.source!==frame.contentWindow||event.origin!==location.origin||event.data?.type!=='cecile-route')return;
    const hash=event.data.hash;
    if(typeof hash!=='string'||!/^#(?:home|work|about|project\/[a-z0-9-]+)$/.test(hash))return;
    if(location.hash!==hash)history.replaceState(null,'',hash);
    document.title=event.data.title;
  });
})();
