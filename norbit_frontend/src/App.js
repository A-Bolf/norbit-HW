import "./App.css";
import { useState } from "react";
const socket = new WebSocket("ws://127.0.0.1:8080");

function App() {
  socket.onmessage = ({ data }) => {
    data = JSON.parse(data);
    console.log(data);
    if (data.boat1 !== undefined) {
      setBoat1(data.boat1);
    }
    if (data.boat2 !== undefined) {
      setBoat2(data.boat2);
    }
    if (data.boat3 !== undefined) {
      setBoat3(data.boat3);
    }
    if (JSON.stringify(data) === "{}") {
      socket.close();
    }
  };
  const [boat1, setBoat1] = useState("NO DATA");
  const [boat2, setBoat2] = useState("NO DATA");
  const [boat3, setBoat3] = useState("NO DATA");
  return (
    <>
      <div>
        boat1 pos: lat: {boat1.lat} lon: {boat1.lon} heading:{boat1.heading}
      </div>
      <div>
        boat2 pos: lat: {boat2.lat} lon: {boat2.lon} heading:{boat2.heading}
      </div>
      <div>
        boat3 pos: lat: {boat3.lat} lon: {boat3.lon} heading:{boat3.heading}
      </div>
    </>
  );
}

export default App;
