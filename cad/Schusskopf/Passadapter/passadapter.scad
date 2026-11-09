// Maße in mm. Passprobe am stromlosen Motor und Radkern.
rad_durchmesser = 19.25;
wellenbohrung = 5.25;
einstecktiefe = 12;
anschlag_hoehe = 3.2;
anschlag_durchmesser = 28;
fasen_hoehe = 0.55;
beschriftung = "19.25";
$fn = 96;

gesamt_hoehe = anschlag_hoehe + einstecktiefe;

difference() {
    union() {
        cylinder(d=anschlag_durchmesser, h=anschlag_hoehe);
        translate([0, 0, anschlag_hoehe-0.05])
            cylinder(d=rad_durchmesser, h=einstecktiefe-fasen_hoehe+0.05);
        translate([0, 0, gesamt_hoehe-fasen_hoehe-0.01])
            cylinder(d1=rad_durchmesser, d2=rad_durchmesser-2*fasen_hoehe, h=fasen_hoehe+0.01);
    }

    translate([0, 0, -0.1])
        cylinder(d=wellenbohrung, h=gesamt_hoehe+0.2);
    translate([0, 0, -0.01])
        cylinder(d1=wellenbohrung+2*fasen_hoehe, d2=wellenbohrung, h=fasen_hoehe+0.01);
    translate([0, 0, gesamt_hoehe-fasen_hoehe])
        cylinder(d1=wellenbohrung, d2=wellenbohrung+2*fasen_hoehe, h=fasen_hoehe+0.01);

    for (mark = [[0, 11.55, beschriftung], [0, -11.55, "TEST"]])
        translate([mark[0], mark[1], anschlag_hoehe-0.55])
            linear_extrude(height=0.65)
                text(mark[2], size=2.25, halign="center", valign="center");
}
