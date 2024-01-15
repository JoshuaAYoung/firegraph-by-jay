import React from 'react';
import { Alert, Box, IconButton, Typography } from '@mui/joy';
import { IoClose } from 'react-icons/io5';
import './Banner.css';

function Banner({
  body,
  title,
  icon,
  onClose,
  containerStyle,
  color,
  containerClass,
}) {
  return (
    <Box
      sx={{
        ...containerStyle,
        display: 'flex',
        gap: 2,
        width: '100%',
        flexDirection: 'column',
      }}
      className={containerClass}
    >
      <Alert
        key={title}
        sx={{ alignItems: 'center' }}
        startDecorator={icon}
        variant="soft"
        color={color}
        endDecorator={
          <IconButton variant="soft" onClick={onClose}>
            <IoClose />
          </IconButton>
        }
      >
        <div>
          <Typography
            sx={{
              fontWeight: 'bold',
              color: 'text.primary',
              textAlign: 'start',
            }}
          >
            {title}
          </Typography>
          <Typography level="body-sm">{body}</Typography>
        </div>
      </Alert>
    </Box>
  );
}

export default Banner;
