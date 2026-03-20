import { uniqueIndex, unique, real, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { integer, pgTable, varchar, uuid, pgEnum, boolean } from "drizzle-orm/pg-core";


export const UserRole = pgEnum("UserRole", ["ADMIN", "NORMAL"])

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  age: integer("age").notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  role: UserRole("UserRole").default("NORMAL").notNull()
}, (table) => {
  return {
    emailIndex: uniqueIndex("emailIndex").on(table.email),
    uniqueNameandAge: unique("uniqueNameAndAge").on(table.name, table.age)// evry user will have unique name and age
  }
});


export const UserPreferenceTable = pgTable("userReferences", {
  id: uuid("id").primaryKey().defaultRandom(),
  emailUpdates: boolean("email_updates").notNull().default(false),
  userId: uuid("userId").references(() => usersTable.id).notNull() //foreign key reln
})


//one to many reln 
export const PostTable = pgTable("post", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  averageRating: real("averageRating").notNull().default(0),
  createdAt: timestamp("created_At").defaultNow().notNull(),
  authorId: uuid("author_id").references(() => usersTable.id).notNull() //one user can have many posts
})

//many to many reln

export const CategoryTable = pgTable("category", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull()
})

export const PostCategoryTable = pgTable("postCategory", {
  postId: uuid("post_id").references(() => PostTable.id).notNull(),
  categoryId: uuid("category_id").references(() => CategoryTable.id).notNull()
}, table => {
  return {
    primaryKey: primaryKey({ columns: [table.postId, table.categoryId] })
  }
})
