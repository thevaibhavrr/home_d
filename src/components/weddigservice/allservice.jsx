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

//         // Sort the categories array based on the `poistionId` field
//         const sortedCategories = response.data.sort((a, b) => a.poistionId - b.poistionId);

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
//         <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
//           <Loader />
//         </div>
//       ) : (
//         <div className="all-services-page">
//           <div className="services-container">
//             {categories.map((service) => (
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
//                     src={service.image.replace('http://', 'https://')} // Replaces "http://" with "https://"
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


import "../../styles/allservice.css";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { makeApi } from "../../api/callApi";
import Loader from "../../components/loader/loader";

// All Services Page Component
function AllServicesPage() {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        const response = await makeApi("/api/get-all-categories", "GET");

        // Sort the categories array based on the `poistionId` field
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

  // Handle search input change
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query === '') {
      setFilteredCategories(categories); // If search is empty, show all categories
    } else {
      const filtered = categories.filter((service) =>
        service.name.toLowerCase().includes(query)
      );
      setFilteredCategories(filtered);
    }
  };

  return (
    <>
      {loading ? (
        <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Loader />
        </div>
      ) : (
        <div className="all-services-page">
          {/* Image Slider Section */}
          {/* <div className="image-slider">
            <div className="slider-container">
              {categories.slice(0, 5).map((service) => (
                <div key={service._id} className="slider-item">
                  <img
                    src={service.image.replace('http://', 'https://')}
                    alt={service.name}
                    className="slider-image"
                  />
                </div>
              ))}
            </div>
          </div> */}

          {/* Search Input Section */}
          {/* <div className="search-container">
            <input
              type="text"
              placeholder="Search for services..."
              value={searchQuery}
              onChange={handleSearch}
              className="search-input"
            />
          </div> */}

          {/* Services Section */}
          <div className="services-container">
            {filteredCategories.map((service) => (
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
                    src={service.image.replace('http://', 'https://')}
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
