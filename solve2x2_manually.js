var solver = require('javascript-lp-solver'),
  results,
  model = {
    "optimize": "price",
    "opType": "min",
    "constraints": {
        "a1": {"equal": 44000},
        "b1": {"equal": 50000},
        "a2": {"equal": 26000},
        "b2": {"equal": 20000},
        //---
        "s1_car": {"max": 1464},
        "s1_rail": {"max": 1464},
        "s1_plane": {"max": 1464},
        "s2_car": {"max": 1464},
        "s2_rail": {"max": 1464},
        "s2_plane": {"max": 1464},
        //----
        "c_z11_car": {"max": 120},
        "c_z12_car": {"max": 120},
        "c_z21_car": {"max": 60},
        "c_z22_car": {"max": 60},
        "c_z11_rail": {"max": 1000},
        "c_z21_rail": {"max": 1000},
        "c_z12_plane": {"max": 200},
        "c_z22_plane": {"max": 200},
        //--
        "c_r_z11_car": {"max": 0},
        "c_r_z12_car": {"max": 0},
        "c_r_z21_car": {"max": 0},
        "c_r_z22_car": {"max": 0},
        "c_r_z11_rail": {"max": 0},
        "c_r_z21_rail": {"max": 0},
        "c_r_z12_plane": {"max": 0},
        "c_r_z22_plane": {"max": 0},
    },
    "variables": {
        "r11_car": {"price": 4368000, "a1": 120, "b1": 120, "s1_car": 4.55,"c_r_z11_car":-120},
        "r12_car": {"price": 1428000, "a1": 120, "b2": 120, "s1_car": 1.49,"c_r_z12_car":-120},
        "r21_car": {"price": 2850000, "a2": 60, "b1": 60, "s2_car": 5.94,"c_r_z21_car":-60},
        "r22_car": {"price": 702000, "a2": 60, "b2": 60, "s2_car": 1.46,"c_r_z22_car":-60},
        "r11_rail": { "price": 30000000, "a1": 1000, "b1": 1000, "s1_rail": 24,"c_r_z11_rail":-1000},
        "r21_rail": { "price": 30000000, "a2": 1000, "b1": 1000, "s2_rail": 24,"c_r_z21_rail":-1000},
        "r12_plane": {"price": 50000000, "a1": 200, "b2": 200, "s1_plane": 24,"c_r_z12_plane":-200},
        "r22_plane": {"price": 50000000, "a2": 200, "b2": 200, "s2_plane": 24,"c_r_z22_plane":-200},
        //-------
        // "z11_car": {"price": -36400, "a1": -1, "b1": -1, "c_z11_car": 1,},
        // "z12_car": {"price": -11900, "a1": -1, "b2": -1, "c_z12_car": 1,},
        // "z21_car": {"price": -47500, "b1": -1, "a2": -1, "c_z21_car": 1,},
        // "z22_car": {"price": -11700, "a2": -1, "b2": -1, "c_z22_car": 1,},
        // "z11_rail": { "price": -30000, "a1": -1, "b1": -1, "c_z11_rail": 1,},
        // "z21_rail": { "price": -30000, "b1": -1, "a2": -1, "c_z21_rail": 1,},
        // "z12_plane": {"price": -250000, "a1": -1, "b2": -1, "c_z12_plane": 1,},
        // "z22_plane": {"price": -250000, "a2": -1, "b2": -1, "c_z22_plane": 1,},
        //------
        // "z11_car": {"price": 1/36400, "a1": -1, "b1": -1, "c_z11_car": 1,"c_r_z11_car":1},
        // "z12_car": {"price": 1/11900, "a1": -1, "b2": -1, "c_z12_car": 1,"c_r_z12_car":1},
        // "z21_car": {"price": 1/47500, "b1": -1, "a2": -1, "c_z21_car": 1,"c_r_z21_car":1},
        // "z22_car": {"price": 1/11700, "a2": -1, "b2": -1, "c_z22_car": 1,"c_r_z22_car":1},
        // "z11_rail": { "price": 1/30000, "a1": -1, "b1": -1, "c_z11_rail": 1,"c_r_z11_rail":1},
        // "z21_rail": { "price": 1/30000, "b1": -1, "a2": -1, "c_z21_rail": 1,"c_r_z21_rail":1},
        // "z12_plane": {"price": 1/250000, "a1": -1, "b2": -1, "c_z12_plane": 1,"c_r_z12_plane":1},
        // "z22_plane": {"price": 1/250000, "a2": -1, "b2": -1, "c_z22_plane": 1,"c_r_z22_plane":1},
        //------
        "z11_car": {"a1": -1, "b1": -1, "c_z11_car": 1,"c_r_z11_car":1},
        "z12_car": {"a1": -1, "b2": -1, "c_z12_car": 1,"c_r_z12_car":1},
        "z21_car": {"b1": -1, "a2": -1, "c_z21_car": 1,"c_r_z21_car":1},
        "z22_car": {"a2": -1, "b2": -1, "c_z22_car": 1,"c_r_z22_car":1},
        "z11_rail": {"a1": -1, "b1": -1, "c_z11_rail": 1,"c_r_z11_rail":1},
        "z21_rail": {"b1": -1, "a2": -1, "c_z21_rail": 1,"c_r_z21_rail":1},
        "z12_plane": {"a1": -1, "b2": -1, "c_z12_plane": 1,"c_r_z12_plane":1},
        "z22_plane": {"a2": -1, "b2": -1, "c_z22_plane": 1,"c_r_z22_plane":1},
        //------
        // "z11_car": {"a1": -1, "b1": -1, "c_z11_car": 1,},
        // "z12_car": {"a1": -1, "b2": -1, "c_z12_car": 1,},
        // "z21_car": {"b1": -1, "a2": -1, "c_z21_car": 1,},
        // "z22_car": {"a2": -1, "b2": -1, "c_z22_car": 1,},
        // "z11_rail": {"a1": -1, "b1": -1, "c_z11_rail": 1,},
        // "z21_rail": {"b1": -1, "a2": -1, "c_z21_rail": 1,},
        // "z12_plane": {"a1": -1, "b2": -1, "c_z12_plane": 1,},
        // "z22_plane": {"a2": -1, "b2": -1, "c_z22_plane": 1,},
    },
    "ints": {"r11_car": 1, "r12_car": 1, "r21_car": 1, "r22_car": 1,
    "r11_rail": 1,"r21_rail": 1,
    "r12_plane": 1,"r22_plane": 1,
    }
};

results = solver.Solve(model);
console.log(results);
// console.log('end_of_input');
