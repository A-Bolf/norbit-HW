import { request, response } from "express";
import { pgclient } from ".";
export const addBoat = (boat, name) => {
  pgclient.query(
    'INSERT INTO "Boats" (latitude,longitude,heading,name) VALUES ($1,$2,$3,$4)',
    [boat.lat, boat.lon, boat.heading, name],
    function (err, result) {
      if (err) throw err;
      // console.log("1 record inserted");
    }
  );
};
