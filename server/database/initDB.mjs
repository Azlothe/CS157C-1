import { client } from "./connection.mjs";
import CONSTANTS from "./constants.mjs"
import initData from "./initData.mjs";
import createStrokes from "./models/strokes/strokes.mjs"
import createUserInfo from "./models/users/users.mjs";

const createKeyspace = async () => {
    const query = `CREATE KEYSPACE IF NOT EXISTS ${CONSTANTS.KEYSPACE} WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : 1 };`
    await client.execute(query);
    client.execute(`USE ${CONSTANTS.KEYSPACE};`);
    console.log("keyspace created");
}

const createTables = async () => {
    await Promise.all([
        createStrokes(),
        createUserInfo()
    ])
}

export async function initDB() {
    await createKeyspace();
    await createTables();

    initData();
}