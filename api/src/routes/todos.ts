import {Elysia} from "elysia"
import {database, todos} from "../db/drizzle"
import {eq} from "drizzle-orm"

// Helper to map completed 0/1 → boolean
const mapTodo = (todo: any) => ({...todo, completed: Boolean(todo.completed)});

export const todoRoutes = new Elysia()

  // GET /todos
  .get("/todos", async () => {
    const all = await database.select().from(todos)
    return all.map(mapTodo)
  })

  // POST /todos
  .post("/todos", async ({body}) => {
    const {title} = body as { title: string }
    if (!title) return {error: "Title is required"}
    const [newTodo] = await database.insert(todos).values({title}).returning()
    return mapTodo(newTodo)
  })

  // PUT /todos/:id
  .put("/todos/:id", async ({params, body}) => {
    const {id} = params
    const {title, completed} = body as { title?: string; completed?: boolean }
    await database
      .update(todos)
      .set({title, completed: completed ? 1 : 0})
      .where(eq(todos.id, Number(id)))
    const updated = await database.select()
      .from(todos)
      .where(eq(todos.id, Number(id)))
    return mapTodo(updated[0])
  })

  // DELETE /todos/:id
  .delete("/todos/:id", async ({params}) => {
    const {id} = params
    await database.delete(todos)
      .where(eq(todos.id, Number(id)))
    return {success: true}
  })
