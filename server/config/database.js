import { MongoClient } from "mongodb";

const host = process.env.HOST || "";
const database = process.env.DATABASE || "";

const client = new MongoClient(host)

let conn

try {
    conn = await client.connect()
} catch (error) {
    console.log(error)
}

let db = conn.db(database)

export default db;