import { ActionArgs, LoaderArgs, json } from "@remix-run/node";
import authenticate from "../shopify.server";
import shopify from "../shopify.server";

export default async function createProduct({request}: ActionArgs) {
  const {admin} = await shopify.authenticate.admin(request);
  const response = await admin.graphql(
    `#graphql
    mutation populateProduct($input: ProductInput!) {
      productCreate(input: $input) {
        product {
          id
        }
      }
    }`,
    {
      variables: {
        input: {
          title: 'New product',
          variants: [{price: 100}],
        },
      },
    },
  );
  const parsedResponse = await response.json();

  return json({data: parsedResponse.data});
}