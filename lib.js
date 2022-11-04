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
    let temp_team;
    let json_metadata = [];
    
    let writableStream = fs.createWriteStream('nft.output.csv');

    let total = data[data.length - 1]['Series Number']
    let stringifier = stringify({ header: true, columns: columns })


    //default team name
    temp_team = data[0]['TEAM NAMES'];

    for(const i in data){
        //this is each row

        if((data[i]['TEAM NAMES']).length > 0) temp_team = data[i]['TEAM NAMES']

        //find each column from the insane key values
        let team_name = ((data[i]['TEAM NAMES']).length == 0) ? temp_team : data[i]['TEAM NAMES']
        let serial_number = data[i]['Series Number'] 
        let file_name = data[i]['Filename'] 
        let name = data[i]['Name']
        let description = data[i]['Description']
        let gender = data[i]['Gender']
        let attributes = data[i]['Attributes']
        let uuid = data[i]['UUID']

        let attributes_array = [];

        //push team name
        attributes_array.push({
            trait_type: 'Team Name',
            value: team_name
        })


        //push name
        attributes_array.push({
            trait_type: 'Name',
            value: name
        })

        //push gender
        attributes_array.push({
            trait_type: 'Gender',
            value: gender
        })


        //split atributes and push too
        let attributes_text_array = attributes.split(';') //major delimeter

        for(const at in attributes_text_array) {
            let trait = attributes_text_array[at].split(':') //minor delimeter

            attributes_array.push({
                trait_type: String(trait[0]).trim(),
                value: String(trait[1]).trim(),
            })
        }
        
        //push UUID
        attributes_array.push({
            trait_type: 'UUID',
            value: uuid
        })

        //create CHIP-0007 JSON 
        let json = {
            'format': 'CHIP-0007',
            'name': String(file_name).trim(),
            'description': String(description).trim(),
            'minting_tool': 'SuperMinter/2.5.2',
            'sensitive_content': false,
            'series_number': serial_number,
            'series_total': total,
            'attributes': attributes_array,
            'collection': {
                'name': 'Zuri NFT Tickets for Free Lunch',
                'id': '9fec2493-14ab-45bc-8ff0-9bd4b5c20adc',
                'attributes': [
                    {
                        'type': 'Collection',
                        'value': 'Zuri NFT'
                    },
                    {
                        'type': 'Description',
                        'value': 'Rewards for accomplishments during HNGi9'
                    }
                ]
            }
        }

        //add data to main file
        json_metadata.push(json) //add to main josn file


        //hash the formatted data
        const hash = crypto.createHash('sha256').update(JSON.stringify(json)).digest('hex');


        //append to array
        let output = Object.assign(data[i], {
            sha256Hash: (uuid.length < 10) ? '' : hash
        })
        
        stringifier.write(output)
    }

    stringifier.pipe(writableStream);

    //save josn file
    fs.writeFile('metadata.json', JSON.stringify(json_metadata, null, 4), 'utf8', () => {
        console.log('finished writing csv and json data');
    });
}

module.exports = { createNewCSV }