"use strict";

function build(p, recorded) {
  const {ball, deck, intake, auger:a, hopper:h, gate:g, head:s}=p;
  const [lo,hi]=ball.diameterMm, r=hi/2, parts=[];
  const ringXY=(cx,cy,z,r,n)=>Array.from({length:n},(_,i)=>{
    const t=2*Math.PI*i/n;
    return [cx+r*Math.cos(t),cy+r*Math.sin(t),z];
  });
  function add(name, vertices, polygons, stage) {
    const faces=polygons.flatMap(poly=>poly.slice(1,-1).map((v,i)=>[poly[0],v,poly[i+2]]));
    let volume=0;
    const edges=new Map();
    for (const [i,j,k] of faces) {
      const [u,v,w]=[vertices[i],vertices[j],vertices[k]];
      const cross=[v[1]*w[2]-v[2]*w[1],v[2]*w[0]-v[0]*w[2],v[0]*w[1]-v[1]*w[0]];
      volume+=u.reduce((sum,value,axis)=>sum+value*cross[axis],0)/6;
      for (const [x,y] of [[i,j],[j,k],[k,i]]) {
        const key=x<y?`${x},${y}`:`${y},${x}`;
        const use=edges.get(key)??[0,0];
        use[0]++;
        use[1]+=x<y?1:-1;
        edges.set(key,use);
      }
    }
    if (Math.abs(volume)<0.001||vertices.some(v=>v.some(x=>!Number.isFinite(x)))||
        [...edges.values()].some(([count,orientation])=>count!==2||orientation!==0)) {
      throw Error(`${name}: offene, degenerierte oder inkonsistent orientierte Geometrie`);
    }
    if (volume<0) for (const f of faces) f.reverse();
    parts.push({name,vertices,faces,stage,volumeMm3:Math.abs(volume)});
  }
  function skin(n, offset1, offset2, faces) {
    for(let i=0;i<n;i++){
      const j=(i+1)%n;
      faces.push([offset1+i,offset1+j,offset2+j,offset2+i]);
    }
  }
  function prism(name,bottom,top,stage) {
    const n=bottom.length;
    const faces=[Array.from({length:n},(_,i)=>n-1-i),Array.from({length:n},(_,i)=>n+i)];
    skin(n,0,n,faces);
    add(name,[...bottom,...top],faces,stage);
  }
  const rect=(x0,x1,y0,y1,z)=>[[x0,y0,z],[x1,y0,z],[x1,y1,z],[x0,y1,z]];
  const box=(name,x0,x1,y0,y1,z0,z1,stage)=>prism(name,rect(x0,x1,y0,y1,z0),rect(x0,x1,y0,y1,z1),stage);
  function beam(name,start,end,width,z0,z1,stage) {
    const [x,y]=start,[X,Y]=end;
    const len=Math.hypot(X-x,Y-y), dx=-(Y-y)/len*width/2,dy=(X-x)/len*width/2;
    const plan=[[x-dx,y-dy],[X-dx,Y-dy],[X+dx,Y+dy],[x+dx,y+dy]];
    prism(name,plan.map(v=>[...v,z0]),plan.map(v=>[...v,z1]),stage);
  }
  function cyl(name,cx,cy,z0,z1,r,stage,n=32) {
    prism(name,ringXY(cx,cy,z0,r,n),ringXY(cx,cy,z1,r,n),stage);
  }
  function cylY(name,x,z,y0,y1,r,stage) {
    const ring=y=>ringXY(x,z,y,r,36).map(([x,z,y])=>[x,y,z]);
    prism(name,ring(y0),ring(y1),stage);
  }
  function shell(name,outerLow,outerHigh,innerLow,innerHigh,stage) {
    const n=outerLow.length,faces=[];
    skin(n,0,n,faces);
    skin(n,n,3*n,faces);
    skin(n,3*n,2*n,faces);
    skin(n,2*n,0,faces);
    add(name,[...outerLow,...outerHigh,...innerLow,...innerHigh],faces,stage);
  }
  function tube(name,x,y,z0,z1,r0,r1,stage) {
    const n=72;
    shell(name,ringXY(x,y,z0,r1,n),ringXY(x,y,z1,r1,n),ringXY(x,y,z0,r0,n),ringXY(x,y,z1,r0,n),stage);
  }
  function partialTube(name,z0,z1,start,end) {
    const n=Math.ceil((end-start)/5);
    const stations=Array.from({length:n+1},(_,i)=>{
      const t=(start+(end-start)*i/n)*Math.PI/180;
      return [ [a.housing,z0], [a.housing+a.wall,z0], [a.housing+a.wall,z1], [a.housing,z1] ]
        .map(([r,z])=>[a.x+r*Math.cos(t),a.y+r*Math.sin(t),z]);
    });
    openSweep(name,stations,"auger-fixed");
  }
  function openSweep(name,stations,stage) {
    const faces=[[0,1,2,3]],last=4*(stations.length-1);
    for(let i=0;i<stations.length-1;i++){
      const o=4*i;
      for(let j=0;j<4;j++){
        const k=(j+1)%4;
        faces.push([o+j,o+4+j,o+4+k,o+k]);
      }
    }
    faces.push([last+3,last+2,last+1,last]);
    add(name,stations.flat(),faces,stage);
  }
  function ramp(name,x0,x1,width,top0,top1,depth,stage) {
    const bottom=rect(x0,x1,-width/2,width/2,0).map(([x,y])=>[x,y,(x===x0?top0:top1)-depth]);
    prism(name,bottom,bottom.map(([x,y,z])=>[x,y,z+depth]),stage);
  }
  function sphere(name,x,y,z,r,stage) {
    const n=32,m=16,vertices=[[x,y,z-r]];
    for(let i=1;i<m;i++){
      const t=Math.PI*i/m;
      vertices.push(...ringXY(x,y,z-r*Math.cos(t),r*Math.sin(t),n));
    }
    vertices.push([x,y,z+r]);
    const faces=[],top=vertices.length-1,upper=top-n;
    for(let j=0;j<n;j++){
      faces.push([0,1+(j+1)%n,1+j],[top,upper+j,upper+(j+1)%n]);
    }
    for(let i=0;i<m-2;i++) skin(n,1+n*i,1+n*(i+1),faces);
    add(name,vertices,faces,stage);
  }

  const hw=deck.width/2, hl=deck.length/2, w=intake.channel/2;
  const top=deck.bottom+deck.thickness, wheelR=recorded.wheel_diameter/2;
  box("01_Grundplatte", -hl,hl,-hw,hw,deck.bottom,top,"frame");
  for (const sign of [-1,1]) {
    const label=sign>0?"links":"rechts";
    const mirror=(near,far)=>sign>0?[near,far]:[-far,-near];
    let [y0,y1]=mirror(hw+3,hw+3+recorded.wheel_width);
    cylY("01_Fahrrad_"+label,intake.axleX,wheelR,y0,y1,wheelR,"drive");
    [y0,y1]=mirror(hw-intake.driveLength,hw);
    cylY("01_Getriebemotor_Bauraum_"+label,intake.axleX,wheelR,y0,y1,intake.driveDiameter/2,"drive");
    [y0,y1]=mirror(hw,hw+11);
    cylY("01_Radnabe_Bauraum_"+label,intake.axleX,wheelR,y0,y1,8,"drive");
    [y0,y1]=mirror(hw-35,hw-8);
    box("01_Motortraeger_"+label,intake.axleX-17,intake.axleX+17,y0,y1,
        wheelR+intake.driveDiameter/2,deck.bottom,"frame");
    const shape=[[-121,w],[51,w],[hl,intake.mouth/2],[hl,intake.mouth/2+intake.wall],
                 [51,w+intake.wall],[-121,w+intake.wall]];
    // Triangulate the guide as two convex prisms that meet at the elbow.
    for (const [suffix,indices] of [["gerade",[0,1,4,5]],["Trichter",[1,2,3,4]]]){
      const points=indices.map(i=>[shape[i][0],sign*shape[i][1]]);
      prism("02_Ballfuehrung_"+label+"_"+suffix,points.map(v=>[...v,5]),
            points.map(v=>[...v,deck.bottom]),"intake");
    }
    [y0,y1]=mirror(89,112);
    box("01_Stuetze_vorn_"+label,79,112,y0,y1,28,deck.bottom,"frame");
    sphere("01_Kugelrolle_Bauraum_"+label,96,sign*100,15,15,"drive");
  }
  // Lower ramp starts on the ground and stays aft of the axle.
  ramp("02_Einlauframpe",-142,-112,82,3,2,2,"intake");
  box("02_Aufnahmetasche_Boden",a.x-34,-142,-41,41,1,3,"intake");
  box("02_Aufnahmetasche_Lippe",a.x-38,a.x-34,-40,40,3,5,"intake");
  box("01_Hecktraeger",-138,-hl,-119,-102,79,90,"frame");
  box("01_Hecktraeger_Querverbinder",-153,-131,-142,-115,79,90,"frame");
  box("01_Hecktraeger_Stuetzarm",-267,-133,-143,-132,57,79,"frame");
  box("01_Heckstuetze",-266,-242,-145,-123,29,57,"frame");
  sphere("01_Kipprolle_Bauraum",-254,-134,16,13,"drive");

  const rotorTop=a.z+a.pitch*a.turns+a.thickness;
  cyl("03_Schneckenwelle",a.x,a.y,3,rotorTop+8,a.core,"rotor",48);
  const count=96*a.turns;
  const flight=Array.from({length:count+1},(_,i)=>{
    const turn=i/96,t=2*Math.PI*turn+Math.PI/2,z=a.z+a.pitch*turn;
    return [[a.core-1.5,0],[a.flight,0],[a.flight,a.thickness],[a.core-1.5,a.thickness]]
      .map(([r,dz])=>[a.x+r*Math.cos(t),a.y+r*Math.sin(t),z+dz]);
  });
  openSweep("03_Schnecke_Windung",flight,"rotor");
  partialTube("03_Mantel_Einlauf",3,80,117,351);
  // The service sector is represented as its own removable shell piece.
  partialTube("03_Mantel_Hauptschale",80,rotorTop-28,117,351);
  partialTube("03_Mantel_Wartungsabdeckung",80,rotorTop-28,351,477);
  partialTube("03_Mantel_Auslauf",rotorTop-28,rotorTop+6,117,351);
  for (const sign of [-1,1]){
    const u=a.x+sign*a.guideX,v=u+sign*6;
    box("03_Vertikalfuehrung_"+sign,Math.min(u,v),Math.max(u,v),
        a.y+a.guideY,a.y+a.housing+2,80,rotorTop-18,"auger-fixed");
  }
  box("03_Wellenlager_Bauraum",a.x-17,a.x+17,a.y-51,a.y-12,rotorTop+3,rotorTop+12,"auger-fixed");
  cyl("03_Getriebemotor_Bauraum",a.x,a.y,rotorTop+12,rotorTop+68,18.5,"auger-drive");
  box("03_Auflager_Schneckenmotor",a.x-24,a.x+24,a.y-47,a.y+13,rotorTop+8,rotorTop+12,"auger-fixed");
  const rimBack=h.topX-h.length/2;
  // Contour the transfer shelf outside the entire rotating cylinder.
  // At the centerline the flight-to-shelf gap is under 4 mm.
  const shelfEnd=rimBack+8;
  for(let y0=-42;y0<42;y0+=6){
    const y1=y0+6;
    const radialY=Math.max(0,y0-a.y,a.y-y1);
    const limit=a.flight+2;
    const x0=a.x+Math.sqrt(Math.max(0,limit**2-radialY**2));
    const topAtStart=rotorTop-2;
    const topAtEnd=rotorTop-7;
    const upper=rect(x0,shelfEnd,y0,y1,0).map(([x,y])=>[x,y,x===x0?topAtStart:topAtEnd]);
    prism("03_Auslaufrutsche_Segment_"+(y0+42),upper.map(([x,y,z])=>[x,y,z-2]),
      upper,"auger-fixed");
  }
  beam("03_Auslaufabstreifer", [a.x-23,29],[a.x-6,-22],4,rotorTop+10,rotorTop+58,"auger-fixed");
  box("03_Auslaufwange_links",a.x-3,rimBack+8,42,45,rotorTop-7,rotorTop+43,"auger-fixed");
  box("03_Auslaufwange_rechts",a.x-3,rimBack+8,-45,-42,rotorTop+2,rotorTop+43,"auger-fixed");

  const q=h.throat/2, wall=h.wall, xl=h.throatX-q, xr=h.throatX+q;
  const rimFront=h.topX+h.length/2, half=h.width/2;
  const throat=z=>rect(xl,xr,-q,q,z);
  shell("04_Trichter_unten",rect(xl-wall,xr+wall,-q-wall,q+wall,h.throatTop),
    rect(rimBack-wall,rimFront+wall,-half-wall,half+wall,h.funnelTop),
    throat(h.throatTop),rect(rimBack,rimFront,-half,half,h.funnelTop),"hopper");
  box("04_Speicher_vorn",rimFront,rimFront+wall,-half,half,h.funnelTop,h.rim,"hopper");
  box("04_Speicher_links",rimBack-wall,rimFront+wall,half,half+wall,h.funnelTop,h.rim,"hopper");
  box("04_Speicher_rechts",rimBack-wall,rimFront+wall,-half-wall,-half,h.funnelTop,h.rim,"hopper");
  box("04_Speicher_hinten_unten",rimBack-wall,rimBack,-half,half,h.funnelTop,rotorTop-10,"hopper");
  for (const sign of [-1,1]){
    const [y0,y1]=sign>0?[45,half]:[-half,-45];
    box("04_Speicher_hinten_oben_"+sign,rimBack-wall,rimBack,y0,y1,rotorTop-10,h.rim,"hopper");
    const [post0,post1]=sign>0?[95,103]:[-103,-95];
    box("04_Trichterstuetze_"+sign,-79,-66,post0,post1,top,h.funnelTop,"frame");
  }

  // Rear-facing gate slots. Lower closed and upper retracted are the rest state.
  box("05_Kanal_Seite_links",xl-wall,xr+wall,q,q+wall,g.lower-g.thickness,h.throatTop,"feed");
  box("05_Kanal_Seite_rechts",xl-wall,xr+wall,-q-wall,-q,g.lower-g.thickness,h.throatTop,"feed");
  box("05_Kanal_vorne",xr,xr+wall,-q,q,g.lower-g.thickness,h.throatTop,"feed");
  box("05_Kanal_hinten_Mitte",xl-wall,xl,-q,q,g.lower,g.upper-g.thickness,"feed");
  box("05_Kanal_hinten_Oben",xl-wall,xl,-q,q,g.upper,h.throatTop,"feed");
  box("05_Untere_Sperre_zu",xl,xr,-q,q,g.lower-g.thickness,g.lower,"gate");
  box("05_Obere_Sperre_offen",xl-g.stroke,xr-g.stroke,-q,q,g.upper-g.thickness,g.upper,"gate");
  for (const [label,z] of [["unten",g.lower],["oben",g.upper]]) {
    box("05_Linearantrieb_Bauraum_"+label,xl-g.stroke-48,xl-g.stroke-4, -13,13,z-13,z+13,"feed");
    for (const sign of [-1,1]){
      const [y0,y1]=sign>0?[q+0.5,q+5]:[-q-5,-q-0.5];
      box("05_Schieberfuehrung_"+label+"_"+sign,xl-g.stroke-6,xl-wall,y0,y1,z-5,z+3,"feed");
    }
  }

  const wr=s.wheelDiameter/2, wheelY=wr+s.compressionGap/2;
  const wz0=s.wheelZ-s.wheelWidth/2, wz1=s.wheelZ+s.wheelWidth/2;
  const motorR=recorded.motor_775_body_diameter/2, motorLength=recorded.motor_775_body_length;
  ramp("06_Zufuehrrampe_am_Kopf",16,s.wheelX,78,154,105,2,"head");
  box("06_Fuehrungsboden_Auslauf",s.wheelX,145,-36,36,103,105,"head");
  box("06_Kopfquertraeger_unten",41,55,-111,111,111,116,"head");
  for(const sign of [-1,1]){
    const y=sign*wheelY;
    cyl("06_Wurfrad_Referenz_"+sign,s.wheelX,y,wz0,wz1,wr,"head-wheel",48);
    cyl("06_775_Motor_"+sign,s.wheelX,y,wz1+3,wz1+3+motorLength,motorR,"head-motor",48);
    cyl("06_Nabe_Bauraum_"+sign,s.wheelX,y,wz1,wz1+3,5,"head");
    tube("06_Radabdeckung_oben_"+sign,s.wheelX,y,wz1,wz1+2,24,38,"head");
    const side=(near,far)=>sign>0?[near,far]:[-far,-near];
    let [y0,y1]=side(105,110);
    box("06_Schutzwange_"+sign,44,136,y0,y1,111,wz1+2,"head");
    [y0,y1]=side(110,123);
    cylY("06_Kippzapfen_"+sign,s.pivot[0],s.pivot[1],y0,y1,5,"head-pivot");
    [y0,y1]=side(114,122);
    box("06_Fester_Lagerbock_"+sign,36,60,y0,y1,top,s.pivot[1]+11,"frame");
    [y0,y1]=side(39,42);
    box("06_Zufuehrwange_"+sign,16,48,y0,y1,130,167,"head");
  }
  box("06_Neigeantrieb_Bauraum",31,63,122,146,114,151,"actuator");
  box("07_Android_Huelle",105,118,-47,47,185,343,"camera");
  box("07_Android_Mast",104,113,-12,12,top,185,"frame");
  box("07_ESP32_Referenz",12,65,-109,-78,top+4,top+18,"electronics");
  box("07_Treiber_Bauraum_links",-52,-19,65,112,top+4,top+24,"electronics");
  box("07_Treiber_Bauraum_rechts",-52,-19,-112,-65,top+4,top+24,"electronics");
  sphere("00_Padelball_Maximalmass_am_Einlass",10,0,r,r,"reference");

  function pitchSpace(diameter) {
    const radius=diameter/2, radial=Math.abs(a.y);
    let low=-Infinity,high=Infinity;
    for(let i=-180;i<=180;i++){
      const theta=Math.PI*i/180;
      const z=a.pitch*i/360;
      for(let j=0;j<=120;j++){
        const rr=a.core+(a.flight-a.core)*j/120;
        const xy2=(rr-radial)**2+2*rr*radial*(1-Math.cos(theta));
        if(xy2<=radius**2){
          const height=Math.sqrt(radius**2-xy2);
          low=Math.max(low,z+a.thickness+height);
          high=Math.min(high,z+a.pitch-height);
        }
      }
    }
    return high-low;
  }
  const selected=parts.filter(p=>p.stage.startsWith("head")&&p.stage!=="head-pivot");
  const tiltVertices=selected.flatMap(p=>p.vertices.map(([x,y,z])=>[x,y,z]));
  let floorGap=Infinity,motorClear=Infinity;
  const [px,pz]=s.pivot;
  for(let i=0;i<=112;i++){
    const degrees=s.tilt[0]+(s.tilt[1]-s.tilt[0])*i/112;
    const t=degrees*Math.PI/180,c=Math.cos(t),sn=Math.sin(t);
    for (const [x,y,z] of tiltVertices) {
      const newX=px+(x-px)*c-(z-pz)*sn;
      const newZ=pz+(x-px)*sn+(z-pz)*c;
      if(Math.abs(newX)<=hl&&Math.abs(y)<=hw) floorGap=Math.min(floorGap,newZ-top);
      if (Math.abs(y)>q+wall) motorClear=Math.min(motorClear,h.throatTop-newZ);
    }
  }
  const transferLane=Math.abs(a.y);
  const transferGap=Math.sqrt((a.flight+2)**2-transferLane**2)-
    Math.sqrt(a.flight**2-transferLane**2);
  const sub=(u,v)=>u.map((x,i)=>x-v[i]);
  const dot=(u,v)=>u.reduce((sum,x,i)=>sum+x*v[i],0);
  const norm2=u=>dot(u,u);
  function segmentDistance2(p,a,b) {
    const edge=sub(b,a), diff=sub(p,a);
    const t=Math.max(0,Math.min(1,dot(diff,edge)/norm2(edge)));
    return norm2(diff.map((x,i)=>x-t*edge[i]));
  }
  function triangleDistance2(p,a,b,c) {
    const u=sub(b,a),v=sub(c,a),w=sub(p,a);
    const uu=norm2(u),vv=norm2(v),uv=dot(u,v),wu=dot(w,u),wv=dot(w,v);
    const determinant=uu*vv-uv*uv;
    const s=(vv*wu-uv*wv)/determinant,t=(uu*wv-uv*wu)/determinant;
    if(s>=0&&t>=0&&s+t<=1) return norm2(w.map((x,i)=>x-s*u[i]-t*v[i]));
    return Math.min(segmentDistance2(p,a,b),segmentDistance2(p,b,c),segmentDistance2(p,c,a));
  }
  const obstacles=parts.filter(v=>["frame","drive","intake","auger-fixed"].includes(v.stage) ||
    v.name==="03_Schneckenwelle").filter(v=>!["02_Einlauframpe","02_Aufnahmetasche_Boden",
    "02_Aufnahmetasche_Lippe"].includes(v.name));
  let trackGap=Infinity,trackObstacle;
  for(let i=0;i<=220;i++) {
    const x=hl+(a.x-hl)*i/220;
    const center=[x,0,r+3*Math.max(0,Math.min(1,(-112-x)/30))];
    for(const obj of obstacles){
      for(const f of obj.faces){
        const tri=f.map(i=>obj.vertices[i]);
        if([0,1,2].some(axis=>tri.every(v=>v[axis]>center[axis]+r+16) ||
                            tri.every(v=>v[axis]<center[axis]-r-16))) continue;
        const distance=Math.sqrt(triangleDistance2(center,...tri))-r;
        if(distance<trackGap){trackGap=distance;trackObstacle=obj.name}
      }
    }
  }
  const check={
    ballMittelbahnZuFestteilenAbgetastet:trackGap,
    auslaufSpaltMitte:transferGap,
    maxBallBodenfreiheit:deck.bottom-hi,
    maxBallKanalGesamt:intake.channel-hi,
    motorgehaeuseZuFuehrung:hw-intake.driveLength-w-intake.wall,
    schneckeKernZuMaxBall:Math.abs(a.y)-a.core-r,
    schneckeMantelZuMaxBall:a.housing-Math.abs(a.y)-r,
    schneckeFuehrungZuWindung:Math.hypot(a.guideX,a.guideY)-a.flight,
    schneckeFuehrungZuMaxBall:Math.hypot(a.guideX,a.guideY-Math.abs(a.y))-r,
    schneckeSpielZwischenWindungenMaxBall:pitchSpace(hi),
    trichterAuslaufGesamt:h.throat-hi,
    obereSperreUeberMaxBall:g.upper-g.thickness-g.lower-hi,
    obereSperreUnterKleinsterZweitballmitte:g.lower+1.5*lo-g.upper,
    rueckgezogenerSchieberFrei:g.stroke-h.throat-wall,
    kopfZuDeckBeiNeigungAbgetastet:floorGap,
    kopfZuTrichterUnterkanteAbgetastet:motorClear,
    motorSeitlichZuFestemKanal:wheelY-motorR-q-wall,
    schussradEindrueckungKlein:lo-s.compressionGap,
    schussradEindrueckungGross:hi-s.compressionGap
  };
  if(Object.values(check).some(x=>!(x>0))) throw Error(JSON.stringify(check));
  const feedSlope=Math.atan2(154-105,s.wheelX-16)*180/Math.PI-s.tilt[1];
  if(feedSlope<=0) throw Error("Zuführrampe steigt bei oberer Neigung.");
  const lowArea=h.throat**2, highArea=h.length*h.width, dh=h.funnelTop-h.throatTop;
  const taperVolume=dh*(lowArea+highArea+
    (h.length*h.throat+h.width*h.throat)/2)/3;
  const grossVolume=taperVolume+highArea*(rotorTop-7-h.funnelTop);
  const all=parts.flatMap(p=>p.vertices);
  const bounds=[0,1,2].map(axis=>[
    Math.min(...all.map(v=>v[axis])),Math.max(...all.map(v=>v[axis]))
  ]);
  const report={
    revision:"v1-schneckenrover",
    nominalMillimeters:true,
    manufacturingRelease:false,
    parts:parts.length,
    closedOrientedParts:parts.length,
    triangles:parts.reduce((sum,p)=>sum+p.faces.length,0),
    boundsMm:bounds.map(pair=>pair.map(v=>Number(v.toFixed(2)))),
    clearanceMm:Object.fromEntries(Object.entries(check).map(([k,v])=>[k,Number(v.toFixed(2))])),
    closestFixedObjectOnIntakePath:trackObstacle,
    minimumFeedDownSlopeDeg:Number(feedSlope.toFixed(2)),
    grossHopperLitersBelowInlet:Number((grossVolume/1e6).toFixed(2)),
    testScope:["Wasserdichte orientierte Einzelnetze", "Geometrische Spielmaße für FIP-Grenzfälle",
       "Schnecke und Kippwinkel numerisch abgetastet", "Kein Kontakt-, Reibungs-, Traglast- oder Montageversuch"]
  };
  return {parts,report};
}

