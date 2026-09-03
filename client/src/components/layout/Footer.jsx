const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">

      <div className="footer-content">

        <div>
          <strong>
            StoreRate
          </strong>

          <span>
            A modern platform for discovering
            and rating stores.
          </span>
        </div>

        <div className="footer-links">

          <span>
            Privacy
          </span>

          <span>
            Terms
          </span>

          <span>
            Support
          </span>

        </div>

        <div className="footer-copyright">

          © {currentYear} StoreRate

        </div>

      </div>

    </footer>
  );
};

export default Footer;