// import "../../styles/allservice.css";
// import { Link } from "react-router-dom";
// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { makeApi } from "../../api/callApi";
// import Loader from "../../components/loader/loader";

// // All Services Page Component
// function AllServicesPage() {
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     async function fetchCategories() {
//       try {
//         setLoading(true);
//         const response = await makeApi("/api/get-all-categories", "GET");
        
//         // Preset order for categories
//         const categoryOrder = ["Food","Thali" ,"General store", "Milk", "Shakes"];

//         // Sort the categories array based on the preset order
//         const sortedCategories = response.data.sort((a, b) => {
//           const indexA = categoryOrder.indexOf(a.name);
//           const indexB = categoryOrder.indexOf(b.name);
          
//           // If one of the categories is in the preset order, sort accordingly
//           if (indexA === -1 && indexB === -1) {
//             // Both not in preset order, sort alphabetically
//             return a.name.localeCompare(b.name);
//           } 
          
//           // Sort based on preset order
//           if (indexA === -1) return 1; // If A is not in preset order, it should come after B
//           if (indexB === -1) return -1; // If B is not in preset order, it should come after A
//           return indexA - indexB; // Normal sort based on preset order
//         });

//         setCategories(sortedCategories);
//       } catch (error) {
//         console.log("Error fetching categories:", error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchCategories();
//   }, []);

//   return (
//     <>
//       {loading ? (
//         <Loader />
//       ) : (
//         <div className="all-services-page">
//           <div className="services-container">
//             {categories.map((service) => (
//               <motion.div
//                 className="service-card"
//                 key={service._id}  // Using _id as the key to ensure uniqueness
//                 initial={{ scale: 0.8, y: 100 }}
//                 animate={{ scale: 1, y: 0 }}
//                 transition={{ duration: 0.4 }}
//               >
//                 <Link to={`/category/${service.name.toLowerCase()}`} className="service-link">
//                   <img src={service.image} alt={service.name} className="service-image" />
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

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        const response = await makeApi("/api/get-all-categories", "GET");

        // Sort the categories array based on the `poistionId` field
        const sortedCategories = response.data.sort((a, b) => a.poistionId - b.poistionId);

        setCategories(sortedCategories);
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
        <Loader />
      ) : (
        <div className="all-services-page">
          <div className="services-container">
            {categories.map((service) => (
              <motion.div
                className="service-card"
                key={service._id} // Using _id as the key to ensure uniqueness
                initial={{ scale: 0.8, y: 100 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ duration: 0.4 }}
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
        </div>
      )}
    </>
  );
}

export default AllServicesPage;
