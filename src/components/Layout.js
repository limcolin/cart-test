import React, { useContext } from "react";
import PropTypes from "prop-types";

const Layout = ({ children, className }) => {

  return (
    <>
      <main
        id="layout"
        className={`layout max-w-6xl mx-auto ${className}`}
      >
        {children}
      </main>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string.isRequired
};

export default Layout;
