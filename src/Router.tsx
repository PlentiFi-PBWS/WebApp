import React from 'react';

import { Route, Routes } from 'react-router-dom';

import Home from './pages/home';
import Invest from './pages/Invest';
import Lp from './pages/landing-page';
import Form from './pages/form';
import Setup from './pages/finalSetup';

const Router = () => {
  return (
    <Routes>
      <Route path='/' element={<Lp />} />
      <Route path='/Home' element={<Home />} />
      <Route path='/Form' element={<Form />} />
      <Route path='/Setup' element={<Setup />} />
      <Route path='/Home' element={<Home />} />
      <Route path='/Invest' element={<Invest />} />
      <Route path='/Invest/:asset' element={<Invest />} />
    </Routes>
  );
};

export default Router;