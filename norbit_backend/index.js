import express, { json } from "express";
import http from "http";
import { Server } from "socket.io";
import WebSocket from "ws";
import pg from "pg";
import { addBoat } from "./queries.js";
import { clearInterval } from "timers";
const app = express();
const server = http.createServer(app);
const options = {
  cors: true,
  origins: ["http://127.0.0.1:3001"],
};
const io = new Server(server, options);
const { Client } = pg;
let boatData = {};

export const pgclient = new Client({
  user: "hosc",
  host: "localhost",
  database: "norbit",
  password: "Porcica1",
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
};

io.on("connection", (socket) => {
  console.log("a user connected");
  let sendInterval = setInterval(() => {
    socket.emit("data", boatData);
    console.log(boatData);
  }, 1000);
  socket.on("disconnect", () => {
    clearInterval(sendInterval);
  });
});

server.listen(3001, () => {
  console.log("listening on *:3001");
});
