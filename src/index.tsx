import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { renderToReadableStream } from "hono/jsx/streaming";
import { IPost, Post, Top } from "./render";
import { z } from "zod";

const postSchema = z.object({
  title: z.string({ required_error: "Title is required" }).min(2),
  description: z.string({ required_error: "Description is required" }).min(2),
});

const app = new Hono();

app.use(
  "/static/*",
  serveStatic({
    root: "./",
    rewriteRequestPath: (path) => path.replace(/^\/static/, "./public"),
  })
);

let posts: IPost[] = [
  {
    id: crypto.randomUUID(),
    title: "Hello",
    description: "World",
  },
];

const port = 3000;
console.log(`Server is running on port http://localhost:${port}`);

app.get("/", (c) => {
  const streamableHTML = renderToReadableStream(<Top posts={posts} />);

  return c.body(streamableHTML, {
    headers: {
      "Content-Type": "text/html; charset=UTF-8",
      "Transfer-Encoding": "chunked",
    },
  });
});

app.delete("/post/:id", (c) => {
  const id = c.req.param("id");
  posts = posts.filter((post) => post.id !== id);

  return c.newResponse("", { status: 200 });
});

app.post("/clicked", (c) => {
  return c.html(<div>Button has been clicked</div>);
});

app.post("/post", async (c) => {
  const data = Object.fromEntries(Array.from(await c.req.formData()));

  const post: IPost = {
    id: crypto.randomUUID(),
    title: String(data["title"]),
    description: String(data["title"]),
  };

  if (postSchema.safeParse(post).success === false) {
    return c.newResponse("Invalid data", { status: 422 });
  }

  posts.push(post);

  return c.html(<Post post={post} />);
});

serve({
  fetch: app.fetch,
  port,
});
