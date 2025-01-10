import pg from 'pg';


export const db = new pg.Client({
   user: "postgres",
   host: "localhost",
 database: "blog",
    password: "Ayushi@12344",
    port: 5432,
});
//export const db = new pg.Client({
  //  connectionString: process.env.POSTGRES_URL,
  //})

db.connect(err => {
    if (err) {
        console.error('Connection error', err.stack);
    } else {
        console.log('Connected to the database');
    }
});

// Export the db object as a default export

