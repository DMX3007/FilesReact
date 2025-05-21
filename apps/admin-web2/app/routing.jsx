import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Journals from '../pages/journals';
import Reports from '../pages/reports';
import Links from '../pages/links';

const AppRoutes = () => (
  <Routes>
    <Route path="/journals" element={<Journals />} />
    <Route path="/reports" element={<Reports />} />
    <Route path="/" element={<div>Welcome to Filebump</div>} />
  </Routes>
);

export default AppRoutes;