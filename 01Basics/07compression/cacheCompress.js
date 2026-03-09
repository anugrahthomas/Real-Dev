const http = require("http");
const zlib = require("zlib");
const crypto = require("crypto");

// Real Production Flow
// Browser first request:
// GET /cache
// → 200 OK
// → ETag: xyz
// Second request:
// GET /cache
// If-None-Match: xyz
// Server:
// → 304 Not Modified
// → No body
// Bandwidth saved

http.createServer((req, res) => {
  if (req.url === "/cache") {

    const rawBody = "Hello World";
    // Compress sync not async
    const compressed = zlib.gzipSync(rawBody);

    // Generate ETag from compressed content
    const etag = crypto // etag is a validation token, if data change etag change
      .createHash("sha1")
      .update(compressed)
      .digest("hex");

    const ifNoneMatch = req.headers["if-none-match"]; // for current etag

    if (ifNoneMatch === etag) {
      res.statusCode = 304; // same content not updated
      return res.end();
    }

    // res.setHeader("Content-Type", "text/plain");

    res.setHeader("Vary", "Accept-Encoding");
    res.setHeader("Content-Encoding", "gzip");

    res.setHeader("Cache-Control", "public, max-age=3600, must-revalidate"); // cache is cached for 1hr by all(public): browser,cdn, etc
    res.setHeader("ETag", etag); // set etag for data

    res.statusCode = 200;
    res.end(compressed);// sending compressed data
  }
}).listen(3000);

