import express from "express";
import { client } from "../database/connection.mjs";
import { types } from "cassandra-driver";
import constants from "../database/constants.mjs";

const router = express.Router();

const findCoordinateRange = (coordinates) => {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  coordinates.forEach((coordinate) => {
    minX = Math.min(minX, coordinate.x);
    maxX = Math.max(maxX, coordinate.x);

    minY = Math.min(minY, coordinate.y);
    maxY = Math.max(maxY, coordinate.y);
  });

  return [ { min: minX, max: maxX }, { min: minY, max: maxY } ];
};

router.get("/", async (req, res) => {
  try {
    const query = `SELECT username, email, coordinates, color, weight FROM ${constants.KEYSPACE}.Strokes`;
    const result = await client.execute(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error executing Cassandra query:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  const { username, email, coordinates, color, weight } = req.body;

  const [xRange, yRange] = findCoordinateRange(coordinates);

  // Generating a current timestamp for the stroke
  const time = new Date().toISOString();

  try {
    // Also assuming the color is received as an object and needs to be converted into a tuple
    //const colorTuple = [color.r, color.g, color.b];
    const colorTuple = new types.Tuple(color.r, color.g, color.b);

    const insertQuery = `INSERT INTO ${constants.KEYSPACE}.Strokes (strokeID, username, email, coordinates, color, weight, time, xRange, yRange) VALUES (uuid(), ?, ?, ?, ?, ?, ?, ?, ?)`;
    await client.execute(
      insertQuery,
      [username, email, coordinates, colorTuple, weight, time, xRange, yRange],
      { prepare: true }
    );
    res.status(201).send("Stroke saved successfully");
  } catch (error) {
    console.error("Error saving stroke data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
