import "../../styles/allservice.css";
import { Link } from "react-router-dom";
import React from "react";
import { motion } from "framer-motion";

// All Services Page Component
function AllServicesPage() {
  const services = [
    { id: 1, title: "Food", image: "https://t4.ftcdn.net/jpg/05/61/78/69/360_F_561786951_IdQbtR0bga3RzISgodGvIRMFEBqmjfcn.jpg", description: "Delicious meals delivered to your door." },
    { id: 2, title: "Medicine", image: "https://media.istockphoto.com/id/463594335/photo/medicine-pills.jpg?s=612x612&w=0&k=20&c=Dus1rcWLtN2puGcHlRk54HdcELVZUcB_z03o7hp18NU=", description: "Healthcare essentials at your fingertips." },
  ];

  return (
    <div className="all-services-page">
      {/* <h1 className="page-title">Choose Your Service</h1> */}
      <div className="services-container">
        {services.map((service) => (
          <motion.div
            className="service-card"
            key={service.id}
            initial={{ scale: 0.8, y: 100 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link to={`/category/${service.title.toLowerCase()}`} className="service-link">
              <img src={service.image} alt={service.title} className="service-image" />
              <div className="service-details">
                <h2 className="service-title">{service.title}</h2>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default AllServicesPage;
