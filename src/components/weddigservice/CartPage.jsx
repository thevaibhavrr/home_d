import React, { useState, useEffect } from "react";
import "../../styles/cart.css";
import { motion } from "framer-motion";
import { makeApi } from "../../api/callApi"; // Assuming this handles API calls
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import { toast, ToastContainer } from "react-toastify"; // Import toast and ToastContainer from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles
import Loader from "../loader/loader"; // Import your Loader component

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [showAddAddressPopup, setShowAddAddressPopup] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [address, setAddress] = useState("");
  const [userName, setUserName] = useState(""); // State for user's name
  const [isMobileValid, setIsMobileValid] = useState(true); // To track mobile validation
  const [selectedAddress, setSelectedAddress] = useState(null); // Track selected address
  const [village, setVillage] = useState("");
  const [orderDetails, setOrderDetails] = useState(null); // State to hold order details for thank-you popup
  const [showThankYouPopup, setShowThankYouPopup] = useState(false); // To control the visibility of the Thank You popup
  const [isLoading, setIsLoading] = useState(false); // State for loader
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // State to disable the button
  const [minOrderValue] = useState(500); // Minimum order value
  const [selectedShop, setSelectedShop] = useState(null); // Track the selected shop
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [deleteAddressIndex, setDeleteAddressIndex] = useState(null); // To store the index of the address to delete

  const navigate = useNavigate(); // Initialize navigate for redirection

  // useEffect(() => {
  //   // Load cart and addresses from local storage
  //   const cartData = JSON.parse(localStorage.getItem("cart"));
  //   const savedAddresses = JSON.parse(localStorage.getItem("addresses")) || [];

  //   // Convert cartData (object) to array
  //   const cartArray = cartData ? Object.values(cartData) : [];

  //   setCart(cartArray);
  //   setAddresses(savedAddresses);

  //   // Set selected shop if any
  //   const shop = cartArray.length > 0 ? cartArray[0].shop : null;
  //   setSelectedShop(shop);
  // }, []);
  useEffect(() => {
    // Load cart and addresses from local storage
    const cartData = JSON.parse(localStorage.getItem("cart"));
    const savedAddresses = JSON.parse(localStorage.getItem("addresses")) || [];

    // Convert cartData (object) to array
    const cartArray = cartData ? Object.values(cartData) : [];

    setCart(cartArray);
    setAddresses(savedAddresses);

    // Set selected shop if any
    const shop = cartArray.length > 0 ? cartArray[0].shop : null;
    setSelectedShop(shop);
    console.log(savedAddresses.length);
    // Pre-select the first address if there's only one address
    if (savedAddresses.length == 1) {
      setSelectedAddress(savedAddresses[0]);
    }
  }, []);


  const handleRemoveFromCart = (id) => {
    const updatedCart = cart.filter((item) => item._id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleIncreaseQuantity = (id) => {
    const updatedCart = cart.map((item) =>
      item._id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleDecreaseQuantity = (id) => {
    const updatedCart = cart.map((item) =>
      item._id === id && item.quantity > (item.minorderquantity || 1)
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleAddAddress = () => {
    // if (!mobileNumber || !userName || !address || !village) {
    if (!mobileNumber ) {
      toast.error("please enter mobile number");
      return;
    }
     if (!address) {
      toast.error("please enter address");
      return;
    }
     if (!userName) {
      toast.error("please enter name");
      return;
    }
     if (!village) {
      toast.error("please enter village");
      return;
    }

    if (mobileNumber.length === 10 && address.trim() && userName.trim()) {
      // Address is valid, save it
      const updatedAddresses = [...addresses, { userName, mobileNumber, address,village }];
      setAddresses(updatedAddresses);
      localStorage.setItem("addresses", JSON.stringify(updatedAddresses));
      setMobileNumber(""); 
      setAddress(""); 
      setUserName(""); 
      setVillage("");
      setShowAddAddressPopup(false); 
    } else {
      toast.error("Please enter a valid mobile number, address, and name.");
    }
  };

  const handleMobileChange = (e) => {
    const value = e.target.value;
    setMobileNumber(value);
    setIsMobileValid(value.length === 10);
  };

  const handleSelectAddress = (selected) => {
    setSelectedAddress(selected);
  };

  const totalCartValue = cart.reduce(
    (total, item) => total + item.FinalPrice * item.quantity,
    0
  );

  // Function to handle order placement
  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select an address!");
      return;
    }



    setIsLoading(true);
    setIsButtonDisabled(true);

    const orderData = {
      username: selectedAddress.userName,
      address: selectedAddress.address,
      mobileNumber: selectedAddress.mobileNumber,
      village: selectedAddress.village,
      products: cart.map((product) => ({
        productId: product._id,  // Use _id
        name: product.name,
        quantity: product.quantity,
        shopname: product.shop,
        SingelProductPrice: product.FinalPrice,
        FinalPrice: product.FinalPrice * product.quantity,
        thumbnail: product.thumbnail,
      })),
      createdAt: new Date().toISOString(),
      totalAmount: totalCartValue,
    };

    const handleDeleteAddress = (index) => {
      const updatedAddresses = addresses.filter((_, i) => i !== index); 
      setAddresses(updatedAddresses); 
      localStorage.setItem("addresses", JSON.stringify(updatedAddresses)); 

      // If the deleted address was selected, reset the selected address
      if (selectedAddress === addresses[index]) {
        setSelectedAddress(null); // Reset selected address
      }
    };


    try {
      // Call the API to create the order
      const response = await makeApi("/api/create-order", "POST", orderData);
      toast.success("Order placed successfully!"); // Show success toast
      setOrderDetails(orderData); // Set the order details for the thank-you popup
      setShowThankYouPopup(true); // Show the thank-you popup
      // Clear cart from localStorage and state
      localStorage.removeItem("cart");
      setCart([]);
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Error placing order. Please try again."); // Show error toast
    } finally {
      setIsLoading(false); // Hide the loader
    }
  };

  const closeThankYouPopup = () => {
    setShowThankYouPopup(false);
    navigate("/"); // Redirect to /all-service after closing the popup
  };

  const handleDeleteClick = (index) => {
    setDeleteAddressIndex(index); // Store the address index to be deleted
    setShowConfirmPopup(true); // Show the confirmation popup
  };
  const handleConfirmDelete = () => {
    const updatedAddresses = addresses.filter((_, i) => i !== deleteAddressIndex); // Remove the address at the given index
    setAddresses(updatedAddresses); // Update state
    localStorage.setItem("addresses", JSON.stringify(updatedAddresses)); // Update local storage

    // Reset selected address if the deleted address was selected
    if (selectedAddress === addresses[deleteAddressIndex]) {
      setSelectedAddress(null);
    }

    setShowConfirmPopup(false); // Close the confirmation popup
  };

  const handleDeleteAddress = (index) => {
    const updatedAddresses = addresses.filter((_, i) => i !== index); // Remove the address at the given index
    setAddresses(updatedAddresses); // Update state
    localStorage.setItem("addresses", JSON.stringify(updatedAddresses)); // Update local storage

    // If the deleted address was selected, reset the selected address
    if (selectedAddress === addresses[index]) {
      setSelectedAddress(null); // Reset selected address
    }
  };


  return (
    <div className="cart-page">
      <h1 className="cart-title">Your Cart</h1>
      {showConfirmPopup && (
        <motion.div
          className="confirm-popup"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
        >
          <h3>Are you sure you want to delete this address?</h3>
          <div className="confirm-popup-buttons">
            <button
              className="confirm-btn"
              onClick={handleConfirmDelete} // Confirm delete
            >
              Yes, Delete
            </button>
            <button
              className="cancel-btn"
              onClick={() => setShowConfirmPopup(false)} // Close the popup without deleting
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      <div className="cart-section">
        {cart.length === 0 ? (
          <p className="empty-cart-message">Your cart is empty!</p>
        ) : (
          cart.map((product) => (
            <motion.div
              key={product._id}
              className="product-card"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={product.thumbnail}
                alt={product.name}
                className="product-image"
              />
              <div className="product-info">
                <h2 className="product-name">{product.name}</h2>
                {product.shop && <p className="product-shop"><strong>Shop: </strong>{product.shop}</p>}
                <p className="product-price">
                  <span className="original-price">₹{product.price}</span>
                  <span className="final-price">₹{product.FinalPrice}</span>
                </p>
                {product.minorderquantity && (
                  <p style={{ color: "red" }}>
                    Min Order Quantity: {product.minorderquantity}
                  </p>
                )}
              </div>
              <div className="cart-item-actions">
                <button
                  className="quantity-btn"
                  onClick={() => handleDecreaseQuantity(product._id)}
                >
                  -
                </button>
                <span className="quantity">{product.quantity}</span>
                <button
                  className="quantity-btn"
                  onClick={() => handleIncreaseQuantity(product._id)}
                >
                  +
                </button>
              </div>
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="cart-item-subtotal"
              >
                Subtotal: ₹{product.FinalPrice * product.quantity}
              </motion.p>
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
                      checked={selectedAddress && selectedAddress.address === address.address}  // Check if this address is selected
                      onChange={() => handleSelectAddress(address)} // Update selected address
                    />
                    <label htmlFor={`address-${index}`}>
                      {address.userName} - {address.mobileNumber}, {address.address} - {address.village}
                    </label>
                    <button
                      className="delete-address-btn"
                      onClick={() => handleDeleteAddress(index)} // Call delete function
                    >
                      Delete
                    </button>
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
            <p className="delivery-charge">Delivery Charges: <b> Free</b></p>
            <p className="total-cart-value">Total Amount: ₹{totalCartValue}</p>

          </div>

          <button
            className="checkout-btn"
            onClick={handlePlaceOrder}
            disabled={isButtonDisabled} // Disable button if address is not selected
          >
            {isLoading ? <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }} > <Loader /></div> : "Continue with COD"}
          </button>
        </>
      )}

      {/* Add Address Popup */}
      {showAddAddressPopup && (
        <motion.div
          className="add-address-popup"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
        >
          <input
            type="text"
            placeholder="Enter your village"
            value={village}
            onChange={(e) => setVillage(e.target.value)}
            className="input-field-for-address"
            required
          />
          <input
            type="text"
            placeholder="Enter your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="input-field-for-address"
          />
          <input
            type="text"
            placeholder="Enter your mobile number"
            value={mobileNumber}
            onChange={handleMobileChange}
            maxLength="14"
            className="input-field-for-address"
            required
          />
          {!isMobileValid && mobileNumber && (
            <span className="error-text">
              Please enter a valid 10-digit mobile number.
            </span>
          )}

          <textarea
            placeholder="Enter your new address"
            value={address}
            className="input-field-for-address"
            onChange={(e) => setAddress(e.target.value)}
          />

          <button
            className="save-address-btn"
            onClick={handleAddAddress}
            disabled={!(isMobileValid && address.trim() && userName.trim())} // Disable if validation fails
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

      {/* Thank You Popup */}
      {showThankYouPopup && (
        <motion.div
          className="thank-you-popup"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
        >
          <h2>Thank You for Your Order!</h2>
          <p>Your order has been placed successfully. Here's what you've ordered:</p>
          <ul className="order-details">
            {orderDetails.products.map((product) => (
              <li key={product.productId} className="order-item">
                <img src={product.thumbnail} alt={product.name} className="order-item-image" />
                <div className="order-item-info">
                  <span className="order-item-quantity">Quantity: {product.quantity}</span>
                  <span className="order-item-name">{product.name}</span>
                  <span className="order-item-price">₹{product.FinalPrice * product.quantity}</span>
                </div>
              </li>
            ))}
          </ul>
          <p>Total Amount: ₹{orderDetails.totalAmount}</p>

          <button className="close-thank-you-popup-btn" onClick={closeThankYouPopup}>
            Close
          </button>
        </motion.div>
      )}

      <ToastContainer style={{ width: '300px' }} position="top-center" autoClose={3000} />
    </div>
  );
};

export default CartPage;
