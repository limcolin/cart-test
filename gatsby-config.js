require(`dotenv`).config({
  path: `.env.${process.env.NODE_ENV}`
});

const autoprefixer = require(`autoprefixer`);
const proxy = require(`http-proxy-middleware`);
const tailwindCss = require(`tailwindcss`)(`./tailwind.config.js`);

module.exports = {
  developMiddleware: app => {
    app.use(
      `/.netlify/functions/`,
      proxy({
        target: `http://localhost:9000`,
        pathRewrite: {
          "/.netlify/functions/": ``
        }
      })
    );
  },
  plugins: [
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        postCssPlugins: [autoprefixer, tailwindCss]
      }
    },
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-root-import`,
    `gatsby-transformer-yaml`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/pages/`,
        name: `pages`
      }
    },
    {
      resolve: `gatsby-source-apiserver`,
      options: {
        url: `https://fakestoreapi.com/products`,
        method: `get`,
        headers: {
          "Content-Type": `application/json`
        },
        schemaType: {
          id: `111111`,
          title: `Dummy Product`,
          price: 1.50,
          category: `Dummy Category`,
          description: `Dummy Description`,
          image: `https://img2.pngio.com/index-of-areaedu-wp-content-uploads-2016-02-default-png-600_600.png`
        },
        name: `shopifyAdminProduct`
      }
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          `gatsby-remark-relative-images`,
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 968,
              sizeByPixelDensity: true,
              withWebp: true
            }
          },
          `gatsby-remark-lazy-load`,
          {
            resolve: `gatsby-remark-copy-linked-files`,
            options: {
              destinationDir: `${__dirname}/static`
            }
          }
        ]
      }
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-postcss`
  ]
};
