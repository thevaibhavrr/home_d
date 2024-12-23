// import React, { useEffect, useState } from "react";
// import { Link, useParams } from "react-router-dom";
// import "../../styles/category.css";
// import "../../styles/cartpop.css";
// import { motion, AnimatePresence } from "framer-motion";
// import { makeApi } from "../../api/callApi";

// function CategoryPage() {
//   const { category } = useParams();
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [cart, setCart] = useState({});
//   const [isInitialLoad, setIsInitialLoad] = useState(true);

//   // Function to check if the current time is within available times
//   const isProductOpen = (availableTimes) => {
//     if (!availableTimes || availableTimes.length === 0) return true; // No available times means it's always open
    
//     const currentTime = new Date();
    
//     // Loop through all the available time ranges
//     return availableTimes.some((timeRange) => {
//       if (!timeRange) return false; // If timeRange is undefined or null, skip it
  
//       const [startTime, endTime] = timeRange.split(" - ");
  
//       if (!startTime || !endTime) return false; // Ensure both startTime and endTime are valid
  
//       const [startHours, startMinutes] = startTime.split(":").map(Number);
//       const [endHours, endMinutes] = endTime.split(":").map(Number);
  
//       const start = new Date(currentTime);
//       start.setHours(startHours, startMinutes, 0, 0);
  
//       const end = new Date(currentTime);
//       end.setHours(endHours, endMinutes, 0, 0);
  
//       return currentTime >= start && currentTime <= end;
//     });
//   };
  

//   useEffect(() => {
//     async function fetchCategories() {
//       try {
//         setLoading(true);
//         const response = await makeApi(`/api/get-products-by-service-id/${category}`, "GET");
//         setProducts(response.data.products);
//       } catch (error) {
//         console.log("Error fetching categories:", error);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchCategories();
//   }, [category]);

//   // Load cart from localStorage on component mount
//   useEffect(() => {
//     const storedCart = JSON.parse(localStorage.getItem("cart")) || {};
//     setCart(storedCart);
//     setIsInitialLoad(false);
//   }, []);

//   // Update localStorage when the cart changes (but not on the initial load)
//   useEffect(() => {
//     if (!isInitialLoad) {
//       localStorage.setItem("cart", JSON.stringify(cart));
//     }
//   }, [cart, isInitialLoad]);

//   const getTotalCartValue = () => {
//     return Object.values(cart).reduce(
//       (total, item) => total + item.FinalPrice * item.quantity,
//       0
//     );
//   };

//   const addToCart = (product) => {
//     setCart((prevCart) => {
//       const updatedCart = {
//         ...prevCart,
//         [product._id]: {  // Use _id instead of id
//           ...product,
//           quantity: (prevCart[product._id]?.quantity || 0) + 1,
//         },
//       };
//       return updatedCart;
//     });
//   };

//   const removeFromCart = (product) => {
//     setCart((prevCart) => {
//       const updatedCart = { ...prevCart };
//       if (updatedCart[product._id]?.quantity > 1) {
//         updatedCart[product._id].quantity -= 1;
//       } else {
//         delete updatedCart[product._id];
//       }
//       return updatedCart;
//     });
//   };

//   const clearFromCart = (productId) => {
//     setCart((prevCart) => {
//       const updatedCart = { ...prevCart };
//       delete updatedCart[productId];
//       localStorage.setItem("cart", JSON.stringify(updatedCart));  // Update localStorage immediately
//       return updatedCart;
//     });
//   };

//   return (
//     <div className="category-page">
//       <h1 className="category-title">
//         {category.charAt(0).toUpperCase() + category.slice(1)}
//       </h1>
//       <div className="product-list">
//         {products.map((product) => {
//           const isOpen = isProductOpen(product.availableTimes);
//           return (
//             <motion.div
//               // className={`product-card ${!isOpen ? "closed" : ""}`}
//               className={`product-card`}
//               key={product._id}  // Use _id here instead of id
//               initial={{ opacity: 0, y: 50 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3 }}
//             >
//               <img
//                 src={product.thumbnail}
//                 alt={product.name}
//                 className="product-image"
//               />
//               <div className="product-info">
//                 <h2 className="product-name">{product.name}</h2>

//                 {/* Display original FinalPrice with a strikethrough and final price */}
//                 <p className="product-price">
//                   <span className="original-price">₹{product.price}</span>
//                   <span className="final-price">₹{product.FinalPrice}</span>
//                 </p>

//                 {/* Show closed message if product is not available */}
//                 {/* {!isOpen && <div className="closed-message">Closed</div>} */}

//                 <div className="product-actions">
//                   {cart[product._id] ? (  // Use _id to check if the product is in the cart
//                     <>
//                       <div className="quantity-control">
//                         <motion.button
//                           className="quantity-btn decrease-btn"
//                           whileTap={{ scale: 0.9 }}
//                           onClick={() => removeFromCart(product)}
//                         >
//                           -
//                         </motion.button>
//                         <motion.span
//                           className="quantity"
//                           key={cart[product._id].quantity}
//                           initial={{ opacity: 0 }}
//                           animate={{ opacity: 1 }}
//                           transition={{ duration: 0.3 }}
//                         >
//                           {cart[product._id].quantity}
//                         </motion.span>
//                         <motion.button
//                           className="quantity-btn increase-btn"
//                           whileTap={{ scale: 0.9 }}
//                           onClick={() => addToCart(product)}
//                         >
//                           +
//                         </motion.button>
//                       </div>
//                       <motion.button
//                         className="remove-btn"
//                         whileTap={{ scale: 0.9 }}
//                         onClick={() => clearFromCart(product._id)}  // Use _id to remove from cart
//                       >
//                         Remove
//                       </motion.button>
//                     </>
//                   ) : (
//                     <motion.button
//                       className="add-to-cart-btn"
//                       whileTap={{ scale: 0.95 }}
//                       onClick={() => addToCart(product)}
//                       initial={{ scale: 0 }}
//                       animate={{ scale: 1 }}
//                       transition={{ duration: 0.3 }}
//                     >
//                       Add to Cart
//                     </motion.button>
//                   )}
//                 </div>
//               </div>
//             </motion.div>
//           );
//         })}
//       </div>

