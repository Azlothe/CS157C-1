import { client } from "../../connection.mjs"
import constants from "../../constants.mjs";

const createCoordinateType = async () => {
    const query = `CREATE TYPE IF NOT EXISTS ${constants.KEYSPACE}.Coordinate(
        x int,
        y int
    );`
    await client.execute(query);
    console.log("created coordinate type");
}

const createStrokes = async () => {
    await createCoordinateType();

    const query = `CREATE TABLE IF NOT EXISTS ${constants.KEYSPACE}.Strokes (
        strokeID UUID, 
        username text, 
        email text,
        coordinates list<frozen <Coordinate>>, 
        color tuple<smallint, smallint, smallint>, 
        weight smallint, 
        time timestamp, 
        minX int,
        maxX int,
        minY int,
        maxY int,
        PRIMARY KEY(strokeID));`
    await client.execute(query);
    console.log("create stroke table");
}

export default createStrokes;