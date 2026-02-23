const {parentPort} = require("worker_threads");

parentPort.on("message", (n) => {
    let sum = 0;
    for(let i=1; i<=n; i++) {
        sum+=i;
    }
    parentPort.postMessage(sum);
})