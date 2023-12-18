import React from 'react';
import { List, ListItem, IconButton, Typography } from '@mui/joy';
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';
import LabelValue from '../LabelValue/LabelValue';
import Tooltip from '../Tooltip/Tooltip';

function ExpandableListItem({
  isOpen,
  setIsOpen,
  listItems,
  title,
  titleSpan,
  tooltipText,
  tooltipIcon,
}) {
  return (
    <ListItem
      nested
      sx={{ my: 1 }}
      variant="plain"
      color="neutral"
      startAction={
        <IconButton
          variant="plain"
          size="sm"
          color="neutral"
          onClick={() => setIsOpen(!isOpen)}
        >
          {!isOpen ? <IoIosArrowDown /> : <IoIosArrowUp />}
        </IconButton>
      }
    >
      <ListItem sx={{ columnGap: '4px' }}>
        <Typography
          level="inherit"
          sx={{
            fontWeight: isOpen ? 'bold' : undefined,
            color: isOpen ? 'text.primary' : 'inherit',
          }}
        >
          {title}
        </Typography>
        {titleSpan && !isOpen && (
          <Typography level="inherit" component="span">
            ({titleSpan} Items)
          </Typography>
        )}
        {tooltipText && (
          <Tooltip tooltipText={tooltipText} icon={tooltipIcon} size="sm" />
        )}
      </ListItem>
      {isOpen && (
        <List
          sx={{
            borderLeftColor: 'divider',
            borderLeftWidth: '1px',
            borderLeftStyle: 'solid',
            '--ListItem-paddingY': '8px',
          }}
        >
          {listItems.map((item, index) => (
            <ListItem key={`${item.name}-${index}`}>
              <LabelValue
                label={item.name}
                value={item.value}
                paddingRight="37px"
              />
            </ListItem>
          ))}
        </List>
      )}
    </ListItem>
  );
}

export default ExpandableListItem;
