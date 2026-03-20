import { db } from "../index.ts";
import { usersTable } from "./schema.ts";

async function main() {

  //insertion
  const user = await db.insert(usersTable).values({
    name: "icarus",
    age: 20,
    email: "test@gamil.com"
  }).returning({
    id: usersTable.id,
  })

  //selection

  const findUser = await db.query.usersTable.findMany({
    columns:
  })
}

main()
