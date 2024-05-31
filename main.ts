const excel = require('exceljs');
const excel_file = new excel.Workbook();  

async function get_data_from_excel(filename) {
    const test_data_file = await excel_file.xlsx.readFile(filename);
    var model = new Object()
    model["products_list"] = []
    var products_list = model["products_list"]
    for (let worksheet_index = 0; worksheet_index < test_data_file.worksheets.length-1; worksheet_index++){
        var worksheet = test_data_file.worksheets[worksheet_index];
        var row = worksheet.getRow(1);
        var product = new Object()
        product["product_name"] = row.values[2]
        product["group"] = row.values[5]
        product["time"] = row.values[8]
        product["unit"] = row.values[11]
        // product["priority"] = row.values[14]
        product["transport_list"] = []
        var col_index = 5
        row = worksheet.getRow(3).values
        const rows_count = row[2] //count of rows
        const cols_count = row[3] //count of cols
        while(row[col_index]!=undefined){
            product["transport_list"].push({"transport_name":row[col_index]})
            col_index+=1
        }
        const first_row_index = 8
        const first_col_index = 3
        const step_between_tables_cols = 2
        const step_between_tables_rows = 4
        const transport_matrixs_list = ["cost","gk","time","calc_trips"]
        var current_table_first_row_index
        var current_table_first_col_index
        var matrix
        // console.log(product["transport_list"])
        for (let transport_index = 0; transport_index < product["transport_list"].length; transport_index++){ 
            current_table_first_col_index = first_col_index + transport_index*cols_count + transport_index*step_between_tables_cols
            for (let i = 0; i < transport_matrixs_list.length; i++){
                matrix = []
                current_table_first_row_index = first_row_index + i*rows_count + i*step_between_tables_rows
                
                for(let row_index = current_table_first_row_index; row_index < current_table_first_row_index+rows_count; row_index++){
                    row = worksheet.getRow(row_index).values
                    matrix.push([])
                    for(let col_index = current_table_first_col_index; col_index < current_table_first_col_index+cols_count; col_index++){
                        if(row[col_index]!=undefined){
                            matrix[matrix.length-1].push(row[col_index])
                        } else{
                            matrix[matrix.length-1].push("nan")
                        }      
                    }
                }
                // console.log(matrix)
                product["transport_list"][transport_index][transport_matrixs_list[i]] = matrix
            }
        }
        var temp_v = transport_matrixs_list.length
        current_table_first_row_index = first_row_index + temp_v*rows_count + temp_v*step_between_tables_rows
        current_table_first_col_index = first_col_index + cols_count
        product["stocks"] = []
        var row_values
        for(let row_index = current_table_first_row_index; row_index<current_table_first_row_index+rows_count; row_index++){
            row_values = worksheet.getRow(row_index).values
            product["stocks"].push({"stock_name": row_values[2], "value": row_values[current_table_first_col_index]})
        }
        
        product["needs"] = []
        current_table_first_row_index = first_row_index + (temp_v+1)*rows_count + temp_v*step_between_tables_rows
        const needs_row_values = worksheet.getRow(current_table_first_row_index).values
        current_table_first_row_index = first_row_index + temp_v*rows_count + temp_v*step_between_tables_rows-1
        const needs_row_names = worksheet.getRow(current_table_first_row_index).values
        for(let col_index = first_col_index; col_index<first_col_index+cols_count; col_index++){
            product["needs"].push({"need_name": needs_row_names[col_index], "value": needs_row_values[col_index]})
        }
        // console.log(product["transport_list"])
        products_list.push(product)
        // console.log(products_list)
        // console.log("fds")
    }

    var worksheet = test_data_file.worksheets[test_data_file.worksheets.length-1];
    var check = true
    var row_index = 3
    var row = worksheet.getRow(row_index);
    model["plan_list"] = []
    model["max_cost"] = worksheet.getRow(1).values[2]
    while(check){
        var plan = new Object()
        plan["model"] = row.values[2]
        plan["opt_func"] = row.values[3]
        plan["priority"] = row.values[4]
        plan["products_names"] = []
        var products_names_list = row.values[5].split(', ')
        for (let i = 0; i<products_names_list.length;i++){
            plan["products_names"].push(products_names_list[i])
        }
        model["plan_list"].push(plan)
        row_index++
        row = worksheet.getRow(row_index)
        if(row.values[2]==undefined){
            check = false
        }
    }
    console.log(model)
    // console.log("fdsf")
    // console.log(test_data_file.worksheets.length);
    return model
  }

var exec = require('child_process').execFile;
  /**
   * Function to execute exe
   * @param {string} fileName The name of the executable file to run.
   * @param {string[]} params List of string arguments.
   * @param {string} path Current working directory of the child process.
   */
function execute_file(fileName, params, path) {
    let promise = new Promise((resolve, reject) => {
        exec(fileName, params, { cwd: path }, (err, data) => {
              if (err) reject(err);
              else resolve(data);
              // console.log(data.toString());
          });
  
      });
      return promise;
  }

// var path_to_test_data ='E:\\Папка рабочего стола\\VScodeProjects\\vkr_js\\test_data3\\test_data_2x2.xlsx'
// var path_to_test_data ='E:\\Папка рабочего стола\\VScodeProjects\\vkr_js\\test_data3\\1 product\\fractional_big_time\\test_data_2x2.xlsx'
var path_to_test_data ='E:\\Папка рабочего стола\\VScodeProjects\\vkr_js\\test_data3\\1 product\\cost\\test_data_2x2_1_transport.xlsx'


get_data_from_excel(path_to_test_data).then(
    function(result){ 
        let fs = require('fs');
        // input_data_file_path - нужно указать ПОЛНЫЙ путь до файла с данными
        // let input_data_file_path = "E:\\Папка рабочего стола\\VScodeProjects\\vkr_js\\module_data\\module_input_data_5x12.json"
        let input_data_file_path = "E:\\Папка рабочего стола\\VScodeProjects\\vkr_js\\module_data\\module_input_data_2x2.json"
        fs.writeFile(input_data_file_path, JSON.stringify(result, null, 2),'utf8', (err) => err && console.error(err));
        let solver_name = 'main.exe'
        let solver_dir = 'E:\\Папка рабочего стола\\pyCharmProjects\\connect_solver_by_pulp\\dist'
        execute_file(solver_name, [input_data_file_path], solver_dir).then(
            function(result){ console.log(result)},
            function(error) { console.log(new Error(error))}
        )
    },
    function(error) { console.log(new Error(error)) }
  );
