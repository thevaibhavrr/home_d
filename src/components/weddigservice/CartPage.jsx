// import React, { useEffect, useState } from "react";
// import "../../styles/cart.css";
// import { motion } from "framer-motion";

// function CartPage() {
//   const [cart, setCart] = useState({});
//   const [addresses, setAddresses] = useState([]);
//   const [selectedAddress, setSelectedAddress] = useState(null);
//   const [isAddAddressPopupOpen, setIsAddAddressPopupOpen] = useState(false);
//   const [newAddress, setNewAddress] = useState("");

//   // Load cart and addresses from localStorage
//   useEffect(() => {
//     const storedCart = JSON.parse(localStorage.getItem("cart")) || {};
//     const storedAddresses = JSON.parse(localStorage.getItem("addresses")) || [];
//     setCart(storedCart);
//     setAddresses(storedAddresses);
//     setSelectedAddress(storedAddresses[0] || null);
//   }, []);

//   // Calculate total cart value
//   const getTotalCartValue = () => {
//     return Object.values(cart).reduce(
//       (total, item) => total + item.price * item.quantity,
//       0
//     );
//   };

//   // Add a new address
//   const handleAddAddress = () => {
//     if (newAddress.trim() === "") return;
//     const updatedAddresses = [...addresses, newAddress];
//     setAddresses(updatedAddresses);
//     localStorage.setItem("addresses", JSON.stringify(updatedAddresses));
//     setSelectedAddress(newAddress);
//     setNewAddress("");
//     setIsAddAddressPopupOpen(false);
//   };

//   return (
//     <div className="cart-page">
//       <h1 className="cart-title">Your Cart</h1>

//       {/* Cart Products */}
//       <div className="cart-products">
//         {Object.keys(cart).length > 0 ? (
//           Object.values(cart).map((item) => (
//             <motion.div
//               className="cart-product-card"
//               key={item.id}
//               initial={{ opacity: 0, y: 50 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3 }}
//             >
//               <img
//                 src={item.image}
//                 alt={item.name}
//                 className="cart-product-image"
//               />
//               <div className="cart-product-info">
//                 <h2 className="cart-product-name">{item.name}</h2>
//                 <p className="cart-product-price">₹{item.price}</p>
//                 <p className="cart-product-quantity">
//                   Quantity: {item.quantity}
//                 </p>
//               </div>
//             </motion.div>
//           ))
//         ) : (
//           <p className="empty-cart">Your cart is empty.</p>
//         )}
//       </div>

//       {/* Delivery Address */}
//       <div className="delivery-section">
//         <h2 className="section-title">Delivery Address</h2>
//         {addresses.length > 0 ? (
//           <div className="address-list">
//             {addresses.map((address, index) => (
//               <div
//                 key={index}
//                 className={`address-card ${
//                   selectedAddress === address ? "selected" : ""
//                 }`}
//                 onClick={() => setSelectedAddress(address)}
//               >
//                 {address}
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p>No saved addresses. Please add a new address.</p>
//         )}
//         <button
//           className="add-address-btn"
//           onClick={() => setIsAddAddressPopupOpen(true)}
//         >
//           Add New Address
//         </button>
//       </div>

//       {/* Add Address Popup */}
//       {isAddAddressPopupOpen && (
//         <motion.div
//           className="add-address-popup"
//           initial={{ y: "100%" }}
//           animate={{ y: 0 }}
//           exit={{ y: "100%" }}
//           transition={{ duration: 0.4 }}
//         >
//           <h3>Add New Address</h3>
//           <textarea
//             className="new-address-input"
//             placeholder="Enter your address"
//             value={newAddress}
//             onChange={(e) => setNewAddress(e.target.value)}
//           ></textarea>
//           <button className="save-address-btn" onClick={handleAddAddress}>
//             Save Address
//           </button>
//           <button
//             className="cancel-popup-btn"
//             onClick={() => setIsAddAddressPopupOpen(false)}
//           >
//             Cancel
//           </button>
//         </motion.div>
//       )}

//       {/* Fixed Continue Button */}
//       <button className="fixed-continue-btn">
//         Continue with COD - ₹{getTotalCartValue()}
//       </button>
//     </div>
//   );
// }

// export default CartPage;
import React, { useState, useEffect } from "react";
import "../../styles/cart.css"; // New CSS file for CartPage
import { motion } from "framer-motion";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [showAddAddressPopup, setShowAddAddressPopup] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  useEffect(() => {
    // Load cart and addresses from local storage
    const cartData = JSON.parse(localStorage.getItem("cart"));
    const savedAddresses = JSON.parse(localStorage.getItem("addresses")) || [];
    console.log("cartDatacartData", cartData);
  
    // Convert cartData (object) to array
    const cartArray = cartData ? Object.values(cartData) : [];
  
    setCart(cartArray);
    setAddresses(savedAddresses);
  }, []);
  

  const handleRemoveFromCart = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleAddAddress = () => {
    if (newAddress.trim()) {
      const updatedAddresses = [...addresses, newAddress];
      setAddresses(updatedAddresses);
      localStorage.setItem("addresses", JSON.stringify(updatedAddresses));
      setNewAddress("");
      setShowAddAddressPopup(false);
    }
  };

  const totalCartValue = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="cart-page">
      <h1 className="cart-title">Your Cart</h1>

      <div className="cart-section">
        {cart.length === 0 ? (
          <p className="empty-cart-message">Your cart is empty!</p>
        ) : (
          cart.map((product) => (
            <motion.div
              key={product.id}
              className="cart-item"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <img src={product.image} alt={product.name} className="cart-item-image" />
              <div className="cart-item-details">
                <h2 className="cart-item-name">{product.name}</h2>
                <p className="cart-item-price">₹{product.price} x {product.quantity}</p>
                <p className="cart-item-subtotal">Subtotal: ₹{product.price * product.quantity}</p>
              </div>
              <button
                className="remove-item-btn"
                onClick={() => handleRemoveFromCart(product.id)}
              >
                Remove
              </button>
            </motion.div>
          ))
        )}
      </div>

      {cart.length > 0 && (
        <>
         
          <div className="address-section">
            <h2 className="section-title">Select Address</h2>
            {addresses.length > 0 ? (
              <div className="address-list">
                {addresses.map((address, index) => (
                  <div className="address-item" key={index}>
                    <input
                      type="radio"
                      name="address"
                      id={`address-${index}`}
                      defaultChecked={index === 0}
                    />
                    <label htmlFor={`address-${index}`}>{address}</label>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-address-message">No addresses saved. Add a new one below!</p>
            )}
            <button
              className="add-address-btn"
              onClick={() => setShowAddAddressPopup(true)}
            >
              Add New Address
            </button>
          </div>

          <div className="delivery-section">
            <h2 className="section-title">Delivery</h2>
            <p className="delivery-charge">Delivery Charges: ₹50</p>
            <p className="total-cart-value">
              Total Amount: ₹{totalCartValue + 50}
            </p>
          </div>


          {showAddAddressPopup && (
            <motion.div
              className="add-address-popup"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
            >
              <textarea
                placeholder="Enter your new address"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
              />
              <button className="save-address-btn" onClick={handleAddAddress}>
                Save Address
              </button>
              <button
                className="close-popup-btn"
                onClick={() => setShowAddAddressPopup(false)}
              >
                Close
              </button>
            </motion.div>
          )}

          <button className="checkout-btn">Continue with COD</button>
        </>
      )}
    </div>
  );
};

export default CartPage;
