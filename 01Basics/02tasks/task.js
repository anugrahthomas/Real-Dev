const http = require("http");

// 🧠 Architecture Thinking
// Right now you built:
// Monolithic single-threaded HTTP server.
// But in production:
// Client
// → Load Balancer
// → Multiple Node Instances
// → Redis Cache
// → PostgreSQL

// 🔐 Security Thinking Upgrade
// Ask yourself:
// 1. What if someone floods server?
// → You need rate limiting.
// 2. What if someone sends invalid JSON?
// → You need try/catch.
// 3. What if URL contains query params?
// /users?id=1
// → You need URL parsing.



// In-memory rate limitter using sliding window (networking approach) // not effcient
// we can use token bucket
const rateLimitStore = {};
const WINDOW_SIZE = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5;

const server = http.createServer((req, res) => {
  const ip = req.socket.remoteAddress;
  const now = Date.now();
  if (!rateLimitStore[ip]) {
    rateLimitStore[ip] = [];
  }
  // Remove old timestamps
  rateLimitStore[ip] = rateLimitStore[ip].filter(
    (timestamp) => now - timestamp < WINDOW_SIZE,
  );
  // Check limit
  if (rateLimitStore[ip].length >= MAX_REQUESTS) {
    res.writeHead(429, { "Content-Type": "text/plain" });
    return res.end("Too Many Requests");
  }
  // Add current request
  rateLimitStore[ip].push(now);

  const { method, url } = req;
  const urlObj = new URL(url, `http://${req.headers.host}`);
  const id = urlObj.searchParams.get("id");

  if (method === "GET" && urlObj.pathname === "/users") {
    if (id != null) { // handle query params
      res.writeHead(200, { "Content-Type": "application/json" });
      const user = {
        id: id,
        user: "User",
      };
      return res.end(JSON.stringify(user));
    }

    res.writeHead(200, { "Content-Type": "application/json" }); // get request
    const user = {
      id: 1,
      user: "User1",
    };
    return res.end(JSON.stringify(user));
  }

  if (method === "POST" && urlObj.pathname === "/users") { // post request
    let body = "";

    req.on("data", (chunk) => { // bcz req is stream handle it in chunks
      body += chunk;

      // Protection against large body
      if (body.length > 1e6) {
        req.socket.destroy();
      }
    });

    req.on("end", () => {
      try {
        const user = JSON.parse(body);
        res.writeHead(201, { "Content-Type": "application/json" });
        return res.end(JSON.stringify(user));
      } catch (err) {
        res.writeHead(400);
        return res.end("Invalid JSON");
      }
    });

    return; // IMPORTANT
  }

  // 404 handler
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found");
});

server.listen(3000);

