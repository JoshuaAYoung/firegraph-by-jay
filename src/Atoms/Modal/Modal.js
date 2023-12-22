import React from 'react';
import { Modal as JoyModal, ModalClose, Sheet, Typography } from '@mui/joy';

function Modal({ open, onClose, title, message }) {
  return (
    <JoyModal
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
      open={open}
      onClose={onClose}
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <Sheet
        variant="outlined"
        sx={{
          maxWidth: 500,
          borderRadius: 'md',
          p: 3,
          boxShadow: 'lg',
        }}
      >
        <ModalClose variant="plain" sx={{ m: 1 }} />
        <Typography
          component="h2"
          id="modal-title"
          level="h4"
          textColor="inherit"
          fontWeight="lg"
          mb={1}
        >
          {title}
        </Typography>
        <Typography id="modal-desc" textColor="text.tertiary">
          {message}
        </Typography>
      </Sheet>
    </JoyModal>
  );
}

export default Modal;
