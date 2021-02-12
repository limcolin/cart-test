/* eslint-disable camelcase */
import React, { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useCookies } from "react-cookie";
import { globalHistory } from "@reach/router";
import { fancyError, fancyWarning } from "~utils/helpers";

export const AppContext = createContext({});

const AppProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartActive, setCartActive] = useState(false);
  const [cookies, setCookie] = useCookies(null);
  const [menuActive, setMenuActive] = useState(false);
  const [pathname, setPathname] = useState(null);

  useEffect(() => {
    if (window) {
      setPathname(window.location.pathname);
    }

    if (cookies?.cart) {
      let valid = Array.isArray(cookies.cart);

      cookies.cart.forEach(cookieCartItem => {
        if (!valid) {
          return;
        }

        if (
          typeof cookieCartItem === `undefined` ||
          cookieCartItem === null ||
          cookieCartItem === false ||
          cookieCartItem === ``
        ) {
          valid = false;
        }
      });

      if (!valid || process.env.GATSBY_RESET_COOKIES) {
        fancyWarning(`Resetting cart data`);
        setCart([]);
      } else {
        setCart(cookies.cart);
      }
    }

    return globalHistory.listen(({ location }) => {
      setPathname(location.pathname);
    });
  }, []);

  useEffect(() => {
    setCookie(`cart`, cart, { path: `/` });
  }, [cart]);


  const addToCart = (product, quantity = 1) => {

    let existingCartPosition = null;

    const cartClone = JSON.parse(JSON.stringify(cart));

    cartClone.forEach((cartItem, cartIndex) => {
      if (existingCartPosition !== null) {
        return;
      }

      if (cartItem.id === product.id) {
        existingCartPosition = cartIndex;
      }
    });

    if (existingCartPosition === null) {
      cartClone.push({
        quantity,
        id: product.id
      });
    } else {
      cartClone[existingCartPosition].quantity += quantity;
    }

    setCartActive(true);
    setCart(cartClone);
  };

  const decreaseQuantityByCartIndex = cartIndex => {
    if (!cart?.[cartIndex]) {
      return;
    }

    const cartClone = JSON.parse(JSON.stringify(cart));

    if (cartClone[cartIndex].quantity <= 1) {
      cartClone.splice(cartIndex, 1);
    } else {
      cartClone[cartIndex].quantity -= 1;
    }

    setCart(cartClone);
  };

  const increaseQuantityByCartIndex = (cartIndex, productWithVariant) => {
    if (!cart?.[cartIndex]) {
      return;
    }

    const cartClone = JSON.parse(JSON.stringify(cart));

    cartClone[cartIndex].quantity += 1;

    setCart(cartClone);
  };

  const removeFromCartByIndex = cartIndex => {
    if (!cart?.[cartIndex]) {
      return;
    }

    const cartClone = JSON.parse(JSON.stringify(cart));

    cartClone.splice(cartIndex, 1);

    setCart(cartClone);
  };

  return (
    <AppContext.Provider
      value={{
        cart,
        setCart,
        cartActive,
        setCartActive,
        menuActive,
        setMenuActive,
        pathname,
        //
        addToCart,
        decreaseQuantityByCartIndex,
        increaseQuantityByCartIndex,
        removeFromCartByIndex,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default AppProvider;
