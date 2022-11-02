const express = require('express')
const crypto = require('crypto')
const cors = require('cors')
const fileupload = require('express-fileupload')
const { v4: uuidv4 } = require('uuid')
const api = express()


api.use(express.urlencoded({ extended: true }));
api.use(express.json({ limit: '10mb' })); // limit all JSON size to 10MB
api.use(fileupload({limits: { fileSize: 50 * 1024 * 1024 }})) //limit file upload to 50MB
api.use(cors());




api.post('/upload', (request, response) => {
    let uuid = uuidv4();

    //System Design
    //1. Get the CSV file
    //2. Create a JSON object with the CSV file with CHIP-0007 format
    //3. Get the sha256 hash the JSON object 
    //4. Write to the CSV file and append the sha256 hash
    //5. Save CSV file and create download link

    //check if any file was uploaded
    if(!request.files || Object.keys(request.files).length === 0){
        return response.status(400).json({
            status: false,
            message: 'No CSV file was uploaded',
            link: null
        })
    }


    // get the csv file
    let csv_file = request.files.file;


    //check if the csv file is valid
    if(csv_file == undefined){
        return response.status(400).json({
            status: false,
            message: 'Unable to get CSV file information',
            link: null
        })
    }


    //check the mimetype to make sure it is a CSV file
    if(csv_file.mimetype != 'text/csv'){
        return response.status(406).json({
            status: false,
            message: 'Please upload CSV files only',
            link: null
        })
    }


    //All checks completed, begin processing!

    //generate the hash of the json
    const hash = crypto.createHash('sha256').update(JSON.stringify(json)).digest('hex');

    return response.status(200).json({
        status: true,
        message: 'SHA256 hash of the JSON data has been generated',
        sha256: hash
    })
})


//for endpoints that are not valid
api.all('*', (request, response) => {
    response.status(404).send('CHIP-0007 sha256 CSV hasher is running')
});


api.listen(8880, ()=> {
    console.log(`CHIP-0007 running on port 8880`)
})