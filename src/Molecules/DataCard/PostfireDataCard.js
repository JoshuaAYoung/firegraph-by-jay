import React from 'react';
import { ListItem, Typography } from '@mui/joy';
import { RiErrorWarningFill } from 'react-icons/ri';
import { useFGContext } from '../../context/FGContext';
import ExpandableListItem from '../../Atoms/ExpandableListItem/ExpandableListItem';
import LabelValue from '../../Atoms/LabelValue/LabelValue';
import {
  parseDateString,
  minutesToHourString,
} from '../../Utils/dateUtils/dateUtils';

function PostfireDataCard() {
  // Hook(s)
  const [postfireOpen, setPostfireOpen] = React.useState(false);
  const [eventsOpen, setEventsOpen] = React.useState(false);

  const { analysisData, targetDuration } = useFGContext();

  const { dateWithTime } = parseDateString(analysisData?.endTime);

  const endTime =
    dateWithTime || minutesToHourString(analysisData.actualMinuteTicks);

  const actualHourDuration = minutesToHourString(
    analysisData?.actualMinuteTicks,
  );

  const targetHourDuration = minutesToHourString(targetDuration);

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
            Final Data
          </Typography>
        </ListItem>
      </ListItem>
      <ListItem nested sx={{ my: 1 }} variant="plain" color="neutral">
        <ListItem>
          <LabelValue
            label="Firing End Time"
            value={endTime || 'N/A'}
            tooltipText={
              !dateWithTime
                ? 'The date and time on your controller are set using the internet. If your controller was not connected at the end of the firing, this date and time is invalid.'
                : ''
            }
            tooltipIcon={<RiErrorWarningFill />}
            paddingRight={dateWithTime ? '29px' : '20px'}
          />
        </ListItem>
      </ListItem>
      <ListItem nested sx={{ my: 1 }} variant="plain" color="neutral">
        <ListItem>
          <LabelValue
            label="Total Duration Actual"
            value={actualHourDuration || 'N/A'}
            tooltipText={
              !actualHourDuration
                ? 'Every half minute log entry is summed to derive this value. Check your CSV files for potential issues.'
                : ''
            }
            tooltipIcon={<RiErrorWarningFill />}
            paddingRight={actualHourDuration ? '29px' : '20px'}
          />
        </ListItem>
      </ListItem>
      <ListItem nested sx={{ my: 1 }} variant="plain" color="neutral">
        <ListItem>
          <LabelValue
            label="Total Duration Target"
            value={targetHourDuration || 'N/A'}
            tooltipText={
              !targetHourDuration
                ? 'This number is derived from analyzing the target ramp and temp. If the target data is shown in the graph, this value should be show. Consult your CSV for any obvious issues.'
                : ''
            }
            tooltipIcon={<RiErrorWarningFill />}
            paddingRight={targetHourDuration ? '29px' : '20px'}
          />
        </ListItem>
      </ListItem>
      <ExpandableListItem
        isOpen={postfireOpen}
        setIsOpen={setPostfireOpen}
        listItems={(analysisData && analysisData.postFireInfo) || []}
        title="Post-Fire Info"
        titleSpan={(analysisData && analysisData.postFireInfo.length) || ''}
        tooltipText="'Info' event log items from the end of the firing. If this is empty, verify that the firing wasn't more than 24 hours long, in which case you may have 2 csv files."
      />
      {!!analysisData.events.length && (
        <ExpandableListItem
          isOpen={eventsOpen}
          setIsOpen={setEventsOpen}
          listItems={(analysisData && analysisData.events) || []}
          title="Firing Events"
          titleSpan={(analysisData && analysisData.events.length) || ''}
          tooltipText="If a manual stop, segment skip or error occurs during the firing, the event is recorded and added to this list."
        />
      )}
    </>
  );
}

export default PostfireDataCard;