//       {/* Mini Cart Popup */}
//       <AnimatePresence>
//         {Object.keys(cart).length > 0 && (
//           <motion.div
//             className="mini-cart"
//             initial={{ opacity: 0, y: 100 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: 100 }}
//             transition={{ duration: 0.4 }}
//           >
//             <div className="cart-title-popup">Cart</div>
//             <ul className="cart-items">
//               {Object.values(cart).map((item) => (
//                 <motion.li
//                   key={item._id}  // Use _id for unique key
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: 10 }}
//                   transition={{ duration: 0.8, delay: 0.4 }}
//                 >
//                   {item.name} x {item.quantity} = ₹{item.FinalPrice * item.quantity}
//                   <motion.button
//                     className="remove-btn-mini"
//                     whileTap={{ scale: 0.9 }}
//                     onClick={() => clearFromCart(item._id)}  // Remove from cart using _id
//                   >
//                     Remove
//                   </motion.button>
//                 </motion.li>
//               ))}
//             </ul>
//             <div className="cart-footer">
//               <motion.p
//                 key={getTotalCartValue()}
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: 0.4 }}
//               >
//                 Total: ₹{getTotalCartValue()}
//               </motion.p>
//               <Link to={"/cart"} style={{ textDecoration: "none" }}>
//                 <button className="buy-now-btn">Buy Now</button>
//               </Link>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// export default CategoryPage;

import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../../styles/category.css";
import "../../styles/cartpop.css";
import { motion, AnimatePresence } from "framer-motion";
import { makeApi } from "../../api/callApi";

function CategoryPage() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState({});
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Function to check if the current time is within available times
  const isProductOpen = (availableTimes) => {
    if (!availableTimes || availableTimes.length === 0) return true; // No available times means it's always open
    
    const currentTime = new Date();
    
    // Loop through all the available time ranges
    return availableTimes.some((timeRange) => {
      if (!timeRange) return false; // If timeRange is undefined or null, skip it
  
      const [startTime, endTime] = timeRange.split(" - ");
  
      if (!startTime || !endTime) return false; // Ensure both startTime and endTime are valid
  
      const [startHours, startMinutes] = startTime.split(":").map(Number);
      const [endHours, endMinutes] = endTime.split(":").map(Number);
  
      const start = new Date(currentTime);
      start.setHours(startHours, startMinutes, 0, 0);
  
      const end = new Date(currentTime);
      end.setHours(endHours, endMinutes, 0, 0);
  
      return currentTime >= start && currentTime <= end;
    });
  };

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
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

  const getTotalCartValue = () => {
    return Object.values(cart).reduce(
      (total, item) => total + item.FinalPrice * item.quantity,
      0
    );
  };

  const addToCart = (product) => {
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

  const removeFromCart = (product) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      if (updatedCart[product._id]?.quantity > 1) {
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
      localStorage.setItem("cart", JSON.stringify(updatedCart));  // Update localStorage immediately
      return updatedCart;
    });
  };

  return (
    <div className="category-page">
      <h1 className="category-title">
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </h1>
      <div className="product-list">
        {products.map((product) => {
          const isOpen = isProductOpen(product.availableTimes);
          return (
            <motion.div
              className={`product-card`}
              key={product._id}  // Use _id here instead of id
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={product.thumbnail}
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

                <div className="product-actions">
                  {cart[product._id] ? (  // Use _id to check if the product is in the cart
                    <>
                      <div className="quantity-control">
                        <motion.button
                          className="quantity-btn decrease-btn"
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeFromCart(product)}
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
                          onClick={() => addToCart(product)}
                        >
                          +
                        </motion.button>
                      </div>
                      <motion.button
                        className="remove-btn"
                        whileTap={{ scale: 0.9 }}
                        onClick={() => clearFromCart(product._id)}  // Use _id to remove from cart
                      >
                        Remove
                      </motion.button>
                    </>
                  ) : (
                    <motion.button
                      className="add-to-cart-btn"
                      whileTap={{ scale: 0.95 }}
                      onClick={() => addToCart(product)}
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
            <div className="cart-title-popup">Cart</div>
            <ul className="cart-items">
              {Object.values(cart).map((item) => (
                <motion.li
                  key={item._id}  // Use _id for unique key
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  {item.name} x {item.quantity} = ₹{item.FinalPrice * item.quantity}
                  <motion.button
                    className="remove-btn-mini"
                    whileTap={{ scale: 0.9 }}
                    onClick={() => clearFromCart(item._id)}  // Remove from cart using _id
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
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Total: ₹{getTotalCartValue()}
              </motion.p>
              <Link to={"/cart"} style={{ textDecoration: "none" }}>
                <button className="buy-now-btn">Buy Now</button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CategoryPage;
