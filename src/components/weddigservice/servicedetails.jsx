import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../../styles/category.css";
import "../../styles/cartpop.css";
import { motion, AnimatePresence } from "framer-motion";
import { makeApi } from "../../api/callApi";
import Loader from "../../components/loader/loader";

function CategoryPage() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState({});
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Scroll to the top on initial load
  useEffect(() => {
    if (isInitialLoad) {
      window.scrollTo(0, 0); // This scrolls the page to the top
      setIsInitialLoad(false); // After the first load, set isInitialLoad to false
    }
  }, [isInitialLoad]);

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      try {
        const response = await makeApi(`/api/get-products-by-service-id/${category}`, "GET");
        const sortedProducts = response.data.products.sort((a, b) => a.FinalPrice - b.FinalPrice); // Sort by FinalPrice (ascending)
        setProducts(sortedProducts);
      } catch (error) {
        console.log("Error fetching categories:", error);
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
    setIsInitialLoad(false);
  }, []);

  // Update localStorage when the cart changes (but not on the initial load)
  useEffect(() => {
    if (!isInitialLoad) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, isInitialLoad]);

  // Function to clear localStorage every 10 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      localStorage.removeItem("cart"); // Clear only the cart from localStorage
      setCart({}); // Reset the cart state in React
    }, 600000); // 600000ms = 10 minutes
  
    // Cleanup function to clear the interval on component unmount
    return () => clearInterval(interval);
  }, []);
  

  const getTotalCartValue = () => {
    return Object.values(cart).reduce(
      (total, item) => total + item.FinalPrice * item.quantity,
      0
    );
  };
  const clearCart = () => {
    setCart({});
    localStorage.removeItem("cart"); // Clear the cart data from localStorage
  };
  

  // Function to handle adding items to the cart when the "Add to Cart" button is clicked
  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      const existingProduct = prevCart[product._id];

      if (!existingProduct) {
        updatedCart[product._id] = {
          ...product,
          quantity: product.minorderquantity || 1, // Set to minorderquantity or 1 if not defined
        };
      }

      return updatedCart;
    });
  };

  const handleIncreaseQuantity = (product) => {
    setCart((prevCart) => {
      const updatedCart = {
        ...prevCart,
        [product._id]: {  // Use _id instead of id
          ...product,
          quantity: (prevCart[product._id]?.quantity || 0) + 1,
        },
      };
      return updatedCart;
    });
  };

  // Function to handle decreasing the quantity (when "-" button is clicked)
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

  // Function to remove the product completely from the cart
  const clearFromCart = (productId) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      delete updatedCart[productId];
      localStorage.setItem("cart", JSON.stringify(updatedCart)); // Update localStorage immediately
      return updatedCart;
    });
  };

  return (
    <>
      {loading ? (
        <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }} >
          <Loader />
        </div>
      ) : (
        <>
        <div className="category-page">
          <h1 className="category-title">
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </h1>

          <div className="product-list">
            {products.map((product) => {
              return (
                <motion.div
                  className="product-card"
                  // className="product-card closed"
                  key={product._id} // Use _id here instead of id
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={product.thumbnail.replace('http://', 'https://')}
                    alt={product.name}
                    className="product-image"
                  />
                  <div className="product-info">
                    <h2 className="product-name">{product.name}</h2>

                    {/* Display original FinalPrice with a strikethrough and final price */}
                    <p className="product-price">
                      <span className="original-price">₹{product.price}</span>

                      <span className="final-price">₹{product.FinalPrice}</span>
                    </p>

                    {/* Display minorderquantity below price in red */}
                    {product.minorderquantity && (
                      <p style={{ color: "red" }}>
                        Min Order Quantity: {product.minorderquantity}
                      </p>
                    )}

                    <div className="product-actions">
                      {cart[product._id] ? ( // Use _id to check if the product is in the cart
                        <>
                          <div className="quantity-control">
                            <motion.button
                              className="quantity-btn decrease-btn"
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDecreaseQuantity(product)} // Decrease the quantity
                            >
                              -
                            </motion.button>
                            <motion.span
                              className="quantity"
                              key={cart[product._id].quantity}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                            >
                              {cart[product._id].quantity}
                            </motion.span>
                            <motion.button
                              className="quantity-btn increase-btn"
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleIncreaseQuantity(product)} // Increase the quantity by 1
                            >
                              +
                            </motion.button>
                          </div>
                          <motion.button
                            className="remove-btn"
                            whileTap={{ scale: 0.9 }}
                            onClick={() => clearFromCart(product._id)} // Use _id to remove from cart
                          >
                            Remove
                          </motion.button>
                        </>
                      ) : (
                        <motion.button
                          className="add-to-cart-btn"
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleAddToCart(product)} // First time, set to minorderquantity
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          Add to Cart
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Mini Cart Popup */}
           <AnimatePresence>
                {Object.keys(cart).length > 0 && (
                  <motion.div
                    className="mini-cart"
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 100 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between" }} >
        
                      <div className="cart-title-popup">Cart</div>
                      <div>
        
                        <motion.button
                          className="clear-cart-btn"
                          whileTap={{ scale: 0.9 }}
                          onClick={() => clearCart()}
                          style={{
                            marginTop: "10px",
                            backgroundColor: "#e74c3c",
                            color: "#fff",
                            border: "none",
                            padding: "5px 5px",
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontSize: "13px",
                          }}
                        >
                          Clear
                        </motion.button>
                      </div>
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
                          {item.name} x {item.quantity} = ₹{item.FinalPrice * item.quantity}
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
        <div style={{ height: "60vh" }} ></div>
        </>
      )}
    </>
  );
}

export default CategoryPage;