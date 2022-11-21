import React from "react";
import boatIcon from "./boat.png";
import { LineString, Point } from "ol/geom";
import { fromLonLat } from "ol/proj";
import { RFeature, ROverlay } from "rlayers";
const Boat = ({ boat }) => {
  return (
    <>
      <RFeature geometry={new Point(fromLonLat([boat.lon, boat.lat]))}>
        <ROverlay className="no-interaction">
          <img
            src={boatIcon}
            style={{
              position: "relative",
              transform: `rotate(${boat.heading}deg)`,
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
    </>
  );
};

export default Boat;
