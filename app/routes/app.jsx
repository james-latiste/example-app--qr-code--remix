import { json } from "@remix-run/node";
import { Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css";
import { boundary, shopifyApp } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { authenticate } from "../shopify.server";
import { restResources } from "@shopify/shopify-api/rest/admin/2023-07";
import { Shopify } from "@shopify/shopify-api";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];
export async function loader({ request }) {
  await authenticate.admin(request);
  const { admin, session } = await authenticate.admin(request);

  // Use REST resources
  const data = await admin.rest.resources.Product.count({ session });
  // const client = await admin.rest.post({ path: "/product.json" });
  // const product = await client.json();
  const body = {
    product: {
      title: "Hiking backpack",
    },
  };
  // product.title = "Burton Custom Freestyle 151";
  // product.body_html = "<strong>Good snowboard!</strong>";
  // product.vendor = "Burton";
  // product.product_type = "Snowboard";
  // product.status = "draft";
  // await product.save({
  //   update: true,
  // });

  return json({
    apiKey: process.env.SHOPIFY_API_KEY,
    productCount: data.count,
  });
}

export default function App() {
  const { apiKey, productCount } = useLoaderData();

  return (
    <AppProvider apiKey={apiKey} isEmbeddedApp>
      Product.count <div>{productCount}</div>
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
