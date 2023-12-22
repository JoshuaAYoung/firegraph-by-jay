import React from 'react';
import { Box, CircularProgress } from '@mui/joy';

function LoadingIndicator() {
  return (
    <Box left="50%" top="50%" position="absolute">
      <CircularProgress variant="outlined" color="warning" />
    </Box>
  );
}

export default LoadingIndicator;
