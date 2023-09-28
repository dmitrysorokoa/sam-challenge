const express = require('express')
const path = require("path");
const app = express()

const config = require('platformsh-config').config();

const port = !config.isValidPlatform() ? 3003 : config.port;

app.use(express.static(path.join(__dirname, "client", "build")));
app.use(express.static("public"));

// app.get('/', (req, res) => {
//   res.send('Hello World1!')
// })

app.get('/test', (req, res) => {
  res.send({ data: 'test bla' })
})

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})