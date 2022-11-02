# ✨ CHIP-0007 sha256 CSV processor
Backend system processing CSV files to create a CHIP-0007 JSON data and then calculate the sha256 hash of the JSON then append the hash to the CSV file.
Sounds like a lot but its nothing, please read through and give a star rating.

######
## 😌 For non technical users

What the system does
1. Accept a csv file by uploading to https://hng-chianft-chip-0007hash.vercel.app/upload using the *file* key
2. Runs through the CSV file and gets each row
3. Converts each row to a Chia CHIP-0007 JSON format
4. Convert the JSON data to sha256 and append it to CSV file
5. Creates a download link for the new CSV file as team.output.csv


######
## 👩‍🦰 For frontend devs

1. Build a file upload interface that accept CSV file
2. Send the uploaded CSV file to the endpoint as explained below
    - Endpoint is **https://hng-chianft-chip-0007hash.vercel.app/upload**
    - Method is a **POST request**
    - Body type is **form-data**
    - Key is **file**
3. It will send back a response containing the download link to the new CSV file with sha256 hash of the JSON NFT data.


sample response
```json
{
    "status": true,
    "message": "New CSV file has been generated successfully",
    "link": "https://hng-chianft-chip-0007hash.vercel.app/bin/team.output.csv"
}
```


######
## 🥷 For backend devs

This repository allows you convert json data to sha256

1. Make sure you're running Node.js on your system
2. ``git clone https://github.com/SilverC0de/hng-chiaNFT-CHIP-0007hash``
3. ``cd hng-chiaNFT-CHIP-0007hash``
4. ``npm i``
5. Open Postman and make a POST request to http://localhost:8880/upload with your CSV file using form-data with key *file*
6. It will return a new CSV file containing sha256 hash of the NFTs

The structure of the JSON file for each NFT before hashing
```json
{
    "format": "CHIP-0007",
    "name": "Name of the NFT",
    "description": "Description of the NFT",
    "minting_tool": "SuperMinter/2.5.2",
    "sensitive_content": false,
    "series_number": 1,
    "series_total": 20,
    "attributes": [
        {
            "trait_type": "Name of the NFT",
            "value": "Short description of the NFT"
        }
    ],
    "collection": {
        "name": "Name of team that created this NFT",
        "id": "e43fcfe6-1d5c-4d6e-82da-5de3aa8b3b57",
        "attributes": [
            {
                "type": "Name of the NFT collection",
                "value": " Awesome NFT collection made by team Silver"
            }
        ]
    },
    "data": {
        "uuid": "e43fcfe6-1d5c-4d6e-82da-5de3aa8b3b57"
    }
}
```
