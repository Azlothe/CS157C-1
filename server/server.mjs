import app from "./expressSetup.mjs";
import ENV from './EnvVars.mjs';
import { initDB } from './database/initDB.mjs';
import { WebSocketServer } from 'ws';
import strokeRoutes from "./routes/strokeRoutes.mjs";
import userRoutes from "./routes/userRoutes.mjs";
import { v4 as uuidv4 } from 'uuid';
import { client, types } from './database/connection.mjs';
import constants from './database/constants.mjs';

initDB();

app.use("/strokes/", strokeRoutes);
app.use("/users", userRoutes);

const server = app.listen(ENV.PORT, () => {
    console.log(`Server running on port ${ENV.PORT}`);
});

const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
    console.log('New WebSocket client connected');

    ws.on('message', async (message) => {
        console.log('Received message:', message);

        try {
            const stroke = JSON.parse(message);
            console.log('Parsed stroke:', stroke);

            stroke.strokeID = uuidv4();
            stroke.time = new Date();
            console.log('Generated strokeID and time:', stroke.strokeID, stroke.time);

            // Convert color array to Cassandra tuple
            const colorTuple = new types.Tuple(stroke.color[0], stroke.color[1], stroke.color[2]);
            console.log('Converted color to tuple:', colorTuple);

            await client.execute(
                `INSERT INTO ${constants.KEYSPACE}.Strokes (strokeID, username, email, coordinates, color, weight, time, minX, maxX, minY, maxY) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    stroke.strokeID,
                    stroke.username,
                    stroke.email,
                    stroke.coordinates,
                    colorTuple,
                    stroke.weight,
                    stroke.time,
                    stroke.minX,
                    stroke.maxX,
                    stroke.minY,
                    stroke.maxY,
                ],
                { prepare: true }
            );

            console.log('Inserted stroke data into Cassandra');

            wss.clients.forEach(client => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(stroke));
                }
            });

            console.log('Broadcasted stroke data to other clients');
        } catch (error) {
            console.error("Error handling WebSocket message:", error);
        }
    });

    ws.on('close', () => {
        console.log('WebSocket client disconnected');
    });
});
