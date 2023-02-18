const { VM } = require('vm2');
const vm = new VM();
const fs = require('fs');

const { isMainThread, parentPort, workerData } = require('node:worker_threads');

const code = fs.readFileSync("9anime.js").toString();
vm.run(code);
let mainFunc = vm.run("mainFunction");

parentPort.on("message", message => {
    // Generates the VRF and posts it back to the main thread
    if (message[2] == "vrf") {
        parentPort.postMessage([message[0], mainFunc(16).default.Ft(message[1])]);
    } else if (message[2] == "decrypt") {
        parentPort.postMessage([message[0], mainFunc(16).default.fu(message[1])]);
    }
});