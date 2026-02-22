const fs = require("fs");

const file = "file.txt";
const writer = fs.createWriteStream(file);

const data = "This is my test data file";
writer.write(data, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("Write successfully");
});
