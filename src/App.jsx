import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Ads from './components/Ads';
import Orders from './components/Orders';
import Ad from './components/Ad';
import Navigation from './components/Navigation';

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/ads" element={<Ads />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/ad/:id" element={<Ad />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
