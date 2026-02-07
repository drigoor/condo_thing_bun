import {Elysia} from "elysia";
import {todoRoutes} from "./routes/todos.ts";

const app = new Elysia()

app.group("/api/v1", api =>
  api.use(todoRoutes)
);

app.listen(3000, () => console.log("API running at http://localhost:3000"));
