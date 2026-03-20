import React from 'react';
import {
  Zap, ArrowRight, FileText,
  Download, Shield, ChevronRight
} from 'lucide-react';

const HomePage = ({ onGetStarted }) => {

  const features = [
    {
      icon: <Download size={28} />,
      title: 'Professional PDF Export',
      desc: 'Single-column, system-font PDF that looks great and is simple to read.',
      color: '#0984e3',
    },
    {
      icon: <Shield size={28} />,
      title: '100% Private',
      desc: 'Your data never leaves your device. No accounts, no tracking, no uploads.',
      color: '#e17055',
    },
  ];

  const steps = [
    { num: '01', title: 'Fill Your Details', desc: 'Enter your experience, education, and skills in our guided form.' },
    { num: '02', title: 'Format Your Data', desc: 'Use our clean, professional templates to structure your information.' },
    { num: '03', title: 'Export & Apply', desc: 'Download a perfectly formatted PDF resume.' },
  ];

  return (
    <div className="homepage">
      {/* ── Navbar ── */}
      <nav className="home-nav">
        <div className="home-nav-inner">
          <div className="logo">
            <Zap size={24} />
            <span>ResumeForge</span>
          </div>
          <div className="home-nav-right">
            <button className="home-cta-small" onClick={onGetStarted}>
              Build Resume <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-content">
          <h1 className="hero-title">
            Build a Professional Resume<br />
            <span className="hero-gradient">Fast & Easy</span>
          </h1>
          <p className="hero-subtitle">
            A simple, no-nonsense resume builder. 
            All free, all private, all in your browser.
          </p>
          <div className="hero-actions">
            <button className="hero-btn primary" onClick={onGetStarted}>
              <FileText size={18} /> Start Building — It's Free
            </button>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="stat-number">100%</span>
              <span className="stat-label">Free & Private</span>
            </div>
            <div className="hero-stat-sep" />
            <div className="hero-stat">
              <span className="stat-number">Fast</span>
              <span className="stat-label">Builder</span>
            </div>
            <div className="hero-stat-sep" />
            <div className="hero-stat">
              <span className="stat-number">No Sign-Up</span>
              <span className="stat-label">Required</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="features-section">
        <h2 className="section-heading">Everything You Need to Land Interviews</h2>
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon" style={{ background: f.color + '18', color: f.color }}>
                {f.icon}
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="how-section">
        <h2 className="section-heading">How It Works</h2>
        <div className="steps-grid">
          {steps.map((s, i) => (
            <div key={i} className="step-card">
              <span className="step-num">{s.num}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              {i < steps.length - 1 && <ChevronRight className="step-arrow" size={20} />}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="cta-card">
          <h2>Ready to Build Your Resume?</h2>
          <p>Create your professional resume in under 10 minutes. No sign-up required.</p>
          <button className="hero-btn primary" onClick={onGetStarted}>
            <Zap size={18} /> Start Building Now
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="home-footer">
        <div className="footer-inner">
          <div className="logo">
            <Zap size={18} />
            <span>ResumeForge</span>
          </div>
          <span className="footer-text">Free & open-source. Your data stays on your device.</span>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
