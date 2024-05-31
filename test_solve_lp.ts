// дробные r, ввел w
 
// import parse_data_from_excel from './excel_parser.js' ;
// const parse_data_from_excel = require('./excel_parser.js');

// import 'exceljs'
const Excel = require('exceljs');
const workbook = new Excel.Workbook();  

function matrixArray(rows,columns){
    var arr = new Array();
    for(var i=0; i<rows; i++){
      arr[i] = new Array();
      for(var j=0; j<columns; j++){
        arr[i][j] = 0;
      }
    }
    return arr;
}

function get_table_row(arr,row,row_number,first_row_number,first_column_number,n){
    for (let colomn_number = first_column_number; colomn_number < n+first_column_number; colomn_number++) {
        if (row[colomn_number]!=undefined){
            arr[row_number-first_row_number][colomn_number-first_column_number]=row[colomn_number]
        }
    }
    return arr;
}

async function parse_data_from_excel(filename) {
    const test_data_file = await workbook.xlsx.readFile(filename);
    var worksheet = test_data_file.worksheets[0];
    var row = worksheet.getRow(3).values;
    const m = row[2]
    const n = row[3]
    // var row = worksheet.getRow(7);
    // console.log(row.getCell(3).value);
    var first_row_number = 8
    const first_column_number = 3
    const step_between_tables_cols_numbers = 2
    const step_between_tables_rows_numbers = 4
    var result = new Map();
    var c_car = matrixArray(m,n);
    var c_rail = structuredClone(c_car);
    var c_plane = structuredClone(c_car);
    var gk_car = structuredClone(c_car);
    var gk_rail = structuredClone(c_car);
    var gk_plane = structuredClone(c_car);
    var t_car = structuredClone(c_car);
    var t_rail = structuredClone(c_car);
    var t_plane = structuredClone(c_car);

    for (let row_number = first_row_number; row_number < m+first_row_number; row_number++){
        row = worksheet.getRow(row_number).values;
        c_car = get_table_row(c_car, row,row_number, first_row_number, first_column_number, n)
        c_rail = get_table_row(c_rail, row,row_number, 
            first_row_number, 
            first_column_number + n + step_between_tables_cols_numbers, n)
        c_plane = get_table_row(c_plane, row,row_number, 
            first_row_number, 
            first_column_number + 2*n + 2*step_between_tables_cols_numbers, n)
    }
    result.set("c_car", c_car).set("c_rail", c_rail).set("c_plane", c_plane)

    first_row_number = first_row_number + m + step_between_tables_rows_numbers
    for (let row_number = first_row_number; row_number < m+first_row_number; row_number++){
        row = worksheet.getRow(row_number).values;
        gk_car = get_table_row(gk_car, row,row_number, first_row_number, first_column_number, n)
        gk_rail = get_table_row(gk_rail, row,row_number, 
            first_row_number, 
            first_column_number + n + step_between_tables_cols_numbers, n)
        gk_plane = get_table_row(gk_plane, row,row_number, 
            first_row_number, 
            first_column_number + 2*n + 2*step_between_tables_cols_numbers, n)
    }
    result.set("gk_car", gk_car).set("gk_rail", gk_rail).set("gk_plane", gk_plane)

    first_row_number = first_row_number + m + step_between_tables_rows_numbers
    // console.log(first_row_number)
    for (let row_number = first_row_number; row_number < m+first_row_number; row_number++){
        row = worksheet.getRow(row_number).values;
        t_car = get_table_row(t_car, row,row_number, first_row_number, first_column_number, n)
        t_rail = get_table_row(t_rail, row,row_number, 
            first_row_number, 
            first_column_number + n + step_between_tables_cols_numbers, n)
        t_plane = get_table_row(t_plane, row,row_number, 
            first_row_number, 
            first_column_number + 2*n + 2*step_between_tables_cols_numbers, n)
    }
    var s = worksheet.getRow(3).values[9];
    result.set("t_car", t_car).set("t_rail", t_rail).set("t_plane", t_plane).set("s", s)
    // console.log(s)
    first_row_number = m + step_between_tables_rows_numbers + first_row_number
    var stocks = new Array();
    var index = first_column_number+n
    var i = 0
    for (let row_number = first_row_number; row_number < m+first_row_number; row_number++){
        stocks[i] = worksheet.getRow(row_number).values[index];
        i++
    }
    // console.log(stocks)
    first_row_number = first_row_number+m
    var needs = new Array();
    i = 0
    for (let column_number = first_column_number; column_number < n+first_column_number; column_number++){
        row = worksheet.getRow(first_row_number).values
        needs[i] = row[column_number];
        i++
    }
    result.set("stocks", stocks).set("needs", needs)

    return result
    // resolve(result) 
  }
  
