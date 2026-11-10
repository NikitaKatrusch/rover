// Stehender 775er auf der Lochplatte, für die stromlose Montageprobe.
motor_d = 44.2;
durchmesserspiel = 0.7;
auflage_z = 24;
fuehrung_h = 45;
wand = 2.4;
auflage_b = 3.2;
segment_winkel = 54;
fuss_h = 3.2;
schraubenabstand = 60;
langloch_laenge = 20;
langloch_breite = 4.5;
band_breite = 5.6;
$fn = 96;

innen_r = (motor_d+durchmesserspiel)/2;
aussen_r = innen_r+wand;
fuss_x = 23;
fuss_y = 18;
schrauben_y = schraubenabstand/2;
eps = 0.02;

module strebe(a, b, r) {
    hull()
        for (p = [a,b])
            translate([p[0],p[1],0]) cylinder(r=r,h=fuss_h);
}

module fuss() {
    difference() {
        union() {
            for (s = [-1,1]) {
                strebe([s*fuss_x,-fuss_y],[s*fuss_x,fuss_y],4.6);
                for (t = [-1,1])
                    strebe([s*fuss_x,t*fuss_y],[0,t*schrauben_y],4.6);
            }
            for (t = [-1,1])
                strebe([-8,t*schrauben_y],[8,t*schrauben_y],5.5);
        }
        for (t = [-1,1])
            translate([0,t*schrauben_y,-eps])
                hull()
                    for (x = [-1,1])
                        translate([x*(langloch_laenge-langloch_breite)/2,0,0])
                            cylinder(d=langloch_breite,h=fuss_h+2*eps);
    }
}

module fuehrung() {
    band_z = auflage_z+30;
    band_t = 0.6;
    oberkante = auflage_z+fuehrung_h;
    rotate([0,0,-segment_winkel/2])
        rotate_extrude(angle=segment_winkel)
            polygon([
                [innen_r,fuss_h-eps], [aussen_r,fuss_h-eps],
                [aussen_r,band_z-band_t],
                [aussen_r-band_t,band_z],
                [aussen_r-band_t,band_z+band_breite],
                [aussen_r,band_z+band_breite+band_t],
                [aussen_r,oberkante], [innen_r+0.7,oberkante],
                [innen_r,oberkante-0.7], [innen_r,auflage_z],
                [innen_r-auflage_b,auflage_z], [innen_r,auflage_z-auflage_b]
            ]);
}

union() {
    fuss();
    for (angle = [0,180]) rotate([0,0,angle]) fuehrung();
}
