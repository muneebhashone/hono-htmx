import type { FC } from "hono/jsx";

export interface IPost {
  id?: number;
  title: string;
  description: string;
}

export const Post: FC<{ post: IPost }> = ({ post }) => {
  return (
    <li className="shadow-sm my-2 p-4 rounded-md border border-slate-200 w-1/4">
      <h2>
        <span className="text-xs text-slate-600 mr-2">TITLE:</span>
        {post.title}
      </h2>
      <p>
        <span className="text-xs text-slate-600 mr-2">DESCRIPTION:</span>
        {post.description}
      </p>
      <button
        className="border mt-2 text-sm p-2 hover:bg-blue-300"
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
        <main className="p-6">{props.children}</main>
        <script src="https://unpkg.com/htmx.org@1.9.11"></script>
        <script src="/static/js/app.js"></script>
      </body>
    </html>
  );
};

export const Top: FC<{ posts: IPost[] }> = ({ posts }) => {
  return (
    <Layout>
      <h1 className="text-3xl capitalize mb-4">Blogs</h1>
      <form
        hx-post="/post"
        hx-target=".post-list"
        hx-swap="beforeend"
        className="flex gap-2"
        {...{ "hx-on::after-request": "this.reset()" }}
      >
        <input
          className="border shadow-sm p-2"
          placeholder="Title"
          name="title"
        />
        <input
          className="border shadow-sm p-2"
          placeholder="Description"
          name="description"
        />
        <button type="submit">Post</button>
      </form>
      <ul className="post-list flex gap-2 w-screen flex-wrap">
        {posts.map((post) => {
          return <Post post={post} />;
        })}
      </ul>
    </Layout>
  );
};
