import { client } from './database/connection.mjs';
import ENV from './EnvVars.mjs';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());

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

app.listen(ENV.PORT, () => {
    console.log(`Server running on port ${ENV.PORT}`);
});
