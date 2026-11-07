"use strict";

// Bauraummodell in mm. X ist die Schussrichtung, Z zeigt nach oben.
const { create3mf } = require("../RoverV1/generate.js");

const colors = {
  frame: "344B60", guide: "2A9D8F", rollers: "3E4650",
  motor: "CD7A39", mount: "527CA8", reference: "DBDF4B",
};

function buildBench(p, motor) {
  const {deck,feed,rollers,ball}=p;
  const [minBall,maxBall]=ball.diameters;
  const [minGap,maxGap]=rollers.gapRange;
  const radius=rollers.diameter/2, halfWidth=deck.width/2, center=radius+rollers.gap/2;
  const baseEnd=deck.rearX+deck.length;
  const floorZ=rollers.centerZ-maxBall/2;
  const rollerBottom=rollers.centerZ-rollers.width/2;
  const rollerTop=rollers.centerZ+rollers.width/2;
  const motorBottom=rollerTop+4;
  const nearestWheelY=radius+minGap/2;
  const wallOutside=feed.innerWidth/2+feed.wall;
  const dy=nearestWheelY-wallOutside;
  const wheelAtWallX=Math.sqrt(Math.max(0,radius**2-dy**2));
  const nominalOverlap=[minBall-rollers.gap,maxBall-rollers.gap];
  const available={
    guideFreeWidthMm: feed.innerWidth-maxBall,
    minGuideToWheelLongitudinalMm: feed.sideWallEndX-wheelAtWallX,
    baseLateralReserveMm: halfWidth-(rollers.diameter+maxGap/2),
    wheelBottomAboveGuideFloorMm: rollerBottom-floorZ,
    maxGapFreeWidthMm: maxGap-maxBall,
  };
  if(Object.values(available).some(v=>!Number.isFinite(v)||v<=0) ||
     rollers.gap<minGap || rollers.gap>maxGap || feed.entryX<deck.rearX ||
     feed.entryX>=-feed.sideWallEndX || feed.exitX<=feed.sideWallEndX || feed.exitX>baseEnd ||
     deck.thickness>=floorZ || motor.diameter<=0 || motor.length<=0 ||
     !Number.isFinite(motor.diameter+motor.length)) {
    throw Error("Bauraumparameter ergeben eine unzulässige Referenzgeometrie.");
  }
  const parts=[];
  function prism(name,stage,ring,topZ) {
    const n=ring.length;
    const vertices=[...ring,...ring.map(([x,y])=>[x,y,topZ])];
    const faces=[];
    for(let i=0;i<n;i++){
      const j=(i+1)%n;
      faces.push([i,j,n+j],[i,n+j,n+i]);
      if(i>0&&i<n-1)faces.push([0,i+1,i],[n,n+i,n+i+1]);
    }
    parts.push({name,stage,vertices,faces});
  }
  function box(name,stage,x0,x1,y0,y1,z0,z1) {
    prism(name,stage,[[x0,y0,z0],[x1,y0,z0],[x1,y1,z0],[x0,y1,z0]],z1);
  }
  function circle(y,z,r) {
    return Array.from({length:64},(_,i)=>{
      const angle=2*Math.PI*i/64;
      return [r*Math.cos(angle),y+r*Math.sin(angle),z];
    });
  }
  box("01_Stationaere_Grundplatte_Bauraum","frame",deck.rearX,baseEnd,
    -halfWidth,halfWidth,0,deck.thickness);
  box("02_Durchgehende_Kanalsohle","guide",feed.entryX,feed.exitX,
    -wallOutside,wallOutside,deck.thickness,floorZ);
  for(const side of [-1,1]){
    const label=side>0?"L":"R";
    const y=side*center;
    const [wall0,wall1]=side>0?[feed.innerWidth/2,wallOutside]:[-wallOutside,-feed.innerWidth/2];
    box("02_Einlaufwand_"+label,"guide",feed.entryX,-feed.sideWallEndX,wall0,wall1,
      floorZ,floorZ+feed.wallHeight);
    box("02_Auslaufwand_"+label,"guide",feed.sideWallEndX,feed.exitX,wall0,wall1,
      floorZ,floorZ+feed.wallHeight);
    prism("03_Wurfrolle_Bauraum_"+label,"rollers",circle(y,rollerBottom,radius),rollerTop);
    prism("04_Nabe_Bauraum_"+label,"mount",circle(y,rollerTop,8),motorBottom);
    prism("04_775_Motor_Bauraum_"+label,"motor",
      circle(y,motorBottom,motor.diameter/2),motorBottom+motor.length);
    box("05_Schlittenposition_Bauraum_"+label,"mount",-25,25,y-25,y+25,
      deck.thickness,rollerBottom-2);
  }
  // Referenzkörper für den maximalen Ball. Die Kappen sind Dreiecke ohne Pol-Duplikate.
  const ballX=(feed.entryX-feed.sideWallEndX)/2;
  const vertices=[[ballX,0,floorZ]],faces=[];
  const slices=32,rings=15,r=maxBall/2;
  for(let j=1;j<=rings;j++){
    const t=Math.PI*j/(rings+1);
    for(let i=0;i<slices;i++){
      const a=2*Math.PI*i/slices;
      vertices.push([ballX+r*Math.sin(t)*Math.cos(a),r*Math.sin(t)*Math.sin(a),floorZ+r*(1-Math.cos(t))]);
    }
  }
  const top=vertices.length;
  vertices.push([ballX,0,floorZ+maxBall]);
  for(let i=0;i<slices;i++){
    const j=(i+1)%slices;
    faces.push([0,1+j,1+i],[top,top-slices+i,top-slices+j]);
    for(let k=0;k<rings-1;k++){
      const low=1+k*slices,high=low+slices;
      faces.push([low+i,low+j,high+j],[low+i,high+j,high+i]);
    }
  }
  parts.push({name:"00_Padelball_Maximalmass_Referenz",stage:"reference",vertices,faces});
  const round=x=>Number(x.toFixed(2));
  return {parts, report:{
    revision:p.revision,units:"mm",meshBodies:parts.length,
    suitableForPoweredTest:false,
    wheelAxisSpacingMm:round(2*center),
    wheelAxisSpacingRangeMm:[rollers.diameter+minGap,rollers.diameter+maxGap],
    slideTravelPerSideMm:(maxGap-minGap)/2,
    ballAndWheelOverlapAtNominalGapMm:nominalOverlap.map(round),
    clearancesMm:Object.fromEntries(Object.entries(available).map(([key,value])=>[key,round(value)])),
  }};
}

module.exports={buildBench,colors};
if(require.main===module){
  const fs=require("node:fs");
  const path=require("node:path");
  const p=require("./auslegung.json");
  const {dimensions}=require("../../hardware/bauteilmasse.json");
  const values=Object.fromEntries(dimensions.map(d=>[d.parameter,d.reported_mm]));
  const {parts,report}=buildBench(p,{
    diameter:values.motor_775_body_diameter,length:values.motor_775_body_length,
  });
  const destination=process.argv[2]||__dirname;
  fs.mkdirSync(destination,{recursive:true});
  fs.writeFileSync(path.join(destination,"Schusskopf_V0.3mf"),create3mf(parts,colors));
  fs.writeFileSync(path.join(destination,"pruefbericht.json"),JSON.stringify(report,null,2)+"\n");
  console.log(JSON.stringify(report,null,2));
}
