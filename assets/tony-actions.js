/* ---------- Tony actions: reusable keyframed moves for the canvas rig ----------
   Needs the Tony rig (with prop/beam support and Tony.reach) loaded first.

   Use:
     const act = TonyActs.player();
     act.play('inspect', { prop: TonyProps.rock(), on: { peak(){ say('Hmm!') } }, onDone(){} });
     // in your draw loop, after choosing a base pose:
     act.apply(P, performance.now()/1000);   // overrides the right arm, head, eyes and brows while playing
     act.busy()     -> true while an action plays
     act.release()  -> lets a held action (opts.hold) finish
     act.stop()     -> ends at once

   Built-in actions (right hand):
     inspect  pull a prop from behind his back, light it with the headlamp, turn it, put it back
     present  pull a prop from behind his back and hold it up toward the viewer, then put it back
   Events fired through opts.on: out (prop in view), lightOn, peak, lightOff, away (prop back behind him)
   opts.hold = true pauses at the hold point until release() (e.g. keep an answer card up).
   Add new moves to TonyActs.actions with the same key format:
     {t: seconds, hand:[x,y] (Tony units; shoulder is 126,153; reach ~36), behind:0/1,
      head, px, py (pupils), brow (raise), jaw, beam (0..1), rot (prop spin), event:'name', hold:true}
   Channels left out of a key are interpolated from the keys around it (smooth ease).
*/
const TonyActs=(function(){
  const HIP=[114,195],SIDE=[150,182];
  const actions={
    inspect:{keys:[
      {t:0,hand:HIP,behind:1,head:0,px:0,py:0,brow:0,beam:0,rot:0},
      {t:.45,hand:SIDE,behind:1},
      {t:.5,behind:0,event:'out'},
      {t:1.0,hand:[154,135],head:.12,px:2.6,py:2.6,brow:.25},
      {t:1.2,beam:0},{t:1.32,beam:1,event:'lightOn'},
      {t:1.9,rot:.4},{t:2.6,rot:-.35},{t:3.1,rot:.1,event:'peak',hold:true},
      {t:3.5,beam:1},{t:3.7,beam:0,event:'lightOff'},
      {t:3.9,hand:[154,135],head:.12,px:2.6,py:2.6,brow:.25},
      {t:4.3,hand:SIDE,head:0,px:0,py:0,brow:0,rot:0},
      {t:4.32,behind:0},{t:4.36,behind:1},
      {t:4.7,hand:HIP,event:'away'}
    ]},
    present:{keys:[
      {t:0,hand:HIP,behind:1,head:0,px:0,py:0,brow:0,jaw:0,rot:0},
      {t:.45,hand:SIDE,behind:1},
      {t:.5,behind:0,event:'out'},
      {t:.95,hand:[156,130],head:-.04,brow:.35,jaw:.3,rot:-.12},
      {t:1.1,event:'peak'},
      {t:2.4,hand:[156,130],jaw:.3,brow:.35,rot:-.12,hold:true},
      {t:2.8,hand:SIDE,head:0,brow:0,jaw:0,rot:0},
      {t:2.82,behind:0},{t:2.86,behind:1},
      {t:3.2,hand:HIP,event:'away'}
    ]}
  };
  const ease=x=>x<=0?0:x>=1?1:x*x*(3-2*x);
  const STEP={behind:1};
  function sample(keys,ch,t){
    let a=null,b=null;
    for(const k of keys){if(k[ch]===undefined)continue;if(k.t<=t)a=k;else{b=k;break;}}
    if(!a)return b?b[ch]:undefined;
    if(!b||STEP[ch])return a[ch];
    const u=ease((t-a.t)/(b.t-a.t)),va=a[ch],vb=b[ch];
    return Array.isArray(va)?va.map((v,i)=>v+(vb[i]-v)*u):va+(vb-va)*u;
  }
  function player(){
    let cur=null;
    return {
      play(name,opts){const a=actions[name];if(!a)throw new Error('No Tony action: '+name);
        const keys=a.keys.slice().sort((x,y)=>x.t-y.t);
        cur={keys,opts:opts||{},start:null,last:-1,held:0,end:keys[keys.length-1].t,released:false};},
      busy(){return !!cur;},
      release(){if(cur)cur.released=true;},
      stop(){if(cur){const d=cur.opts.onDone;cur=null;d&&d();}},
      apply(P,now){
        if(!cur)return P;
        if(cur.start===null)cur.start=now;
        let t=now-cur.start-cur.held;
        const hk=cur.opts.hold&&!cur.released&&cur.keys.find(k=>k.hold&&k.t<=t&&cur.last<k.t+1e-9);
        if(hk){cur.held+=t-hk.t;t=hk.t;}
        for(const k of cur.keys)if(k.event&&k.t>cur.last&&k.t<=t){const f=cur.opts.on&&cur.opts.on[k.event];f&&f();}
        cur.last=t;
        const K=cur.keys,v=ch=>sample(K,ch,t);
        const hand=v('hand');if(hand)P.armR=Tony.reach('R',hand[0],hand[1]);
        const head=v('head');if(head!==undefined)P.head=(P.head||0)*.3+head;
        const px=v('px'),py=v('py');if(px!==undefined)P.pupil=[px,py||0];
        const br=v('brow');if(br!==undefined){P.browL=-br;P.browR=br;}
        const jaw=v('jaw');if(jaw!==undefined)P.jaw=Math.max(P.jaw||0,jaw);
        P.beam=v('beam')||0;
        if(cur.opts.prop)P.prop={draw:cur.opts.prop.draw,side:'R',behind:!!v('behind'),rot:v('rot')||0,at:cur.opts.prop.at,upright:cur.opts.prop.upright};
        if(t>=cur.end){const d=cur.opts.onDone;cur=null;d&&d();}
        return P;
      }
    };
  }
  return {player,actions};
})();

