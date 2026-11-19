/* Tony Bony canvas rig (from Tony's Science Trivia / Bomb Squad) + miner hat, held props, headlamp beam.
   Pose flags: hat, comb ('wide'), hatTurn, hatSide, hatTilt, prop, beam. Exposes Tony.draw, poses, Tony.reach.
   © 2026 S. Kahler Teaching */
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));const TAU=Math.PI*2;
function rr(ctx,x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();}
const Tony=(function(){
  const INK='#2d2452',BONE='#fff6e4',BONE2='#e9dcc3';
  const L1=Math.hypot(11,10.5),L2=Math.hypot(15,14.5),R1=Math.hypot(10,11.5),R2=Math.hypot(14,15.5);
  const B={L1:Math.atan2(-10.5,-11),L2:Math.atan2(-14.5,-15),R1:Math.atan2(11.5,10),R2:Math.atan2(15.5,14)};
  const wrap=a=>{while(a>Math.PI)a-=TAU;while(a<-Math.PI)a+=TAU;return a;};
  function reach(side,tx,ty){
    const Ls=side==='L',S=Ls?[74,153]:[126,153],l1=Ls?L1:R1,l2=Ls?L2:R2,b1=Ls?B.L1:B.R1,b2=Ls?B.L2:B.R2;
    let dx=tx-S[0],dy=ty-S[1],d=Math.hypot(dx,dy)||1;const dd=clamp(d,Math.abs(l1-l2)+.1,l1+l2-.05);dx*=dd/d;dy*=dd/d;
    const base=Math.atan2(dy,dx),al=Math.acos(clamp((l1*l1+dd*dd-l2*l2)/(2*l1*dd),-1,1));
    const c=[base+al,base-al],e1=Math.sin(c[0]),e2=Math.sin(c[1]),a=e1>e2?c[0]:c[1];
    const ex=S[0]+Math.cos(a)*l1,ey=S[1]+Math.sin(a)*l1,d2=Math.atan2(S[1]+dy-ey,S[0]+dx-ex);
    const a1=wrap(a-b1);return [a1,wrap(d2-b2-a1),0];
  }
  const RIBS=['M95 152 C88 149 76 149 73 158 C72 161 72.5 164 74.5 166','M95 165 C88 162 76 162 73 171 C72 174 72.5 177 74.5 179','M95 178 C88 175 76 175 73 184 C72 187 72.5 190 74.5 192'].map(d=>new Path2D(d));
  const RIB4=new Path2D('M91 189 C86 187 81 188 79 192');
  const CRANIUM=new Path2D('M100 28 C126 28 142 42 142 64 C142 84 134 104 124 120 L76 120 C66 104 58 84 58 64 C58 42 74 28 100 28 Z');
  const NOSE=new Path2D('M100 97 L94 107 C92 111 97 113 100 109 C103 113 108 111 106 107 Z');
  const PELVIS=new Path2D('M72 194 Q80 187 92 193 L108 193 Q120 187 128 194 Q132 204 122 208 Q112 206 106 200 L94 200 Q88 206 78 208 Q68 204 72 194Z');
  const JAW=new Path2D('M76 124 L124 124 C123 132 119 140 111 142 L89 142 C81 140 77 132 76 124 Z');
  const TINT=new Path2D('M74 150 Q100 140 126 150 Q132 172 124 194 Q100 200 76 194 Q68 172 74 150 Z');
  function smudge(ctx,x,y,r,a){const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(28,22,24,${a})`);g.addColorStop(.6,`rgba(28,22,24,${a*.55})`);g.addColorStop(1,'rgba(28,22,24,0)');
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();}
  function ln(ctx,a,b,c,d,col,w){ctx.strokeStyle=col;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(a,b);ctx.lineTo(c,d);ctx.stroke();}
  function bone(ctx,a,b,c,d,w){ln(ctx,a,b,c,d,INK,w);ln(ctx,a,b,c,d,BONE,w/2);}
  function joint(ctx,x,y){ctx.beginPath();ctx.arc(x,y,3.4,0,TAU);ctx.fillStyle=BONE;ctx.fill();ctx.lineWidth=2.2;ctx.strokeStyle=INK;ctx.stroke();}
  function rot(ctx,p,a){ctx.translate(p[0],p[1]);ctx.rotate(a);ctx.translate(-p[0],-p[1]);}
  function handG(ctx,w,tips){tips.forEach(t=>ln(ctx,w[0],w[1],t[0],t[1],INK,5.6));tips.forEach(t=>ln(ctx,w[0],w[1],t[0],t[1],BONE,2.2));
    ctx.beginPath();ctx.arc(w[0],w[1],5,0,TAU);ctx.fillStyle=BONE;ctx.fill();ctx.lineWidth=2.4;ctx.strokeStyle=INK;ctx.stroke();}
  function leg(ctx,side,a1,a2){
    const L=side==='L',hip=L?[88,204]:[112,204],kn=L?[87,222]:[113,222],an=L?[86,240]:[114,240],ft=L?82:118;
    ctx.save();rot(ctx,hip,a1);bone(ctx,hip[0],hip[1],kn[0],kn[1],9);
    ctx.save();rot(ctx,kn,a2);bone(ctx,kn[0],kn[1],an[0],an[1],9);
    ctx.beginPath();ctx.ellipse(ft,243.5,8.5,4.2,0,0,TAU);ctx.fillStyle=BONE;ctx.fill();ctx.lineWidth=2.6;ctx.strokeStyle=INK;ctx.stroke();joint(ctx,kn[0],kn[1]);
    ctx.restore();ctx.restore();
  }

  // ---- held props + headlamp beam ----
  // A pose may carry P.prop = {draw(ctx,{lit}), side:'R', behind:bool, rot, at:[dx,dy], upright:bool, lit:0..1}
  // and P.beam = 0..1 (needs the hat's headlamp). The prop is drawn centred at its own (0,0),
  // in Tony's units (his skull is about 84 wide), offset from the wrist by `at`.
  let CUR=null,HAND=null,LAMP=null;
  function propAt(ctx,pr,wr){const at=pr.at||[7,7];ctx.save();ctx.translate(wr[0]+at[0],wr[1]+at[1]);if(pr.upright){const m=ctx.getTransform();ctx.rotate(-Math.atan2(m.b,m.a));}ctx.rotate(pr.rot||0);pr.draw(ctx,{lit:pr.lit||0});ctx.restore();}
  function frontProp(ctx,P){
    const pr=P.prop;if(!pr||pr.behind||!HAND)return;
    const at=pr.at||[7,7],b=Math.max(0,Math.min(1,P.beam||0));
    if(b>0&&LAMP){
      const a=LAMP.M.transformPoint(new DOMPoint(LAMP.x,LAMP.y)),c=HAND.M.transformPoint(new DOMPoint(HAND.wr[0]+at[0],HAND.wr[1]+at[1]));
      const sc=Math.hypot(HAND.M.a,HAND.M.b),dx=c.x-a.x,dy=c.y-a.y,len=Math.hypot(dx,dy)||1,nx=-dy/len,ny=dx/len,w0=4*sc,w1=19*sc;
      ctx.save();ctx.setTransform(1,0,0,1,0,0);
      const cone=(wa,wb)=>{ctx.beginPath();ctx.moveTo(a.x+nx*wa,a.y+ny*wa);ctx.lineTo(c.x+nx*wb,c.y+ny*wb);ctx.lineTo(c.x-nx*wb,c.y-ny*wb);ctx.lineTo(a.x-nx*wa,a.y-ny*wa);ctx.closePath();};
      // outer beam
      let g=ctx.createLinearGradient(a.x,a.y,c.x,c.y);g.addColorStop(0,`rgba(255,236,120,${.95*b})`);g.addColorStop(1,`rgba(255,236,120,${.6*b})`);
      cone(w0,w1);ctx.fillStyle=g;ctx.fill();
      ctx.lineWidth=1.4*sc;ctx.strokeStyle=`rgba(232,170,20,${.85*b})`;ctx.stroke();
      // bright core
      g=ctx.createLinearGradient(a.x,a.y,c.x,c.y);g.addColorStop(0,`rgba(255,255,240,${.95*b})`);g.addColorStop(1,`rgba(255,255,235,${.35*b})`);
      cone(w0*.45,w1*.45);ctx.fillStyle=g;ctx.fill();
      // lamp flare
      g=ctx.createRadialGradient(a.x,a.y,0,a.x,a.y,12*sc);g.addColorStop(0,`rgba(255,255,235,${b})`);g.addColorStop(1,'rgba(255,240,150,0)');
      ctx.fillStyle=g;ctx.beginPath();ctx.arc(a.x,a.y,12*sc,0,TAU);ctx.fill();
      ctx.restore();
    }
    ctx.save();ctx.setTransform(HAND.M);propAt(ctx,Object.assign({},pr,{lit:b}),HAND.wr);handG(ctx,HAND.wr,HAND.tips);ctx.restore();
    if(b>0&&LAMP){const c=HAND.M.transformPoint(new DOMPoint(HAND.wr[0]+at[0],HAND.wr[1]+at[1])),sc=Math.hypot(HAND.M.a,HAND.M.b);
      ctx.save();ctx.setTransform(1,0,0,1,0,0);const g=ctx.createRadialGradient(c.x,c.y,0,c.x,c.y,22*sc);g.addColorStop(0,`rgba(255,250,200,${.5*b})`);g.addColorStop(1,'rgba(255,250,200,0)');
      ctx.fillStyle=g;ctx.beginPath();ctx.arc(c.x,c.y,22*sc,0,TAU);ctx.fill();ctx.restore();}
  }
  function arm(ctx,side,A){
    const L=side==='L',sh=L?[74,153]:[126,153],el=L?[63,142.5]:[136,164.5],wr=L?[48,128]:[150,180];
    const tips=L?[[38.2,125.9],[40.8,121.1],[45.5,118.3]]:[[159.6,182.9],[156.6,187.5],[151.8,189.8]];
    ctx.save();rot(ctx,sh,A[0]);bone(ctx,sh[0],sh[1],el[0],el[1],9);
    ctx.save();rot(ctx,el,A[1]);bone(ctx,el[0],el[1],wr[0],wr[1],9);
    ctx.save();rot(ctx,wr,A[2]);
    const pr=CUR&&CUR.prop;if(pr&&(pr.side||'R')===side){HAND={M:ctx.getTransform(),wr,tips};if(pr.behind)propAt(ctx,pr,wr);}
    handG(ctx,wr,tips);ctx.restore();
    joint(ctx,el[0],el[1]);ctx.restore();ctx.restore();
  }
  function torso(ctx){
    for(let i=0;i<6;i++){rr(ctx,95,147+8*i,10,6.5,3);ctx.fillStyle=BONE2;ctx.fill();ctx.lineWidth=1.8;ctx.strokeStyle=INK;ctx.stroke();}
    ctx.globalAlpha=.28;ctx.fillStyle=BONE;ctx.fill(TINT);ctx.globalAlpha=1;
    ctx.fillStyle=BONE;ctx.fill(PELVIS);ctx.lineWidth=2.6;ctx.lineJoin='round';ctx.strokeStyle=INK;ctx.stroke(PELVIS);
    ctx.lineCap='round';
    for(const flip of [0,1]){
      ctx.save();if(flip){ctx.translate(200,0);ctx.scale(-1,1);}
      RIBS.forEach(p=>{ctx.strokeStyle=INK;ctx.lineWidth=7.6;ctx.stroke(p);ctx.strokeStyle=BONE;ctx.lineWidth=3.6;ctx.stroke(p);});
      ctx.strokeStyle=INK;ctx.lineWidth=7.2;ctx.stroke(RIB4);ctx.strokeStyle=BONE;ctx.lineWidth=3.2;ctx.stroke(RIB4);ctx.restore();
    }
    rr(ctx,95.5,147,9,26,4.5);ctx.fillStyle=BONE;ctx.fill();ctx.lineWidth=2.2;ctx.strokeStyle=INK;ctx.stroke();
  }
  function neck(ctx){
    for(let i=0;i<3;i++){rr(ctx,94,126+8*i,12,7,3);ctx.fillStyle=BONE2;ctx.fill();ctx.lineWidth=2;ctx.strokeStyle=INK;ctx.stroke();}
    ctx.lineCap='round';ln(ctx,98,147,73,151,INK,10.5);ln(ctx,98,147,73,151,BONE,4.5);ln(ctx,102,147,127,151,INK,10.5);ln(ctx,102,147,127,151,BONE,4.5);
  }
  // bomb-squad harness (red straps + gold buckle)
  function harness(ctx){ctx.lineCap='round';
    for(const p of [[[80,150],[120,198]],[[120,150],[80,198]]]){ln(ctx,p[0][0],p[0][1],p[1][0],p[1][1],INK,7.5);ln(ctx,p[0][0],p[0][1],p[1][0],p[1][1],'#e5232f',4.2);}
    ctx.beginPath();ctx.arc(100,174,4.4,0,TAU);ctx.fillStyle='#ffd166';ctx.fill();ctx.lineWidth=2;ctx.strokeStyle=INK;ctx.stroke();}

  // classic miner's hard hat with headlamp (drawn in head space, so it nods with Tony)
  // Seen straight on but from slightly above: the visor dips toward the viewer in the middle.
  const HAT_Y='#f5b919',HAT_D='#d99a07',HAT_L='#ffe07a';
  // comb styles: [fin above the crown, comb face on the dome, groove lines]
  const COMBS={
    round:['M91 24 C91 6 94 -1 100 -1 C106 -1 109 6 109 24 Z','M92.5 10.5 C94 4 106 4 107.5 10.5 L108.5 44 L91.5 44 Z',0],
    flat:['M91 24 L91 4 Q91 1 94 1 L106 1 Q109 1 109 4 L109 24 Z','M92.5 8.5 L107.5 8.5 L108.5 44 L91.5 44 Z',0],
    wide:['M88 24 L88 6.5 Q88 4 90.5 4 L109.5 4 Q112 4 112 6.5 L112 24 Z','M89.5 9 L110.5 9 L111 44 L89 44 Z',0,[112,5],[110.5,9,111,44]],
    taper:['M88.5 24 L92 2.5 Q92.4 1 94 1 L106 1 Q107.6 1 108 2.5 L111.5 24 Z','M92.2 8.5 L107.8 8.5 L110 44 L90 44 Z',0],
    ribbed:['M90 24 L90 3.5 Q90 1 92.5 1 L107.5 1 Q110 1 110 3.5 L110 24 Z','M91.5 8.5 L108.5 8.5 L109.5 44 L90.5 44 Z',1]
  };
  const COMBP={};for(const k in COMBS)COMBP[k]=[new Path2D(COMBS[k][0]),new Path2D(COMBS[k][1]),COMBS[k][2],COMBS[k][3],COMBS[k][4]];
  const DOME=new Path2D('M58 54 C56 27 76 9 100 9 C124 9 144 27 142 54 Z');

  const BRIM=new Path2D('M53 51 Q100 44 147 51 Q151.5 55.5 146 58.5 Q100 63 54 58.5 Q48.5 55.5 53 51 Z');
  function mineHat(ctx,P){
    ctx.save();ctx.lineJoin='round';ctx.lineCap='round';
    ctx.translate(0,-3);  // sit high enough that the brows show under the visor
    if(P.hatTilt){const pv=P.hatPivot||[100,52];ctx.translate(pv[0],pv[1]);ctx.rotate(P.hatTilt);ctx.translate(-pv[0],-pv[1]);}
    const TN=P.hatTurn||0;  // negative = front of hat turned toward Tony's right (viewer's left)
    // raised comb peeking above the crown
    const CB=COMBP[P.comb||'flat'],FIN=CB[0],COMB=CB[1];
    const SW=P.hatSide&&TN<0?-TN*.55:0;  // width of the comb's visible side when turned
    ctx.save();ctx.translate(TN,0);
    if(SW&&CB[3]){const f=CB[3];ctx.beginPath();ctx.moveTo(f[0]-2,f[1]-1);ctx.lineTo(f[0]+SW-2,f[1]-1);ctx.quadraticCurveTo(f[0]+SW,f[1]-1,f[0]+SW,f[1]+1.5);ctx.lineTo(f[0]+SW,24);ctx.lineTo(f[0],24);ctx.closePath();
      ctx.fillStyle='#b27a04';ctx.fill();ctx.lineWidth=3;ctx.strokeStyle=INK;ctx.stroke();}
    ctx.fillStyle=HAT_D;ctx.fill(FIN);ctx.lineWidth=3;ctx.strokeStyle=INK;ctx.stroke(FIN);ctx.restore();
    // dome
    ctx.fillStyle=HAT_Y;ctx.fill(DOME);
    ctx.save();ctx.clip(DOME);
    ctx.fillStyle=HAT_D;ctx.beginPath();ctx.ellipse(135-TN*.25,42,17-TN*.35,34,-.15,0,TAU);ctx.fill();
    ctx.fillStyle=HAT_L;ctx.beginPath();ctx.ellipse(73+TN*.35,28,7.5,14,.55,0,TAU);ctx.fill();
    ctx.restore();
    ctx.lineWidth=3;ctx.strokeStyle=INK;ctx.stroke(DOME);
    // comb running down the front of the dome
    ctx.save();ctx.clip(DOME);ctx.translate(TN,0);
    if(SW&&CB[4]){const e=CB[4];ctx.beginPath();ctx.moveTo(e[0],e[1]);ctx.lineTo(e[0]+SW,e[1]+1);ctx.lineTo(e[2]+SW*.55,e[3]);ctx.lineTo(e[2],e[3]);ctx.closePath();
      ctx.fillStyle='#b27a04';ctx.fill();ctx.lineWidth=2;ctx.strokeStyle=INK;ctx.stroke();}
    ctx.fillStyle=HAT_Y;ctx.fill(COMB);ctx.lineWidth=2.4;ctx.stroke(COMB);
    ctx.strokeStyle=HAT_L;ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(97,9);ctx.lineTo(96.5,22);ctx.stroke();
    if(CB[2]){ctx.strokeStyle=HAT_D;ctx.lineWidth=1.8;ctx.beginPath();ctx.moveTo(95,11);ctx.lineTo(94.6,22);ctx.moveTo(105,11);ctx.lineTo(105.4,22);ctx.stroke();}
    ctx.restore();
    // headband strap
    ctx.beginPath();ctx.moveTo(58,45);ctx.quadraticCurveTo(100+TN,36,142,45);ctx.lineTo(142.5,51.5);ctx.quadraticCurveTo(100+TN,43,57.5,51.5);ctx.closePath();
    ctx.fillStyle='#2b2733';ctx.fill();ctx.lineWidth=2;ctx.strokeStyle=INK;ctx.stroke();
    // short visor brim
    const BR=TN?new Path2D(`M53 51 Q${100+TN} 44 147 51 Q151.5 55.5 146 58.5 Q${100+TN} 63 54 58.5 Q48.5 55.5 53 51 Z`):BRIM;
    ctx.fillStyle=HAT_Y;ctx.fill(BR);ctx.lineWidth=3;ctx.strokeStyle=INK;ctx.stroke(BR);
    ctx.strokeStyle=HAT_D;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(57,56);ctx.quadraticCurveTo(100+TN,51,143,56);ctx.stroke();
    // lamp glow, mount, rim, lens
    ctx.save();ctx.translate(TN,0);
    const g=ctx.createRadialGradient(100,33,4,100,33,28);g.addColorStop(0,'rgba(255,246,170,.85)');g.addColorStop(1,'rgba(255,246,170,0)');
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(100,33,28,0,TAU);ctx.fill();
    if(TN){ctx.translate(100,35);ctx.scale(1+TN/90,1);ctx.translate(-100,-35);}  // lamp foreshortens as it turns
    rr(ctx,89.5,38,21,9,3);ctx.fillStyle='#5d6478';ctx.fill();ctx.lineWidth=2;ctx.strokeStyle=INK;ctx.stroke();
    ctx.beginPath();ctx.arc(100,31.5,11,0,TAU);ctx.fillStyle='#aeb6c7';ctx.fill();ctx.lineWidth=2.6;ctx.stroke();
    ctx.beginPath();ctx.arc(100,31.5,7.2,0,TAU);ctx.fillStyle='#fff7c2';ctx.fill();ctx.lineWidth=1.6;ctx.stroke();
    ctx.fillStyle='#ffffff';ctx.beginPath();ctx.arc(97.4,29,2.3,0,TAU);ctx.fill();
    LAMP={M:ctx.getTransform(),x:100,y:31.5};
    ctx.restore();
    ctx.restore();
  }
  function head(ctx,P){
    ctx.save();rot(ctx,[100,140],P.head||0);
    const jd=(P.jaw||0)*26;ctx.fillStyle=INK;ctx.fillRect(76,118,48,7+jd);
    ctx.fillStyle=BONE;ctx.fill(CRANIUM);
    if(P.soot){ctx.save();ctx.clip(CRANIUM);[[66,60,24,.85],[88,42,18,.6],[133,76,20,.8],[108,34,15,.5],[124,104,15,.7],[72,102,13,.55],[100,92,10,.4],[140,52,12,.5]].forEach(b=>smudge(ctx,b[0],b[1],b[2],b[3]));ctx.restore();}
    ctx.lineWidth=3;ctx.lineJoin='round';ctx.strokeStyle=INK;ctx.stroke(CRANIUM);
    ctx.lineCap='round';ctx.strokeStyle='#cdb994';ctx.lineWidth=2.6;ctx.beginPath();ctx.moveTo(59,52);ctx.quadraticCurveTo(100,37,141,52);ctx.stroke();
    ctx.strokeStyle='#d9c9ac';ctx.lineWidth=2;ctx.beginPath();[82.5,89.5,96.5,103.5,110.5,117.5].forEach(x=>{ctx.moveTo(x,113);ctx.lineTo(x,119);});ctx.stroke();
    ctx.fillStyle=INK;ctx.beginPath();ctx.ellipse(81,84,14,15,0,0,TAU);ctx.ellipse(119,84,14,15,0,0,TAU);ctx.fill();
    ctx.fillStyle=INK;ctx.fill(NOSE);ctx.lineWidth=1.5;ctx.strokeStyle=INK;ctx.stroke(NOSE);
    ctx.strokeStyle=BONE;ctx.lineWidth=1.1;ctx.beginPath();ctx.moveTo(100,104.8);ctx.lineTo(100,111);ctx.stroke();
    ctx.fillStyle=BONE;ctx.beginPath();ctx.moveTo(98.9,111.4);ctx.lineTo(101.1,111.4);ctx.lineTo(100,109.6);ctx.closePath();ctx.fill();
    ctx.globalAlpha=.75;ctx.fillStyle='#ff8fb5';ctx.beginPath();ctx.ellipse(77,105,4.5,2.8,0,0,TAU);ctx.ellipse(123,105,4.5,2.8,0,0,TAU);ctx.fill();ctx.globalAlpha=1;
    ctx.save();ctx.translate(0,jd);ctx.fillStyle=BONE;ctx.fill(JAW);ctx.lineWidth=3;ctx.strokeStyle=INK;ctx.stroke(JAW);
    ctx.strokeStyle='#d9c9ac';ctx.lineWidth=2;ctx.beginPath();[[82.5,5],[89.5,7],[96.5,7],[103.5,7],[110.5,7],[117.5,5]].forEach(a=>{ctx.moveTo(a[0],125);ctx.lineTo(a[0],125+a[1]);});ctx.stroke();ctx.restore();
    if(!P.hat){ln(ctx,100,33,100,25,INK,6);ctx.beginPath();ctx.arc(100,20,5,0,TAU);ctx.lineWidth=6;ctx.strokeStyle=INK;ctx.stroke();
    ln(ctx,100,33,100,25,'#a9b1c4',2.8);ctx.beginPath();ctx.arc(100,20,5,0,TAU);ctx.lineWidth=2.8;ctx.strokeStyle='#a9b1c4';ctx.stroke();}
    const pu=P.pupil||[0,0],ps=P.pupilScale||1;
    [[81,83,78.8,82.5],[119,83,116.8,117.5]].forEach(e=>{
      ctx.beginPath();ctx.arc(e[0],e[1],12.5,0,TAU);ctx.fillStyle='#d3d8ec';ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle=INK;ctx.stroke();
      ctx.beginPath();ctx.arc(e[2],80.5,9.8,0,TAU);ctx.fillStyle='#fff';ctx.fill();
      ctx.save();ctx.translate(e[3]+pu[0],85+pu[1]);ctx.rotate(-.26);ctx.beginPath();ctx.ellipse(0,0,4.2*ps,3.86*ps,0,0,TAU);ctx.fillStyle='#1b1730';ctx.fill();ctx.restore();
    });
    ctx.lineCap='round';ctx.strokeStyle=INK;ctx.lineWidth=3;
    ctx.save();rot(ctx,[81,62],P.browL||0);ctx.beginPath();ctx.moveTo(75,62.5);ctx.lineTo(87,61.5);ctx.stroke();ctx.restore();
    ctx.save();rot(ctx,[119,62],P.browR||0);ctx.beginPath();ctx.moveTo(125,62.5);ctx.lineTo(113,61.5);ctx.stroke();ctx.restore();
    if(P.hat)mineHat(ctx,P);
    ctx.restore();
  }
  function blank(){return {lean:0,head:0,jaw:0,pupil:[0,0],pupilScale:1,browL:0,browR:0,legL:[0,0],legR:[0,0],armL:[0,0,0],armR:[0,0,0],harness:false,hat:true,comb:'wide',hatTurn:-7,hatSide:true};}
  function idle(t){const P=blank();P.armL=[Math.sin(t*1.4)*.08+.1,.5,0];P.head=Math.sin(t*1.7)*.05;P.lean=Math.sin(t*1.3)*.015;
    P.jaw=.04+Math.max(0,Math.sin(t*2.1))*.05;P.pupil=[Math.sin(t*.8)*2,Math.cos(t*.6)];return P;}
  function talk(t){const P=idle(t);P.jaw=.1+Math.abs(Math.sin(t*11))*.22;P.armR=[-.35+Math.sin(t*3)*.15,-.5,0];return P;}
  function wave(t){const P=blank();P.armL=[Math.sin(t*3.4)*.1,Math.sin(t*7)*.55,Math.sin(t*7)*.3];P.head=Math.sin(t*1.7)*.05;P.jaw=.08;P.pupil=[Math.sin(t*.8)*2,0];return P;}
  function cheer(t){const P=blank(),w=Math.sin(t*13);
    P.armL=[w*.15,w*.45,w*.3];P.armR=[-1.62-w*.15,-w*.45,-w*.3];P.head=Math.sin(t*6)*.08;P.jaw=.4+.12*Math.sin(t*14);P.browL=-.2;P.browR=.2;P.pupil=[0,-2];return P;}
  function nervous(t){const P=blank();P.jaw=.12+Math.abs(Math.sin(t*38))*.1;P.pupil=[Math.sin(t*41)*1.2,1+Math.cos(t*37)];P.pupilScale=.8;P.browL=-.3;P.browR=.3;
    P.legL=[.12+Math.sin(t*30)*.06,0];P.legR=[-.12-Math.sin(t*30)*.06,0];P.armL=[.3,.9,.2];P.armR=[-.3,-.9,-.2];P.head=Math.sin(t*25)*.02;return P;}
  function sooty(t){const P=blank();P.soot=true;P.jaw=.45;P.pupilScale=.55;P.pupil=[Math.cos(t*4)*2.5,Math.sin(t*4)*2.5];P.head=Math.sin(t*1.5)*.12;
    P.armL=[.6,.3,0];P.armR=[-.6,-.3,0];P.browL=.25;P.browR=-.25;return P;}
  function draw(ctx,o){
    const P=o.pose;CUR=P;HAND=null;LAMP=null;
    ctx.save();ctx.translate(o.x,o.y);ctx.scale(o.s,o.s);ctx.translate(-100,-247);
    ctx.lineCap='round';ctx.lineJoin='round';
    leg(ctx,'L',P.legL[0],P.legL[1]);leg(ctx,'R',P.legR[0],P.legR[1]);
    ctx.save();rot(ctx,[100,200],P.lean||0);
    arm(ctx,'L',P.armL);arm(ctx,'R',P.armR);
    torso(ctx);if(P.harness)harness(ctx);neck(ctx);head(ctx,P);
    if(P.soot){[[84,168,12,.4],[117,184,11,.35],[100,200,9,.3]].forEach(b=>smudge(ctx,b[0],b[1],b[2],b[3]));}
    ctx.restore();ctx.restore();
    frontProp(ctx,P);CUR=null;
  }
  function think(t){const P=idle(t);P.armR=reach('R',110,141);P.head=-.08+Math.sin(t*1.2)*.03;P.pupil=[-2.5,-2.5];P.browL=-.18;P.browR=.05;return P;}
  function point(t){const P=idle(t);P.armR=reach('R',176+Math.sin(t*4)*2,128);P.head=.05;P.pupil=[2.5,0];return P;}
  function surprise(t){const P=blank();P.jaw=.5+Math.sin(t*9)*.05;P.browL=-.4;P.browR=.4;P.pupilScale=.6;P.armL=reach('L',58,112);P.armR=reach('R',142,112);P.head=Math.sin(t*20)*.02;return P;}
  return {draw,idle,talk,wave,cheer,nervous,sooty,think,point,surprise,reach};
})();
