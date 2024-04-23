import express from "express";
import { client } from "../database/connection.mjs";
import { types } from 'cassandra-driver';
import constants from "../database/constants.mjs";

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const query = `SELECT * FROM ${constants.KEYSPACE}.Strokes`;
        const result = await client.execute(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error executing Cassandra query:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/', async (req, res) => {
    const { username, coordinates, color, weight, email } = req.body;

    // Generating a current timestamp for the stroke
    const time = new Date().toISOString();

    try {
        // Also assuming the color is received as an object and needs to be converted into a tuple
        //const colorTuple = [color.r, color.g, color.b];
        const colorTuple = new types.Tuple(color.r, color.g, color.b);

        // Prepare your INSERT query
        const strokeId = Date.now()/1000;
        
        const insertQuery = `INSERT INTO ${constants.KEYSPACE}.Strokes (strokeID, username, email, coordinates, color, weight, time) VALUES (uuid(), ?, ?, ?, ?, ?, ?)`;
        await client.execute(insertQuery, [username, email, coordinates, colorTuple, weight, time], { prepare: true });
        res.status(201).send('Stroke saved successfully');
    } catch (error) {
        console.error('Error saving stroke data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
