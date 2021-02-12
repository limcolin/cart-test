/* eslint-disable react/prop-types */

import React, { useContext, useEffect, useRef, useState } from "react";
import { graphql, Link, StaticQuery } from "gatsby";
import { AppContext } from "~context/AppContext";
import Layout from "~components/Layout";
import Button from "~components/Button";

const query = graphql`
  query CartPage {
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

const CartPage = () => {
  const {
    cart,
    cartActive,
    setCartActive,
    addToCart,
    menuActive,
    setMenuActive,
    decreaseQuantityByCartIndex,
    increaseQuantityByCartIndex,
    removeFromCartByIndex,
  } = useContext(AppContext);

  let cartLength = 0;
  cart.forEach(cartItem => {
    cartLength += cartItem.quantity;
  });

  return (
    <StaticQuery
      query={query}
      render={data => {
        const products = data.allShopifyAdminProduct.nodes;
        const navCart = [];

        let cartTotal = 0;

        cart.forEach(cartItem => {
          const lineItemDetails = products.find(product => product.id === cartItem.id)
          const lineItemCost = lineItemDetails.price * cartItem.quantity;

          cartTotal += lineItemCost;

          navCart.push({
            id: cartItem.id,
            quantity: cartItem.quantity,
            //
            image: lineItemDetails.image,
            price: lineItemDetails.price,
            slug: `/products/${lineItemDetails.id}`,
            title: lineItemDetails.title
          });
        });

        return (
          <Layout className="product-page w-full relative">
            {/* cart container */}
            <div className="grid">
              <div className="w-full h-screen grid-end-12 pb-32 sm:pb-40 bg-white text-black">
                <div className="w-full relative flex items-center justify-between pt-8 pl-4 pr-2">
                  <h3 className="py-8 pl-6 xs:pl-4 f2 font-bold">Cart</h3>
                  <h4 className="b1 text-center text-black font-bold"><span role="product-count">
                    {cartLength}
                  </span> Items
                  </h4>
                </div>

                {cart?.[0] && (
                  <>
                    <ul className="nav__cart__list relative overflow-y-scroll">
                      {navCart.map((cartItem, cartItemIndex) => {
                        return (
                          <li
                            key={cartItem.id}
                            className="nav__cart__list__item animation-appear-down relative flex items-center mb-8 sm:mb-2"
                          >
                            <div className="w-1/4 relative block">
                              <figure className="square">
                                {cartItem?.image && (
                                  <div className="w-full absolute transform-center p-4">
                                    <img
                                      className="w-full relative block"
                                      src={
                                        cartItem.image
                                      }
                                      alt={cartItem.title}
                                    />
                                  </div>
                                )}
                              </figure>
                            </div>

                            <div className="w-3/4 relative px-6 sm:px-4">
                              <div className="relative flex justify-between">
                                <h3 className="mb-1 f4 uppercase">
                                  {cartItem.title}
                                </h3>

                                <button type="button" className="relative self-end mb-2 -mt-1 hover-underline" onClick={() => removeFromCartByIndex(cartItemIndex)}>
                                  <span className="caption">Remove</span>
                                </button>
                              </div>

                              <div className="relative flex justify-between">
                                <div className="relative flex">
                                  <button type="button" className="pr-10 f4" onClick={() => decreaseQuantityByCartIndex(cartItemIndex)}>
                                    <span className="caption">-</span>
                                  </button>

                                  <h4 className="f4">{cartItem.quantity}</h4>

                                  <button type="button" className="pl-10 f4" onClick={() => increaseQuantityByCartIndex(cartItemIndex, cartItem)}>
                                    <span className="caption">+</span>
                                  </button>
                                </div>

                                <div className="relative flex flex-col">
                                  <h4 className="f4">${`${parseFloat(cartItem.price).toFixed(2)}`}</h4>
                                </div>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>

                    <div className="w-full absolute right-0 bottom-0 left-0 z-10 pt-8 px-8 pb-8 xs:pb-20 bg-black text-white">
                      <header className="relative flex justify-between mb-4">
                        <h3 className="f3">Subtotal</h3>
                        <h3 className="f3" role="subtotal">
                          ${parseFloat(cartTotal).toFixed(2)}
                        </h3>
                      </header>

                      <Button
                        className="w-full"
                        color="white"
                        text="Checkout"
                      />
                    </div>
                  </>
                ) || (
                  <h3 className="b1 text-center">Your cart is empty</h3>
                )}
              </div>
            </div>
          </Layout>
        );
      }}
    />
  );
};

export default CartPage;
