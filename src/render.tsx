import type { FC } from "hono/jsx";

export interface IPost {
  id: string;
  title: string;
  description: string;
}

export const Post: FC<{ post: IPost }> = ({ post }) => {
  return (
    <li class="shadow-sm my-2 p-4 rounded-md border border-slate-200">
      <h2>
        <span class="text-xs text-slate-600 mr-2">TITLE:</span>
        {post.title}
      </h2>
      <p>
        <span class="text-xs text-slate-600 mr-2">DESCRIPTION:</span>
        {post.description}
      </p>
      <button
        class="border mt-2 text-sm p-2 hover:bg-blue-300"
        hx-target="closest li"
        hx-swap="outerHTML swap:1s"
        hx-delete={`/post/${post.id}`}
      >
        Delete
      </button>
    </li>
  );
};

export const Layout: FC = (props) => {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/static/css/output.css" />
        <link rel="stylesheet" href="/static/css/common.css" />
      </head>
      <body>
        <main class="p-6">{props.children}</main>
        <script src="https://unpkg.com/htmx.org@1.9.11"></script>
        <script src="/static/js/app.js"></script>
      </body>
    </html>
  );
};

export const Top: FC<{ posts: IPost[] }> = ({ posts }) => {
  return (
    <Layout>
      <h1 class="text-3xl capitalize mb-4">Blogs</h1>
      <form
        hx-post="/post"
        hx-target=".post-list"
        hx-swap="beforeend"
        class="flex gap-2"
        {...{ "hx-on::after-request": "this.reset()" }}
      >
        <input class="border shadow-sm p-2" placeholder="Title" name="title" />
        <input
          class="border shadow-sm p-2"
          placeholder="Description"
          name="description"
        />
        <button type="submit">Post</button>
      </form>
      <ul class="post-list flex gap-2">
        {posts.map((post) => {
          return <Post post={post} />;
        })}
      </ul>
    </Layout>
  );
};
