import { json } from "@remix-run/node";
import { Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css";
import { boundary, shopifyApp } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { authenticate } from "../shopify.server";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];
export async function loader({ request }) {
  await authenticate.admin(request);
  const { admin, session } = await authenticate.admin(request);

  // Use REST resources
  // const data = await admin.rest.resources.Product.count({
  //   session,
  //   product_type: "dress",
  // });

  const body = {
    product: {
      title: "Hiking backpack",
    },
  };

  // const allProducts = await admin.rest.get({
  //   path: "/products.json?",
  // });

  // get all products
  // const allProducts = await admin.rest.resources.Product.all({
  //   session: session,
  // });

  // Session is built by the OAuth process

  const product = new admin.rest.resources.Product({ session: session });
  product.title = "Burton Custom Freestyle 151";
  product.body_html = "<strong>Good snowboard!</strong>";
  product.vendor = "Burton";
  product.product_type = "Snowboard";
  product.status = "draft";
  await product.save({
    update: true,
  });

  return json({
    apiKey: process.env.SHOPIFY_API_KEY,
    // productCount: data.count,
    // allProducts,
  });
}

export default function App() {
  const {
    apiKey,
    // , productCount, allProducts
  } = useLoaderData();
  // const renderedProducts = allProducts.data.map((item, index) => (
  //   <li key={index}>
  //     {index} {JSON.stringify(item)}
  //   </li>
  // ));

  return (
    <AppProvider apiKey={apiKey} isEmbeddedApp>
      {/* <div>Product.count: {productCount}</div>
      <ul>{renderedProducts}</ul>
      <div>product: {JSON.stringify(allProducts.data)}</div> */}
      <Outlet />
    </AppProvider>
  );
}

// Shopify needs Remix to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
