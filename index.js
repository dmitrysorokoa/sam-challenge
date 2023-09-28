const express = require('express')
const app = express()

const config = require('platformsh-config').config();

app.get('/', (req, res) => {
  res.send('Hello World1!')
})

app.get('/test', (req, res) => {
  res.send('test')
})

app.listen(config.port, () => {
  console.log(`Example app listening on port ${config.port}`)
})