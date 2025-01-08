
// import "../../styles/allservice.css";
// import { Link } from "react-router-dom";
// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { makeApi } from "../../api/callApi";
// import Loader from "../../components/loader/loader";

// // All Services Page Component
// function AllServicesPage() {
//   const [categories, setCategories] = useState([]);
//   const [filteredCategories, setFilteredCategories] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');

//   useEffect(() => {
//     async function fetchCategories() {
//       try {
//         setLoading(true);
//         const response = await makeApi("/api/get-all-categories", "GET");

//         // Sort the categories array based on the `poistionId` field
//         const sortedCategories = response.data.sort((a, b) => a.poistionId - b.poistionId);

//         setCategories(sortedCategories);
//         setFilteredCategories(sortedCategories); // Initially display all categories
//       } catch (error) {
//         console.log("Error fetching categories:", error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchCategories();
//   }, []);

//   // Handle search input change
//   const handleSearch = (e) => {
//     const query = e.target.value.toLowerCase();
//     setSearchQuery(query);

//     if (query === '') {
//       setFilteredCategories(categories); // If search is empty, show all categories
//     } else {
//       const filtered = categories.filter((service) =>
//         service.name.toLowerCase().includes(query)
//       );
//       setFilteredCategories(filtered);
//     }
//   };

//   return (
//     <>
//       {loading ? (
//         <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
//           <Loader />
//         </div>
//       ) : (
//         <div className="all-services-page">
//           <div className="search-container">
//             <input
//               type="text"
//               placeholder="Search for services..."
//               value={searchQuery}
//               onChange={handleSearch}
//               className="search-input"
//             /> 
//           </div>

//           {/* Services Section */}
//           <div className="services-container">
//             {filteredCategories.map((service) => (
//               <motion.div
//                 className="service-card"
//                 key={service._id} // Using _id as the key to ensure uniqueness
//                 initial={{ scale: 0.8, y: 100 }}
//                 animate={{ scale: 1, y: 0 }}
//                 transition={{ duration: 0.4 }}
//               >
//                 <Link
//                   to={`/category/${service.name.toLowerCase()}`}
//                   className="service-link"
//                 >
//                   <img
//                     src={service.image.replace('http://', 'https://')}
//                     alt={service.name}
//                     className="service-image"
//                   />
//                   <div className="service-details">
//                     <h2 className="service-title">{service.name}</h2>
//                   </div>
//                 </Link>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// export default AllServicesPage;



// import "../../styles/allservice.css";
// import { Link } from "react-router-dom";
// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { makeApi } from "../../api/callApi";
// import Loader from "../../components/loader/loader";

// // All Services Page Component
// function AllServicesPage() {
//   const [categories, setCategories] = useState([]);
//   const [filteredCategories, setFilteredCategories] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isSearchingProducts, setIsSearchingProducts] = useState(false);

//   useEffect(() => {
//     async function fetchCategories() {
//       try {
//         const response = await makeApi("/api/get-all-categories", "GET");

//         // Sort the categories array based on the `poistionId` field
//         const sortedCategories = response.data.sort((a, b) => a.poistionId - b.poistionId);

//         setCategories(sortedCategories);
//         setFilteredCategories(sortedCategories); // Initially display all categories
//       } catch (error) {
//         console.log("Error fetching categories:", error);
//       }
//     }

//     fetchCategories();
//   }, []);

//   // Fetch related products when search query changes
//   useEffect(() => {
//     if (!searchQuery) {
//       setProducts([]);
//       setIsSearchingProducts(false);
//       return;
//     }

//     async function fetchProducts() {
//       try {
//         setLoading(true);
//         const response = await makeApi(`/api/products/search?word=${searchQuery}`, "GET");
//         setProducts(response.data.products);
//         setIsSearchingProducts(true);
//       } catch (error) {
//         console.log("Error fetching products:", error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchProducts();
//   }, [searchQuery]);

//   // Handle search input change
//   const handleSearch = (e) => {
//     const query = e.target.value.toLowerCase();
//     setSearchQuery(query);
//   };

//   return (
//     <div className="all-services-page">
//       <div className="search-container">
//         <input
//           type="text"
//           placeholder="Search for services or products..."
//           value={searchQuery}
//           onChange={handleSearch}
//           className="search-input"
//         />

//         {/* Show loader below input field when loading */}
//         {loading && (
//           <div style={{ marginTop: "10px", display: "flex", justifyContent: "center" }}>
//             <Loader />
//           </div>
//         )}
//       </div>

