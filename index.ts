import express, { Express, Request, Response } from 'express';
const path = require("path");
const app: Express = express()

const config = require('platformsh-config').config();

const port = !config.isValidPlatform() ? 3003 : config.port;

app.use(express.static(path.join(__dirname, "..", "client", "build")));
app.use(express.static("public"));

app.get('/api/test', (req: Request, res: Response) => {
  res.send({ data: 'test a12dc2vc' })
})

app.use((req: Request, res: Response, next) => {
  res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})