import React from 'react';
import './Footer.css';

const Footer = () => {
  // generate current year for copyright
  function generateCopyright() {
    const d = new Date();
    const year = d.getFullYear();
    return year;
  }

  return (
    <footer className="footer">
      <div className="socialContainer">
        <a
          href="mailto:joshua@young.net"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/assets/instagram-icon.svg"
            alt="instagram logo"
            className="socialImage"
          />
        </a>
        <a
          href="https://github.com/JoshuaAYoung"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/assets/github-icon.svg"
            alt="github logo"
            className="socialImage"
          />
        </a>
        <a
          href="https://www.reddit.com/user/jay_klay_pots"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/assets/reddit-icon.svg"
            alt="reddit logo"
            className="socialImage"
          />
        </a>
      </div>
      <p className="copyright">
        Copyright &copy; {generateCopyright()}
        <br />
        <a
          href="https://joshyoung.net"
          target="_blank"
          rel="noopener noreferrer"
          className="portLink"
        >
          Josh Young
        </a>
      </p>
    </footer>
  );
};

export default Footer;
