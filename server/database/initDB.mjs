import { client } from "./connection.mjs";
import CONSTANTS from "./constants.mjs"
import createStrokes from "./models/strokes/strokes.mjs"
import createUserInfo from "./models/users/users.mjs";

const createKeyspace = () => {
    const query = `CREATE KEYSPACE IF NOT EXISTS ${CONSTANTS.KEYSPACE} WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : 1 };`
    client.execute(query);
    client.execute(`USE ${CONSTANTS.KEYSPACE};`);
}

const createTables = async () => {
    createStrokes();
    createUserInfo();
}

export async function initDB() {
    createKeyspace();
    createTables();
}