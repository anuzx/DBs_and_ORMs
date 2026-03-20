import { asc, sql, eq } from "drizzle-orm";
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
    columns: { email: true, name: true, age: true },
    extras: { lowerCaseName: sql<string>`lower(${usersTable.name})`.as("lowerCaseName") },//raw sql query
    limit: 1,
    offset: 1, //skips the first element in the array if offset:0 then returns all values
    with: {
      posts: { with: { postCategories: true } }
    },
    orderBy: asc(usersTable.age),
    where: (table, funcs) => funcs.eq(table.age, 20)
  })

  //updation

  const updatedUser = await db.update(usersTable).set({ age: 30 }).where(eq(usersTable.age, 29))

  //deletion 

  const delUser = await db.delete(usersTable).where(eq(usersTable.age, 30))
}

main()
