import React, { useCallback, useState } from 'react';
import IconButton from '@mui/joy/IconButton';
import {
  Dropdown,
  ListItemDecorator,
  Menu,
  MenuButton,
  MenuItem,
} from '@mui/joy';
import { FaEllipsisVertical } from 'react-icons/fa6';
import { MdPictureAsPdf } from 'react-icons/md';
import { useNavigate, useLocation } from 'react-router-dom';

function PageMenu({ downloadPDF, addFiringNotes }) {
  const [resultsOpen, setResultsOpen] = useState(false);
  const [csvOpen, setCsvOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleCsvOpenChange = useCallback((event, isOpen) => {
    setCsvOpen(isOpen);
  }, []);

  const handleResultsOpenChange = useCallback((event, isOpen) => {
    setResultsOpen(isOpen);
  }, []);

  const navigateCsv = () => {
    setCsvOpen(false);
    setResultsOpen(false);
    navigate('/csv');
  };

  const navigateResults = () => {
    setCsvOpen(false);
    setResultsOpen(false);
    navigate('/results');
  };

  const alertPdf = () => {
    // TODO change this into a modal!
    console.warn(
      "Currently disabled for this page. As the PDF Download button saves a screenshot in pdf format, this file can get quite large for this CSV page. Printing from your browser and choosing 'print to pdf' as the printer is a better strategy.",
    );
  };

  if (location.pathname === '/results') {
    return (
      <Dropdown open={resultsOpen} onOpenChange={handleResultsOpenChange}>
        <MenuButton
          slots={{ root: IconButton }}
          slotProps={{
            root: {
              sx: {
                backgroundColor: '#ffaa00',
                color: '#272727',
              },
            },
          }}
        >
          <FaEllipsisVertical />
        </MenuButton>
        <Menu placement="bottom-end">
          <MenuItem sx={{ columnGap: 0 }} onClick={downloadPDF}>
            <ListItemDecorator>
              <MdPictureAsPdf />
            </ListItemDecorator>
            Download PDF
          </MenuItem>
          <MenuItem disabled sx={{ columnGap: 0 }} onClick={addFiringNotes}>
            <ListItemDecorator>
              <MdPictureAsPdf />
            </ListItemDecorator>
            Add Firing Notes
          </MenuItem>
          <MenuItem sx={{ columnGap: 0 }} onClick={navigateCsv}>
            <ListItemDecorator>
              <MdPictureAsPdf />
            </ListItemDecorator>
            View Raw CSV
          </MenuItem>
        </Menu>
      </Dropdown>
    );
  }

  return (
    <Dropdown open={csvOpen} onOpenChange={handleCsvOpenChange}>
      <MenuButton
        slots={{ root: IconButton }}
        slotProps={{
          root: {
            sx: {
              backgroundColor: '#ffaa00',
              color: '#272727',
            },
          },
        }}
      >
        <FaEllipsisVertical />
      </MenuButton>
      <Menu placement="bottom-end">
        <MenuItem sx={{ columnGap: 0 }} onClick={alertPdf}>
          <ListItemDecorator>
            <MdPictureAsPdf />
          </ListItemDecorator>
          Download PDF
        </MenuItem>
        <MenuItem sx={{ columnGap: 0 }} onClick={navigateResults}>
          <ListItemDecorator>
            <MdPictureAsPdf />
          </ListItemDecorator>
          Back To Data
        </MenuItem>
      </Menu>
    </Dropdown>
  );
}

export default PageMenu;
