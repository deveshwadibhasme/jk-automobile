// Footer.jsx - Professional Redesign
import React, { useState } from "react";
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
  faArrowRight,
  faCheckCircle
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      // Handle newsletter subscription
      console.log("Subscribed with email:", email);
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail("");
    }
  };

  return (
    <footer className="footer">
      {/* Newsletter Section */}

      {/* Main Footer Content */}
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            {/* Brand Section */}
            <div className="footer-brand">
              <div className="brand-logo">
                <h2 className="brand-title" style={{color:"white"}}>J.K Auto Electronic Works</h2>
              </div>
              <a
                href="https://www.resicode.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="powered-by"
              >
                <img src="/resicode.jpeg" height={35} width={35} alt="Resicode Solution" />
                <span style={{color:"white"}}>Powered by Resicode Solution</span>
              </a>
              <p className="brand-description">
                Your trusted source for premium automotive parts and accessories. 
                Quality guarantees, performance delivered.
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
                <li><a href="#faq">FAQ</a></li>
                <li><a href="#support">Support</a></li>
              </ul>
            </div>

            {/* Contact Section */}
            <div className="footer-section">
              <h3 className="section-title">Contact Information</h3>
              <ul className="contact-info">
                <li className="contact-item">
                  <div className="contact-icon">
                    <FontAwesomeIcon icon={faPhoneAlt} />
                  </div>
                  <div className="contact-details">
                    <span className="contact-label">Phone Number</span>
                    <a href="tel:8087612366" className="contact-value">+91 8087612366</a>
                  </div>
                </li>
                <li className="contact-item">
                  <div className="contact-icon">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                  </div>
                  <div className="contact-details">
                    <span className="contact-label">Our Location</span>
                    <address className="contact-value">
                      H no. 107/45, Shantinagar ghat square, OLD KAMTHI,<br />
                      Shanti Nagar Main Rd, Nagpur, Maharashtra 440002
                    </address>
                  </div>
                </li>
                <li className="contact-item">
                  <div className="contact-icon">
                    <FontAwesomeIcon icon={faClock} />
                  </div>
                  <div className="contact-details">
                    <span className="contact-label">Business Hours</span>
                    <span className="contact-value">Mon - Sat: 9:00 AM - 12:00 PM</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="footer-bottom">
            <div className="footer-bottom-content">
              <p className="copyright">
                © 2026 J K Auto Electronic Works. All rights reserved.
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