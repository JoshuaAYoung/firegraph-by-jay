import React from 'react';
import { Box, Typography } from '@mui/joy';
import Tooltip from '../Tooltip/Tooltip';

const LabelValue = ({
  label,
  value,
  tooltipText,
  tooltipIcon,
  ...boxProps
}) => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      flexDirection="row"
      width="100%"
      alignItems="center"
      {...boxProps}
    >
      <Typography level="inherit">{label}:</Typography>
      <Box display="flex" flexDirection="row" alignItems="center">
        {value && (
          <Typography
            level="inherit"
            sx={{
              fontWeight: 'bold',
              color: 'text.primary',
            }}
          >
            {value}
          </Typography>
        )}
        {tooltipText && (
          <Tooltip tooltipText={tooltipText} icon={tooltipIcon} size="sm" />
        )}
      </Box>
    </Box>
  );
};

export default LabelValue;
