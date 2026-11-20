/* ==========================================================================
   TONY BONY RIG CONTROLLER (shared). (c) 2026 S. Kahler Teaching
   Included into each game by tools/build.py. No libraries needed.

   Wardrobe
     TonyRig.wear('labcoat')        put a piece on (a hat replaces any other hat)
     TonyRig.take('labcoat')        take it off
     TonyRig.toggle('mininghat')    on/off, returns true if now wearing it
     TonyRig.isWearing('chefhat')   true/false
     TonyRig.outfit()               list of what he has on, e.g. ['chefhat','labcoat']
     TonyRig.setOutfit(['mininghat','labcoat'])   dress him all at once
     TonyRig.items                  the wardrobe list below

   Moves
     TonyRig.flipHat({onLand(){}})  hat pops up, shows the hook, lands with a squash
                                    (CSS animation; returns false if already flipping)

   Adding a costume piece: see shared/tony/README.md.
   ========================================================================== */
const TonyRig=(function(){
  // slot: pieces in the same slot replace each other (one hat at a time)
  const items={
    chefhat:  {slot:'hat',  label:'Chef hat'},
    mininghat:{slot:'hat',  label:'Mining hat'},
    labcoat:  {slot:'coat', label:'Lab coat'}
  };
  const root=()=>document.getElementById('tb-tony');
  function sync(r){r.classList.toggle('hatted',Object.keys(items).some(k=>items[k].slot==='hat'&&r.classList.contains('wear-'+k)))}
  function wear(item){const r=root(),it=items[item];if(!r||!it)return false;
    for(const k in items)if(k!==item&&items[k].slot===it.slot)r.classList.remove('wear-'+k);
    r.classList.add('wear-'+item);sync(r);return true}
  function take(item){const r=root();if(!r)return;r.classList.remove('wear-'+item);sync(r)}
  function isWearing(item){const r=root();return !!r&&r.classList.contains('wear-'+item)}
  function toggle(item){if(isWearing(item)){take(item);return false}return wear(item)}
  function outfit(){return Object.keys(items).filter(isWearing)}
  function setOutfit(list){const r=root();if(!r)return;Object.keys(items).forEach(k=>r.classList.remove('wear-'+k));(list||[]).forEach(wear);sync(r)}
  function flipHat(opts){opts=opts||{};const h=document.getElementById('tb-hatSlot'),r=root();
    if(!h||!r||h.classList.contains('tb-flip')||!r.classList.contains('hatted'))return false;
    r.classList.remove('hatted');h.classList.add('tb-flip');
    setTimeout(()=>{sync(r);if(opts.onLand)opts.onLand()},880);
    h.addEventListener('animationend',()=>h.classList.remove('tb-flip'),{once:true});return true}
  return {items,wear,take,toggle,isWearing,outfit,setOutfit,flipHat};
})();
