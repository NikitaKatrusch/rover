// Abmessungen in mm. Prüfstand für stromlose Pass- und Einzugsproben.
part = "assembly";
angle = 45;
$fn = 48;

positions = [0, 20, 35, 45, 55, 65];
pivot_height = 155;
ball_axis = 50;
pin_radius = 60;
deck_t = 8;
deck_half = 110;
pivot_gap = 1;
moving_t = 10;
fixed_t = 12;
roller_center = 68.5;
guide_width = 68;
guide_entry_x = -121;
guide_floor_t = 8.5;
reference_ball_d = 66;
pusher_front_stop = -39;
pusher_stroke = 25;
roller_z = 50;
clearance_m5 = 5.6;

module through_z(x, y, z, diameter, height) {
    translate([x, y, z]) cylinder(d=diameter, h=height);
}

module through_y(x, y, z, diameter, height) {
    translate([x, y, z]) rotate([-90, 0, 0]) cylinder(d=diameter, h=height);
}

module deck() {
    difference() {
        translate([-125, -deck_half, 0]) cube([195, 2*deck_half, deck_t]);
        for (side = [-1, 1]) {
            for (x = [-12, 63])
                through_z(x, side*101, -1, clearance_m5, deck_t+2);
            for (x = [-22, 22])
                hull()
                    for (shift = [-1.5, 2.5])
                        through_z(x, side*(roller_center+shift), -1, clearance_m5, deck_t+2);
            for (x = [-100, -54])
                through_z(x, side*44, -1, clearance_m5, deck_t+2);
        }
    }
}

module guide() {
    inner_width = guide_width;
    wall = 3;
    floor_t = guide_floor_t;
    difference() {
        union() {
            translate([guide_entry_x, -inner_width/2-wall, 0])
                cube([-guide_entry_x, inner_width+2*wall, floor_t]);
            for (side = [-1, 1]) {
                translate([guide_entry_x, side*inner_width/2+(side-1)*wall/2, floor_t-0.1])
                    cube([-guide_entry_x-31, wall, 23.1]);
                for (x = [-100, -54])
                    hull() {
                        through_z(x, side*33, 0, 12, floor_t);
                        through_z(x, side*44, 0, 13, floor_t);
                    }
            }
        }
        for (side = [-1, 1], x = [-100, -54])
            through_z(x, side*44, -1, clearance_m5, floor_t+2);
    }
}

module ballschieber() {
    shoe_width = guide_width - 1.6;
    stop_width = guide_width + 8;
    stop_x = guide_entry_x - pusher_front_stop;
    difference() {
        union() {
            // Schuh und Schubstange laufen auf der vorhandenen Kanalsohle.
            translate([-41, -shoe_width/2, 0]) cube([34, shoe_width, 5]);
            translate([stop_x-4, -6, 0]) cube([-stop_x-2, 12, 12]);
            translate([-12, -12, 0]) cube([14.6, 24, 42]);
            // Der Kragen ist breiter als die Führung und stoppt am Einlauf.
            translate([stop_x-5, -stop_width/2, 0]) cube([5, stop_width, 12]);
            translate([stop_x-5, -12, 0]) cube([8, 24, 43]);
        }
        through_z(reference_ball_d/2, 0, -1, reference_ball_d, 44);
    }
}

module roller_stand() {
    difference() {
        union() {
            translate([-29, -17, 0]) cube([58, 34, 7]);
            translate([-16, -16, 0]) cube([32, 32, 26]);
            through_z(0, 0, 25.9, 14, 3.1);
        }
        through_z(0, 0, -1, 8.6, 31);
        translate([0, 0, -1]) cylinder(d=15.8, h=8, $fn=6);
        for (x = [-22, 22])
            through_z(x, 0, -1, clearance_m5, 9);
    }
}

module trunnion() {
    pin_z = ball_axis-deck_t;
    difference() {
        union() {
            translate([-18, -17, 0]) cube([88, 17+moving_t, 8]);
            hull() {
                translate([-18, 0, 0]) cube([88, moving_t, 8]);
                through_y(0, 0, pin_z, 25, moving_t);
                through_y(pin_radius, 0, pin_z, 22, moving_t);
            }
        }
        for (x = [0, pin_radius])
            through_y(x, -1, pin_z, clearance_m5, moving_t+2);
        for (x = [-12, 63])
            through_z(x, -9, -1, clearance_m5, 10);
    }
}

module cheek() {
    difference() {
        union() {
            translate([-83, -18, 0]) cube([166, 18+fixed_t, 10]);
            hull() {
                translate([-83, 0, 0]) cube([166, fixed_t, 10]);
                through_y(0, 0, pivot_height, 29, fixed_t);
                for (a = positions)
                    through_y(pin_radius*cos(a), 0, pivot_height+pin_radius*sin(a), 23, fixed_t);
            }
        }
        through_y(0, -1, pivot_height, clearance_m5, fixed_t+2);
        for (a = positions)
            through_y(pin_radius*cos(a), -1, pivot_height+pin_radius*sin(a), clearance_m5, fixed_t+2);
        for (x = [-72, 72])
            through_z(x, -10, -1, clearance_m5, 12);
    }
}

module pair() {
    children();
    mirror([0, 1, 0]) children();
}

module assembly() {
    color("#40566f") pair()
        translate([0, deck_half+moving_t+pivot_gap, 0]) cheek();
    translate([0, 0, pivot_height]) rotate([0, -angle, 0]) translate([0, 0, -ball_axis]) {
        color("#617a94") deck();
        color("#25877a") translate([0, 0, deck_t]) guide();
        color("#d08b46") pair() translate([0, deck_half, deck_t]) trunnion();
        pair() translate([0, roller_center, deck_t]) {
            color("#697c92") roller_stand();
            color("#66788b") through_z(0, 0, 29, 12, 1);
            color("#eeeeea") difference() {
                through_z(0, 0, roller_z-12-deck_t, 72, 24);
                through_z(0, 0, roller_z-13-deck_t, 8, 26);
            }
            color("#444c57") through_z(0, 0, 25, 8, 33);
        }
        ball_r = reference_ball_d/2;
        pusher_x = pusher_front_stop-pusher_stroke;
        color("#ab603e") translate([pusher_x, 0, deck_t+guide_floor_t]) ballschieber();
        color("#e4d03b")
            translate([pusher_x+ball_r, 0, deck_t+guide_floor_t+ball_r]) sphere(d=reference_ball_d);
    }
}

if (part == "deck") deck();
else if (part == "guide") guide();
else if (part == "ballschieber") ballschieber();
else if (part == "roller_stand") roller_stand();
else if (part == "trunnion_left") translate([0, 0, moving_t]) rotate([-90, 0, 0]) trunnion();
else if (part == "trunnion_right") mirror([0, 1, 0]) translate([0, 0, moving_t]) rotate([-90, 0, 0]) trunnion();
else if (part == "cheek_left") translate([0, 0, fixed_t]) rotate([-90, 0, 0]) cheek();
else if (part == "cheek_right") mirror([0, 1, 0]) translate([0, 0, fixed_t]) rotate([-90, 0, 0]) cheek();
else if (part == "assembly") assembly();
