const fs = require("fs");

// read stream, faster than write stream

const file = "file.txt";
const reader = fs.createReadStream(file);

reader.on("data", (chunk) => {
  const data = chunk.toString();
  console.log(data);
});

reader.on("error", (err) => {
  console.error("error while reading", err);
});
