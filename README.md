# ✨ CHIP-0007 sha256 CSV processor
Backend system processing CSV files to create a CHIP-0007 JSON data and then calculate the sha256 hash of the JSON then append the hash to the CSV file.
Sounds like a lot but its nothing, please read through and give a star rating.

#

What this software does...
1. Accept a CSV file by either uploading or using the CLI
2. Runs through the CSV file creates a CHIP-0007 JSON data from the available information on the CSV file
3. Creates a `sha256` hash of each CHIP-0007 JSON data
4. Saves the sha256 hash as a new column on an output CSV file
5. Your new `csv` file and your CHIP-0007 `json` file has now been created


#
## 🧙 For CLI users


If you want to use the command line interface, you need to have Nodejs installed, you can download Nodejs [here](https://nodejs.org/en/download/)

1. ``git clone https://github.com/SilverC0de/hng-chiaNFT-CHIP-0007hash``
2. ``cd hng-chiaNFT-CHIP-0007hash``
3. Make sure the CSV file is added to the directory
4. ``npm i``
5. ``npm run cli``
6. Follow the CLI prompts
7. Your processed JSON file will now be found in the directory as `metadata.json`
8. Your processed CSV file will now be found in the directory as `nftx.output.csv`


#
## 🥷 For backend devs

This repository also allows uploading of your CSV file using Postman.

1. Make sure you're running Node.js on your system
2. ``git clone https://github.com/SilverC0de/hng-chiaNFT-CHIP-0007hash``
3. ``cd hng-chiaNFT-CHIP-0007hash``
4. ``npm i``
5. ``npm start``
6. Open Postman and make a POST request to http://localhost:8880/upload 
7. Upload your csv file using form-data with key **file**
8. It will return a response containing a link to the newly formatted CSV file and save a copy as `nft.output.csv`
9. It will also save the JSON file for the NFT as `metadata.json`