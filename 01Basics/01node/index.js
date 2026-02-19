const http = require("http");

// What is happening internally?
// Node:
//    - Creates socket
//    - Listens on port 3000
//    - Registers callback in event loop
//    - OS binds port to process
//    - Kernel handles networking


// Kernel accepts TCP connection
// Node event loop registers callback
// Request object is a stream
// Response object is a writable stream
// Everything is non-blocking
const server = http.createServer((req, res) => {
  if (req.url == "/") {
    // handling routes
    res.writeHead(200, { "Content-Type": "text/plain" }); // writing headers
    res.end("Hello server");
  }
});

server.listen(3000, () => {
  console.log("listening to port:3000");
});
