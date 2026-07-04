/* global use, db */
// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

const database = "IT_HELP_DESK_DB";
const collection = "USERS";

// Create a new database.
use(database);

// Create a new collection.
db.createCollection(collection);

// The prototype form to create a collection:
 db.createCollection( collection,{name: "USERS", capped: false, autoIndexId: true, size: 5242880, max: 5000} );

// More information on the `createCollection` command can be found at:
// https://www.mongodb.com/docs/manual/reference/method/db.createCollection/
