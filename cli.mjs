import fs from "fs";
import csv from "fast-csv";
import figlet from "figlet";
import inquirer from "inquirer";
import crypto from "crypto"
import { stringify } from "csv-stringify"


let filepath;

const createNewCSV = async (path, data) => {
    let firstRowRetrieved = false;

    fs.createReadStream(path)
    .pipe(csv.parse({ delimiter: ',' }))
    .on('data', (column) => {
        if(!firstRowRetrieved){
            firstRowRetrieved = true;
            
            //add new column
            const formatted_column = [
                ...column,
                'sha256Hash'
            ];
            
            createNewCSVData(formatted_column, data);
        }
    })
}

//create file
const createNewCSVData = async (columns, data) => {
    let writableStream = fs.createWriteStream('nftx.output.csv');

    let total = data[data.length - 1]['Series Number']
    let stringifier = stringify({ header: true, columns: columns })


    for(const i in data){
        //this is each row

        //find each column from the insane key values
        let serial_number = data[i]['Series Number'] 
        let file_name = data[i]['Filename'] 
        let name = data[i]['Name']
        let description = data[i]['Description']
        let gender = data[i]['Gender']
        let attributes = data[i]['Attributes- Hair. Eyes. Teeth. Clothing. Accessories. Expression. Strength. Weakness']
        let uuid = data[i]['UUID']

        

        //create CHIP-0007 JSON 
        let json = {
            'format': 'CHIP-0007',
            'name': file_name,
            'description': description,
            'minting_tool': 'SuperMinter/2.5.2',
            'sensitive_content': false,
            'series_number': serial_number,
            'series_total': total,
            'attributes': [
                {
                    'trait_type': gender,
                    'value': attributes
                }
            ],
            'collection': {
                'name': 'Zuri NFT collection',
                'id': uuid,
                'attributes': [
                    {
                        'type': name,
                        'value': description
                    }
                ]
            }
        }

        //format the formatted data
        const hash = crypto.createHash('sha256').update(JSON.stringify(json)).digest('hex');


        let output = Object.assign(data[i], {
            sha256Hash: (uuid.length < 10) ? '' : hash
        })
        
        stringifier.write(output)
    }

    stringifier.pipe(writableStream);
    console.log('CSV file processed successfully');
    console.log(`New CSV file name is nftx.output.csv`)
}


const fileValidator = async (input) => {
    //let csv_file_path = path.resolve(__dirname, input)

    //console.log(csv_file_path)

    if (!fs.existsSync(input)) {
       return 'Place the CSV file in the same location as this script and type in a valid CSV filename';
    }
    return true;
 };





 //cli script
const runCLIScript = async () => {
    let csv_array_file = [];


    figlet('sha256 Hasher', function (err, data) {
        console.log(data)
    });
  
    // Wait for 2secs
    await new Promise(resolve => setTimeout(resolve, 1200));
  

    // Ask the user's name
    const { name } = await inquirer.prompt({
        type: "input",
        name: "name",
        message: "Please enter the name of the CSV file e.g database.csv:",
        validate: fileValidator
    }).then();
  
    // Set the user's name
    filepath = name;

    console.log(`Starting ${filepath} file processing`)

    fs.createReadStream(filepath)
    .pipe(csv.parse({
        headers: true
    }))
    .on('error', (e) => {
        console.log(e)
    })
    .on('data', (data) => {
        //push to array
        csv_array_file.push(data)
    })
    .on('end', () => {
        createNewCSV(filepath, csv_array_file)
        console.log('CSV data extracted')
    })
}

runCLIScript();