import { Pacifico } from 'next/font/google';
import React from 'react';
import Sidebar from '@/components/adminSidebar';

const pacifico = Pacifico({
  subsets: ['latin'], // Specify subsets you need
  weight: '400', // Pacifico only supports the 400 weight
  variable: '--font-pacifico' // Define a custom CSS variable to use this font
});

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen relative">
      <Sidebar />

    <div className={`${pacifico.variable} font-sans flex-1 overflow-x-hidden overflow-y-auto`}>
      {children}
    </div>
    </div>
  );
};

export default Layout;
