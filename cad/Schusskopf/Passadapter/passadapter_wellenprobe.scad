// Passprobe am Radkern und an der stromlosen Motorwelle.
rad_durchmesser = 19.35;
wellenbohrung = 5.65;
markierungen = 2;
einstecktiefe = 12;
anschlag_durchmesser = 26;
anschlag_hoehe = 3.2;
radfase = 0.55;
wellenfase = 0.8;
$fn = 96;

gesamt_hoehe = anschlag_hoehe + einstecktiefe;
ueberstand = 0.02;

difference() {
    union() {
        cylinder(d=anschlag_durchmesser, h=anschlag_hoehe);
        translate([0, 0, anschlag_hoehe-ueberstand])
            cylinder(d=rad_durchmesser, h=einstecktiefe-radfase+ueberstand);
        translate([0, 0, gesamt_hoehe-radfase-ueberstand])
            cylinder(d1=rad_durchmesser, d2=rad_durchmesser-2*radfase,
                     h=radfase+ueberstand);
    }

    translate([0, 0, -ueberstand])
        cylinder(d=wellenbohrung, h=gesamt_hoehe+2*ueberstand);
    translate([0, 0, -ueberstand])
        cylinder(d1=wellenbohrung+2*(wellenfase+ueberstand),
                 d2=wellenbohrung, h=wellenfase+ueberstand);
    translate([0, 0, gesamt_hoehe-wellenfase])
        cylinder(d1=wellenbohrung, d2=wellenbohrung+2*(wellenfase+ueberstand),
                 h=wellenfase+ueberstand);

    // Kerben am Anschlag kennzeichnen den Durchmesser der Wellenbohrung.
    for (index = [0 : markierungen-1])
        rotate([0, 0, 12*(index-(markierungen-1)/2)])
            translate([0, anschlag_durchmesser/2, -ueberstand])
                cylinder(r=0.85, h=anschlag_hoehe+2*ueberstand, $fn=24);
}
