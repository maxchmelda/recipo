import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Recipo. All rights reserved.</p>
        <p>
          max.chmelicek@gmail.com
        </p>
      </div>
    </footer>
  )
}

export default Footer