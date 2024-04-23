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

const createRangeType = async () => {
    const query = `CREATE TYPE IF NOT EXISTS ${constants.KEYSPACE}.Range(
        min int,
        max int
    );`
    await client.execute(query);
    console.log("created range type");
}

const createStrokes = async () => {
    await createCoordinateType();
    await createRangeType();

    const query = `CREATE TABLE IF NOT EXISTS ${constants.KEYSPACE}.Strokes (
        strokeID UUID, 
        username text, 
        email text,
        coordinates list<frozen <Coordinate>>, 
        color tuple<smallint, smallint, smallint>, 
        weight smallint, 
        time timestamp, 
        xRange frozen<Range>,
        yRange frozen<Range>,
        PRIMARY KEY(strokeID));`
    await client.execute(query);
    console.log("create stroke table");
}

export default createStrokes;