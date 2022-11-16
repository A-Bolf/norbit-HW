import "./App.css";
import { useState } from "react";

function App() {
  const socket = new WebSocket("ws://127.0.0.1:8080");
  socket.onmessage = ({ data }) => {
    console.log(data);
  };
  const [data, setData] = useState(["asd"]);
  return <div className="App">{data}</div>;
}

export default App;
