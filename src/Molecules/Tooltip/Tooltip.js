import React from 'react';
import { IconButton, Tooltip as JoyTooltip } from '@mui/joy';
import { FaInfoCircle } from 'react-icons/fa';

function Tooltip({ tooltipText, placement, icon, onClick, size, iconDims }) {
  const tooltipPlacement = placement || 'right-end';
  const iconComponent = icon || <FaInfoCircle />;

  return (
    <JoyTooltip
      title={tooltipText}
      placement={tooltipPlacement}
      size={size || 'sm'}
      sx={{ maxWidth: '300px' }}
    >
      <IconButton
        size={size || 'sm'}
        sx={{
          '--IconButton-size': iconDims,
        }}
        onClick={onClick}
      >
        {iconComponent}
      </IconButton>
    </JoyTooltip>
  );
}

export default Tooltip;
