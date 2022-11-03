const fs = require('fs')
const csv = require('fast-csv');
const crypto = require('crypto')
const { stringify } = require('csv-stringify')


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

const createNewCSVData = async (columns, data) => {
    let writableStream = fs.createWriteStream('nft.output.csv');

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
    console.log('finished writing csv data');
}

module.exports = { createNewCSV }