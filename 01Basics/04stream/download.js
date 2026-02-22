const http = require("http");
const fs = require("fs");

http.createServer((req, res) => {
  if (req.url === "/download") {
    const stream = fs.createReadStream("file.zip");

    res.writeHead(200, {
      "Content-Type": "application/zip",
      "Content-Disposition": "attachment; filename=file.zip"
    });

    stream.pipe(res);
  }
}).listen(3000);
