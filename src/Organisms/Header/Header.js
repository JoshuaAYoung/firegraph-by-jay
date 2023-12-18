import React, { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';
import { Button } from '@mui/joy';
import { MdPictureAsPdf } from 'react-icons/md';
import { useFGContext } from '../../context/FGContext';
import { parseDateString } from '../../Utils/dateUtils/dateUtils';

function Header({ downloadPDF }) {
  const { analysisData, resetState } = useFGContext();
  const { date } = useMemo(
    () => parseDateString(analysisData?.startTime),
    [analysisData],
  );

  const programTitle = analysisData?.programName || '';

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
      {analysisData && (
        <div>
          <Button
            onClick={() => downloadPDF({ page: { format: 'letter' } })}
            loading={false}
            variant="plain"
            color="warning"
            size="sm"
            startDecorator={<MdPictureAsPdf size={20} />}
            sx={{
              backgroundColor: '#ffaa00',
              color: '#272727',
            }}
          >
            Download PDF
          </Button>
        </div>
      )}
    </div>
  );
}

export default Header;
