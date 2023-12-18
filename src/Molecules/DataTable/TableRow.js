import React from 'react';
import { Grid, IconButton, List, ListItem, Sheet } from '@mui/joy';
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';
import LabelValue from '../LabelValue/LabelValue';
import Tooltip from '../Tooltip/Tooltip';

function ExpandedListItem({ label, value, tooltipText }) {
  return (
    <Grid xs={6} md={4} lg={3}>
      <ListItem
        nested
        sx={{
          mb: 1,
          borderBottomColor: 'divider',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
        }}
        variant="plain"
        color="neutral"
      >
        <ListItem>
          <LabelValue
            label={label}
            value={value || 'N/A'}
            tooltipText={tooltipText || ''}
          />
        </ListItem>
      </ListItem>
    </Grid>
  );
}

function TableRow({ row }) {
  const [open, setOpen] = React.useState(false);
  const tempTooltipText =
    'This value is averaged from the selected TCs at the top of the page.';

  return (
    <>
      <tr onClick={() => setOpen(!open)}>
        <td>
          <IconButton
            aria-label="expand row"
            variant="plain"
            color="neutral"
            size="sm"
            onClick={() => setOpen(!open)}
          >
            {open ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </IconButton>
        </td>
        <td style={{ textAlign: 'center' }}>{row.number}</td>
        <td>{row.actualRamp}°/hr</td>
        <td>{row.targetRamp}°/hr</td>
        <td>{row.rampDiff}°/hr</td>
        <td>{row.targetTemp}°</td>
        <td>
          {row.targetHoldTime || (
            <Tooltip tooltipText="Segment hold information is often missing from the last, or last few, segments." />
          )}
        </td>
        <td>{row.actualDuration}</td>
        <td>{row.targetDuration}</td>
        <td>{row.durationDiff}m</td>
      </tr>
      <tr>
        <td style={{ height: 0, padding: 0 }} colSpan={10}>
          {open && (
            <Sheet
              variant="plain"
              color="neutral"
              sx={{
                p: 4,
                boxShadow: 'inset 0 3px 6px 0 rgba(0 0 0 / 0.08)',
              }}
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
                  '--ListItem-startActionWidth': '0px',
                  '--ListItem-startActionTranslateX': '-50%',
                })}
              >
                <Grid
                  container
                  rowSpacing={1}
                  columnSpacing={3}
                  sx={{ flexGrow: 1 }}
                >
                  <ExpandedListItem label="Start Time" value={row.startTime} />
                  <ExpandedListItem label="End Time" value={row.endTime} />
                  {/* Info about based on tCs selected from top of page */}
                  <ExpandedListItem
                    label="Start Temp Actual"
                    value={`${row.actualStartTemp}°`}
                    tooltipText={tempTooltipText}
                  />
                  <ExpandedListItem
                    label="Start Temp Target"
                    value={`${row.targetStartTemp}°`}
                  />
                  <ExpandedListItem
                    label="End Temp Actual"
                    value={`${row.actualEndTemp}°`}
                    tooltipText={tempTooltipText}
                  />
                  <ExpandedListItem
                    label="End Temp Target"
                    value={`${row.targetTemp}°`}
                  />
                  <ExpandedListItem
                    label="Hold Duration Actual"
                    value={row.actualHoldTime}
                  />
                  <ExpandedListItem
                    label="Hold Duration Target"
                    value={row.targetHoldTime}
                  />
                  <ExpandedListItem
                    label="TC-1 Temp (avg.)"
                    value={`${row.temp1Average}°`}
                  />
                  <ExpandedListItem
                    label="TC-2 Temp (avg.)"
                    value={`${row.temp2Average}°`}
                  />
                  <ExpandedListItem
                    label="TC-3 Temp (avg.)"
                    value={`${row.temp3Average}°`}
                  />
                  <ExpandedListItem
                    label="Out1 % (avg.)"
                    value={`${row.out1Average}%`}
                  />
                  <ExpandedListItem
                    label="Out2 % (avg.)"
                    value={`${row.out2Average}%`}
                  />
                  <ExpandedListItem
                    label="Out3 % (avg.)"
                    value={`${row.out3Average}%`}
                  />
                </Grid>
              </List>
            </Sheet>
          )}
        </td>
      </tr>
    </>
  );
}

export default TableRow;
