/* eslint-disable react/prop-types */

import React, { useContext, useEffect, useRef, useState } from "react";
import { PropTypes } from "prop-types";
import { graphql, Link } from "gatsby";
import Img from "gatsby-image";
import { AppContext } from "~context/AppContext";
import { DocumentContext } from "~context/DocumentContext";
import Button from "~components/Button";
import Layout from "~components/Layout";

const ProductPage = ({ data, location }) => {

  const {
    addToCart,
  } = useContext(AppContext);
  const { device } = useContext(DocumentContext);
  const buttonRef = useRef();
  const [activeInfo, setActiveInfo] = useState(null);
  const [touchMove, setTouchMove] = useState(null);
  const [touchStart, setTouchStart] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const product = data.shopifyAdminProduct;

  let touchButtonActive = false;

  if (buttonRef?.current) {
    touchButtonActive =
      device === `mobile` && buttonRef.current.getBoundingClientRect().top < 0;
  }

  return (
    <>
      <div
        className={`product-page__touch-add ${
          touchButtonActive
            ? `active pointer-events-auto`
            : `pointer-events-none`
        } w-full fixed bottom-0 left-0 right-0 z-30`}
      >

        <Button
          className="w-full relative"
          color="black"
          onClick={() => addToCart(product, quantity)}
          text={
            `ADD TO BAG - $${parseFloat(
              product.price
            ).toFixed(2)}`
          }
        />
      </div>

      <Layout className="product-page w-full relative">
        <section className="relative flex flex-col items-stretch">
          <div className="grid items-start pt-12 xs:pt-12">
            <div className="h-full animation-appear-right-slow animation-delay-3 grid-end-8 grid-start-1 xs:grid-end-12">
              <figure className="w-full h-full relative flex items-center justify-center f3">
                <img
                  className="w-full relative block"
                  src={
                    product.image
                  }
                />
              </figure>
            </div>

            <div className="product-page__sidebar grid-end-4 xs:grid-end-12 sticky xs:relative right-0 xs:right-auto pl-3 xs:pl-0">
              {device === `desktop` && (
                <article className="w-full absolute xs:relative bottom-0 xs:bottom-auto right-0 xs:right-auto left-0 xs:left-auto pl-3 xs:pl-0">
                    <div className="w-full relative flex xs:flex-col end pointer-events-auto pb-3">
                      <div className="product-page__quantity w-24 xs:w-full relative flex items-center justify-between xs:mb-2 border-grey">
                        <button
                          type="button"
                          onClick={() =>
                            quantity > 1 ? setQuantity(quantity - 1) : null
                          }
                          className="pt-2 pb-3 px-4 b3 font-bold"
                        >
                          -
                        </button>

                        <span className="pb-1 b3 font-bold">{quantity}</span>

                        <button
                          type="button"
                          onClick={() => setQuantity(quantity + 1)}
                          className="pt-2 pb-3 px-4 b3 font-bold"
                        >
                          +
                        </button>
                      </div>

                      <div
                        ref={buttonRef}
                        className="w-full relative ml-4 xs:ml-0"
                      >
                        <Button
                          className="w-full relative"
                          color="black"
                          onClick={() => addToCart(product, quantity)}
                          text={`ADD TO BAG - $${parseFloat(
                            product.price
                          ).toFixed(2)}`}
                        />
                      </div>
                    </div>
                </article>
              )}

              <div className="product-page__sidebar__scroll w-full relative overflow-y-scroll pt-6">
                <Link
                  to="/"
                  className="flex items-center caption uppercase"
                >
                  <span>Back to shop</span>
                </Link>

                <h1 className="mt-10 mb-1 f3 uppercase">{product.title}</h1>

                {device && device !== `desktop` && (
                  <article className="w-full absolute xs:relative bottom-0 xs:bottom-auto right-0 xs:right-auto left-0 xs:left-auto pl-3 xs:pl-0">
                      <div className="w-full relative flex xs:flex-col end pointer-events-auto pb-3">
                        <div className="product-page__quantity w-24 xs:w-full relative flex items-center justify-between xs:mb-2 border-grey">
                          <button
                            type="button"
                            onClick={() =>
                              quantity > 1 ? setQuantity(quantity - 1) : null
                            }
                            className="pt-2 pb-3 px-4 b3 font-bold"
                          >
                            -
                          </button>

                          <span className="pb-1 b3 font-bold">{quantity}</span>

                          <button
                            type="button"
                            onClick={() => setQuantity(quantity + 1)}
                            className="pt-2 pb-3 px-4 b3 font-bold"
                          >
                            +
                          </button>
                        </div>

                        <div
                          ref={buttonRef}
                          className="w-full relative ml-4 xs:ml-0"
                        >
                          <Button
                            className="w-full relative"
                            color="black"
                            onClick={() => addToCart(product, quantity)}
                            text={`ADD TO BAG - $${parseFloat(
                              product.price
                            ).toFixed(2)}`}
                          />
                        </div>
                      </div>
                  </article>
                )}

                <article className="mt-10 mb-10 pt-2 border-t-grey-pale">
                  <p className="mb-3 b2">{product.description}</p>
                </article>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

ProductPage.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.shape({})
    })
  }).isRequired,
  location: PropTypes.shape({}).isRequired
};

export default ProductPage;

export const query = graphql`
  query ProductPage($id: String!) {
    shopifyAdminProduct(id: { eq: $id }) {
      id
      title
      price
      category
      description
      image
    }
  }
`;
