import React from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';
import { format } from 'date-fns';
import { Button } from '@mui/joy';
import { MdPictureAsPdf } from 'react-icons/md';
import { useFGContext } from '../../context/FGContext';
import { parseISODateString } from '../../Utils/dateUtils/dateUtils';

const Header = ({ downloadPDF }) => {
  const { analysisData } = useFGContext();

  const programDate =
    analysisData && analysisData.startTime
      ? format(parseISODateString(analysisData.startTime), 'MM/dd/yyyy')
      : '';

  const programTitle =
    analysisData && analysisData.programName ? analysisData.programName : '';

  return (
    <div className="navBarContainer">
      <NavLink to="/" className="logoLink">
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
        <p className="programSubtitle">{programDate}</p>
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
};

export default Header;
