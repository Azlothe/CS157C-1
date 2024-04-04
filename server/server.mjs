import { client } from './database/connection.mjs';
import ENV from './EnvVars.mjs';
import express from 'express';
import cors from 'cors';
import { initDB } from './database/initDB.mjs';

const app = express();
app.use(cors());

initDB();

app.listen(ENV.PORT, () => {
    console.log(`Server running on port ${ENV.PORT}`);
});


// temporarily use for example data if needed for other parts of app while database is in progress
app.get('/api/emp', async (req, res) => {
    try {
        const query = 'SELECT * FROM emp';
        const result = await client.execute(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error executing Cassandra query:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});