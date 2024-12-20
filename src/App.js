
import { Route, Routes } from "react-router-dom";
import AllServicesPage from "./components/weddigservice/allservice";
import CategoryPage from "./components/weddigservice/servicedetails";
import CartPage from "./components/weddigservice/CartPage"; 
// import FooterBar from "./components/footer/FooterBar"; 

function App() {
  return (
    <>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<AllServicesPage />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>

        {/* Conditionally render FooterBar */}
        {/* <FooterBar /> */}
      </div>
    </>
  );
}

export default App;
