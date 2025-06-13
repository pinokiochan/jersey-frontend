import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Header from './components/Header';
import Footer from './components/Footer';
import About from "./pages/About.jsx";

export default function App() {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/about" element={<About />} />
            </Routes>
            <Footer />
        </Router>
    );
}