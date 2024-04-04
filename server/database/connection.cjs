const express = require('express');
const cors = require('cors');
const cassandra = require('cassandra-driver');

const app = express();
app.use(cors())
const client = new cassandra.Client({
    contactPoints: ['127.0.0.1'],
    localDataCenter: 'datacenter1',
    keyspace: 'emp',
});

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

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
