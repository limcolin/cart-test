/* eslint-disable no-console */
/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const chalk = require(`chalk`);
const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);
const { fmImagesToRelative } = require(`gatsby-remark-relative-images`);

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        "~assets": path.resolve(__dirname, `src/assets`),
        "~components": path.resolve(__dirname, `src/components`),
        "~context": path.resolve(__dirname, `src/context`),
        "~data": path.resolve(__dirname, `src/data`),
        "~node_modules": path.resolve(__dirname, `node_modules`),
        "~scss": path.resolve(__dirname, `src/scss`),
        "~utils": path.resolve(__dirname, `src/utils`),
        "~workers": path.resolve(__dirname, `src/workers`)
      }
    }
  });
};

//

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;
  return graphql(`
    {
      allShopifyAdminProduct {
        nodes {
          id
          title
          price
          category
          description
          image
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      throw result.errors;
    }

    const { allShopifyAdminProduct } = result.data;

    allShopifyAdminProduct.nodes.forEach(node => {
      if (node.id === `dummy`) {
        return;
      }

      const { id, title, price, category, description, image } = node;
      const pagePath = `/products/${id}`;

      console.log(
        `${chalk.blue(`createPages → shopify [markdown] |`)} ${pagePath}`
      );

      createPage({
        path: pagePath,
        component: path.resolve(`src/templates/product-page.js`),
        context: {
          id,
          title
        }
      });
    });

    createPage({
      path: `/`,
      component: path.resolve(
        `src/templates/index-page.js`
      )
    });

    createPage({
      path: `/cart`,
      component: path.resolve(
        `src/templates/cart-page.js`
      )
    });

    return true;
  });
};
