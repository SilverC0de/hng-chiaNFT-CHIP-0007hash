const express = require('express')
const api = express()

api.get('/', (request, response) => {
    response.status(200).json({
        slackUsername: 'Silver',
        backend: true,
        age: 25,
        bio: 'Getting shit done!'
    })
})

//for endpoints that are not valid
api.all('*', (request, response) => {
    response.status(404).send('Not a valid route, try the endpoint without any path')
});


api.listen(8880, ()=> {
    console.log(`Server running on port 8880`)
})