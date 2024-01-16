import React from 'react';
import { List, Box } from '@mui/joy';
import useWindowDimensions from '../../Utils/useWindowDimensions/useWindowDimensions';

function DataCardContainer({ children }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 600;

  return (
    <Box
      sx={{
        pl: '24px',
      }}
      backgroundColor="#f2f2f2"
      borderRadius={isMobile ? 0 : 8}
      height="100%"
    >
      <List
        size="sm"
        sx={() => ({
          '--joy-palette-primary-plainColor': '#8a4baf',
          '--joy-palette-neutral-plainHoverBg': 'transparent',
          '--joy-palette-neutral-plainActiveBg': 'transparent',
          '--joy-palette-primary-plainHoverBg': 'transparent',
          '--joy-palette-primary-plainActiveBg': 'transparent',
          '--List-insetStart': '32px',
          '--ListItem-paddingY': '0px',
          '--ListItem-paddingRight': '16px',
          '--ListItem-paddingLeft': '21px',
          '--ListItem-startActionWidth': '0px',
          '--ListItem-startActionTranslateX': '-50%',
        })}
      >
        {children}
      </List>
    </Box>
  );
}

export default DataCardContainer;
