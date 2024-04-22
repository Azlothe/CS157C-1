import { client } from "../../connection.mjs"
import constants from "../../constants.mjs";

const createUserInfo = async () => {

    const query = `CREATE TABLE IF NOT EXISTS ${constants.KEYSPACE}.Users (
        userID UUID,
        username text,
        email text,
        PRIMARY KEY(email)
    );`
    await client.execute(query);
    console.log("created user table");
}

export default createUserInfo;