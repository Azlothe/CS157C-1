import express from "express";
import { client } from "../database/connection.mjs";
import constants from "../database/constants.mjs";

const router = express.Router();

const getUser = async (email) => {
  const query = `SELECT userID, username, email FROM ${constants.KEYSPACE}.Users WHERE email = ? ALLOW FILTERING;`;
  return await client.execute(query, [email], { prepare: true });
}

router.get("/getUser", async (req, res) => {
  const { email } = req.query;

  try {
    const result = await getUser(email);

    const userData = result.rows[0];

    if (userData) {
      const { userID, username, email } = userData;
      res.status(200).json({ userID, username, email });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/checkUserExists", async (req, res) => {
  const { email } = req.query;

  try {
    const result = await getUser(email);
    
    return res.status(200).json({ exists: result.rows.length != 0 });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/signup", async (req, res) => {
  const { username, email } = req.body;
  
  try {
    const result = await getUser(email);

    if (result.rows.length)
      return res.status(400).json({ error: "User already exists." });

    const query = `INSERT INTO ${constants.KEYSPACE}.Users (userID, username, email) VALUES (uuid(), ?, ?);`;
    await client.execute(query, [username, email], { prepare: true });

    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
