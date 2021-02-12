/* eslint-disable react/prop-types */

import React, { useContext } from "react";
import { Link } from "gatsby";
import { AppContext } from "~context/AppContext";
import { DocumentContext } from "~context/DocumentContext";

const Header = () => {
  const {
    activeCurrency,
    setActiveCurrency,
    cart,
    cartActive,
    setCartActive,
    menuActive,
    setMenuActive
  } = useContext(AppContext);
  const { device } = useContext(DocumentContext);

  const toggleCart = () => {
    setCartActive(!cartActive);
    setMenuActive(false);
  };

  const toggleMenu = () => {
    setCartActive(false);
    setMenuActive(!menuActive);
  };

  //

  let cartLength = 0;

  cart.forEach(cartItem => {
    cartLength += cartItem.quantity;
  });

  return (
    <header
      className={`header ${cartActive ? ` cart-active` : ``} ${
        menuActive ? ` menu-active` : ``
      }  bg-black w-full h-12 fixed top-0 left-0 z-30 sm:z-50 px-8 xs:px-6 flex items-center justify-between text-white`}
    >
      <div className="animation-appear-down w-1/3 relative flex desktop-only text-white">
        <Link to="/">
          <button type="button" className="mr-10">
            <span className="header__text b1 uppercase condensed text-white">Shop</span>
          </button>
        </Link>

        <Link to="/cart">
          <button type="button">
            <span className="header__text b1 uppercase condensed text-white">Cart</span>
          </button>
        </Link>
      </div>

      <div className="animation-appear-down w-1/3 sm:w-full sm:justify-between relative flex items-center justify-end">
        <button onClick={toggleCart} type="button" className="relative block">
          <span className="header__text b1 uppercase condensed text-white">Bag</span>

          <figure className="header__flower w-4 h-4 absolute top-0 right-0 flex items-center justify-center -mt-1 -mr-4">
            <h4 className="b1 header__flower__text w-full h-full absolute top-0 right-0 bottom-0 left-0 text-center text-white">
              {cartLength}
            </h4>
          </figure>
        </button>

        <button
          type="button"
          className="menu__burger touch-only touch-only--flex w-5 h-12 relative items-center justify-center ml-6"
          onClick={toggleMenu}
        >
          <ul className="w-5 relative flex flex-col items-center justify-center pointer-events-none">
            <li className="menu__burger__line menu__burger__line--0 transition-opacity-transform w-5 relative block mb-3 border-b-2 border-white"></li>
            <li className="menu__burger__line menu__burger__line--1 transition-opacity-transform w-5 relative block border-b-2 border-white"></li>
          </ul>
        </button>
      </div>
    </header>
  );
};

export default Header;
