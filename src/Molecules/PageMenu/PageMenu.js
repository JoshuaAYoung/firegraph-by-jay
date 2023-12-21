import React, { useCallback, useState } from 'react';
import {
  Box,
  Button,
  Dropdown,
  IconButton,
  ListDivider,
  ListItemDecorator,
  Menu,
  MenuButton,
  MenuItem,
} from '@mui/joy';
import { FaEllipsisVertical } from 'react-icons/fa6';
import { MdPictureAsPdf } from 'react-icons/md';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaAngleRight } from 'react-icons/fa';

function PageMenu({ downloadPDF, addFiringNotes }) {
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const isResultsPage = location.pathname === '/results';
  const isCsvPage = location.pathname === '/csv';

  const handleOpenChange = useCallback((_event, openBool) => {
    setIsOpen(openBool);
  }, []);

  const navigateCsv = () => {
    if (!isCsvPage) {
      setIsOpen(false);
      navigate('/csv');
    }
  };

  const navigateResults = () => {
    if (!isResultsPage) {
      setIsOpen(false);
      navigate('/results');
    }
  };

  const navigateHome = () => {
    setIsOpen(false);
    navigate('/');
  };

  const alertPdf = () => {
    // TODO change this into a modal!
    console.warn(
      "Currently disabled for this page. As the PDF Download button saves a screenshot in pdf format, this file can get quite large for this CSV page. Printing from your browser and choosing 'print to pdf' as the printer is a better strategy.",
    );
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
    <Dropdown open={isOpen} onOpenChange={handleOpenChange}>
      <MenuButton
        slots={{ root: IconButton }}
        slotProps={{
          root: {
            sx: {
              backgroundColor: isOpen ? '#f0f4f8' : '#ffaa00',
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
          CSV Reader
        </MenuItem>
        <ListDivider sx={{ marginTop: 0, marginBottom: 0 }} />
        <Box display="flex" flexDirection="column" margin="16px 12px">
          {isResultsPage && (
            <Button
              onClick={addFiringNotes}
              loading={false}
              variant="outlined"
              color="warning"
              size="sm"
              startDecorator={<MdPictureAsPdf size={20} />}
              sx={{
                borderWidth: '2px',
                fontWeight: 600,
                marginBottom: '10px',
                '&:hover': {
                  backgroundColor: '#FFD480',
                  borderColor: '#FFD480',
                },
              }}
            >
              Add Firing Note
            </Button>
          )}
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
    </Dropdown>
  );
}

export default PageMenu;
