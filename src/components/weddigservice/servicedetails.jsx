import React from "react";
import { useParams } from "react-router-dom";
import "../../styles/category.css";
import { motion } from "framer-motion";
import data from "../../data/products.json"; // Your JSON data file

function CategoryPage() {
  const { category } = useParams();
  const products = data[category] || [];

  return (
    <div className="category-page">
      <h1 className="category-title">{category.charAt(0).toUpperCase() + category.slice(1)}</h1>
      <div className="product-list">
        {products.map((product) => (
          <motion.div
            className="product-card"
            key={product.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <img src={product.image} alt={product.name} className="product-image" />
            <div className="product-info">
              <h2 className="product-name">{product.name}</h2>
              <p className="product-price">₹{product.price}</p>
              <div className="product-actions">
                <button className="quantity-btn">-</button>
                <span className="quantity">1</span>
                <button className="quantity-btn">+</button>
                <button className="add-to-cart-btn">Add to Cart</button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default CategoryPage;
