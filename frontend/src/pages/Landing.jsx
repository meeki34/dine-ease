import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ParticlesBackground from '../components/ParticlesBackground';
import PretextHero from '../components/PretextHero';
import { PlateIcon, PackageIcon, UsersIcon, GridIcon, ClipboardIcon, KitchenIcon, ChartIcon } from '../components/icons';
import '../styles/Landing.css';

const Landing = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  
  // Typewriter effect state
  const words = ['Efficiency', 'Profitability', 'Excellence', 'Control'];
  const [currentWord, setCurrentWord] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    const wordInterval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 3000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(wordInterval);
    };
  }, [words.length]);

  return (
    <div className="landing-wrapper">
      {/* ===== NAVIGATION ===== */}
      <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
        <a href="#" className="landing-logo">
          <span className="logo-icon"><PlateIcon /></span>
          <h2>DINE-EASE</h2>
        </a>
        <div className="landing-links">
          <a href="#features" className="nav-item">Features</a>
          <a href="#testimonials" className="nav-item">Testimonials</a>
          <a href="#pricing" className="nav-item">Pricing</a>
        </div>
        <div className="nav-actions">
          <button onClick={() => navigate('/staff-login')} className="btn-ghost">Staff Login</button>
          <button onClick={() => navigate('/login')} className="btn-ghost">Admin Login</button>
          <button onClick={() => navigate('/register')} className="btn-primary">Register Business</button>
        </div>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section className="hero-section">
        <ParticlesBackground />
        <div className="hero-overlay"></div>
        
        <div className="hero-content">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="hero-badge"
          >
            ★ Premium Hospitality Suite 2026
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <PretextHero />
          </motion.div>
          
          <motion.div 
            className="hero-ctas"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <button onClick={() => navigate('/register')} className="btn-primary">Start Your Free Trial</button>
            <button onClick={() => document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' })} className="btn-large-ghost">View Pricing</button>
          </motion.div>

          <motion.div 
            className="hero-trust"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <div className="trust-avatars">
              <div className="trust-avatar"><span>MB</span></div>
              <div className="trust-avatar"><span>SC</span></div>
              <div className="trust-avatar"><span>JO</span></div>
            </div>
            <p>Trusted by <strong>500+</strong> restaurants worldwide</p>
          </motion.div>
        </div>

        {/* CSS Mockup Window */}
        <motion.div 
          className="hero-visual"
          initial={{ opacity: 0, x: 40, rotateY: 0 }}
          animate={{ opacity: 1, x: 0, rotateY: -5 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <div className="dashboard-mockup">
            <div className="mockup-header">
              <div className="mockup-dot red"></div>
              <div className="mockup-dot yellow"></div>
              <div className="mockup-dot green"></div>
            </div>
            
            <div className="mockup-stats">
              <div className="mockup-stat-card active">
                <div className="mockup-stat-label">Today's Revenue</div>
                <div className="mockup-stat-value">₹12,450</div>
              </div>
              <div className="mockup-stat-card">
                <div className="mockup-stat-label">Active Orders</div>
                <div className="mockup-stat-value">24</div>
              </div>
              <div className="mockup-stat-card">
                <div className="mockup-stat-label">Occupancy</div>
                <div className="mockup-stat-value">18/24</div>
              </div>
            </div>

            <div className="mockup-chart">
              <div className="mockup-bar" style={{ height: '40%' }}></div>
              <div className="mockup-bar" style={{ height: '70%' }}></div>
              <div className="mockup-bar" style={{ height: '50%' }}></div>
              <div className="mockup-bar" style={{ height: '90%' }}></div>
              <div className="mockup-bar" style={{ height: '100%', background: '#ffb77d' }}></div>
            </div>

            <div className="mockup-list">
              <div className="mockup-list-item">
                <div className="mockup-item-left">
                  <span>Table 12 • Vip Guest</span>
                  <p>Truffle Risotto, Wagyu A5</p>
                </div>
                <div className="mockup-badge prep">In Prep</div>
              </div>
              <div className="mockup-list-item">
                <div className="mockup-item-left">
                  <span>Table 04 • Walk-in</span>
                  <p>2x Caesar Salad, Martini</p>
                </div>
                <div className="mockup-badge ready">Ready</div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ===== STATS BAND ===== */}
      <section className="stats-band">
        <div className="stats-grid">
          {[
            { num: "500+", label: "Restaurants Worldwide" },
            { num: "99.9%", label: "Uptime Guaranteed" },
            { num: "₹2M+", label: "Revenue Tracked Daily" },
            { num: "< 3min", label: "Avg. Order Routing" }
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              className="stat-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="stat-number">{stat.num}</div>
              <div className="stat-label">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="features-section" id="features">
        <div className="section-header">
          <h2>Operational <span className="amber-gradient-text">Excellence</span></h2>
          <p>Precision modules built for elite operations, eliminating friction from front-of-house to the pass.</p>
        </div>
        
        <div className="features-grid">
          {[
            { id: "01", title: "Real-time Inventory", desc: "Track stock levels with surgical precision. Automated reordering and ingredient-level tracking.", Icon: PackageIcon },
            { id: "02", title: "Staff Management", desc: "Seamlessly coordinate your elite team. Intelligent scheduling and performance metrics.", Icon: UsersIcon },
            { id: "03", title: "Table Management", desc: "Master your floor plan. Intelligent seat allocation and VIP guest recognition.", Icon: GridIcon },
            { id: "04", title: "Order Management", desc: "Real-time order tracking from table to kitchen. Reduce errors and improve speed.", Icon: ClipboardIcon },
            { id: "05", title: "Kitchen Queue", desc: "Live kitchen display system. Chefs see orders instantly and update status in real time.", Icon: KitchenIcon },
            { id: "06", title: "Advanced Analytics", desc: "Detailed dashboards and predictive forecasting for data-driven financial decisions.", Icon: ChartIcon }
          ].map((feat, i) => (
            <motion.div 
              key={feat.id} 
              className="feature-card glass-panel"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="feature-top">
                <div className="feature-icon"><feat.Icon /></div>
                <div className="feature-num">{feat.id}</div>
              </div>
              <h3>{feat.title}</h3>
              <p>{feat.desc}</p>
              <div className="feature-underline"></div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="testimonials-section" id="testimonials">
        <div className="section-header">
          <h2>What Restaurateurs Say</h2>
          <p>The system chosen by industry leaders who demand perfection.</p>
        </div>
        
        <div className="testimonials-grid">
          {[
            { quote: "DINE-EASE cut our ticket times by 40%. Absolutely revolutionary for our high-volume services.", name: "Marco Bianchi", role: "Executive Chef, Milano Ristorante" },
            { quote: "Finally a system that doesn't require a tech degree. Our team adopted it overnight without a hitch.", name: "Sarah Chen", role: "Owner, The Golden Chopstick" },
            { quote: "Real-time inventory alerts alone saved us thousands in waste reduction in the first quarter.", name: "James Okafor", role: "GM, Savanna Steakhouse" }
          ].map((t, i) => (
            <motion.div 
              key={i} 
              className="testimonial-card glass-panel"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <div className="quote-icon">"</div>
              <p className="testimonial-text">{t.quote}</p>
              <div className="testimonial-author">
                <div className="stars">★★★★★</div>
                <strong>{t.name}</strong>
                <span>{t.role}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section className="pricing-section" id="pricing">
        <div className="section-header">
          <h2>Simple <span className="amber-gradient-text">Transparent</span> Pricing</h2>
          <p>No hidden fees. Scale your restaurant operations with the plan that fits you best.</p>
        </div>
        
        <div className="pricing-grid">
          <motion.div className="pricing-card glass-panel" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h3>Free Trial</h3>
            <div className="price">₹0<span>/mo</span></div>
            <p className="desc">14-day full access. No credit card required.</p>
            <ul className="feature-list">
              <li><span className="check">✓</span> 1 Location</li>
              <li><span className="check">✓</span> Up to 50 orders/day</li>
              <li><span className="check">✓</span> Basic Analytics</li>
            </ul>
            <button onClick={() => navigate('/register')} className="btn-large-ghost">Start Free</button>
          </motion.div>

          <motion.div className="pricing-card highlight glass-panel" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <div className="popular-badge">Most Popular</div>
            <h3 style={{ color: '#f48c25' }}>Pro</h3>
            <div className="price">₹1,000<span>/mo</span></div>
            <p className="desc">Everything you need to run a high-volume restaurant.</p>
            <ul className="feature-list">
              <li><span className="check">✓</span> Unlimited Orders</li>
              <li><span className="check">✓</span> Advanced Analytics & Forecasting</li>
              <li><span className="check">✓</span> Staff Scheduling & Performance</li>
              <li><span className="check">✓</span> Advanced Inventory routing</li>
            </ul>
            <button onClick={() => navigate('/register')} className="btn-primary">Get Started</button>
          </motion.div>

          <motion.div className="pricing-card glass-panel" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
            <h3>Enterprise</h3>
            <div className="price">Custom</div>
            <p className="desc">For multi-location franchise operations.</p>
            <ul className="feature-list">
              <li><span className="check">✓</span> Multi-location dashboard</li>
              <li><span className="check">✓</span> Custom API Integrations</li>
              <li><span className="check">✓</span> Dedicated Success Manager</li>
            </ul>
            <button className="btn-large-ghost">Contact Sales</button>
          </motion.div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="cta-section">
        <motion.div 
          className="cta-box"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h2>Ready to redefine your dining experience?</h2>
          <p>Join 500+ top-tier restaurants using DINE-EASE to power their success and elevate their margins.</p>
          <button onClick={() => navigate('/register')} className="btn-dark">Request Access →</button>
        </motion.div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="landing-logo">
              <span className="logo-icon"><PlateIcon /></span>
              <h2>DINE-EASE</h2>
            </div>
            <p>The definitive operating system for modern hospitality, combining clinical precision with warm luxury.</p>
          </div>
          <div className="footer-col">
            <h4>Product</h4>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#">Book a Demo</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Blog</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <ul>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div>© 2026 DINE-EASE Technologies. All rights reserved.</div>
          <div className="social-links">
            <a href="#">Twitter</a>
            <a href="#">LinkedIn</a>
            <a href="#">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

