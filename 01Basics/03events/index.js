const process = require("process");

// | Poll Phase                | Check Phase                  |
// | ------------------------- | ---------------------------- |
// | Runs I/O callbacks        | Runs setImmediate callbacks  |
// | Can block waiting for I/O | Never blocks                 |
// | Core working phase        | Cleanup / continuation phase |

// Event loop order
// • Timers
// • Pending
// • Poll
// • Check
// • Close
// • (repeat)

// I/O also part of macrotask
console.log("Sync Above");

setImmediate(() => {
  console.log("immediate , Poll Phase"); // Macrotask
});

setTimeout(() => { // Macrotask
  console.log("timer, Timer Phase");
}, 0);

process.nextTick(() => { // highest priority (nextTick queue)
  console.log("Next Tick");
});

console.log("Sync Below");

Promise.resolve().then(() => { // microtask queue
  console.log("Promise, MacroTask Queue");
});


