const http = require("http");

http
  .createServer((req, res) => {
    if (req.url === "/cache") {
      res.setHeader("Cache-Control", "public, max-age=3600, must-revalidate");
      res.setHeader("ETag", "abc123"); //name,value
      res.statusCode = 200;
      return res.end("");
    }

    if (req.url === "/validate") {
      const ifNoneMatch = req.headers["if-none-match"];
      const currentETag = "abc123";
      if (ifNoneMatch === currentETag) {
        console.log(ifNoneMatch);
        res.writeHead(304); //not modified
        res.end();
      } else {
        console.log(currentETag);
        res.setHeader("ETag", currentETag);
        res.end("Etag");
      }
    }
  })
  .listen(3000);

// real req header

// {
//   host: 'localhost:3000',
//   connection: 'keep-alive',
//   'cache-control': 'max-age=0',
//   'sec-ch-ua': '"Not(A:Brand";v="8", "Chromium";v="144", "Google Chrome";v="144"',
//   'sec-ch-ua-mobile': '?0',
//   'sec-ch-ua-platform': '"macOS"',
//   'upgrade-insecure-requests': '1',
//   'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36',
//   accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
//   'sec-fetch-site': 'none',
//   'sec-fetch-mode': 'navigate',
//   'sec-fetch-user': '?1',
//   'sec-fetch-dest': 'document',
//   'accept-encoding': 'gzip, deflate, br, zstd',
//   'accept-language': 'en-GB,en;q=0.9'
// }
