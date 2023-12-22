import React, { useCallback, useState } from 'react';
import {
  Box,
  Button,
  Dropdown,
  IconButton,
  ListDivider,
  Menu,
  MenuButton,
  MenuItem,
} from '@mui/joy';
import { FaEllipsisVertical } from 'react-icons/fa6';
import { MdPictureAsPdf, MdStickyNote2 } from 'react-icons/md';
import { useNavigate, useLocation } from 'react-router-dom';
import Modal from '../../Atoms/Modal/Modal';
import { useFGContext } from '../../context/FGContext';

function PageMenu({ downloadPDF }) {
  const { addAndScrollNotes, showFiringNote } = useFGContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const isResultsPage = location.pathname === '/results';
  const isCsvPage = location.pathname === '/csv';

  const pdfAlertTitle =
    "This button typically downloads a screenshot, but this file can be very large for long CSVs. Try printing from your browser and choose 'Save as PDF'.";

  const handleOpenChange = useCallback((_event, openBool) => {
    setIsMenuOpen(openBool);
  }, []);

  const navigateCsv = () => {
    if (!isCsvPage) {
      setIsMenuOpen(false);
      setIsModalOpen(false);
      navigate('/csv');
    }
  };

  const navigateResults = () => {
    if (!isResultsPage) {
      setIsMenuOpen(false);
      setIsModalOpen(false);
      navigate('/results');
    }
  };

  const navigateHome = () => {
    setIsMenuOpen(false);
    setIsModalOpen(false);
    navigate('/');
  };

  const addFiringNotes = () => {
    addAndScrollNotes();
  };

  const alertPdf = () => {
    setIsModalOpen(true);
  };

  const MenutItemSX = {
    fontWeight: '600 !important;',
    fontSize: '16px',
    padding: '12px 24px !important;',
    color: '#6d5b5b',
    backgroundColor: 'white',
    '&:hover': {
      backgroundColor: '#FFD480 !important;',
    },
    '&.Mui-selected': {
      backgroundColor: '#ffaa00',
      color: 'black',
      '&:hover': {
        backgroundColor: '#ffaa00 !important;',
        cursor: 'default',
      },
    },
  };

  return (
    <Dropdown open={isMenuOpen} onOpenChange={handleOpenChange}>
      <MenuButton
        slots={{ root: IconButton }}
        slotProps={{
          root: {
            sx: {
              backgroundColor: isMenuOpen ? '#f0f4f8' : '#ffaa00',
              color: '#272727',
              '&:hover': { backgroundColor: '#FFD480' },
            },
          },
        }}
      >
        <FaEllipsisVertical />
      </MenuButton>
      <Menu
        placement="bottom-end"
        sx={{
          minWidth: '200px',
          border: 'none',
          paddingTop: 0,
          paddingBottom: 0,
          boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px;',
        }}
      >
        <MenuItem sx={MenutItemSX} onClick={navigateHome}>
          Home
        </MenuItem>
        <MenuItem
          sx={MenutItemSX}
          onClick={isResultsPage ? undefined : navigateResults}
          {...(isResultsPage && {
            selected: true,
          })}
        >
          Data Page
        </MenuItem>
        <MenuItem
          sx={MenutItemSX}
          onClick={isCsvPage ? undefined : navigateCsv}
          {...(isCsvPage && {
            selected: true,
          })}
        >
          CSV Viewer
        </MenuItem>
        <ListDivider sx={{ marginTop: 0, marginBottom: 0 }} />
        <Box display="flex" flexDirection="column" margin="16px 12px">
          <Button
            onClick={isResultsPage ? downloadPDF : alertPdf}
            loading={false}
            variant="solid"
            color="warning"
            size="sm"
            startDecorator={<MdPictureAsPdf size={20} />}
            sx={{
              fontWeight: 600,
            }}
          >
            Download PDF
          </Button>
        </Box>
      </Menu>
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Currently Disabled for CSVs"
        message={pdfAlertTitle}
      />
    </Dropdown>
  );
}

export default PageMenu;
