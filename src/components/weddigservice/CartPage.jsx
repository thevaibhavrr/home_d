// import React, { useState, useEffect } from "react";
// import "../../styles/cart.css"; // New CSS file for CartPage
// import { motion } from "framer-motion";

// const CartPage = () => {
//   const [cart, setCart] = useState([]);
//   const [addresses, setAddresses] = useState([]);
//   const [showAddAddressPopup, setShowAddAddressPopup] = useState(false);
//   const [newAddress, setNewAddress] = useState("");
//   useEffect(() => {
//     const cartData = JSON.parse(localStorage.getItem("cart"));
//     const savedAddresses = JSON.parse(localStorage.getItem("addresses")) || [];
//     console.log("cartDatacartData", cartData);
  
//     const cartArray = cartData ? Object.values(cartData) : [];
  
//     setCart(cartArray);
//     setAddresses(savedAddresses);
//   }, []);
  

//   const handleRemoveFromCart = (id) => {
//     const updatedCart = cart.filter((item) => item.id !== id);
//     setCart(updatedCart);
//     localStorage.setItem("cart", JSON.stringify(updatedCart));
//   };

//   const handleAddAddress = () => {
//     if (newAddress.trim()) {
//       const updatedAddresses = [...addresses, newAddress];
//       setAddresses(updatedAddresses);
//       localStorage.setItem("addresses", JSON.stringify(updatedAddresses));
//       setNewAddress("");
//       setShowAddAddressPopup(false);
//     }
//   };

//   const totalCartValue = cart.reduce((total, item) => total + item.price * item.quantity, 0);

//   return (
//     <div className="cart-page">
//       <h1 className="cart-title">Your Cart</h1>

//       <div className="cart-section">
//         {cart.length === 0 ? (
//           <p className="empty-cart-message">Your cart is empty!</p>
//         ) : (
//           cart.map((product) => (
//             <motion.div
//               key={product.id}
//               className="cart-item"
//               initial={{ opacity: 0, x: -50 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.3 }}
//             >
//               <img src={product.image} alt={product.name} className="cart-item-image" />
//               <div className="cart-item-details">
//                 <h2 className="cart-item-name">{product.name}</h2>
//                 <p className="cart-item-price">₹{product.price} x {product.quantity}</p>
//                 <p className="cart-item-subtotal">Subtotal: ₹{product.price * product.quantity}</p>
//               </div>
//               <button
//                 className="remove-item-btn"
//                 onClick={() => handleRemoveFromCart(product.id)}
//               >
//                 Remove
//               </button>
//             </motion.div>
//           ))
//         )}
//       </div>

//       {cart.length > 0 && (
//         <>
         
//           <div className="address-section">
//             <h2 className="section-title">Select Address</h2>
//             {addresses.length > 0 ? (
//               <div className="address-list">
//                 {addresses.map((address, index) => (
//                   <div className="address-item" key={index}>
//                     <input
//                       type="radio"
//                       name="address"
//                       id={`address-${index}`}
//                       defaultChecked={index === 0}
//                     />
//                     <label htmlFor={`address-${index}`}>{address}</label>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="no-address-message">No addresses saved. Add a new one below!</p>
//             )}
//             <button
//               className="add-address-btn"
//               onClick={() => setShowAddAddressPopup(true)}
//             >
//               Add New Address
//             </button>
//           </div>

//           <div className="delivery-section">
//             <h2 className="section-title">Delivery</h2>
//             <p className="delivery-charge">Delivery Charges:  Free</p>
//             <p className="total-cart-value">
//               Total Amount: ₹{totalCartValue }
//             </p>
//           </div>


//           {showAddAddressPopup && (
//             <motion.div
//               className="add-address-popup"
//               initial={{ opacity: 0, y: 50 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: 50 }}
//             >
//               <textarea
//                 placeholder="Enter your new address"
//                 value={newAddress}
//                 onChange={(e) => setNewAddress(e.target.value)}
//               />
//               <button className="save-address-btn" onClick={handleAddAddress}>
//                 Save Address
//               </button>
//               <button
//                 className="close-popup-btn"
//                 onClick={() => setShowAddAddressPopup(false)}
//               >
//                 Close
//               </button>
//             </motion.div>
//           )}

//           <button className="checkout-btn">Continue with COD</button>
//         </>
//       )}
//     </div>
//   );
// };

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

  const handleIncreaseQuantity = (id) => {
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleDecreaseQuantity = (id) => {
    const updatedCart = cart.map((item) =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleAddAddress = () => {
    if (mobileNumber.length === 10 && address.trim()) {
      const updatedAddresses = [...addresses, { mobileNumber, address }];
      setAddresses(updatedAddresses);
      localStorage.setItem("addresses", JSON.stringify(updatedAddresses));
      setMobileNumber("");
      setAddress("");
      setShowAddAddressPopup(false);
    } else {
      alert("Please enter a valid mobile number and address.");
    }
  };
  const totalCartValue = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const [mobileNumber, setMobileNumber] = useState("");
const [address, setAddress] = useState("");
const [isMobileValid, setIsMobileValid] = useState(true); // To track mobile validation

const handleMobileChange = (e) => {
  const value = e.target.value;
  setMobileNumber(value);
  // Simple mobile number validation (10 digits)
  setIsMobileValid(value.length === 10);
};



// Button Disabled Condition
const isButtonDisabled = !(isMobileValid && address.trim());


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
          className="product-card"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={product.image}
                alt={product.name}
            className="product-image"
              />
              <div className="product-info">
                <h2 className="product-name">{product.name}</h2>
                <p className="product-price">
                  ₹{product.price} 
                </p>
                <p className="cart-item-subtotal">
                  Subtotal: ₹{product.price * product.quantity}
                </p>
              </div>

              <div className="cart-item-actions">
                <button
                  className="quantity-btn"
                  onClick={() => handleDecreaseQuantity(product.id)}
                >
                  -
                </button>
                <span className="quantity">{product.quantity}</span>
                <button
                  className="quantity-btn"
                  onClick={() => handleIncreaseQuantity(product.id)}
                >
                  +
                </button>

                <button
                  className="remove-item-btn"
                  onClick={() => handleRemoveFromCart(product.id)}
                >
                  Remove
                </button>
              </div>
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
              <p className="no-address-message">
                No addresses saved. Add a new one below!
              </p>
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
            <p className="delivery-charge">Delivery Charges: Free</p>
            <p className="total-cart-value">Total Amount: ₹{totalCartValue}</p>
          </div>

          {showAddAddressPopup && (
  <motion.div
    className="add-address-popup"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 50 }}
  >
    <input
      type="text"
      placeholder="Enter your mobile number"
      value={mobileNumber}
      onChange={handleMobileChange}
      maxLength="10"
      className="input-field"
    />
    {!isMobileValid && mobileNumber && (
      <span className="error-text">Please enter a valid 10-digit mobile number.</span>
    )}

    <textarea
      placeholder="Enter your new address"
      value={address}
      onChange={(e) => setAddress(e.target.value)}
    />
    
    <button
      className="save-address-btn"
      onClick={handleAddAddress}
      disabled={isButtonDisabled}
    >
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
