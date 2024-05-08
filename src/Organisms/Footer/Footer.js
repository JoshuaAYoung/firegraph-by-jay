import React from 'react';
import './Footer.css';
import { VscGithub } from 'react-icons/vsc';
import { PiInstagramLogoBold } from 'react-icons/pi';
import { HiOutlineMail } from 'react-icons/hi';

function Footer() {
  // generate current year for copyright
  function generateCopyright() {
    const d = new Date();
    const year = d.getFullYear();
    return year;
  }

  return (
    <div className="footer">
      <div className="socialContainer">
        <a
          href="https://www.instagram.com/jay_klay_pots"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram Link"
          className="socialIcon"
        >
          <PiInstagramLogoBold size={32} />
        </a>
        <a
          href="mailto:joshua@young.net"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Email Link"
          className="socialIcon"
        >
          <HiOutlineMail size={32} />
        </a>
        <a
          href="https://github.com/JoshuaAYoung"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Github Link"
          className="socialIcon"
        >
          <VscGithub size={28} />
        </a>
      </div>
      <p className="copyright">
        Copyright &copy; {generateCopyright()} - Josh Young
      </p>
    </div>
  );
}

export default Footer;
