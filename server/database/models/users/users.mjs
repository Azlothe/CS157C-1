import { client } from "../../connection.mjs"
import constants from "../../constants.mjs";

const createUserInfo = async () => {

    const query = `CREATE TABLE IF NOT EXISTS ${constants.KEYSPACE}.Users (
        userID int,
        username text,
        PRIMARY KEY(userID)
    );`
    client.execute(query);
}

export default createUserInfo;