/* ---------- Props Tony can hold ----------
   Each returns {draw(ctx,{lit}), at?, upright?}. upright keeps it level however the hand turns. Drawn centred on (0,0) in Tony units; lit (0..1) is how
   strongly the headlamp is on it.
     TonyProps.rock({color, dark, light, speck, r, seed})   a lumpy rock (defaults: brown)
     TonyProps.card(text, {color, ink})                      an answer card for quiz apps
*/
const TonyProps=(function(){
  const INK='#2d2452',TAU=Math.PI*2;
  function rock(o){
    o=o||{};const r=o.r||16,seed=o.seed||3;
    const base=o.color||'#8a5a3b',dark=o.dark||'#5e3b24',light=o.light||'#b9875f',speck=o.speck||'#4a2e1c';
    const pts=[];for(let i=0;i<9;i++){const a=i/9*TAU+.3,k=.8+.2*Math.abs(Math.sin(seed*7.3+i*2.1));pts.push([Math.cos(a)*r*k*1.12,Math.sin(a)*r*k*.92]);}
    const path=new Path2D();
    pts.forEach((p,i)=>{const q=pts[(i+1)%pts.length],m=[(p[0]+q[0])/2,(p[1]+q[1])/2];if(i===0){const z=pts[pts.length-1];path.moveTo((z[0]+p[0])/2,(z[1]+p[1])/2);}path.quadraticCurveTo(p[0],p[1],m[0],m[1]);});
    path.closePath();
    const spots=[];for(let i=0;i<(o.spots||6);i++){const a=seed*3.1+i*2.4,d=r*.55*Math.abs(Math.sin(seed+i*1.7));spots.push([Math.cos(a)*d,Math.sin(a)*d*.8,.7+.5*Math.abs(Math.cos(i*3.3+seed))]);}
    return {draw(ctx,s){
      ctx.save();ctx.fillStyle=base;ctx.fill(path);
      ctx.save();ctx.clip(path);
      ctx.fillStyle=dark;ctx.beginPath();ctx.ellipse(r*.45,r*.5,r*.9,r*.6,-.4,0,TAU);ctx.fill();
      ctx.fillStyle=light;ctx.beginPath();ctx.ellipse(-r*.4,-r*.45,r*.45,r*.25,-.5,0,TAU);ctx.fill();
      ctx.fillStyle=speck;spots.forEach(p=>{ctx.beginPath();ctx.arc(p[0],p[1],p[2],0,TAU);ctx.fill();});
      if(s&&s.lit>0){const g=ctx.createRadialGradient(-r*.2,-r*.3,0,0,0,r*1.3);g.addColorStop(0,`rgba(255,248,200,${.75*s.lit})`);g.addColorStop(1,'rgba(255,248,200,0)');ctx.fillStyle=g;ctx.fillRect(-r*2,-r*2,r*4,r*4);}
      ctx.restore();
      ctx.lineWidth=2.2;ctx.lineJoin='round';ctx.strokeStyle=INK;ctx.stroke(path);ctx.restore();
    }};
  }
  function card(text,o){
    o=o||{};const w=Math.max(22,text.length*5.2+8),h=15;
    return {at:[11,-3],upright:true,draw(ctx,s){
      ctx.save();ctx.translate(0,-h/2-4);
      ctx.beginPath();ctx.roundRect?ctx.roundRect(-w/2,-h/2,w,h,3):ctx.rect(-w/2,-h/2,w,h);
      ctx.fillStyle=o.color||'#ffffff';ctx.fill();ctx.lineWidth=2;ctx.strokeStyle=INK;ctx.stroke();
      ctx.fillStyle=o.ink||INK;ctx.font='700 9px Fredoka, Nunito, sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,0,.5);
      ctx.restore();
    }};
  }
  return {rock,card};
})();
