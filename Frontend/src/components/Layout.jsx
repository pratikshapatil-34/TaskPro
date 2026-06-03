import React from 'react';
import NavBar from './NavBar';

const Layout = ({ onLogout, user, children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      
      <NavBar user={user} onLogout={onLogout} />

      <main>
        {children}
      </main>

    </div>
  );
};

export default Layout;