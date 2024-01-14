import React, { useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './Header.css';
import { useFGContext } from '../../context/FGContext';
import { parseDateString } from '../../Utils/dateUtils/dateUtils';
import PageMenu from '../../Molecules/PageMenu/PageMenu';

function Header({ downloadPDF }) {
  const { analysisData, resetState, csvRawArray } = useFGContext();
  const { date } = useMemo(
    () => parseDateString(analysisData?.startTime),
    [analysisData],
  );
  const location = useLocation();

  let programTitle = '';
  if (location.pathname !== '/') {
    programTitle = analysisData?.programName || csvRawArray[0]?.name || '';
  }

  const resetStateValues = () => {
    resetState();
  };

  return (
    <div className="navBarContainer">
      <NavLink to="/" className="logoLink" onClick={resetStateValues}>
        <img
          src="/assets/firing-graph-logo.svg"
          alt="firing graph logo"
          className="mainLogo"
        />
        <div className="navNameContainer">
          <h1 className="navName">FireGraph</h1>
          <p className="navNameSmall">by Jay Klay Pots</p>
        </div>
      </NavLink>
      <div className="titleContainer">
        <h2 className="programTitle">{programTitle}</h2>
        <p className="programSubtitle">{date}</p>
      </div>
      <div>
        <PageMenu downloadPDF={downloadPDF} />
      </div>
    </div>
  );
}

export default Header;
