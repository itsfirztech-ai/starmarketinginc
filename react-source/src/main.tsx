import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Marketing from './pages/Marketing';
import Development from './pages/Development';
import About from './pages/About';
import Contact from './pages/Contact';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/digital-marketing/*" element={<Marketing />} />
          <Route path="/ai-web-development/*" element={<Development />} />
          <Route path="/about/*" element={<About />} />
          <Route path="/contact/*" element={<Contact />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
