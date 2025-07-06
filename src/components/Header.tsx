

import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { CartSummary } from './CartSummary';
import { ChatBot } from './ChatBot';
import { CartDrawer } from './CartDrawer';

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/product/125832040', label: 'Details', end: false },
  { to: '/checkout', label: 'Compra', end: true },
];

export const Header: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full py-6 absolute top-0 z-10 ">
      <CartDrawer open={open} onClose={() => setOpen(o => !o)} />
      <ChatBot />
      <div className="container mx-auto flex justify-between items-center px-4">
        <NavLink to="/" className="text-2xl font-serif italic">
          Vélez.
        </NavLink>
        <nav className="hidden md:flex space-x-10">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `nav-link hover:text-gray-300 ${isActive ? 'active text-gray-400' : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center" onClick={() => setOpen(o => !o)}>
          <CartSummary />
        </div>
      </div>
    </header>
  );
};
