import React from 'react';
import { Alert, Box, IconButton, Typography } from '@mui/joy';
import { IoClose } from 'react-icons/io5';
import './Banner.css';

function Banner({ body, title, icon, onClose, color, variant, endDecorator }) {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        width: '100%',
        flexDirection: 'column',
      }}
      className="bannerContainer"
    >
      <Alert
        key={title}
        sx={{ alignItems: 'center', borderRadius: '0' }}
        startDecorator={icon}
        variant={variant}
        color={color}
        endDecorator={
          endDecorator || (
            <IconButton variant="soft" onClick={onClose}>
              <IoClose />
            </IconButton>
          )
        }
      >
        <div>
          {title && (
            <Typography
              sx={{
                fontWeight: 'bold',
                color: 'text.primary',
                textAlign: 'start',
              }}
            >
              {title}
            </Typography>
          )}
          <Typography>{body}</Typography>
        </div>
      </Alert>
    </Box>
  );
}

export default Banner;