function exportObj(parts){
  const lines=["# Rover V1. Unit: millimeters. X forward, Y left, Z up.","mtllib Rover_V1.mtl"];
  let offset=1;
  for(const {name,vertices,faces,stage} of parts){
    lines.push(`o ${name}`,`usemtl ${stage}`);
    for(const v of vertices) lines.push("v "+v.map(x=>Number(x.toFixed(4))).join(" "));
    for(const f of faces) lines.push("f "+f.map(i=>i+offset).join(" "));
    offset+=vertices.length;
  }
  return lines.join("\n")+"\n";
}

function modelXml(parts,colors){
  const stages=Object.keys(colors);
  const lines=['<?xml version="1.0" encoding="UTF-8"?>',
    '<model unit="millimeter" xml:lang="de-DE" xmlns="http://schemas.microsoft.com/3dmanufacturing/core/2015/02">',
    '<metadata name="Title">Rover V1 Schneckenfoerderer</metadata>','<resources>','<basematerials id="1">'];
  for(const stage of stages) lines.push(`<base name="${stage}" displaycolor="#${colors[stage]}"/>`);
  lines.push('</basematerials>');
  for(const [index,{name,vertices,faces,stage}] of parts.entries()){
    lines.push(`<object id="${index+2}" type="model" name="${name}" pid="1" pindex="${stages.indexOf(stage)}"><mesh><vertices>`);
    for(const [x,y,z] of vertices) lines.push(`<vertex x="${Number(x.toFixed(4))}" y="${Number(y.toFixed(4))}" z="${Number(z.toFixed(4))}"/>`);
    lines.push('</vertices><triangles>');
    for(const [i,j,k] of faces) lines.push(`<triangle v1="${i}" v2="${j}" v3="${k}"/>`);
    lines.push('</triangles></mesh></object>');
  }
  lines.push('</resources>','<build>');
  for(let index=0;index<parts.length;index++) lines.push(`<item objectid="${index+2}"/>`);
  lines.push('</build>','</model>');
  return lines.join('\n');
}

