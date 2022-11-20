import React from "react";
import { fromLonLat } from "ol/proj";
import "ol/ol.css";
import { useState, useEffect } from "react";
import { RMap, ROSM, RLayerVector, RStyle } from "rlayers";
import Boat from "./Boat";
import { io } from "socket.io-client";

const socket = io("127.0.0.1:3001");
export const App = () => {
  let [boat1, setBoat1] = useState({ lon: 21, lat: 48, heading: 0 });
  let [boat2, setBoat2] = useState({});
  let [boat3, setBoat3] = useState({});
  useEffect(() => {
    socket.emit("connection");
    socket.on("data", (data) => {
      if (data.boat1) {
        setBoat1(data.boat1);
      }
      if (data.boat2) {
        setBoat2(data.boat2);
      }
      if (data.boat3) {
        setBoat3(data.boat3);
      }
    });
  });

  return (
    <div>
      <RMap
        width={"100%"}
        height={"100vh"}
        className="map"
        initial={{ center: fromLonLat([20.74, 48.215]), zoom: 16 }}
      >
        <ROSM />
        <RLayerVector zIndex={10}>
          <RStyle.RStyle>
            <RStyle.RCircle radius={5}>
              <RStyle.RFill color="transparent" />
            </RStyle.RCircle>
          </RStyle.RStyle>
          <Boat boat={boat1} />
          <Boat boat={boat2} />
          <Boat boat={boat3} />
        </RLayerVector>
      </RMap>
      <button>start recording</button>
      <button>stop recording</button>
      <button>play recording</button>
    </div>
  );
};
export default App;
