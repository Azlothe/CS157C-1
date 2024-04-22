import express from "express";
import { client } from "../database/connection.mjs";
import constants from "../database/constants.mjs";

const router = express.Router();

router.get('/checkUserExists', async (req, res) => {
    const { email } = req.query;

    try {
        const query = `SELECT userID, username, email FROM ${constants.KEYSPACE}.Users WHERE email='${email}' ALLOW FILTERING;`;
        const result = await client.execute(query);

        return res.status(200).json({ exists: result.rows.length != 0 });

    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