function zip(entries) {
  const data=[], directory=[];
  const write=(a,n,b)=>{for(let i=0;i<b;i++) a.push((n>>>(8*i))&255)};
  const ascii=s=>{
    const a=new Uint8Array(s.length);
    for(let i=0;i<s.length;i++){
      if(s.charCodeAt(i)>127) throw Error("ZIP payload must be ASCII");
      a[i]=s.charCodeAt(i);
    }
    return a;
  };
  for(const [path,body] of Object.entries(entries)){
    const name=ascii(path), bytes=ascii(body), start=data.length;
    let crc=-1;
    for(const byte of bytes){
      crc^=byte;
      for(let i=0;i<8;i++) crc=(crc>>>1)^((crc&1)?0xedb88320:0);
    }
    crc^=-1;
    write(data,0x04034b50,4);
    for(const word of [20,0,0,0,0x5d67])write(data,word,2);
    for(const word of [crc,bytes.length,bytes.length])write(data,word,4);
    write(data,name.length,2);write(data,0,2);
    for(const byte of name)data.push(byte);
    for(const byte of bytes)data.push(byte);
    write(directory,0x02014b50,4);
    for(const word of [20,20,0,0,0,0x5d67])write(directory,word,2);
    for(const word of [crc,bytes.length,bytes.length])write(directory,word,4);
    for(const word of [name.length,0,0,0,0])write(directory,word,2);
    write(directory,0,4);write(directory,start,4);
    for(const byte of name)directory.push(byte);
  }
  const offset=data.length,count=Object.keys(entries).length;
  for(const byte of directory)data.push(byte);
  write(data,0x06054b50,4);
  for(const word of [0,0,count,count])write(data,word,2);
  write(data,directory.length,4);write(data,offset,4);write(data,0,2);
  return Uint8Array.from(data);
}

