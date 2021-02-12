/* eslint-disable react/prop-types */

import React, { useContext, useEffect } from "react";
import { graphql, Link, StaticQuery } from "gatsby";
import Img from "gatsby-image";
import { clearAllBodyScrollLocks, disableBodyScroll } from "body-scroll-lock";
import { AppContext } from "~context/AppContext";
import { DocumentContext } from "~context/DocumentContext";
import Button from "~components/Button";
import Cross from "~components/svg/Cross";
import { useKeyPress } from "~utils/hooks";

const query = graphql`
  query Nav {
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

const Nav = () => {
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
  const { device, scrollTop } = useContext(DocumentContext);

  let cartLength = 0;

  cart.forEach(cartItem => {
    cartLength += cartItem.quantity;
  });

  //

  const close = () => {
    setCartActive(false);
    setMenuActive(false);
  };

  //

  const escKeyPressed = useKeyPress(`Escape`);

  useEffect(() => {
    close();
  }, [escKeyPressed]);

  useEffect(() => {
    close();
  }, [scrollTop]);

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
          <div
            className={`nav ${cartActive ? `cart-active` : ``} ${
              menuActive ? `menu-active` : ``
            } w-screen h-screen fixed flex items-center justify-between z-40 pointer-events-none`}
          >
            <div
              role="presentation"
              className={`nav__background ${
                cartActive || menuActive
                  ? `opacity-50 pointer-events-auto`
                  : `opacity-0`
              } transition-opacity w-screen h-screen fixed top-0 right-0 bottom-0 left-0 z-10 bg-black`}
              onClick={close}
            ></div>

            {/* touch menu */}

            {menuActive && (
              <nav className="nav__menu transition-transform h-full absolute top-0 left-0 flex flex-col justify-between pointer-events-auto pt-24 z-20 bg-black text-white">
                <div className="grid items-start">
                  <ul className="grid-end-12">
                    <li className="animation-appear-right grid-end-12 animation-delay-1">
                      <Link
                        to="/"
                        className="block py-1 f1"
                        onClick={close}
                      >
                        Shop
                      </Link>
                    </li>
                    <li className="animation-appear-right grid-end-12 animation-delay-1">
                      <Link
                        to="/cart"
                        className="block py-1 f1"
                        onClick={close}
                      >
                        Cart
                      </Link>
                    </li>
                  </ul>
                </div>
              </nav>
            )}

            {/* cart */}

            <div
              className={`nav__cart  ${
                cartActive ? `pointer-events-auto` : ``
              } transition-transform h-full absolute top-0 right-0 z-20 bg-white`}
            >

              {/* cart container */}
              <div className="w-full h-full pb-32 sm:pb-40 bg-white text-black">
                {/* mobile cart header */}
                <div className="touch-only w-full h-12 relative px-4 bg-black text-white">
                  <div className="w-full h-full flex justify-between items-center">
                    <div className="relative block w-content">
                      <span className="header__text b1 uppercase condensed">
                        Bag
                      </span>

                      <figure className="header__flower w-4 h-4 absolute top-0 right-0 flex items-center justify-center -mt-1 -mr-4">
                        <h4 className="header__flower__text w-full h-full absolute top-0 right-0 bottom-0 left-0 text-center text-black">
                          {cartLength}
                        </h4>
                      </figure>
                    </div>
                  </div>

                  <button
                    className="w-12 h-full absolute top-0 right-0 flex items-center justify-center"
                    onClick={close}
                    type="button"
                  >
                    <Cross className="w-8 h-8" color="" />
                  </button>
                </div>

                <div className="w-full relative flex items-center justify-between pt-4 pl-4 pr-2">
                  <h3 className="py-8 pl-6 xs:pl-4 f3">Cart</h3>

                  <button
                    className="touch-only w-12 h-full"
                    onClick={close}
                    type="button"
                  >
                    <Cross className="w-8 h-8" color="black" />
                  </button>
                </div>

                {(cartActive && cart?.[0] && (
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
                        <h3 className="f3">
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
                )) || (
                  <h3 className="b1 text-center">Your cart is empty</h3>
                )}
              </div>
            </div>
          </div>
        );
      }}
    />
  );
};

export default Nav;
