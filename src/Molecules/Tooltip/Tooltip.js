import React from 'react';
import { IconButton, Tooltip as JoyTooltip } from '@mui/joy';
import { FaInfoCircle } from 'react-icons/fa';

const Tooltip = ({ tooltipText, placement, icon, onClick }) => {
  const tooltipPlacement = placement || 'right-end';
  const iconComponent = icon || <FaInfoCircle />;

  return (
    <JoyTooltip
      title={tooltipText}
      placement={tooltipPlacement}
      size="sm"
      sx={{ maxWidth: '300px' }}
    >
      <IconButton size="sm" onClick={onClick}>
        {iconComponent}
      </IconButton>
    </JoyTooltip>
  );
};

export default Tooltip;
