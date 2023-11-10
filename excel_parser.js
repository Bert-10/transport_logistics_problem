
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

function get_table_row(c_car,row,row_number,first_row_number,first_column_number,n){
    for (let colomn_number = first_column_number; colomn_number < n+first_column_number; colomn_number++) {
        if (row[colomn_number]!=undefined){
            c_car[row_number-first_row_number][colomn_number-first_column_number]=row[colomn_number]
        }
    }
    return c_car;
}

async function parse_data_from_excel(filename) {
    const test_data_file = await workbook.xlsx.readFile(filename);
    var worksheet = test_data_file.worksheets[0];
    row = worksheet.getRow(3).values;
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
    s = worksheet.getRow(3).values[9];
    result.set("t_car", t_car).set("t_rail", t_rail).set("t_plane", t_plane).set("s", s)
    // console.log(s)
    first_row_number = m + 3 + first_row_number
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
  
export default parse_data_from_excel;
