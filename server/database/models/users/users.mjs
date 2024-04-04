import { client } from "../../connection.mjs"

const createUserInfo = async () => {

    const query = `CREATE TABLE IF NOT EXISTS Users (
        userID int,
        username text,
        PRIMARY KEY(userID)
    );`
    client.execute(query);
}

export default createUserInfo;