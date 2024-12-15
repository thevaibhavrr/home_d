// import React from 'react'
// import { Route, Routes } from "react-router-dom";
// import Wedding from './pages/Wedding';

// function App() {
//   return (
//     <div>
//        <Routes>
//         <Route path="/wedding/*" element={<Wedding />} />
//       </Routes>
//     </div>
//   )
// }

// export default App
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AllServicesPage from "./components/weddigservice/allservice";
import CategoryPage from "./components/weddigservice/servicedetails";
import FooterBar from "./components/footrt/FooterBar";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<AllServicesPage />} />
        <Route path="/category/:category" element={<CategoryPage />} />
      </Routes>
      {/* <FooterBar/> */}
    </>
  );
}

export default App;
