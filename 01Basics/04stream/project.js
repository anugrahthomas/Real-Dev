const fs = require("fs");
const { Transform } = require("stream");
const http = require("http");

http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/copy") {
    let totalBytes = 0;

    const counter = new Transform({
      transform(chunk, encoding, callback) {
        totalBytes += chunk.length;
        callback(null, chunk);
      }
    });

    const writer = fs.createWriteStream("copy.txt");

    req
      .pipe(counter)
      .pipe(writer)
      .on("finish", () => {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end(`Copied successfully. Total bytes: ${totalBytes}`);
      })
      .on("error", () => {
        res.writeHead(500);
        res.end("Stream error");
      });
  }
}).listen(3000);
