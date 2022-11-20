const fs = require("fs");
const { parse } = require("csv-parse");
const clients = new Map();
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 });
const boat1 = { lat: [], lon: [], heading: [] };
const boat2 = { lat: [], lon: [], heading: [] };
const boat3 = { lat: [], lon: [], heading: [] };

function readCSV() {
  fs.createReadStream("./lines/line1.csv")
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", function (row) {
      boat1.lat.push(row[0]);
      boat1.lon.push(row[1]);
      boat1.heading.push(row[2]);
    })
    .on("error", function (error) {
      console.log(error.message);
    });

  fs.createReadStream("./lines/line2.csv")
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", function (row) {
      boat2.lat.push(row[0]);
      boat2.lon.push(row[1]);
      boat2.heading.push(row[2]);
    })
    .on("error", function (error) {
      console.log(error.message);
    });

  fs.createReadStream("./lines/line3.csv")
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", function (row) {
      boat3.lat.push(row[0]);
      boat3.lon.push(row[1]);
      boat3.heading.push(row[2]);
    })
    .on("error", function (error) {
      console.log(error.message);
    });
}

function compileBoatData(line) {
  let boat = { lat: 0, lon: 0, heading: 0 };
  if (!line.includes(undefined)) {
    boat.lat = line[0];
    boat.lon = line[1];
    boat.heading = line[2];

    return boat;
  }
}

wss.on("connection", (ws) => {
  const id = uuidv4();
  const metadata = { id };

  clients.set(ws, metadata);
  readCSV();
  let sendInterval = setInterval(() => {
    let msg1 = compileBoatData([
      boat1.lat.shift(),
      boat1.lon.shift(),
      boat1.heading.shift(),
    ]);
    let msg2 = compileBoatData([
      boat2.lat.shift(),
      boat2.lon.shift(),
      boat2.heading.shift(),
    ]);

    let msg3 = compileBoatData([
      boat3.lat.shift(),
      boat3.lon.shift(),
      boat3.heading.shift(),
    ]);

    let message = JSON.stringify({ boat1: msg1, boat2: msg2, boat3: msg3 });

    if (message == "{}") {
      clearInterval(sendInterval);
    } else {
      ws.send(message);
    }
  }, 1000);

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
console.log("WSS running on port 8080");
