import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import axios from "redaxios";
import { useState, useEffect } from "react";
import createApp from "@shopify/app-bridge";
import { getSessionToken } from "@shopify/app-bridge/utilities";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { LoaderArgs, json } from "@remix-run/node";
import shopify from "~/shopify.server";

export function Button() {
  async function handleClick() {
    // axios.post('https://shopbytest.myshopify.com/admin/api/2023-07/products.json', {
    //   "product": {
    //     "title": "Burton Custom Freestyle 151",
    //     "body_html": "<strong>Good snowboard!</strong>",
    //     "vendor": "Burton",
    //     "product_type": "Snowboard",
    //     "status": "draft"
    //   }
    // })
    // .then(function (response) {
    //   console.log(response);
    // })
    // .catch(function (error) {
    //   console.log(error);
    // });

    alert("Item created");
  }
  return <button onClick={handleClick}>Create product</button>;
}

export default function App() {

  const client = axios.create({
    baseURL: "https://jsonplaceholder.typicode.com/posts",
  });

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    client.get("?_limit=5").then((response) => {
      setPosts(response.data);
    });
  }, []);

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="app">
          <h2>All Posts 📫</h2>

          {posts.map((post) => {
            return (
              <div className="post-card" key={post.id}>
                <h2 className="post-title">
                  {post.id} {post.title}
                </h2>
                <p className="post-body">{post.body}</p>
              </div>
            );
          })}
          <Button></Button>
          <Outlet />
          <ScrollRestoration />
          <LiveReload />
          <Scripts />
        </div>
      </body>
    </html>
  );
}
