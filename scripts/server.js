const express = require("express");
const http = require("http");
const https = require("https");
const app = express();
const fs = require("fs");
const path = require("path");
// const escapeHTML = require("escape-html");

let httpPort = 8080;
const httpsPort = 9000
// const staticPath = express.static(path.join(__dirname, "app"))

app.get("/", (request, response) => {
  fs.readFile(path.join(__dirname, '../app/index.html'), {
    encoding: 'utf8'
  }, function(err, data) {
    response.send(data);
  })
});

app.use(['/assets'], express.static(path.join(__dirname, "../app/assets")));
app.use(['/css'], express.static(path.join(__dirname, "../app/css")));
app.use(['/js'], express.static(path.join(__dirname, "../app/js")));
app.use(['/build'], express.static(path.join(__dirname, "../build")));

// Try to load the key and certificate for HTTPS

let httpsOptions = {};

try {
  // httpsOptions.key = fs.readFileSync("./server.key");
  // httpsOptions.cert = fs.readFileSync("./server.crt");
  httpsOptions.key = fs.readFileSync(path.resolve(__dirname + '/server.key'))
  httpsOptions.cert = fs.readFileSync(path.resolve(__dirname + '/server.crt'))
} catch(err) {
  console.error("Unable to load HTTPS cert and/or key; available on HTTP only: " + err);
  httpsOptions = null;
}

let httpServer = http.createServer(app);
httpServer.listen(httpPort, () => {
  const ip = require('ip').address()
  console.info(`https://${ip}:${httpsOptions ? httpsPort: httpPort}`)
});
httpServer.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    httpPort = 8888;
    httpServer = http.createServer(app);
    httpServer.listen(httpPort);
    console.log("Listening on port " + httpPort);
  } else {
    console.error("HTTP startup error: " + err);
  }
});

if (httpsOptions) {
  let httpServer = https.createServer(httpsOptions, app);
  httpServer.listen(httpsPort);
  console.log(`HTTPS listening on port ${httpsPort}`);
}
