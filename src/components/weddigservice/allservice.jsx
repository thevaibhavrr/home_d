import "../../styles/allservice.css";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { makeApi } from "../../api/callApi";
import Loader from "../../components/loader/loader";

// All Services Page Component
function AllServicesPage() {
 
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        const response = await makeApi("/api/get-all-categories", "GET");
        setCategories(response.data);
      } catch (error) {
        console.log("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);
  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     // Check if categories are already in localStorage
  //     const storedData = localStorage.getItem("categories");
  //     const storedTime = localStorage.getItem("categoriesTimestamp");

  //     // If the data exists and is not expired
  //     if (storedData && storedTime && Date.now() - storedTime < 2 * 60 * 1000) {
  //       setCategories(JSON.parse(storedData));
  //       console.log("Using cached categories from localStorage");
  //       return;
  //     }

  //     // If no data in localStorage or data expired, fetch from API
  //     try {
  //       setLoading(true);
  //       const response = await makeApi("/api/get-all-categories", "GET");
  //       const categoriesData = response.data;

  //       // Store the fetched categories and timestamp in localStorage
  //       localStorage.setItem("categories", JSON.stringify(categoriesData));
  //       localStorage.setItem("categoriesTimestamp", Date.now().toString());

  //       setCategories(categoriesData);
  //     } catch (error) {
  //       console.log("Error fetching categories:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchCategories();
  // }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="all-services-page">
          <div className="services-container">
            {categories.map((service) => (

              <motion.div
                className="service-card"
                key={service.id}
                initial={{ scale: 0.8, y: 100 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Link to={`/category/${service.name.toLowerCase()}`} className="service-link">
                  <img src={service.image} alt={service.name} className="service-image" />
                  <div className="service-details">
                    <h2 className="service-title">{service.name}</h2>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

      )}
    </>
  );
}

export default AllServicesPage;
