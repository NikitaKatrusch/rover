// Kurze Wellenlehre für die stromlose Passprobe. Alle Maße in mm.
bohrungen = [5.25, 5.30, 5.35, 5.40, 5.45];
abstand = 11.5;
breite = 16;
laenge = 58;
hoehe = 5.2;
radius = 2;
fase = 0.8;
bohrung_y = 1.6;
schrift_y = -4.7;
gravurtiefe = 0.6;
ueberstand = 0.02;
$fn = 96;

difference() {
    hull()
        for (x = [-1, 1], y = [-1, 1])
            translate([x*(laenge/2-radius), y*(breite/2-radius), 0])
                cylinder(r=radius, h=hoehe);

    for (index = [0 : len(bohrungen)-1]) {
        x = (index-(len(bohrungen)-1)/2)*abstand;
        durchmesser = bohrungen[index];
        translate([x, bohrung_y, -ueberstand])
            cylinder(d=durchmesser, h=hoehe+2*ueberstand);
        translate([x, bohrung_y, -ueberstand])
            cylinder(d1=durchmesser+2*(fase+ueberstand),
                     d2=durchmesser, h=fase+ueberstand);
        translate([x, bohrung_y, hoehe-fase])
            cylinder(d1=durchmesser, d2=durchmesser+2*(fase+ueberstand),
                     h=fase+ueberstand);

        beschriftung = index == 1 || index == 3
            ? str(durchmesser, "0") : str(durchmesser);
        translate([x, schrift_y, hoehe-gravurtiefe])
            linear_extrude(height=gravurtiefe+ueberstand)
                text(beschriftung, size=3.4, halign="center", valign="center",
                     font="Liberation Sans:style=Bold");
    }
}
