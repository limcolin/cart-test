import React from "react"
import { render, screen } from "@testing-library/react"
import { StaticQuery } from "gatsby" // mocked

import CartPage from "../cart-page"
import { AppContext } from "~context/AppContext";

beforeEach(() => {
  StaticQuery.mockImplementationOnce(({ render }) =>
    render({
      allShopifyAdminProduct: {
        nodes: [
          {
            "id": "a56e2683-04e4-5ea8-9c14-05709b99e086",
            "image": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
            "title": "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
            "price": 109.95,
            "category": "men clothing",
            "description": "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday"
          },
          {
            "id": "55d7e61d-536d-5420-9b5e-dd3c40dde5e4",
            "image": "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
            "title": "Mens Casual Premium Slim Fit T-Shirts ",
            "price": 22.3,
            "category": "men clothing",
            "description": "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing. And Solid stitched shirts with round neck made for durability and a great fit for casual fashion wear and diehard baseball fans. The Henley style round neckline includes a three-button placket."
          },
          {
            "id": "e06a0c36-882c-5f8c-9b70-6858ecaed0a1",
            "image": "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
            "title": "Mens Cotton Jacket",
            "price": 55.99,
            "category": "men clothing",
            "description": "great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors. Good gift choice for you or your family member. A warm hearted love to Father, husband or son in this thanksgiving or Christmas Day."
          }
        ]
      }
    })
  )
})

describe(`Cart Page`, () => {

  /* (1x Product:a56e2683-04e4-5ea8-9c14-05709b99e086) + (7x Product:55d7e61d-536d-5420-9b5e-dd3c40dde5e4) = 8 Total Products */
  it(`Displays the number of products in cart`, () => {
    const { getByRole } = render(
      <AppContext.Provider value={{ cart: [{ id: `a56e2683-04e4-5ea8-9c14-05709b99e086`, quantity: 1 }, { id: `55d7e61d-536d-5420-9b5e-dd3c40dde5e4`, quantity: 7 }] }}>
        <CartPage />
      </AppContext.Provider>
    )

    const el = screen.getByRole(`product-count`)

    expect(el).toHaveTextContent("8")
  })

  /* 1x Product:e06a0c36-882c-5f8c-9b70-6858ecaed0a1 = $55.99 Total Cost */
  it(`Gets the right price based on Product ID`, () => {
    const { getByRole } = render(
      <AppContext.Provider value={{ cart: [{ id: `e06a0c36-882c-5f8c-9b70-6858ecaed0a1`, quantity: 1 }] }}>
        <CartPage />
      </AppContext.Provider>
    )

    const el = screen.getByRole(`subtotal`)

    expect(el).toHaveTextContent("$55.99")
  })

  /* 4x Product:55d7e61d-536d-5420-9b5e-dd3c40dde5e4 = $89.20 Total Cost */
  it(`Calculates subtotal by multiplying product price by quantity`, () => {
    const { getByRole } = render(
      <AppContext.Provider value={{ cart: [{ id: `55d7e61d-536d-5420-9b5e-dd3c40dde5e4`, quantity: 4 }] }}>
        <CartPage />
      </AppContext.Provider>
    )

    const el = screen.getByRole(`subtotal`)

    expect(el).toHaveTextContent("$89.20")
  })

  /* (88x * $109.95) + (8x * $55.99) = $10123.52 Total Cost */
  it(`Calculates subtotal by the sum of all line item costs`, () => {
    const { getByRole } = render(
      <AppContext.Provider value={{ cart: [{ id: `a56e2683-04e4-5ea8-9c14-05709b99e086`, quantity: 88 }, { id: `e06a0c36-882c-5f8c-9b70-6858ecaed0a1`, quantity: 8 }] }}>
        <CartPage />
      </AppContext.Provider>
    )

    const el = screen.getByRole(`subtotal`)

    expect(el).toHaveTextContent("$10123.52")
  })
})
