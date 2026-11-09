// Nur für die stromlose Passprobe am Radkern und an der Motorwelle.
rad_durchmesser = 19.25;
wellenbohrung = 5.25;
einstecktiefe = 12;
anschlag_durchmesser = 26;
anschlag_hoehe = 1.6;
ringwand = 1.4;
markierungen = 2;
fasen_hoehe = 0.55;
$fn = 96;

gesamt_hoehe = anschlag_hoehe + einstecktiefe;
wellenrohr_durchmesser = wellenbohrung + 2*ringwand;

difference() {
    union() {
        cylinder(d=anschlag_durchmesser, h=anschlag_hoehe);
        translate([0, 0, anschlag_hoehe-0.05])
            cylinder(d=rad_durchmesser, h=einstecktiefe-fasen_hoehe+0.05);
        translate([0, 0, gesamt_hoehe-fasen_hoehe-0.01])
            cylinder(d1=rad_durchmesser, d2=rad_durchmesser-2*fasen_hoehe,
                     h=fasen_hoehe+0.01);
    }

    // Offener Ringraum. Beide Messflächen laufen über die volle Einstecktiefe.
    translate([0, 0, anschlag_hoehe])
        difference() {
            cylinder(d=rad_durchmesser-2*ringwand, h=einstecktiefe+0.1);
            translate([0, 0, -0.1])
                cylinder(d=wellenrohr_durchmesser, h=einstecktiefe+0.3);
        }

    translate([0, 0, -0.1])
        cylinder(d=wellenbohrung, h=gesamt_hoehe+0.2);
    translate([0, 0, -0.01])
        cylinder(d1=wellenbohrung+2*fasen_hoehe, d2=wellenbohrung, h=fasen_hoehe+0.01);
    translate([0, 0, gesamt_hoehe-fasen_hoehe])
        cylinder(d1=wellenbohrung, d2=wellenbohrung+2*fasen_hoehe, h=fasen_hoehe+0.01);

    // Kerben am Anschlag kennzeichnen die drei Durchmesser.
    if (markierungen > 0)
        for (index = [0 : markierungen-1])
            rotate([0, 0, 12*(index-(markierungen-1)/2)])
                translate([0, anschlag_durchmesser/2, -0.1])
                    cylinder(r=0.85, h=anschlag_hoehe+0.2, $fn=24);
}
