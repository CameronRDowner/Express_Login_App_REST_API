const express = require('express')
const app = express()

app.set('view-engine', 'ejs')

app.get('/', (apiRequest, apiResponse) => {
    apiResponse.render('index.ejs', { name: 'Cameron' })
})

app.listen(3000)