import "../../styles/allservice.css";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { makeApi } from "../../api/callApi";
// import Loader from "../../components/loader/loader";

// All Services Page Component
function AllServicesPage() {
 
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

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

  return (
    <>
      {loading ? (
        // <Loader />
        "Loading..."
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
