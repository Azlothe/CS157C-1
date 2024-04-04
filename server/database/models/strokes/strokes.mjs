import { client } from "../../connection.mjs"

const createCoordinateType = () => {
    const query = `CREATE TYPE IF NOT EXISTS Coordinate(
        x int,
        y int
    );`
    client.execute(query);
}

const createStrokes = async () => {
    createCoordinateType();

    const query = `CREATE TABLE IF NOT EXISTS Strokes (
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