import React from 'react';
import { IconButton, Tooltip as JoyTooltip } from '@mui/joy';
import { FaInfoCircle } from 'react-icons/fa';

const Tooltip = ({ tooltipText, placement }) => {
  const tooltipPlacement = placement || 'right-end';

  return (
    <JoyTooltip
      title={tooltipText}
      placement={tooltipPlacement}
      size="sm"
      sx={{ maxWidth: '300px' }}
    >
      <IconButton size="sm">
        <FaInfoCircle />
      </IconButton>
    </JoyTooltip>
  );
};

export default Tooltip;
