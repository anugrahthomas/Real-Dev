const http = require("http");


http.createServer((req, res) => {
  if (req.url === "/block") {
    for (let i = 0; i < 5e9; i++) {}
    res.end("Blocked");
  }

  if (req.url === "/fast") {
    res.end("Fast");
  }
}).listen(3000);
