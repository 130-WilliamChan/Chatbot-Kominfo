import FullModeChatbot from './components/FullModeChatbot';
import './App.css';

function App() {
  return (
    <div className="App">
      {/* Header */}
      <header className="header">
        <nav className="navbar">
          <div className="nav-brand">
            <h1>TechnoVision</h1>
          </div>
          <ul className="nav-menu">
            <li><a href="#home">Home</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-content">
          <h1 className="hero-title">AI-Powered Solutions with Smart Assistant</h1>
          <p className="hero-subtitle">
            Experience intelligent conversations with our compact AI assistant. 
            Switch between avatar mode with robotic voice or traditional chat mode seamlessly.
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary">Get Started</button>
            <button className="btn btn-secondary">Try Smart Chat</button>
          </div>
        </div>
        <div className="hero-image">
          <div className="floating-card">
            <h3>🤖 Smart Assistant</h3>
            <p>Compact AI with dual modes</p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services">
        <div className="container">
          <h2 className="section-title">Our Services</h2>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">🧠</div>
              <h3>Machine Learning</h3>
              <p>Advanced ML algorithms to solve complex business problems and automate processes.</p>
            </div>
            <div className="service-card">
              <div className="service-icon">🤖</div>
              <h3>Smart Chatbot</h3>
              <p>Compact AI assistant with avatar mode, robotic voice, and traditional chat options.</p>
            </div>
            <div className="service-card">
              <div className="service-icon">📊</div>
              <h3>Data Analytics</h3>
              <p>Transform raw data into actionable insights with our analytics platform.</p>
            </div>
            <div className="service-card">
              <div className="service-icon">🚀</div>
              <h3>AI Integration</h3>
              <p>Seamlessly integrate AI capabilities into your existing systems and workflows.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>About TechnoVision</h2>
              <p>
                We are a leading technology company specializing in AI and machine learning solutions. 
                Our team of experts combines cutting-edge research with practical applications to 
                deliver innovative solutions that drive business growth.
              </p>
              <p>
                Our smart chatbot technology offers dual interaction modes - immersive avatar experience 
                with robotic voice synthesis and efficient traditional chat interface, all optimized 
                for mobile and desktop platforms.
              </p>
              <div className="stats">
                <div className="stat">
                  <h3>500+</h3>
                  <p>Projects Completed</p>
                </div>
                <div className="stat">
                  <h3>50+</h3>
                  <p>Happy Clients</p>
                </div>
                <div className="stat">
                  <h3>5+</h3>
                  <p>Years Experience</p>
                </div>
              </div>
            </div>
            <div className="about-image">
              <div className="tech-showcase">
                <div className="tech-item">React</div>
                <div className="tech-item">TypeScript</div>
                <div className="tech-item">Smart AI</div>
                <div className="tech-item">Gemini API</div>
                <div className="tech-item">Voice Synthesis</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="container">
          <h2 className="section-title">Get In Touch</h2>
          <div className="contact-content">
            <div className="contact-info">
              <h3>Contact Information</h3>
              <div className="contact-item">
                <span className="contact-icon">📧</span>
                <span>info@technovision.com</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📱</span>
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <span>123 Tech Street, Innovation City, TC 12345</span>
              </div>
            </div>
            <div className="contact-form">
              <form>
                <input type="text" placeholder="Your Name" />
                <input type="email" placeholder="Your Email" />
                <textarea placeholder="Your Message" rows={5}></textarea>
                <button type="submit" className="btn btn-primary">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>TechnoVision</h3>
              <p>Leading the future with AI innovation</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Follow Us</h4>
              <div className="social-links">
                <a href="#">LinkedIn</a>
                <a href="#">Twitter</a>
                <a href="#">GitHub</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 TechnoVision. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Full Mode Chatbot positioned at bottom-right */}
      <FullModeChatbot />
    </div>
  );
}

export default App;
