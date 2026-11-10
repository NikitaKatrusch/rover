// Steckpins für die stromlose Schiebeprobe. Maße in mm.
teil = "pins_40";
$fn = 64;

kopf_d = 9;
kopf_h = 2;
hals_d = 2.9;
hals_start = 6.8;
schulter = 9.6;
spitze = 11.15;
keil_breite = 8.4;
keil_laenge = 13;
keil_min = 1.0;
keil_max = 2.65;
keil_rampe = 8.8;
keil_schlitz = 3.2;
keil_schlitz_mitte = 8.1;

module pin(d, kerben) {
    r = d/2;
    difference() {
        rotate_extrude()
            polygon([
                [0,0], [kopf_d/2-0.25,0], [kopf_d/2,0.25],
                [kopf_d/2,kopf_h], [r,kopf_h], [r,kopf_h+hals_start],
                [hals_d/2,kopf_h+hals_start],
                [hals_d/2,kopf_h+schulter-0.55], [r,kopf_h+schulter],
                [r,kopf_h+spitze-0.45], [r-0.45,kopf_h+spitze],
                [0,kopf_h+spitze]
            ]);
        for (k = [0:kerben-1])
            rotate([0,0,24*(k-(kerben-1)/2)])
                translate([kopf_d/2,0,-0.02])
                    cylinder(r=0.72,h=kopf_h+0.04,$fn=24);
    }
}

module keilclip() {
    difference() {
        // Breite entlang Y. Das dünne Ende zeigt in Richtung X=0.
        translate([0,keil_breite/2,0])
            rotate([90,0,0])
                linear_extrude(height=keil_breite)
                    polygon([[0,0],[keil_laenge,0],[keil_laenge,keil_max],
                             [keil_rampe,keil_max],[0,keil_min]]);
        hull()
            for (x = [-2,keil_schlitz_mitte])
                translate([x,0,-0.02])
                    cylinder(d=keil_schlitz,h=keil_max+0.04);
    }
}

if (teil == "pins_40" || teil == "pins_42")
    for (x = [-6.5,6.5], y = [-6.5,6.5])
        translate([x,y,0]) pin(teil == "pins_40" ? 4.0 : 4.2,
                                teil == "pins_40" ? 1 : 2);
else if (teil == "clips")
    for (x = [-17,0,17], y = [-6,6])
        translate([x-6.5,y,0]) keilclip();
