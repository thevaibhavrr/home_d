import { Route, Routes } from "react-router-dom";

import "./App.css";
import CartPage from "./components/weddigservice/CartPage";
import CategoryPage from "./components/weddigservice/servicedetails";
import AllServicesPage from "./components/weddigservice/allservice"
import PrivacyPolicy from "./components/weddigservice/Privacypage";
import Allshoppage from "./components/weddigservice/Shop";
import Repair from "./components/weddigservice/repair";
function App() {
  return (
    <div className="App">
      <Routes>
      <Route path="/" element={<AllServicesPage />} />
      <Route path="/shops" element={<Allshoppage />} />
      <Route path="/repair" element={<Repair />} />

        <Route path="/category/:category" element={<CategoryPage />} />

        <Route path="/cart" element={<CartPage />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
      </Routes>
    </div>
  );
}

export default App;
