import React, { useEffect, useState } from 'react';
import { ListItem, Typography } from '@mui/joy';
import { RiErrorWarningFill } from 'react-icons/ri';
import { useFGContext } from '../../context/FGContext';
import ExpandableListItem from '../../Atoms/ExpandableListItem/ExpandableListItem';
import LabelValue from '../../Atoms/LabelValue/LabelValue';
import {
  minutesToHourString,
  parseDateString,
} from '../../Utils/dateUtils/dateUtils';

function PrefireDataCard() {
  // Hook(s)
  const [prefireOpen, setPrefireOpen] = useState(false);
  const [diagnosticsOpen, setDiagnosticsOpen] = useState(false);
  const { analysisData, dataExpandedState, setDataExpandedState } =
    useFGContext();

  const { dateWithTime } = parseDateString(analysisData?.startTime);

  const startTime =
    dateWithTime ||
    minutesToHourString(analysisData?.segments[0]?.segmentTicks[0].time);

  const expandDiagnostics = (bool) => {
    setDiagnosticsOpen(bool);
    setDataExpandedState('mixed');
  };

  const expandPrefire = (bool) => {
    setPrefireOpen(bool);
    setDataExpandedState('mixed');
  };

  useEffect(() => {
    if (dataExpandedState === 'expanded') {
      setPrefireOpen(true);
      setDiagnosticsOpen(true);
    } else if (dataExpandedState === 'collapsed') {
      setPrefireOpen(false);
      setDiagnosticsOpen(false);
    }
  }, [dataExpandedState]);

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
            value={startTime || 'N/A'}
            tooltipText={
              !dateWithTime
                ? 'It would appear that your controller was not connected to the internet when this date and time was recorded.'
                : ''
            }
            tooltipIcon={<RiErrorWarningFill />}
            paddingRight={dateWithTime ? '29px' : '20px'}
          />
        </ListItem>
      </ListItem>
      <ExpandableListItem
        isOpen={prefireOpen}
        setIsOpen={expandPrefire}
        listItems={(analysisData && analysisData.preFireInfo) || []}
        title="Pre-Fire Info"
        titleSpan={(analysisData && analysisData.preFireInfo.length) || ''}
        tooltipText="'Info' event log items from the start of the firing"
      />
      <ExpandableListItem
        isOpen={diagnosticsOpen}
        setIsOpen={expandDiagnostics}
        listItems={(analysisData && analysisData.diagnostics) || []}
        title="Diagnostics"
        titleSpan={(analysisData && analysisData.diagnostics.length) || ''}
        tooltipText="'Diagnostics' event log items from the start of the firing"
      />
    </>
  );
}

export default PrefireDataCard;
