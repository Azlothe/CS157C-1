import cassandra from 'cassandra-driver';
// const cassandra = require('cassandra-driver');

const client = new cassandra.Client({
    contactPoints: ['127.0.0.1'],
    localDataCenter: 'datacenter1', // Name of the local data center
    keyspace: 'emp'
});

client.connect()
    .then(() => {
        console.log('Connected to Cassandra');
    })
    .catch((err) => {
        console.error('Error connecting to Cassandra:', err.message);
    });

export async function testingFunc(){
    console.log("testing");

    const query = 'SELECT * FROM emp';
    
    const result = await client.execute(query);
    //   .then(result => console.log('User with email %s', result.rows[0]));

    console.log('Query result:', result.rows);
}

testingFunc();