import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import Typography from '@tiptap/extension-typography';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Box, Typography as JoyTypography } from '@mui/joy';
import { useFGContext } from '../../context/FGContext';
import './FiringNotes.css';

function FiringNotes() {
  const { firingNoteValue, setFiringNoteValue } = useFGContext();

  const editor = useEditor({
    extensions: [
      Typography,
      StarterKit,
      Placeholder.configure({
        placeholder: 'Type something here...',
      }),
    ],
    content: firingNoteValue,
    onUpdate({ editor }) {
      setFiringNoteValue(editor.getJSON());
    },
  });

  return (
    <Box
      sx={{
        padding: '20px 24px 24px;',
      }}
      backgroundColor="#f2f2f2"
      borderRadius={8}
      textAlign="left"
    >
      <JoyTypography
        level="h4"
        sx={{
          fontWeight: 'bold',
          color: 'text.primary',
          marginBottom: 1,
        }}
      >
        My Notes
      </JoyTypography>
      <EditorContent editor={editor} />
    </Box>
  );
}

export default FiringNotes;
