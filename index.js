const express = require('express')
const path = require("path");
const app = express()

const config = require('platformsh-config').config();

app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static("public"));

// app.get('/', (req, res) => {
//   res.send('Hello World1!')
// })

app.get('/test', (req, res) => {
  res.send('test')
})

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

app.listen(config.port, () => {
  console.log(`Example app listening on port ${config.port}`)
})