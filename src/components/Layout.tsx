import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { SplashScreen } from './SplashScreen';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <Header />
    <SplashScreen onFinish={()=>{}} />
    <main className='pt-10 '>{children}</main>
    <div className='fixed top-0 w-screen h-screen bg-gray-900 z-[-20]'/>
    <Footer />
  </>
);

export default Layout;