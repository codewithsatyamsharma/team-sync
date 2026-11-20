import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("Set MONGODB_URI before running the migration.");

const inputPath = resolve(process.argv[2] || "data/team-sync.json");
const oldData = JSON.parse(await readFile(inputPath, "utf8"));
const names = ["employees", "messages", "tasks", "attendance", "departments", "documents", "sessions"];
const records = {
  employees: oldData.employees || [],
  messages: oldData.messages || [],
  tasks: oldData.tasks || [],
  attendance: oldData.attendance || [],
  departments: oldData.departments || [],
  documents: oldData.documents || [],
  sessions: Object.entries(oldData.sessions || {}).map(([id, employeeId]) => ({ id, employeeId })),
};

if (!Array.isArray(records.employees)) throw new Error("The source file does not contain an employee list.");
for (const name of names) {
  const idKey = name === "employees" ? "_id" : "id";
  if (!Array.isArray(records[name]) || records[name].some(item => !item[idKey])) {
    throw new Error(`Invalid ${name} records in ${inputPath}.`);
  }
}

const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 });
await client.connect();
try {
  const db = client.db(process.env.MONGODB_DB_NAME || "team_sync");
  await db.command({ ping: 1 });
  const collections = Object.fromEntries(names.map(name => [name, db.collection(name)]));
  const counts = await Promise.all(names.map(name => collections[name].countDocuments()));
  if (counts.some(Boolean)) throw new Error("Migration stopped: at least one target collection already has data. Use an empty MongoDB database.");

  const inserted = [];
  try {
    for (const name of names) {
      const idKey = name === "employees" ? "_id" : "id";
      const docs = records[name].map(item => ({ ...item, _id: item[idKey] }));
      if (docs.length) {
        await collections[name].insertMany(docs, { ordered: true });
        inserted.push([name, docs.map(item => item._id)]);
      }
    }
  } catch (error) {
    for (const [name, ids] of inserted) await collections[name].deleteMany({ _id: { $in: ids } });
    throw error;
  }
  console.log(`Imported Team Sync data from ${inputPath} to MongoDB database ${db.databaseName}.`);
} finally {
  await client.close();
}
