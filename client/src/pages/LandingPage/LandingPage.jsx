import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Menu,
  ShieldCheck,
  Star,
  Store,
  Users,
  X,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import {
  useState,
} from "react";

import "./LandingPage.css";


const LandingPage = () => {

  const [menuOpen, setMenuOpen] = useState(false);

  const [openFaq, setOpenFaq] = useState(null);


  const toggleFaq = (index) => {

    setOpenFaq(
      openFaq === index
        ? null
        : index
    );

  };


  const features = [
    {
      icon: Store,
      title: "Discover Stores",
      text: "Find stores and explore ratings from real customers.",
    },
    {
      icon: Star,
      title: "Rate & Review",
      text: "Share your experience and help others make better decisions.",
    },
    {
      icon: ShieldCheck,
      title: "Trusted Ratings",
      text: "A simple platform designed around transparent customer feedback.",
    },
    {
      icon: Users,
      title: "For Everyone",
      text: "Customers, store owners and administrators all get dedicated experiences.",
    },
  ];


  const steps = [
    {
      number: "01",
      title: "Create your account",
      text: "Register as a customer and get started in seconds.",
    },
    {
      number: "02",
      title: "Discover stores",
      text: "Browse stores, compare ratings and explore details.",
    },
    {
      number: "03",
      title: "Share your experience",
      text: "Rate stores and help the community discover great businesses.",
    },
  ];


  const faqs = [
    {
      question: "What is StoreRate?",
      answer:
        "StoreRate is a platform where customers can discover stores, view ratings and share their own experiences.",
    },
    {
      question: "Can I rate a store?",
      answer:
        "Yes. After registering as a normal user, you can browse stores and submit ratings according to the available store-rating functionality.",
    },
    {
      question: "Can store owners see their ratings?",
      answer:
        "Yes. Store owners have their own dashboard where they can view information related to their store and customer ratings.",
    },
    {
      question: "Is StoreRate free to use?",
      answer:
        "The customer-facing StoreRate experience is designed to make discovering and rating stores simple and accessible.",
    },
  ];


  return (

    <div className="landing-page">

      {/* =========================================
          NAVBAR
      ========================================= */}

      <header className="landing-navbar">

        <Link
          to="/"
          className="landing-logo"
        >

          <div className="logo-mark">
            <Star size={19} />
          </div>

          <span>
            Store<span>Rate</span>
          </span>

        </Link>


        <nav className="desktop-nav">

          <a href="#features">
            Features
          </a>

          <a href="#how-it-works">
            How it works
          </a>

          <a href="#about">
            About
          </a>

          <a href="#faq">
            FAQ
          </a>

        </nav>


        <div className="nav-actions">

          <Link
            to="/login"
            className="nav-login"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="nav-register"
          >
            Get Started
          </Link>

        </div>


        <button
          className="mobile-menu-button"
          onClick={() =>
            setMenuOpen(!menuOpen)
          }
          aria-label="Toggle navigation"
        >

          {menuOpen
            ? <X size={23} />
            : <Menu size={23} />
          }

        </button>

      </header>


      {/* =========================================
          MOBILE NAV
      ========================================= */}

      {menuOpen && (

        <div className="mobile-nav">

          <a
            href="#features"
            onClick={() => setMenuOpen(false)}
          >
            Features
          </a>

          <a
            href="#how-it-works"
            onClick={() => setMenuOpen(false)}
          >
            How it works
          </a>

          <a
            href="#about"
            onClick={() => setMenuOpen(false)}
          >
            About
          </a>

          <a
            href="#faq"
            onClick={() => setMenuOpen(false)}
          >
            FAQ
          </a>

          <Link
            to="/login"
            onClick={() => setMenuOpen(false)}
          >
            Login
          </Link>

          <Link
            to="/register"
            className="mobile-register"
            onClick={() => setMenuOpen(false)}
          >
            Get Started
          </Link>

        </div>

      )}


      {/* =========================================
          HERO
      ========================================= */}

      <main>

        <section className="hero-section">

          <div className="hero-glow hero-glow-one" />
          <div className="hero-glow hero-glow-two" />


          <div className="hero-content">

            <div className="hero-badge">

              <span className="pulse-dot" />

              Trusted store discovery platform

            </div>


            <h1>

              Discover stores.

              <br />

              <span>
                Share your experience.
              </span>

            </h1>


            <p className="hero-description">

              StoreRate helps people discover stores,
              explore ratings and share honest
              experiences — all in one place.

            </p>


            <div className="hero-actions">

              <Link
                to="/register"
                className="hero-primary"
              >

                Start Exploring

                <ArrowRight size={19} />

              </Link>


              <Link
                to="/login"
                className="hero-secondary"
              >
                Sign In
              </Link>

            </div>


            <div className="hero-trust">

              <CheckCircle2 size={17} />

              <span>
                Simple. Transparent. Community-driven.
              </span>

            </div>

          </div>


          {/* HERO VISUAL */}

          <div className="hero-visual">

            <div className="dashboard-preview">

              <div className="preview-top">

                <div className="preview-dots">

                  <span />
                  <span />
                  <span />

                </div>

                <span className="preview-label">
                  StoreRate
                </span>

              </div>


              <div className="preview-content">

                <div className="preview-welcome">

                  <div>

                    <small>
                      DISCOVER
                    </small>

                    <h3>
                      Find your next
                      favorite store
                    </h3>

                  </div>

                  <div className="preview-icon">
                    <Store size={23} />
                  </div>

                </div>


                <div className="preview-search">

                  <span>
                    Search stores...
                  </span>

                  <span className="search-symbol">
                    ⌕
                  </span>

                </div>


                <div className="preview-stores">

                  <div className="preview-store">

                    <div className="mini-store-icon">
                      <Store size={16} />
                    </div>

                    <div className="mini-store-info">

                      <strong>
                        ABC Fitness Store
                      </strong>

                      <span>
                        Pune, Maharashtra
                      </span>

                    </div>

                    <div className="mini-rating">

                      <Star size={13} />

                      4.8

                    </div>

                  </div>


                  <div className="preview-store">

                    <div className="mini-store-icon">
                      <Store size={16} />
                    </div>

                    <div className="mini-store-info">

                      <strong>
                        M-Sports Clothing
                      </strong>

                      <span>
                        Mumbai, Maharashtra
                      </span>

                    </div>

                    <div className="mini-rating">

                      <Star size={13} />

                      4.5

                    </div>

                  </div>


                  <div className="preview-store">

                    <div className="mini-store-icon">
                      <Store size={16} />
                    </div>

                    <div className="mini-store-info">

                      <strong>
                        Sneha Fashion Store
                      </strong>

                      <span>
                        Wakad, Pune
                      </span>

                    </div>

                    <div className="mini-rating">

                      <Star size={13} />

                      4.2

                    </div>

                  </div>

                </div>

              </div>

            </div>


            <div className="floating-card floating-rating">

              <div className="floating-icon">
                <Star size={17} />
              </div>

              <div>

                <strong>
                  4.8
                </strong>

                <span>
                  Average rating
                </span>

              </div>

            </div>


            <div className="floating-card floating-users">

              <div className="avatar-stack">

                <span>U</span>
                <span>S</span>
                <span>R</span>

              </div>

              <div>

                <strong>
                  Growing community
                </strong>

                <span>
                  Real customer feedback
                </span>

              </div>

            </div>

          </div>

        </section>


        {/* =========================================
            STATS
        ========================================= */}

        <section className="stats-section">

          <div className="stats-container">

            <div className="stat-item">

              <strong>
                3+
              </strong>

              <span>
                User experiences
              </span>

            </div>

            <div className="stat-divider" />

            <div className="stat-item">

              <strong>
                4.8
              </strong>

              <span>
                Featured rating
              </span>

            </div>

            <div className="stat-divider" />

            <div className="stat-item">

              <strong>
                3
              </strong>

              <span>
                Dedicated roles
              </span>

            </div>

            <div className="stat-divider" />

            <div className="stat-item">

              <strong>
                24/7
              </strong>

              <span>
                Platform access
              </span>

            </div>

          </div>

        </section>


        {/* =========================================
            FEATURES
        ========================================= */}

        <section
          id="features"
          className="section features-section"
        >

          <div className="section-heading">

            <span className="section-eyebrow">
              WHY STORERATE
            </span>

            <h2>
              Everything you need to
              <span> choose better.</span>
            </h2>

            <p>
              A focused platform designed around
              discovery, trust and real experiences.
            </p>

          </div>


          <div className="features-grid">

            {features.map(
              (feature, index) => {

                const Icon = feature.icon;

                return (

                  <div
                    className="feature-card"
                    key={feature.title}
                    style={{
                      "--delay":
                        `${index * 0.08}s`,
                    }}
                  >

                    <div className="feature-icon">
                      <Icon size={22} />
                    </div>

                    <span className="feature-number">
                      0{index + 1}
                    </span>

                    <h3>
                      {feature.title}
                    </h3>

                    <p>
                      {feature.text}
                    </p>

                    <div className="feature-line" />

                  </div>

                );

              }
            )}

          </div>

        </section>


        {/* =========================================
            ABOUT / FLOW
        ========================================= */}

        <section
          id="about"
          className="section about-section"
        >

          <div className="about-visual">

            <div className="about-glow" />

            <div className="about-card">

              <div className="about-card-header">

                <div className="logo-mark small">
                  <Star size={15} />
                </div>

                <span>
                  StoreRate
                </span>

              </div>


              <div className="rating-large">

                <Star size={28} />

                <strong>
                  4.8
                </strong>

              </div>


              <div className="rating-bars">

                <div>
                  <span>5</span>
                  <div>
                    <i style={{ width: "86%" }} />
                  </div>
                </div>

                <div>
                  <span>4</span>
                  <div>
                    <i style={{ width: "68%" }} />
                  </div>
                </div>

                <div>
                  <span>3</span>
                  <div>
                    <i style={{ width: "32%" }} />
                  </div>
                </div>

                <div>
                  <span>2</span>
                  <div>
                    <i style={{ width: "14%" }} />
                  </div>
                </div>

              </div>

            </div>

          </div>


          <div className="about-content">

            <span className="section-eyebrow">
              BUILT FOR TRUST
            </span>

            <h2>
              Ratings that help
              <span> people decide.</span>
            </h2>

            <p>
              StoreRate brings customers and store
              owners together through a simple,
              transparent rating experience.
            </p>


            <div className="about-points">

              <div>

                <CheckCircle2 size={19} />

                <span>
                  Discover stores through ratings
                </span>

              </div>

              <div>

                <CheckCircle2 size={19} />

                <span>
                  Share your real experience
                </span>

              </div>

              <div>

                <CheckCircle2 size={19} />

                <span>
                  Give store owners useful feedback
                </span>

              </div>

            </div>


            <Link
              to="/register"
              className="text-link"
            >

              Join StoreRate

              <ArrowRight size={17} />

            </Link>

          </div>

        </section>


        {/* =========================================
            HOW IT WORKS
        ========================================= */}

        <section
          id="how-it-works"
          className="section steps-section"
        >

          <div className="section-heading">

            <span className="section-eyebrow">
              SIMPLE FLOW
            </span>

            <h2>
              Start in
              <span> three steps.</span>
            </h2>

          </div>


          <div className="steps-grid">

            {steps.map(
              (step, index) => (

                <div
                  className="step-card"
                  key={step.number}
                >

                  <div className="step-number">
                    {step.number}
                  </div>

                  <div className="step-connector">
                    {index < steps.length - 1 && (
                      <ArrowRight size={19} />
                    )}
                  </div>

                  <h3>
                    {step.title}
                  </h3>

                  <p>
                    {step.text}
                  </p>

                </div>

              )
            )}

          </div>

        </section>


        {/* =========================================
            CTA
        ========================================= */}

        <section className="cta-section">

          <div className="cta-glow" />

          <div className="cta-content">

            <span className="section-eyebrow">
              GET STARTED
            </span>

            <h2>
              Your next great store
              <span> is waiting.</span>
            </h2>

            <p>
              Join StoreRate and start discovering,
              rating and sharing your experiences.
            </p>

            <Link
              to="/register"
              className="hero-primary"
            >

              Create Free Account

              <ArrowRight size={19} />

            </Link>

          </div>

        </section>


        {/* =========================================
            FAQ
        ========================================= */}

        <section
          id="faq"
          className="section faq-section"
        >

          <div className="section-heading">

            <span className="section-eyebrow">
              FAQ
            </span>

            <h2>
              Frequently asked
              <span> questions.</span>
            </h2>

          </div>


          <div className="faq-list">

            {faqs.map(
              (faq, index) => (

                <div
                  className={`faq-item ${
                    openFaq === index
                      ? "faq-open"
                      : ""
                  }`}
                  key={faq.question}
                >

                  <button
                    onClick={() =>
                      toggleFaq(index)
                    }
                    aria-expanded={
                      openFaq === index
                    }
                  >

                    <span>
                      {faq.question}
                    </span>

                    <ChevronDown
                      size={19}
                    />

                  </button>


                  {openFaq === index && (

                    <div className="faq-answer">

                      <p>
                        {faq.answer}
                      </p>

                    </div>

                  )}

                </div>

              )
            )}

          </div>

        </section>

      </main>


      {/* =========================================
          FOOTER
      ========================================= */}

      <footer className="landing-footer">

        <div className="footer-main">

          <div className="footer-brand">

            <Link
              to="/"
              className="landing-logo"
            >

              <div className="logo-mark">
                <Star size={18} />
              </div>

              <span>
                Store<span>Rate</span>
              </span>

            </Link>


            <p>
              Discover better stores.
              Share better experiences.
            </p>


            <div className="footer-socials">

              <span>◎</span>
              <span>in</span>
              <span>𝕏</span>

            </div>

          </div>


          <div className="footer-column">

            <h4>
              Platform
            </h4>

            <a href="#features">
              Features
            </a>

            <a href="#how-it-works">
              How it works
            </a>

            <a href="#faq">
              FAQ
            </a>

          </div>


          <div className="footer-column">

            <h4>
              Account
            </h4>

            <Link to="/login">
              Login
            </Link>

            <Link to="/register">
              Register
            </Link>

          </div>


          <div className="footer-column">

            <h4>
              Roles
            </h4>

            <span>
              Customers
            </span>

            <span>
              Store Owners
            </span>

            <span>
              Administrators
            </span>

          </div>

        </div>


        <div className="footer-bottom">

          <span>
            © {new Date().getFullYear()} StoreRate.
            All rights reserved.
          </span>

          <span>
            Built for better decisions.
          </span>

        </div>

      </footer>

    </div>

  );

};


export default LandingPage;