import express, { json } from "express";
import http from "http";
import { Server } from "socket.io";
import WebSocket from "ws";
import pg from "pg";
import { addBoat } from "./queries.js";
import { clearInterval } from "timers";
import { time, timeStamp } from "console";
const app = express();
const server = http.createServer(app);
const options = {
  cors: true,
  origins: ["http://127.0.0.1:3001"],
};
const io = new Server(server, options);
const { Client } = pg;
let boatData = {};
let recordings = {};
let currentRecord = [];
let isRecording = false;
let isReplaying = false;

export const pgclient = new Client({
  user: "YOUR_PSQL_USERNAME",
  host: "localhost",
  database: "norbit",
  password: "YOUR_PASSWORD",
  port: 5432,
});
pgclient.connect(function (err) {
  if (err) throw err;
  console.log("Connected to psql!");
});
const boatSocket = new WebSocket("ws://127.0.0.1:8080");
boatSocket.onmessage = ({ data }) => {
  data = JSON.parse(data);
  boatData = data;
  for (const key in data) {
    if (Object.hasOwnProperty.call(data, key)) {
      const element = data[key];
      addBoat(element, key);
    }
  }
  if (isRecording) {
    currentRecord.push(data);
    console.log(data);
  }
};

const stopRecording = (socket) => {
  if (isRecording) {
    isRecording = false;
    let timeStamp = new Date();
    recordings[timeStamp] = currentRecord;
    currentRecord = [];
    socket.emit("record data", Object.keys(recordings));
  }
};
const startRecording = () => {
  if (!isReplaying) isRecording = true;
};
const playRecording = (recordName) => {
  if (!isReplaying && !isRecording) console.log("playing", recordName);
  currentRecord = JSON.parse(JSON.stringify(recordings[recordName]));
  isReplaying = true;
};
const stopReplay = () => {
  if (isReplaying) isReplaying = false;
};

io.on("connection", (socket) => {
  socket.emit("record data", Object.keys(recordings));
  let sendInterval = setInterval(() => {
    if (!isReplaying) {
      boatData.isRecording = isRecording;
      boatData.isReplaying = isReplaying;
      socket.emit("data", boatData);
    } else {
      let tick = currentRecord.shift();
      console.log(tick);
      if (tick) {
        tick.isRecording = isRecording;
        tick.isReplaying = isReplaying;
        socket.emit("data", tick);
      } else {
        isReplaying = false;
      }
    }
  }, 1000);
  socket.on("disconnect", () => {
    clearInterval(sendInterval);
  });
  socket.on("stop recording", () => {
    stopRecording(socket);
  });
  socket.on("start recording", () => {
    startRecording();
  });
  socket.on("play recording", (recordName) => {
    console.log(recordName);
    playRecording(recordName);
  });
  socket.on("stop replaying", () => {
    stopReplay();
  });
});

server.listen(3001, () => {
  console.log("listening on *:3001");
});