function build_model(dict){
    var model = new Object()
    model["optimize"] = "price"
    model["opType"] = "min"
    var constraints = new Object()
    const stocks = dict.get("stocks")
    //ограничения по a
    for(let i = 0; i < stocks.length; i++){
        constraints[`a${i+1}`] = {"equal":stocks[i]}
    }
    const needs = dict.get("needs")
    //ограничения по b
    for(let i = 0; i < needs.length; i++){
        constraints[`b${i+1}`] = {"equal":needs[i]}
    }
    const c_car = dict.get("c_car")
    const c_rail = dict.get("c_rail")
    const c_plane = dict.get("c_plane")
    const s = dict.get("s")
    get_s_constraints(constraints, c_car,"car",s)
    get_s_constraints(constraints, c_rail, "rail",s)
    get_s_constraints(constraints, c_plane, "plane",s)
    const gk_car = dict.get("gk_car")
    const gk_rail = dict.get("gk_rail")
    const gk_plane = dict.get("gk_plane")
    get_c_constraints(constraints, gk_car, "car")
    get_c_constraints(constraints, gk_rail, "rail")
    get_c_constraints(constraints, gk_plane, "plane")
    model["constraints"] = constraints

    var variables = new Object()
    var ints = new Object()
    const t_car = dict.get("t_car")
    const t_rail = dict.get("t_rail")
    const t_plane = dict.get("t_plane")
    get_r_variables_ints(variables,ints,c_car,gk_car,t_car,"car")
    get_r_variables_ints(variables,ints,c_rail,gk_rail,t_rail,"rail")
    get_r_variables_ints(variables,ints,c_plane,gk_plane,t_plane,"plane")
    model["variables"] = variables
    model["ints"] = ints

    return model;
}
function get_s_constraints(constraints,arr,str,s){
    for(let i = 0; i < arr.length; i++){
        for(let j = 0; j < arr[i].length; j++){
            if(arr[i][j]!=0){
                constraints[`s${i+1}_${str}`] = {"max":s}
                break;
            }
        }
    }
}
function get_c_constraints(constraints,arr,str){
    for(let i = 0; i < arr.length; i++){
        for(let j = 0; j < arr[i].length; j++){
            if(arr[i][j]!=0){
                constraints[`c_w_${i+1}_${j+1}_${str}`] = {"max":1}
                constraints[`c_r_w_${i+1}_${j+1}_${str}`] = {"min":0}
            }
        }
    }
}
function get_r_variables_ints(variables, ints, c_arr, gk_arr, t_arr, str){
    var temp_v = new Object()
    var gk
    for(let i = 0; i < c_arr.length; i++){
        for(let j = 0; j < c_arr[i].length; j++){
            if(c_arr[i][j]!=0){
                //-----        
                //дробные r и нет z. из s отномается все соответствующее t
                temp_v = new Object()
                gk = gk_arr[i][j]
                temp_v["price"] = c_arr[i][j]*gk
                temp_v[`a${i+1}`] = gk
                temp_v[`b${j+1}`] = gk
                temp_v[`s${i+1}_${str}`] = t_arr[i][j]
                temp_v[`c_r_w_${i+1}_${j+1}_${str}`] = -1
                variables[`r_${i+1}_${j+1}_${str}`] = temp_v
                //-----
                //w
                temp_v = new Object()
                temp_v[`c_w_${i+1}_${j+1}_${str}`] = 1
                temp_v[`c_r_w_${i+1}_${j+1}_${str}`] = 10000
                // temp_v["price"] = -1000000
                temp_v[`s${i+1}_${str}`] = t_arr[i][j]
                variables[`w_${i+1}_${j+1}_${str}`] = temp_v
                
                ints[`w_${i+1}_${j+1}_${str}`] = 1
            }
        }
    }
}
function solve_r_lp(dict){
    const time_start= new Date().getTime();
    var solver = require('javascript-lp-solver'),
    // results,
    model = build_model(dict)
    console.log(model)
    var constraints_count = 0
    for (var c in model['constraints']) {
        constraints_count+=1
    }
    var ints_count = 0
    for (var c in model['ints']) {
        ints_count+=1
    }
    var variables_count = 0
    for (var c in model['variables']) {
        variables_count+=1
    }
    console.log({
        "variables_count": variables_count,
        "constraints_count": constraints_count,
        "ints_count": ints_count
    })
    var results = solver.Solve(model);

    const time_end = new Date().getTime();
    //конвертация в r + z
    //---------------
    // for (obj in results){
    //     if(obj[0]==="r" && !Number.isInteger(results[obj]) && obj!=="result"){
    //         temp_r = results[obj]
    //         results[obj] = Math.ceil(results[obj])
    //         arrayOfStrings = obj.split("_");
    //         r = model["variables"][`r_${arrayOfStrings[1]}_${arrayOfStrings[2]}_${arrayOfStrings[3]}`]
    //         results[`z_${arrayOfStrings[1]}_${arrayOfStrings[2]}_${arrayOfStrings[3]}`] = (results[obj] - temp_r)*r[`a${arrayOfStrings[1]}`]
    //         // results[`z_${arrayOfStrings[1]}_${arrayOfStrings[2]}_${arrayOfStrings[3]}`] = ((results[obj] - temp_r)*r[`a${arrayOfStrings[1]}`]).toFixed(1)

    //     } else if(obj[0]==="w"){
    //         delete results[obj]
    //     }
    // }
    //----------------

    //----------------- конвертация в х
    var s_counted = new Object()
    var temp_r
    var arrayOfStrings
    var r
    var s
    for (var obj in results){
        if(obj[0]==="r" && obj!=="result"){
            temp_r = results[obj]
            arrayOfStrings = obj.split("_");
            r = model["variables"][`r_${arrayOfStrings[1]}_${arrayOfStrings[2]}_${arrayOfStrings[3]}`]
            results[`x_${arrayOfStrings[1]}_${arrayOfStrings[2]}_${arrayOfStrings[3]}`] = Number((temp_r*r[`a${arrayOfStrings[1]}`]).toFixed(2))
            s=`s${arrayOfStrings[1]}_${arrayOfStrings[3]}`
            if(s in s_counted){
                // console.log(r)
                s_counted[s]+=r[s]*Math.ceil(results[obj])
            } else{
                s_counted[s] = r[s]*Math.ceil(results[obj])
            }
            delete results[obj]
        } else if(obj[0]==="w"){
            delete results[obj]
        }
    }
    //--------------------------

    results["working time"] = time_end - time_start
    console.log(results);
    // console.log(typeof 'd');

    // //------- подсчет ограничений черех x
    // const_original = new Object()
    // const_counted = new Object()
    // constraints_model = model["constraints"]
    // for (obj in constraints_model){
    //     if(obj[0]==="a" || obj[0]==="b"){
    //         const_original[obj] = constraints_model[obj]["equal"]
    //         const_counted[obj] = 0
    //     }
    // }

    // for (obj in results){
    //     arrayOfStrings = obj.split("_");
    //     if(arrayOfStrings[0]==="x"){
    //         const_counted[`a${arrayOfStrings[1]}`]+=results[obj]
    //         const_counted[`b${arrayOfStrings[2]}`]+=results[obj]
    //     } 
    // }
    // console.log(const_original)
    // console.log(const_counted)
    // console.log(s_counted)
    // //-------------------------------


    //--------------- подсчет ограничений на a и b через r и z
    // variables = model.variables
    // // console.log(variables)
    // for (obj in results){
    //     arrayOfStrings = obj.split("_");
    //     if(arrayOfStrings[0]==="r"){
    //         const_counted[`a${arrayOfStrings[1]}`]+=variables[obj][`a${arrayOfStrings[1]}`]*results[obj]
    //         const_counted[`b${arrayOfStrings[2]}`]+=variables[obj][`b${arrayOfStrings[2]}`]*results[obj]
    //     } else if(arrayOfStrings[0]==="z"){
    //         const_counted[`a${arrayOfStrings[1]}`]-=results[obj]
    //         const_counted[`b${arrayOfStrings[2]}`]-=results[obj]
    //     }
    // }
    // console.log(const_original)
    // console.log(const_counted)
    //-------------


}
// build_model(start(2,2));
// parse_data_from_excel('C:\\Users\\misha\\Desktop\\code\\test_data_2x2.xlsx').then(solve_r_lp).catch(err => {    
//     console.log('.catch block ran: ', err);
//   });;
// parse_data_from_excel
parse_data_from_excel('C:\\Users\\misha\\Desktop\\code\\test_data\\test_data_5x12.xlsx').then(solve_r_lp);