import React from 'react';
import './DataContainer.css';
import { Grid } from '@mui/joy';
import DataTable from '../../Molecules/DataTable/DataTable';
import PostfireDataCard from '../../Molecules/DataCard/PostfireDataCard';
import PrefireDataCard from '../../Molecules/DataCard/PrefireDataCard';
import DataCardContainer from '../../Molecules/DataCard/DataCardContainer';

function DataContainer() {
  return (
    <Grid container spacing={2} sx={{ flexGrow: 1 }}>
      <Grid sm={12} md={6}>
        <DataCardContainer>
          <PrefireDataCard />
        </DataCardContainer>
      </Grid>
      <Grid sm={12} md={6}>
        <DataCardContainer>
          <PostfireDataCard />
        </DataCardContainer>
      </Grid>
      <Grid sm={12}>
        <DataTable />
      </Grid>
    </Grid>
  );
}

export default DataContainer;
