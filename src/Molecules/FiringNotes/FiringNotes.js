import React from 'react';
import { Box, FormControl, FormLabel, Textarea, Typography } from '@mui/joy';
import { useFGContext } from '../../context/FGContext';

function FiringNotes() {
  const { firingNoteValue, setFiringNoteValue } = useFGContext();

  const onChangeTextarea = (e) => {
    setFiringNoteValue(e.target.value);
  };

  return (
    <Box
      sx={{
        padding: '20px 24px 24px;',
      }}
      backgroundColor="#f2f2f2"
      borderRadius={8}
    >
      <FormControl>
        <FormLabel>
          <Typography
            level="h4"
            sx={{
              fontWeight: 'bold',
              color: 'text.primary',
            }}
          >
            My Notes
          </Typography>
        </FormLabel>
        <Textarea
          sx={{
            borderRadius: 0,
            border: 'none',
            '&::before': {
              display: 'none',
            },
            '&:focus-within': {
              outline: '2px solid #ffaa00',
              outlineOffset: '2px',
            },
          }}
          onChange={onChangeTextarea}
          value={firingNoteValue}
          placeholder="Type something here…"
        />
      </FormControl>
    </Box>
  );
}

export default FiringNotes;
