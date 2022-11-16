const http = require("http");

const hostname = "127.0.0.1";
const port = 5000;

const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 });
const clients = new Map();
wss.on("connection", (ws) => {
  const id = uuidv4();
  const metadata = { id };
  clients.set(ws, metadata);
  ws.send("WS CONNECTED");
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
