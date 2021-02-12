import React, { useContext, useState, useEffect } from "react";
import { Link } from "gatsby";
import PropTypes from "prop-types";
import Button from "~components/Button";
import { AppContext } from "~context/AppContext";
import { DocumentContext } from "~context/DocumentContext";

const ProductGrid = ({
  className,
  heading,
  max,
  omitHandle,
  products,
  withBorderTop
}) => {
  const [hoverIndex, setHoverIndex] = useState(false);
  const { addToCart } = useContext(
    AppContext
  );

  const { device } = useContext(DocumentContext);

  return (
    <section
      className={`product-grid w-full relative ${className} ${
        withBorderTop ? `border-t-grey-pale` : ``
      }`}
    >
      <header className="grid">
        <h3 className="animation-appear animation-delay-3 grid-end-6 xs:grid-end-12 f2 font-bold">
          {heading}
        </h3>
      </header>

      {products?.[0] && (
        <ul className="grid pt-24 sm:pt-16 pb-12">
          {products.map((product, productIndex) => {
            return (
              <li
                key={product.id}
                role="presentation"
                className="product-grid__item animation-appear-left-slow grid-end-3 xs:grid-end-12 relative flex flex-col justify-between py-2 px-2 xs:px-0 xs:mt-6 xs:mb-6"
                style={{
                  animationDelay: `${500 + productIndex * 150}ms`
                }}
              >
                <div className="h-full">
                  <Link to={`/products/${product.id}`}>
                    <div className="h-full flex flex-col justify-between">
                      <div className="h-full flex flex-col justify-center">
                        <img
                          src={product.image}
                        />
                      </div>
                      <p className="font-bold mt-6 whitespace-nowrap overflow-hidden overflow-ellipsis">{product.title}</p>
                    </div>
                  </Link>
                </div>

                <Button
                  className="w-full flex justify-center mt-6"
                  color="black"
                  onClick={() => addToCart(product)}
                  text={`Add to bag – $${parseFloat(
                    product.price
                  ).toFixed(2)}`}
                  transparent
                />
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};

ProductGrid.defaultProps = {
  className: `pt-8 xs:pt-16 pb-12 xs:pb-4`,
  heading: `Products`,
  max: null,
  omitHandle: null,
  withButton: true,
  withBorderTop: false
};

ProductGrid.propTypes = {
  className: PropTypes.string,
  heading: PropTypes.string,
  max: PropTypes.number,
  omitHandle: PropTypes.string,
  products: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  withButton: PropTypes.bool,
  withBorderTop: PropTypes.bool
};

export default ProductGrid;
