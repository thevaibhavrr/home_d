
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../../styles/category.css";
import "../../styles/cartpop.css";
import { motion, AnimatePresence } from "framer-motion";
import { makeApi } from "../../api/callApi";
import Loader from "../../components/loader/loader";
import FooterBar from "../footrt/FooterBar";

function Repair() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState({});
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (isInitialLoad) {
      window.scrollTo(0, 0);
      setIsInitialLoad(false);
    }
  }, [isInitialLoad]);

  // Fetch category products
  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      try {
        const response = await makeApi(
          `/api/get-products-by-service-id/Repair`,
          "GET"
        );
        const sortedProducts = response.data.products.sort(
          (a, b) => a.FinalPrice - b.FinalPrice
        );

        // Add default shop and price for products with shopPrices
        const updatedProducts = sortedProducts.map((product) => {
          if (product.shopPrices?.length > 0) {
            product.defaultShop = product.shopPrices[0].shopname;
            product.defaultPrice = product.shopPrices[0].price;
            product.defaultFinalPrice = product.shopPrices[0].FinalPrice;
          }
          return product;
        });

        setProducts(updatedProducts);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, [category]);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || {};
    setCart(storedCart);
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    if (Object.keys(cart).length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  const getTotalCartValue = () => {
    return Object.values(cart).reduce(
      (total, item) => total + item.FinalPrice * item.quantity,
      0
    );
  };

  const clearCart = () => {
    setCart({});
    localStorage.removeItem("cart");
  };

  const handleAddToCart = (product, selectedShop) => {
    const shopDetails = product.shopPrices.find(
      (shop) => shop.shopname === selectedShop
    );
    setCart((prevCart) => ({
      ...prevCart,
      [product._id]: {
        ...product,
        shop: selectedShop,
        FinalPrice: shopDetails?.FinalPrice || product.defaultFinalPrice || product.FinalPrice,
        price: shopDetails?.price || product.defaultPrice || product.price,
        quantity: product.minorderquantity || 1,
        serviceType: "Repair",
      },
    }));
  };

  const handleShopChange = (product, selectedShop) => {
    const shopDetails = product.shopPrices.find(
      (shop) => shop.shopname === selectedShop
    );
    setCart((prevCart) => ({
      ...prevCart,
      [product._id]: {
        ...prevCart[product._id],
        shop: selectedShop,
        FinalPrice: shopDetails?.FinalPrice || product.defaultFinalPrice || product.FinalPrice,
        price: shopDetails?.price || product.defaultPrice || product.price,
      },
    }));
  };

  const handleIncreaseQuantity = (product) => {
    setCart((prevCart) => ({
      ...prevCart,
      [product._id]: {
        ...prevCart[product._id],
        quantity: prevCart[product._id].quantity + 1,
      },
    }));
  };

  const handleDecreaseQuantity = (product) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      const existingProduct = prevCart[product._id];

      // Prevent quantity from going below minorderquantity
      if (existingProduct.quantity > (product.minorderquantity || 1)) {
        updatedCart[product._id].quantity -= 1;
      } else {
        delete updatedCart[product._id];
      }

      return updatedCart;
    });
  };

  const clearFromCart = (productId) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      delete updatedCart[productId];
      return updatedCart;
    });
  };

  // Filter products based on search query
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {loading ? (
        <div className="loader-container">
          <Loader />
        </div>
      ) : (
        <>
          <div className="category-page">
            {/* <h1 className="category-title">
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </h1> */}
            <div className="search-container">
              <input
                type="text"
                placeholder="Search for service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="product-list">
              {filteredProducts.map((product) => (
                <motion.div
                  className="product-card"
                  key={product._id}
                  initial={{ opacity: 0, y: 50, scale: 0.8 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={product.thumbnail}
                    alt={product.name}
                    className="product-image"
                  />
                  <div className="product-info">
                    <h2 className="product-name">{product.name}</h2>
                    {product.shopPrices?.length > 0 && (
                      <div>
                        Shop name: <b>{cart[product._id]?.shop || product.defaultShop || "N/A"}</b>
                      </div>
                    )}
                    <p> <b>Fees</b>: लोकेशन के हिसाब से </p>
                    {/* <p className="product-price">
                      <span className="original-price">
                        ₹{cart[product._id]?.price || product.defaultPrice || product.price}
                      </span>
                      <span className="final-price">
                        ₹{cart[product._id]?.FinalPrice || product.defaultFinalPrice || product.FinalPrice}
                      </span>
                    </p> */}
                    {product.minorderquantity && (
                      <p style={{ color: "red" }} className="min_order_quantity_text" >
                        Min Order Quantity: {product.minorderquantity}
                      </p>
                    )}
                    {product.shopPrices?.length > 0 && (
                      <div className="shop-selection">
                        <span style={{ cursor: "pointer", color: "red", fontSize: "17px" }}>
                          <div className="btn btn-danger">
                            change shop <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-shop" viewBox="0 0 16 16">
                              <path d="M2.97 1.35A1 1 0 0 1 3.73 1h8.54a1 1 0 0 1 .76.35l2.609 3.044A1.5 1.5 0 0 1 16 5.37v.255a2.375 2.375 0 0 1-4.25 1.458A2.37 2.37 0 0 1 9.875 8 2.37 2.37 0 0 1 8 7.083 2.37 2.37 0 0 1 6.125 8a2.37 2.37 0 0 1-1.875-.917A2.375 2.375 0 0 1 0 5.625V5.37a1.5 1.5 0 0 1 .361-.976zm1.78 4.275a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 1 0 2.75 0V5.37a.5.5 0 0 0-.12-.325L12.27 2H3.73L1.12 5.045A.5.5 0 0 0 1 5.37v.255a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0M1.5 8.5A.5.5 0 0 1 2 9v6h1v-5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v5h6V9a.5.5 0 0 1 1 0v6h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1V9a.5.5 0 0 1 .5-.5M4 15h3v-5H4zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zm3 0h-2v3h2z" />
                            </svg>
                          </div>
                        </span>
                        <select
                          value={cart[product._id]?.shop || product.defaultShop}
                          onChange={(e) =>
                            cart[product._id]
                              ? handleShopChange(product, e.target.value)
                              : handleAddToCart(product, e.target.value)
                          }
                          className="product-actions-dropdown"
                        >
                          {product.shopPrices
                            .sort((a, b) => a.poistionId - b.poistionId)
                            .map((shop) => (
                              <option key={shop._id} value={shop.shopname}>
                                {shop.shopname} - ₹{shop.FinalPrice}
                              </option>
                            ))}
                        </select>
                      </div>
                    )}
                    {cart[product._id] ? (
                      <div className="quantity-control">

                        <motion.button
                          className="remove-btn"
                          onClick={() => clearFromCart(product._id)}
                        >
                          Remove
                        </motion.button>
                      </div>
                    ) : (
                      <motion.button
                        className="add-to-cart-btn"
                        onClick={() =>
                          handleAddToCart(
                            product,
                            product.defaultShop || product.shopPrices[0]?.shopname
                          )
                        }
                      >
                        Book a Service
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
            <AnimatePresence>
              {Object.keys(cart).length > 0 && (
                <motion.div
                  className="mini-cart"
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 100 }}
                  transition={{ duration: 0.4 }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div className="cart-title-popup">Cart</div>
                    <motion.button
                      className="clear-cart-btn"
                      whileTap={{ scale: 0.9 }}
                      onClick={clearCart}
                    >
                      Clear
                    </motion.button>
                  </div>
                  <ul className="cart-items">
                    {Object.values(cart).map((item) => (
                      <motion.li
                        key={item._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.8 }}
                      >
                        {item.serviceType === "Repair" ? (
                          <>
                            {item.name}
                          </>
                        ) : (
                          <>
                            {/* {item.name} from <b>{item.shop}</b> x {item.quantity} = ₹ */}
                            {item.name}  <b> {item?.shop && <>from {item?.shop}</>} </b> x {item.quantity} = ₹

                            {item.FinalPrice * item.quantity}
                          </>
                        )}
                        <motion.button
                          className="remove-btn-mini"
                          whileTap={{ scale: 0.9 }}
                          onClick={() => clearFromCart(item._id)}
                        >
                          Remove
                        </motion.button>
                      </motion.li>
                    ))}
                  </ul>
                  <div className="cart-footer">
                    <motion.p
                      key={getTotalCartValue()}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      Total: ₹{getTotalCartValue()}
                    </motion.p>
                    <Link to="/cart" style={{ textDecoration: "none" }}>
                      <button className="buy-now-btn">Buy Now</button>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <FooterBar />
        </>
      )}
    </>
  );
}

export default Repair;