function create3mf(parts,colors) {
  return zip({
    '[Content_Types].xml':'<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="model" ContentType="application/vnd.ms-package.3dmanufacturing-3dmodel+xml"/></Types>',
    '_rels/.rels':'<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Target="/3D/3dmodel.model" Id="rel0" Type="http://schemas.microsoft.com/3dmanufacturing/2013/01/3dmodel"/></Relationships>',
    '3D/3dmodel.model':modelXml(parts,colors)
  });
}

function preview(parts,palette){
  const az=56*Math.PI/180,el=29*Math.PI/180,ca=Math.cos(az),sa=Math.sin(az),ce=Math.cos(el),se=Math.sin(el);
  const proj=([x,y,z])=>[x*sa-y*ca,-z*ce+(x*ca+y*sa)*se,(x*ca+y*sa)*ce+z*se];
  const show=parts.filter(p=>!p.name.includes("Wartungsabdeckung")&&!p.name.includes("Mantel_Hauptschale"));
  const vertices=show.flatMap(p=>p.vertices.map(proj));
  const minx=Math.min(...vertices.map(v=>v[0])),maxx=Math.max(...vertices.map(v=>v[0]));
  const miny=Math.min(...vertices.map(v=>v[1])),maxy=Math.max(...vertices.map(v=>v[1]));
  const scale=Math.min(736/(maxx-minx),560/(maxy-miny));
  const triangles=[];
  for(const {stage,vertices,faces} of show){
    const projected=vertices.map(proj);
    const rgb=palette[stage].match(/../g).map(x=>parseInt(x,16));
    for(const [i,j,k] of faces){
      const [a,b,c]=[projected[i],projected[j],projected[k]];
      const A=b.map((v,n)=>v-a[n]),B=c.map((v,n)=>v-a[n]);
      const normal=[A[1]*B[2]-A[2]*B[1],A[2]*B[0]-A[0]*B[2],A[0]*B[1]-A[1]*B[0]];
      if(normal[2]<=0)continue;
      const magnitude=Math.hypot(...normal);
      const shade=.68+.32*Math.max(0,(normal[2]-.35*normal[0]+.26*normal[1])/magnitude);
      const color=rgb.map(v=>Math.round(shade*v).toString(16).padStart(2,"0")).join("");
      const path=[a,b,c].map(([x,y])=>[40+(x-minx)*scale,102+(y-miny)*scale]
        .map(v=>Math.round(v)).join(" ")).join("L");
      triangles.push([(a[2]+b[2]+c[2])/3,`<path fill="#${color}" d="M${path}Z"/>`]);
    }
  }
  triangles.sort((a,b)=>a[0]-b[0]);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="830" height="731" viewBox="0 0 830 731" role="img" aria-label="Rover V1, isometrischer Blick mit ausgeblendeter Mantelschale">
<rect width="830" height="731" fill="#edf1f5"/>
<text x="30" y="43" font-family="sans-serif" font-weight="700" font-size="25" fill="#182b3d">Rover V1 · Schneckenförderer</text>
<text x="30" y="68" font-family="sans-serif" font-size="15" fill="#465a6e">CAD-Ansicht mit teilweise ausgeblendetem Schneckenmantel</text>
${triangles.map(t=>t[1]).join("\n")}
<text x="30" y="697" font-family="sans-serif" font-size="14" fill="#465a6e">Gold · Schnecke   Rot · Speicher   Türkis · Ballkanal   Blau · Android-Halterraum</text>
</svg>\n`;
}

const palette = {
  "frame": "283D54",
  "drive": "414957",
  "intake": "2A9D8F",
  "auger-fixed": "7898A9",
  "rotor": "E1A133",
  "auger-drive": "596175",
  "hopper": "D2534D",
  "feed": "B783A6",
  "gate": "CFAD5A",
  "head": "627695",
  "head-wheel": "343A42",
  "head-motor": "E17E36",
  "head-pivot": "88999A",
  "actuator": "596175",
  "camera": "638EF3",
  "electronics": "40965C",
  "reference": "D2D93B"
};

module.exports = { build, create3mf, exportObj, palette, preview };

if (require.main === module) {
  const fs = require("node:fs");
  const path = require("node:path");
  const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
  const settings = read(path.join(__dirname, "auslegung.json"));
  const catalog = read(path.join(__dirname, "../../hardware/bauteilmasse.json"));
  const measured = Object.fromEntries(catalog.dimensions.map(d => [d.parameter, d.reported_mm]));
  const {parts, report} = build(settings, measured);
  const out = path.resolve(process.argv[2] || path.join(__dirname, "../v1"));
  fs.mkdirSync(out, {recursive: true});
  fs.writeFileSync(path.join(out, "Rover_V1.3mf"), create3mf(parts, palette));
  fs.writeFileSync(path.join(out, "Vorschau.svg"), preview(parts, palette));
  fs.writeFileSync(path.join(out, "pruefbericht.json"), JSON.stringify(report, null, 2) + "\n");
  if (process.env.ROVER_OBJ === "1") {
    fs.writeFileSync(path.join(out, "Rover_V1.obj"), exportObj(parts));
    const mtl = Object.entries(palette).map(([stage, hex]) =>
      "newmtl " + stage + "\nKd " + hex.match(/../g).map(x => (parseInt(x,16)/255).toFixed(4)).join(" ") + "\n"
    ).join("\n");
    fs.writeFileSync(path.join(out, "Rover_V1.mtl"), mtl);
  }
  console.log(`Rover V1 · ${report.parts} geprüfte Netzkörper → ${out}`);
}
