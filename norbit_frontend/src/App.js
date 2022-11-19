import React from "react";
import { fromLonLat } from "ol/proj";
import { LineString, Point } from "ol/geom";
import "ol/ol.css";
import { useState } from "react";

import { RMap, ROSM, RLayerVector, RFeature, ROverlay, RStyle } from "rlayers";
const socket = new WebSocket("ws://127.0.0.1:8080");
export const App = () => {
  let [boat1, setBoat1] = useState([21, 48]);
  let [boat1Heading, setBoat1Heading] = useState(0);
  let [boat2, setBoat2] = useState([]);
  let [boat3, setBoat3] = useState([]);
  socket.onmessage = ({ data }) => {
    data = JSON.parse(data);
    setBoat1([data.boat1.lon, data.boat1.lat]);
    setBoat1Heading(data.boat1.heading);
    console.log(boat1, boat1Heading);
  };
  return (
    <div>
      <RMap
        width={"100%"}
        height={"60vh"}
        className="map"
        initial={{ center: fromLonLat([21, 48]), zoom: 11 }}
      >
        <ROSM />
        <RLayerVector zIndex={10}>
          <RStyle.RStyle>
            <RStyle.RCircle radius={5}>
              <RStyle.RFill color="" />
            </RStyle.RCircle>
          </RStyle.RStyle>
          <RFeature geometry={new Point(fromLonLat(boat1))}>
            <ROverlay className="no-interaction">
              <img
                src={"https://i.imgur.com/nq8dyRv.png"}
                style={{
                  position: "relative",
                  transform: `rotate(${boat1Heading}deg)`,
                  top: -12,
                  left: -12,
                  userSelect: "none",
                  pointerEvents: "none",
                }}
                width={24}
                height={24}
                alt="animated icon"
              />
            </ROverlay>
          </RFeature>
        </RLayerVector>
      </RMap>
      <button>click</button>
    </div>
  );
};
export default App;
