import CONFIG from './dbConfig.mjs';
import cassandra from "cassandra-driver";

export const client = new cassandra.Client({
    contactPoints: CONFIG.CONTACT_POINTS,
    localDataCenter: CONFIG.DATA_CENTER,
});