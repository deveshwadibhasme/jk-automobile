// Footer.jsx - Modern Compact Design
import React from "react";
import "./Footer.css";
import {
  faFacebook,
  faTwitter,
  faInstagram,
  faLinkedin,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { 
  faPhoneAlt, 
  faMapMarkerAlt, 
  faEnvelope,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Footer = () => {
  return (
    <footer className="footer">
      {/* Main Footer Content - Compact */}
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            {/* Brand Section */}
            <div className="footer-brand">
              <h2 className="brand-title">J.K Auto Electronic Works</h2>
              <a
                href="https://www.resicode.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="powered-by"
              >
                <img src="/resicode.jpeg" height={28} width={28} alt="Resicode Solution" style={{ borderRadius: '6px' }} />
                <span>Powered by Resicode Solutions</span>
              </a>
              <p className="brand-description">
                
              </p>
              
              {/* Social Media */}
              <div className="social-section">
                <h4 className="social-heading">Follow Us</h4>
                <div className="social-icons-wrapper">
                  <a href="#facebook" className="social-icon facebook" aria-label="Facebook">
                    <FontAwesomeIcon icon={faFacebook} />
                  </a>
                  <a href="#instagram" className="social-icon instagram" aria-label="Instagram">
                    <FontAwesomeIcon icon={faInstagram} />
                  </a>
                  <a href="#youtube" className="social-icon youtube" aria-label="YouTube">
                    <FontAwesomeIcon icon={faYoutube} />
                  </a>
                  <a href="#twitter" className="social-icon twitter" aria-label="Twitter">
                    <FontAwesomeIcon icon={faTwitter} />
                  </a>
                  <a href="#linkedin" className="social-icon linkedin" aria-label="LinkedIn">
                    <FontAwesomeIcon icon={faLinkedin} />
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Links Section */}
            <div className="footer-section">
              <h3 className="section-title">Quick Links</h3>
              <ul className="footer-links">
                <li><a href="#about">About Us</a></li>
                <li><a href="#products">Products</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#guides">Installation Guides</a></li>
               
              </ul>
            </div>

            {/* Resources Section */}
            <div className="footer-section">
              <h3 className="section-title">Resources</h3>
              <ul className="footer-links">
                <li><a href="#catalog">Product Catalog</a></li>
                <li><a href="#warranty">Warranty Info</a></li>
                <li><a href="#shipping">Shipping Policy</a></li>
                <li><a href="#returns">Returns & Refunds</a></li>
              
              </ul>
            </div>

            {/* Contact Section */}
            <div className="footer-section">
              <h3 className="section-title">Get in Touch</h3>
              <ul className="contact-info">
                <li className="contact-item">
                  <div className="contact-icon">
                    <FontAwesomeIcon icon={faPhoneAlt} />
                  </div>
                  <div className="contact-details">
                    <span className="contact-label">Phone</span>
                    <a href="tel:8087612366" className="contact-value">+91 80876 12366</a>
                  </div>
                </li>
                <li className="contact-item">
                  <div className="contact-icon">
                    <FontAwesomeIcon icon={faEnvelope} />
                  </div>
                  <div className="contact-details">
                    <span className="contact-label">Email</span>
                    <a href="mailto:support@jkauto.com" className="contact-value">support@jkautoelectronicworks.com</a>
                  </div>
                </li>
                <li className="contact-item">
                  <div className="contact-icon">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                  </div>
                  <div className="contact-details">
                    <span className="contact-label">Location</span>
                    <address className="contact-value">
                      H no. 107/45, Shantinagar,<br />
                      Nagpur, Maharashtra 440002
                    </address>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="footer-bottom">
            <div className="footer-bottom-content">
              <p className="copyright">
                © 2026 J.K Auto Electronic Works. All rights reserved.
              </p>
              <div className="footer-legal">
                <a href="#privacy">Privacy Policy</a>
                <span className="separator">|</span>
                <a href="#terms">Terms of Service</a>
                <span className="separator">|</span>
                <a href="#returns">Return Policy</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;