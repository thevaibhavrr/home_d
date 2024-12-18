// import React, { useEffect, useState } from "react";
// import { Link, useParams } from "react-router-dom";
// import "../../styles/category.css";
// import "../../styles/cartpop.css";
// import { motion, AnimatePresence } from "framer-motion";
// import data from "../../data/products.json"; // Your JSON data file

// function CategoryPage() {
//   const { category } = useParams();
//   const products = data[category] || [];

//   const [cart, setCart] = useState({});

//   // Load cart from localStorage on component mount
//   useEffect(() => {
//     const storedCart = JSON.parse(localStorage.getItem("cart")) || {};
//     setCart(storedCart);
//   }, []);

//   // Update localStorage when the cart changes
//   useEffect(() => {
//     localStorage.setItem("cart", JSON.stringify(cart));
//   }, [cart]);

//   // Calculate total cart value
//   const getTotalCartValue = () => {
//     return Object.values(cart).reduce(
//       (total, item) => total + item.price * item.quantity,
//       0
//     );
//   };

//   const addToCart = (product) => {
//     setCart((prevCart) => {
//       const updatedCart = {
//         ...prevCart,
//         [product.id]: {
//           ...product,
//           quantity: (prevCart[product.id]?.quantity || 0) + 1,
//         },
//       };
//       return updatedCart;
//     });
//   };

//   const removeFromCart = (product) => {
//     setCart((prevCart) => {
//       const updatedCart = { ...prevCart };
//       if (updatedCart[product.id]?.quantity > 1) {
//         updatedCart[product.id].quantity -= 1;
//       } else {
//         delete updatedCart[product.id];
//       }
//       return updatedCart;
//     });
//   };

//   const clearFromCart = (productId) => {
//     setCart((prevCart) => {
//       const updatedCart = { ...prevCart };
//       delete updatedCart[productId];
//       return updatedCart;
//     });
//   };

//   return (
//     <div className="category-page">
//       <h1 className="category-title">
//         {category.charAt(0).toUpperCase() + category.slice(1)}
//       </h1>
//       <div className="product-list">
//         {products.map((product) => (
//           <motion.div
//           className="product-card"
//           key={product.id}
//           initial={{ opacity: 0, y: 50 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.3 }}
//         >
//           <img
//             src={product.image}
//             alt={product.name}
//             className="product-image"
//           />
//           <div className="product-info">
//             <h2 className="product-name">{product.name}</h2>
//             <p className="product-price">₹{product.price}</p>
//             <div className="product-actions">
//               {cart[product.id] ? (
//                 <>
//                   <div className="quantity-control">
//                     <motion.button
//                       className="quantity-btn decrease-btn"
//                       whileTap={{ scale: 0.9 }}
//                       onClick={() => removeFromCart(product)}
//                     >
//                       -
//                     </motion.button>
//                     <motion.span
//                       className="quantity"
//                       key={cart[product.id].quantity}
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       transition={{ duration: 0.3 }}
//                     >
//                       {cart[product.id].quantity}
//                     </motion.span>
//                     <motion.button
//                       className="quantity-btn increase-btn"
//                       whileTap={{ scale: 0.9 }}
//                       onClick={() => addToCart(product)}
//                     >
//                       +
//                     </motion.button>
//                   </div>
        
//                   <motion.button
//                     className="remove-btn"
//                     whileTap={{ scale: 0.9 }}
//                     onClick={() => clearFromCart(product.id)}
//                   >
//                     Remove
//                   </motion.button>
//                 </>
//               ) : (
//                 <motion.button
//                   className="add-to-cart-btn"
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => addToCart(product)}
//                   initial={{ scale: 0 }}
//                   animate={{ scale: 1 }}
//                   transition={{ duration: 0.3 }}
//                 >
//                   Add to Cart
//                 </motion.button>
//               )}
//             </div>
//           </div>
//         </motion.div>
        
//         ))}
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
//                   key={item.id}
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: 10 }}
//                   transition={{ duration: 0.3 }}
//                 >
//                   {item.name} x {item.quantity} = ₹{item.price * item.quantity}
//                 </motion.li>
//               ))}
//             </ul>
//             <div className="cart-footer">
//               <motion.p
//                 key={getTotalCartValue()}
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.5 }}
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
import data from "../../data/products.json"; // Your JSON data file

function CategoryPage() {
  const { category } = useParams();
  const products = data[category] || [];

  const [cart, setCart] = useState({});
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || {};
    setCart(storedCart);
    setIsInitialLoad(false); // Mark the initial load as complete
  }, []);

  // Update localStorage when the cart changes (but not on the initial load)
  useEffect(() => {
    if (!isInitialLoad) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, isInitialLoad]);

  // Calculate total cart value
  const getTotalCartValue = () => {
    return Object.values(cart).reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const addToCart = (product) => {
    setCart((prevCart) => {
      const updatedCart = {
        ...prevCart,
        [product.id]: {
          ...product,
          quantity: (prevCart[product.id]?.quantity || 0) + 1,
        },
      };
      return updatedCart;
    });
  };

  const removeFromCart = (product) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      if (updatedCart[product.id]?.quantity > 1) {
        updatedCart[product.id].quantity -= 1;
      } else {
        delete updatedCart[product.id];
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

  return (
    <div className="category-page">
      <h1 className="category-title">
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </h1>
      <div className="product-list">
        {products.map((product) => (
          <motion.div
            className="product-card"
            key={product.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={product.image}
              alt={product.name}
              className="product-image"
            />
            <div className="product-info">
              <h2 className="product-name">{product.name}</h2>
              <p className="product-price">₹{product.price}</p>
              <div className="product-actions">
                {cart[product.id] ? (
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
                        key={cart[product.id].quantity}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {cart[product.id].quantity}
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
                      onClick={() => clearFromCart(product.id)}
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
        ))}
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
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  {item.name} x {item.quantity} = ₹{item.price * item.quantity}
                </motion.li>
              ))}
            </ul>
            <div className="cart-footer">
              <motion.p
                key={getTotalCartValue()}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
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
