import React from "react";
import { fromLonLat } from "ol/proj";
import "ol/ol.css";
import { LineString } from "ol/geom";
import { useState, useEffect } from "react";
import { RMap, ROSM, RLayerVector, RStyle, RFeature } from "rlayers";
import Boat from "./Boat";
import { io } from "socket.io-client";

const socket = io("127.0.0.1:3001");
export const App = () => {
  let [boat1, setBoat1] = useState({});
  let [boat2, setBoat2] = useState({});
  let [boat3, setBoat3] = useState({});
  let [boat1Lines, setBoat1Lines] = useState([]);
  let [boat2Lines, setBoat2Lines] = useState([]);
  let [boat3Lines, setBoat3Lines] = useState([]);
  let [recordings, setRecordings] = useState([]);
  let [isRecording, setIsRecording] = useState(false);
  let [isReplaying, setIsReplaying] = useState(false);
  const handlePlayRecording = (recordKey) => {
    socket.emit("play recording", recordKey);
  };
  const handleStartRecording = () => {
    socket.emit("start recording");
  };
  const handleStopRecording = () => {
    socket.emit("stop recording");
  };
  const handleStopReplay = () => {
    socket.emit("stop replaying");
    setBoat1Lines([]);
    setBoat2Lines([]);
    setBoat3Lines([]);
  };

  useEffect(() => {
    socket.emit("connection");
    socket.on("record data", (data) => {
      if (data) {
        setRecordings(data);
      }
    });
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
      setIsRecording(data.isRecording);
      setIsReplaying(data.isReplaying);
    });
  }, []);

  useEffect(() => {
    if (isReplaying) {
      setBoat1Lines(
        [fromLonLat([boat1.lon, boat1.lat]), ...boat1Lines].filter(
          (x) => !isNaN(x[0])
        )
      );
      setBoat2Lines(
        [fromLonLat([boat2.lon, boat2.lat]), ...boat2Lines].filter(
          (x) => !isNaN(x[0])
        )
      );
      setBoat3Lines(
        [fromLonLat([boat3.lon, boat3.lat]), ...boat3Lines].filter(
          (x) => !isNaN(x[0])
        )
      );
    }
  }, [boat1, boat2, boat3]);

  return (
    <div>
      <RMap
        width={"100%"}
        height={"70vh"}
        className="map"
        initial={{ center: fromLonLat([20.74, 48.215]), zoom: 16 }}
      >
        <ROSM />
        {isReplaying && (
          <RLayerVector zIndex={1}>
            <RFeature geometry={new LineString(boat1Lines)}></RFeature>
            <RFeature geometry={new LineString(boat2Lines)}></RFeature>
            <RFeature geometry={new LineString(boat3Lines)}></RFeature>
          </RLayerVector>
        )}
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
      <p>Recording controls:</p>
      {isRecording ? (
        <button onClick={handleStopRecording}>stop Recording</button>
      ) : (
        <button onClick={handleStartRecording}>start Recording</button>
      )}
      {isReplaying && <button onClick={handleStopReplay}>stop Replay</button>}

      <p>Recordings:</p>
      <ul>
        {recordings.map((recording) => {
          return (
            <li
              onClick={() => {
                handlePlayRecording(recording);
              }}
              key={recording}
            >
              <button>{recording}</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export default App;
