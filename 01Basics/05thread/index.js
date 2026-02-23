const { Worker } = require("worker_threads");


const worker = new Worker("./worker.js");

const num = 1e9;
worker.postMessage(num);

// Sum: 500000000067109000
worker.on("message", (sum) => {
  console.log("Sum:", sum);
})
