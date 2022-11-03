const express = require('express')
const cors = require('cors')
const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const fileupload = require('express-fileupload')
const { createNewCSV } = require('./lib')
const api = express()


api.use(express.urlencoded({ extended: true }));
api.use(express.json({ limit: '10mb' })); // limit all JSON size to 10MB
api.use(fileupload({limits: { fileSize: 50 * 1024 * 1024 }, useTempFiles : true, tempFileDir : '/tmp/'})) //limit file upload to 50MB
api.use(cors());




api.post('/upload', (request, response) => {
    let csv_array_file = [];
    

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


    // get the csv file path
    let csv_file_path = path.resolve(__dirname, request.files.file.tempFilePath)

    
    
    //All checks completed, begin processing!
    fs.createReadStream(csv_file_path)
        .pipe(csv.parse({
            headers: true
        }))
        .on('error', (e) => {

        })
        .on('data', (data) => {
            //push to array
            csv_array_file.push(data)
        })
        .on('end', () => {
            createNewCSV(csv_file_path, csv_array_file)
        })



    return response.status(200).json({
        status: true,
        message: 'New CSV file has been generated successfully',
        link: 'https://hng-chianft-chip-0007hash.vercel.app/download/nft.output.csv'
    })
})

api.get('/download/:filename', (request, response) => {
    let name = request.params.filename;
    let file = `${__dirname}/${name}`;
    response.download(file); // Set disposition and send it.
})

//for endpoints that are not valid
api.all('*', (request, response) => {
    response.status(404).send('CSV file processor to CHIP-0007 sha256 hasher is running')
});


api.listen(8880, ()=> {
    console.log(`CSV file processor to CHIP-0007 sha 256 hash running on port 8880`)
})