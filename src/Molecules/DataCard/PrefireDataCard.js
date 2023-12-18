import React from 'react';
import { ListItem, Typography } from '@mui/joy';
import { RiErrorWarningFill } from 'react-icons/ri';
import { useFGContext } from '../../context/FGContext';
import ExpandableListItem from '../ExpandableListItem/ExpandableListItem';
import LabelValue from '../LabelValue/LabelValue';
import { parseDateString } from '../../Utils/dateUtils/dateUtils';

function PrefireDataCard() {
  // Hook(s)
  const [prefireOpen, setPrefireOpen] = React.useState(false);
  const [diagnosticsOpen, setDiagnosticsOpen] = React.useState(false);
  const { analysisData } = useFGContext();

  const { dateWithTime } = parseDateString(analysisData?.startTime);

  return (
    <>
      <ListItem
        nested
        sx={{
          mt: 1,
        }}
        variant="plain"
        color="neutral"
      >
        <ListItem
          sx={{
            my: 1,
            paddingLeft: 0,
          }}
        >
          <Typography
            level="h4"
            sx={{
              fontWeight: 'bold',
              color: 'text.primary',
            }}
          >
            Initial Data
          </Typography>
        </ListItem>
      </ListItem>
      <ListItem nested sx={{ my: 1 }} variant="plain" color="neutral">
        <ListItem>
          <LabelValue
            label="Firing Start Time"
            value={dateWithTime || 'N/A'}
            tooltipText={
              !dateWithTime
                ? 'The date on your controller is likely set using the internet connection. If your controller was not connected at the start of the firing, this date may show 0/0/0'
                : ''
            }
            tooltipIcon={<RiErrorWarningFill />}
            paddingRight={dateWithTime ? '29px' : '20px'}
          />
        </ListItem>
      </ListItem>
      <ExpandableListItem
        isOpen={prefireOpen}
        setIsOpen={setPrefireOpen}
        listItems={(analysisData && analysisData.preFireInfo) || []}
        title="Pre-Fire Info"
        titleSpan={(analysisData && analysisData.preFireInfo.length) || ''}
        tooltipText="'Info' event log items from the start of the firing"
      />
      <ExpandableListItem
        isOpen={diagnosticsOpen}
        setIsOpen={setDiagnosticsOpen}
        listItems={(analysisData && analysisData.diagnostics) || []}
        title="Diagnostics"
        titleSpan={(analysisData && analysisData.diagnostics.length) || ''}
        tooltipText="'Diagnostics' event log items from the start of the firing"
      />
    </>
  );
}

export default PrefireDataCard;
