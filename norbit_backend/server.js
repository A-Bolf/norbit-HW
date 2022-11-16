const Fs = require("fs");
const CsvReadableStream = require("csv-reader");
const AutoDetectDecoderStream = require("autodetect-decoder-stream");
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 });
const clients = new Map();
let sendinterval;
let boatStream1 = Fs.createReadStream("norbit_backend/lines/line1.csv").pipe(
  new AutoDetectDecoderStream({ defaultEncoding: "1255" })
);
let boatStream2 = Fs.createReadStream("norbit_backend/lines/line2.csv").pipe(
  new AutoDetectDecoderStream({ defaultEncoding: "1255" })
);
let boatStream3 = Fs.createReadStream("norbit_backend/lines/line3.csv").pipe(
  new AutoDetectDecoderStream({ defaultEncoding: "1255" })
);
let boat1 = [];
let boat2 = [];
let boat3 = [];
const readData = (inputStream, arr) => {
  inputStream
    .pipe(
      new CsvReadableStream({
        skipHeader: true,
        parseNumbers: true,
        parseBooleans: true,
        trim: true,
      })
    )
    .on("data", function (row) {
      arr.push({ lat: row[0], lon: row[1], heading: row[2] });
    })
    .on("end", function () {
      console.log("read done");
    });
};
const readAllData = (streams, arrs) => {
  for (let i = 0; i < arrs.length; i++) {
    readData(streams[i], arrs[i]);
  }
};
readAllData([boatStream1, boatStream2, boatStream3], [boat1, boat2, boat3]);

const sendData = (ws, arrs) => {
  emptyArrCount = 0;
  for (let i = 0; i < arrs.length; i++) {
    if ((Array.length = 0)) {
      emptyArrCount++;
    }
  }
  if (emptyArrCount === arrs.length) {
    clearInterval(sendinterval);
    return;
  }
  ws.send(
    JSON.stringify({
      boat1: arrs[0].shift(),
      boat2: arrs[1].shift(),
      boat3: arrs[2].shift(),
    })
  );
  console.log(
    JSON.stringify({
      boat1: arrs[0].shift(),
      boat2: arrs[1].shift(),
      boat3: arrs[2].shift(),
    })
  );
};

wss.on("connection", (ws) => {
  const id = uuidv4();
  const metadata = { id };
  clients.set(ws, metadata);
  if (sendinterval === undefined && clients.length !== 0) {
    sendinterval = setInterval(() => {
      sendData(ws, [boat1, boat2, boat3]);
    }, 1000);
  }
  ws.on("close", () => {
    clients.delete(ws);
  });
});

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

console.log("wss up");
