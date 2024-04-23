import { client } from "../../connection.mjs"
import constants from "../../constants.mjs";

const createBlacklist = async () => {

    const query = `CREATE TABLE IF NOT EXISTS ${constants.KEYSPACE}.Blacklist (
        userID UUID,
        blacklisted_userID UUID,
        PRIMARY KEY(userID, blacklisted_userID)
    );`
    await client.execute(query);
    console.log("created blacklist table");
}

export default createBlacklist;