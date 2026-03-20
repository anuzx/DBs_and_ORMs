import { relations } from "drizzle-orm";
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

// one to one
export const UserPreferenceTable = pgTable("userPreferences", {
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


//RELATIONS: this enables nested query inside drizzle ,drizzle level references

export const UserTableRelations = relations(usersTable, ({ one, many }) => {
  return {
    preferences: one(UserPreferenceTable),
    posts: many(PostTable)
  }
})

//UserPreferenceTable has userId so we need to pass fields and references here
export const UserPreferencesTableRelations = relations(UserPreferenceTable, ({ one }) => {
  return {
    user: one(usersTable, {
      fields: [UserPreferenceTable.userId],
      references: [usersTable.id],

    })
  }
})

export const PostTableRealtions = relations(PostTable, ({ one, many }) => {
  return {
    author: one(usersTable, {
      fields: [PostTable.authorId],
      references: [usersTable.id]
    }),
    postCategories: many(PostCategoryTable)
  }
})

export const CategoryTableRelations = relations(CategoryTable, ({ many }) => {
  return {
    postCategories: many(PostCategoryTable)
  }
})

export const PostCategoryTableRealtions = relations(PostCategoryTable, ({ one }) => {
  return {
    post: one(PostTable, {
      fields: [PostCategoryTable.postId],
      references: [PostTable.id]
    }),
    category: one(CategoryTable, {
      fields: [PostCategoryTable.categoryId],
      references: [CategoryTable.id]
    })
  }
})
