const fs = require("fs");
const { MongoClient, ObjectId } = require("mongodb");
const NoSqlCrudAdapter = require("./nosql-crud-adapter");
const SurveyStorage = require("./survey-storage");

const readFileSync = (filename) => fs.readFileSync(filename).toString("utf8");

const dbConfig = {
  host: process.env.DATABASE_HOST || "localhost",
  port: process.env.DATABASE_PORT || 27017,
  database: 'test',//process.env.DATABASE_DB,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD
    ? readFileSync(process.env.DATABASE_PASSWORD)
    : null,
};

// const url = `mongodb://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/`;
const url = `mongodb+srv://rtisadmin:rtisPassword@iri01.zv87dhr.mongodb.net/test?retryWrites=true&w=majority&appName=test`;
const client = new MongoClient(url);

function MongoStorage() {
  function dbConnectFunction(dbCallback) {
    client
      .connect()
      .then(() => {
        // const db = client.db(dbConfig.database);
        const db = client.db('test');
        dbCallback(db, () => {
          if (!!process.env.DATABASE_LOG) {
            console.log(arguments[0]);
            console.log(arguments[1]);
          }
          client.close();
        });
      })
      .catch(() => {
        console.error(JSON.stringify(arguments));
      });
  }
  const dbQueryAdapter = new NoSqlCrudAdapter(dbConnectFunction, () =>
    new ObjectId().toString()
  );
  return new SurveyStorage(dbQueryAdapter);
}

module.exports = MongoStorage;