//       {/* Conditionally show products or categories */}
//       {isSearchingProducts ? (
//         <div className="product-list">
//           {products.map((product) => {
//             return (
//               <motion.div
//                 className="product-card"
//                 key={product._id} // Use _id here instead of id
//                 initial={{ opacity: 0, y: 50 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <img
//                   src={product.thumbnail.replace("http://", "https://")}
//                   alt={product.name}
//                   className="product-image"
//                 />
//                 <div className="product-info">
//                   <h2 className="product-name">{product.name}</h2>
//                   <p className="product-price">
//                     <span className="original-price">₹{product.price}</span>
//                     <span className="final-price">₹{product.FinalPrice}</span>
//                   </p>
//                   {product.minorderquantity && (
//                     <p style={{ color: "red" }}>
//                       Min Order Quantity: {product.minorderquantity}
//                     </p>
//                   )}
//                   <div className="product-actions">
//                     {/* Placeholder actions */}
//                     <motion.button
//                       className="add-to-cart-btn"
//                       whileTap={{ scale: 0.95 }}
//                     >
//                       Add to Cart
//                     </motion.button>
//                   </div>
//                 </div>
//               </motion.div>
//             );
//           })}
//         </div>
//       ) : (
//         <div className="services-container">
//           {filteredCategories.map((service) => (
//             <motion.div
//               className="service-card"
//               key={service._id} // Using _id as the key to ensure uniqueness
//               initial={{ scale: 0.8, y: 100 }}
//               animate={{ scale: 1, y: 0 }}
//               transition={{ duration: 0.4 }}
//             >
//               <Link
//                 to={`/category/${service.name.toLowerCase()}`}
//                 className="service-link"
//               >
//                 <img
//                   src={service.image.replace("http://", "https://")}
//                   alt={service.name}
//                   className="service-image"
//                 />
//                 <div className="service-details">
//                   <h2 className="service-title">{service.name}</h2>
//                 </div>
//               </Link>
//             </motion.div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default AllServicesPage;


import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/allservice.css";
import "../../styles/cartpop.css";
import { motion, AnimatePresence } from "framer-motion";
import { makeApi } from "../../api/callApi";
import Loader from "../../components/loader/loader";

function AllServicesPage() {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchingProducts, setIsSearchingProducts] = useState(false);
  const [cart, setCart] = useState({});
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Fetch categories on mount
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await makeApi("/api/get-all-categories", "GET");

        // Sort categories by position
        const sortedCategories = response.data.sort((a, b) => a.poistionId - b.poistionId);

        setCategories(sortedCategories);
        setFilteredCategories(sortedCategories); // Initially display all categories
      } catch (error) {
        console.log("Error fetching categories:", error);
      }
    }

    fetchCategories();
  }, []);

  // Fetch products on search query change
  useEffect(() => {
    if (!searchQuery) {
      setProducts([]);
      setIsSearchingProducts(false);
      return;
    }

    async function fetchProducts() {
      try {
        setLoading(true);
        const response = await makeApi(`/api/products/search?word=${searchQuery}`, "GET");
        setProducts(response.data.products);
        setIsSearchingProducts(true);
      } catch (error) {
        console.log("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [searchQuery]);

  // Load cart from localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || {};
    setCart(storedCart);
    setIsInitialLoad(false);
  }, []);

  // Update localStorage when cart changes
  useEffect(() => {
    if (!isInitialLoad) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, isInitialLoad]);

  // Clear cart periodically
  useEffect(() => {
    const interval = setInterval(() => {
      localStorage.removeItem("cart");
      setCart({});
    }, 600000); // 10 minutes

    return () => clearInterval(interval);
  }, []);

  const getTotalCartValue = () => {
    return Object.values(cart).reduce(
      (total, item) => total + item.FinalPrice * item.quantity,
      0
    );
  };

  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      const existingProduct = prevCart[product._id];

      if (!existingProduct) {
        updatedCart[product._id] = {
          ...product,
          quantity: product.minorderquantity || 1,
        };
      }

      return updatedCart;
    });
  };

  const handleIncreaseQuantity = (product) => {
    setCart((prevCart) => {
      const updatedCart = {
        ...prevCart,
        [product._id]: {
          ...product,
          quantity: (prevCart[product._id]?.quantity || 0) + 1,
        },
      };
      return updatedCart;
    });
  };

  const handleDecreaseQuantity = (product) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      const existingProduct = prevCart[product._id];

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
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  return (
    <div className="all-services-page">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for services or products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
          className="search-input"
        />
        {loading && (
          <div style={{ marginTop: "10px", display: "flex", justifyContent: "center" }}>
            <Loader />
          </div>
        )}
      </div>

      {isSearchingProducts ? (
        <div className="product-list">
          {products.map((product) => (
            <motion.div
              className="product-card"
              key={product._id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={product.thumbnail.replace("http://", "https://")}
                alt={product.name}
                className="product-image"
              />
              <div className="product-info">
                <h2 className="product-name">{product.name}</h2>
                <p className="product-price">
                  <span className="original-price">₹{product.price}</span>
                  <span className="final-price">₹{product.FinalPrice}</span>
                </p>
                {product.minorderquantity && (
                  <p style={{ color: "red" }}>
                    Min Order Quantity: {product.minorderquantity}
                  </p>
                )}
                <div className="product-actions">
                  {cart[product._id] ? (
                    <>
                      <div className="quantity-control">
                        <motion.button
                          className="quantity-btn decrease-btn"
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDecreaseQuantity(product)}
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
                          onClick={() => handleIncreaseQuantity(product)}
                        >
                          +
                        </motion.button>
                      </div>
                      <motion.button
                        className="remove-btn"
                        whileTap={{ scale: 0.9 }}
                        onClick={() => clearFromCart(product._id)}
                      >
                        Remove
                      </motion.button>
                    </>
                  ) : (
                    <motion.button
                      className="add-to-cart-btn"
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="services-container">
          {filteredCategories.map((service) => (
            <motion.div
              className="service-card"
              key={service._id}
              initial={{ scale: 0.8, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Link
                to={`/category/${service.name.toLowerCase()}`}
                className="service-link"
              >
                <img
                  src={service.image.replace("http://", "https://")}
                  alt={service.name}
                  className="service-image"
                />
                <div className="service-details">
                  <h2 className="service-title">{service.name}</h2>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

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
  );
}

export default AllServicesPage;
