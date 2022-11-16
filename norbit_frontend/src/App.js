import "./App.css";
import useWebSocket from "react-use-websocket";
import { useState } from "react";

const WSS_FEED_URL = "wss://www.cryptofacilities.com/ws/v1";

function App() {
  const [data, setData] = useState(["asd"]);
  const {} = useWebSocket(WSS_FEED_URL, {
    onOpen: () => console.log("WebSocket connection opened."),
    onClose: () => console.log("WebSocket connection closed."),
    shouldReconnect: (closeEvent) => true,
    onMessage: (event) => processMessages(event),
  });
  const processMessages = (event) => {
    setData(event.data);
  };
  return <div className="App">{data}</div>;
}

export default App;
