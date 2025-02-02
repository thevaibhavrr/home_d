
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/allshop.css";
import "../../styles/cartpop.css";
import { motion, AnimatePresence } from "framer-motion";
import { makeApi } from "../../api/callApi";
import Loader from "../../components/loader/loader";
import FooterBar from "../footrt/FooterBar";

function Allshoppage() {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchingProducts, setIsSearchingProducts] = useState(false);
  const [cart, setCart] = useState({});
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [topsall, setTopsall] = useState([]);

  // Fetch categories on mount
  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      try {

        const response = await makeApi("/api/get-all-categories-shop-for-user", "GET");
        
        // Sort categories by position
        const sortedCategories = response.data.sort((a, b) => a.poistionId - b.poistionId);

        setCategories(sortedCategories);
        setFilteredCategories(sortedCategories); // Initially display all categories
      } catch (error) {
        console.log("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);
  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      try {
        const response = await makeApi("/api/gettopsaller", "GET");
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

        setTopsall(updatedProducts);
        // setTopsall(response.data.products);
      } catch (error) {
        console.log("Error fetching categories:", error);
      } finally {
        setLoading(false);
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
      setLoading(true);
      try {
        const response = await makeApi(`/api/products/search?word=${searchQuery}`, "GET");
        // setProducts(response.data.products);
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
        setIsSearchingProducts(true);
      } catch (error) {
        console.log("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [searchQuery]);
  const clearCart = () => {
    setCart({});
    localStorage.removeItem("cart"); // Clear the cart data from localStorage
  };


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

  // const handleAddToCart = (product, selectedShop) => {
  //   const shopDetails = product.shopPrices.find(
  //     (shop) => shop.shopname === selectedShop
  //   );
  //   setCart((prevCart) => ({
  //     ...prevCart,
  //     [product._id]: {
  //       ...product,
  //       shop: selectedShop,
  //       FinalPrice: shopDetails?.price || product.FinalPrice,
  //       quantity: product.minorderquantity || 1,
  //     },
  //   }));
  // };
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
  return (
    <div className="all-services-page">
      
      <div className="search-container">
        {loading && (
          <div style={{ marginTop: "10px", display: "flex", justifyContent: "center" }}>
            <Loader />
          </div>
        )}
      </div>

    
        <>
        <div className="services-container">
          {filteredCategories.map((service) => (
            <motion.div
              className="service-card"
              key={service._id}
              initial={{ scale: 0.8, y: 100, opecity: 0 }}
              whileInView={{ scale: 1, y: 0, opecity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Link
                to={`/category/${service.name.toLowerCase()}`}
                className="service-link"
              >
                <img
                  src={service.image}
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

        </>

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
                  {item.name} from <b>{item.shop}</b> x {item.quantity} = ₹
                  {item.FinalPrice * item.quantity}
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
      <FooterBar/>
      <div style={{ height: "60vh" }} ></div>

    </div>
  );
}

export default Allshoppage;