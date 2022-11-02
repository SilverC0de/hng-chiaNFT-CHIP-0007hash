const express = require('express')
const crypto = require('crypto')
const cors = require('cors');
const api = express()


api.use(express.urlencoded({ extended: true }));
api.use(express.json({ limit: '10mb' })); // Limit all JSON size to 10MB
api.use(cors());




api.post('/hash', (request, response) => {
    let json = request.body //JSON data


    //check if json contains a file
    if(Object.keys(json).length === 0 || !(json !== undefined && json !== null && (json.constructor == Object || json.constructor == Array))){
        //it does not have any key to convert to sha256
        return response.status(400).json({
            status: false,
            message: 'Please append a valid JSON file you want to convert to sha256',
            sha256: null
        })
    }


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
    response.status(404).send('CHIP-0007 sha256 hasher is running, open https://localhost:8880 on postman and send a post request containing the JSON file as the data to get the sha256 hash')
});


api.listen(8880, ()=> {
    console.log(`CHIP-0007 running on port 8880`)
})