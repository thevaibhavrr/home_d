// import React from "react";
// import { useParams } from "react-router-dom";
// import "../../styles/category.css";
// import { motion } from "framer-motion";
// import data from "../../data/products.json"; // Your JSON data file

// function CategoryPage() {
//   const { category } = useParams();
//   const products = data[category] || [];

//   return (
//     <div className="category-page">
//       <h1 className="category-title">{category.charAt(0).toUpperCase() + category.slice(1)}</h1>
//       <div className="product-list">
//         {products.map((product) => (
//           <motion.div
//             className="product-card"
//             key={product.id}
//             initial={{ opacity: 0, y: 50 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.3 }}
//           >
//             <img src={product.image} alt={product.name} className="product-image" />
//             <div className="product-info">
//               <h2 className="product-name">{product.name}</h2>
//               <p className="product-price">₹{product.price}</p>
//               <div className="product-actions">
//                 <button className="quantity-btn">-</button>
//                 <span className="quantity">1</span>
//                 <button className="quantity-btn">+</button>
//                 <button className="add-to-cart-btn">Add to Cart</button>
//               </div>
//             </div>
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default CategoryPage;


import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../styles/category.css";
import { motion } from "framer-motion";
import data from "../../data/products.json"; // Your JSON data file

function CategoryPage() {
  const { category } = useParams();
  const products = data[category] || [];

  const [cart, setCart] = useState({});

  // Load cart from localStorage on component mount
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || {};
    setCart(storedCart);
  }, []);

  // Update localStorage when the cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prevCart) => ({
      ...prevCart,
      [product.id]: {
        ...product,
        quantity: (prevCart[product.id]?.quantity || 0) + 1,
      },
    }));
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
                    <motion.button
                      className="quantity-btn"
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeFromCart(product)}
                    >
                      -
                    </motion.button>
                    <span className="quantity">
                      {cart[product.id].quantity}
                    </span>
                    <motion.button
                      className="quantity-btn"
                      whileTap={{ scale: 0.9 }}
                      onClick={() => addToCart(product)}
                    >
                      +
                    </motion.button>
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
                  >
                    Add to Cart
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default CategoryPage;

