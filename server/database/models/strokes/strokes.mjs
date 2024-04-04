import { client } from "../../connection.mjs"
import constants from "../../constants.mjs";

const createCoordinateType = () => {
    const query = `CREATE TYPE IF NOT EXISTS ${constants.KEYSPACE}.Coordinate(
        x int,
        y int
    );`
    client.execute(query);
}

const createStrokes = async () => {
    createCoordinateType();

    const query = `CREATE TABLE IF NOT EXISTS ${constants.KEYSPACE}.Strokes (
        strokeID int, 
        userID int, 
        username text, 
        coordinates list<frozen <Coordinate>>, 
        color tuple<tinyint, tinyint, tinyint>, 
        weight smallint, 
        time timestamp, 
        PRIMARY KEY(strokeID));`
    client.execute(query);
}

export default createStrokes;