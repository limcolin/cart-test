/* eslint-disable react/prop-types */

import React, { useContext, useEffect, useRef, useState } from "react";
import { graphql } from "gatsby";
import Img from "gatsby-image";
import { AppContext } from "~context/AppContext";
import Layout from "~components/Layout";
import Parallaxer from "~components/Parallaxer";
import ProductGrid from "~components/ProductGrid";
import { splitStringToParagraphs } from "~utils/helpers";
import { DocumentContext } from "~context/DocumentContext";

const IndexPage = ({ data, location }) => {
  const { headerTransparent, setHeaderTransparent } = useContext(AppContext);
  const { device, scrollTop } = useContext(DocumentContext);
  const bannerRef = useRef();
  const [discountActive] = useState(true);
  const products = data.allShopifyAdminProduct.nodes;
  const parallaxTransform = px => `translate3d(0, ${scrollTop * px}px, 0)`;

  return (
    <>
      <Layout className="index-page w-full relative overflow-x-hidden">
        <ProductGrid
          heading="All Products"
          className="mt-24 xs:mt-16 xs:mb-12"
          products={products}
        />
      </Layout>
    </>
  );
};

export default IndexPage;

export const query = graphql`
  query IndexPage {
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
`;
