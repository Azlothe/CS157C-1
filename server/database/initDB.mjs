import { client } from "./connection.mjs";
import CONSTANTS from "./constants.mjs"

function createKeyspace() {
    const query = `CREATE KEYSPACE IF NOT EXISTS ${CONSTANTS.KEYSPACE} WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : 1 }`
    client.execute(query);
}

export function initDB() {
    createKeyspace();
}