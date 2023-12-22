import React from 'react';
import './DataContainer.css';
import { Box, Button, Grid } from '@mui/joy';
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';
import DataTable from '../../Molecules/DataTable/DataTable';
import PostfireDataCard from '../../Molecules/DataCard/PostfireDataCard';
import PrefireDataCard from '../../Molecules/DataCard/PrefireDataCard';
import DataCardContainer from '../../Molecules/DataCard/DataCardContainer';
import FiringNotes from '../../Molecules/FiringNotes/FiringNotes';
import { useFGContext } from '../../context/FGContext';

function DataContainer() {
  const { dataExpandedState, setDataExpandedState } = useFGContext();

  const expandAll = () => {
    if (dataExpandedState !== 'expanded') {
      setDataExpandedState('expanded');
    }
  };

  const collapseAll = () => {
    if (dataExpandedState !== 'collapsed') {
      setDataExpandedState('collapsed');
    }
  };

  return (
    <Grid container spacing={2} sx={{ flexGrow: 1 }}>
      <Grid container direction="column" xs={12} md={6} xl={4} spacing={2}>
        <Box
          display="flex"
          flexDirection="column"
          height="100%"
          padding={1}
          gap={2}
        >
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="stretch"
            gap={2}
          >
            <Button
              aria-label="next file"
              variant="plain"
              color="neutral"
              size="md"
              onClick={expandAll}
              sx={{
                backgroundColor: '#f2f2f2',
                borderRadius: 8,
                padding: '8px 0;',
                width: '100%',
                '&:hover': {
                  color: 'black',
                  backgroundColor: '#FFD480',
                },
              }}
              endDecorator={<IoIosArrowDown size={20} />}
            >
              Expand All
            </Button>
            <Button
              aria-label="next file"
              variant="plain"
              color="neutral"
              size="md"
              onClick={collapseAll}
              sx={{
                backgroundColor: '#f2f2f2',
                borderRadius: 8,
                padding: '8px 0;',
                width: '100%',
                '&:hover': {
                  color: 'black',
                  backgroundColor: '#FFD480',
                },
              }}
              endDecorator={<IoIosArrowUp size={20} />}
            >
              Collapse All
            </Button>
          </Box>
          <DataCardContainer>
            <PrefireDataCard />
          </DataCardContainer>
        </Box>
      </Grid>
      <Grid container xs={12} md={6} xl={8} spacing={2} sx={{ flexGrow: 1 }}>
        <Grid xs={12} xl={6}>
          <DataCardContainer>
            <PostfireDataCard />
          </DataCardContainer>
        </Grid>
        <Grid xs={12} xl={6}>
          <FiringNotes />
        </Grid>
      </Grid>
      <Grid xs={12}>
        <DataTable />
      </Grid>
    </Grid>
  );
}

export default DataContainer;
