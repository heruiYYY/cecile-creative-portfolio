(() => {
  'use strict';
  if(window.parent===window){location.replace('./'+location.hash);return;}
  const notify=()=>window.parent.postMessage({type:'cecile-route',hash:location.hash||'#home',title:document.title},location.origin);
  window.addEventListener('hashchange',notify);
  notify();
})();
