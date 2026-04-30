// EcomFooter.jsx
import React from "react";
import "./Footer.css";
import {
  faFacebook,
  faTwitter,
  faInstagram,
  faLinkedin,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { faPhoneAlt, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Footer = () => {
  return (
    <footer className="footer">
      {/* Main Footer Content */}
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            {/* Brand Section */}
            <div className="footer-brand">
              <h5 className="brand-title">J.K. AutoElectronic Works</h5>
              <a
                href="https://www.resicode.com/"
                className="brand-description"
                style={{
                  fontSize: "20px",
                  color: "white",
                  fontFamily: "bold",
                  paddingBottom: "1px",
                  textDecoration: "underline",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <img src="/resicode.jpeg" height={50} width={50} alt="" />{" "}
                Powered by Resicode Solution
              </a>
              <p className="brand-description">
                Your trusted source for premium automotive parts and
                accessories. Quality guarantees, performance delivered.
              </p>
              {/* Social Media Icons */}
              <div className="social-media">
                <h3 className="social-title">Follow Us</h3>
                <div className="">
                  <a href="#facebook" aria-label="Facebook">
                    <FontAwesomeIcon size="lg" icon={faFacebook} className="" />
                  </a>
                  <a href="#instagram" aria-label="Instagram">
                    <FontAwesomeIcon
                      size="lg"
                      icon={faInstagram}
                      className=""
                    />
                  </a>
                  <a href="#youtube" aria-label="YouTube">
                    <FontAwesomeIcon size="lg" icon={faYoutube} className="" />
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            {/* <div className="footer-section">
              <h3 className="section-title">Quick Links</h3>
              <ul className="footer-links">
                <li><a href="#about">About Us</a></li>
                <li><a href="#shop">Shop</a></li>
                <li><a href="#guides">Installation Guides</a></li>
                <li><a href="#order">Task Order</a></li>
                <li><a href="#returns">Returns</a></li>
                <li><a href="#faq">FAQ</a></li>
                <li><a href="#careers">Careers</a></li>
              </ul>
            </div> */}

            {/* Categories */}
            {/* <div className="footer-section">
              <h3 className="section-title">Categories</h3>
              <ul className="footer-links">
                <li><a href="#engine">Engine Parts</a></li>
                <li><a href="#performance">Performance Testing</a></li>
                <li><a href="#wheels">Wheels & Tires</a></li>
                <li><a href="#electric">Electrical Systems</a></li>
                <li><a href="#accessories">Interior Accessories</a></li>
                <li><a href="#exterior">Exterior Accessories</a></li>
                <li><a href="#tools">Tools & Equipment</a></li>
              </ul>
            </div> */}

            {/* Contact & Newsletter */}
            <div className="footer-section">
              <div className="contact-section">
                <h3 className="section-title">Contact Us</h3>
                <ul className="contact-info">
                  <li className="contact-item">
                    <span className="contact-icon">
                      <FontAwesomeIcon
                        size="lg"
                        icon={faPhoneAlt}
                        className=""
                      />{" "}
                      8087612366
                    </span>
                  </li>
                  {/* <li className="contact-item">
                    <span className="contact-icon">✉️</span>
                    support@autopartspace.com
                  </li> */}
                  <li className="contact-item">
                    <span className="contact-icon">
                      <FontAwesomeIcon
                        size="lg"
                        icon={faMapMarkerAlt}
                        className=""
                      />
                    </span>
                    H no. 107/45 , Shantinagar ghat square, OLD KAMTHI, Shanti
                    Nagar Main Rd, Nagpur, Maharashtra 440002
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="footer-bottom">
            <div className="footer-bottom-content">
              <p className="copyright">
                © 2026 JK Auto Electronics. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
