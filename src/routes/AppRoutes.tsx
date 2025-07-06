import React from 'react';
import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import { LandingPage } from '../pages/LandingPage';
import { ProductPage } from '../pages/ProductPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import Layout from '../components/Layout';

export const AppRoutes: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout><LandingPage /></Layout>} />
      <Route path="/product/:id" element={<Layout><ProductPage /></Layout>} />
      <Route path="/checkout" element={<Layout><CheckoutPage /></Layout>} />

      {/* Redirecciona cualquier otra ruta a la raíz */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);
