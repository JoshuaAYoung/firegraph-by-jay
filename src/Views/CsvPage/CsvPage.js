import React, { useEffect, useState } from 'react';
import { CsvToHtmlTable } from 'react-csv-to-table-18';
import { Box, Button } from '@mui/joy';
import { FaChevronCircleDown, FaChevronCircleUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useFGContext } from '../../context/FGContext';
import Modal from '../../Atoms/Modal/Modal';
import LoadingIndicator from '../../Atoms/LoadingIndicator/LoadingIndicator';
import './CsvPage.css';

function CsvPage() {
  const { csvRawArray, csvStringArray, setCsvStringArray } = useFGContext();
  const [loading, setLoading] = useState(csvStringArray.length === 0 || false);
  const [csvError, setCsvError] = useState(false);
  const navigate = useNavigate();

  const readString = (csv) =>
    new Promise((resolve) => {
      // eslint-disable-next-line no-undef
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsText(csv);
    });

  useEffect(() => {
    if (!csvStringArray.length && !csvRawArray.length) {
      navigate('/');
      return;
    }

    if (!csvStringArray.length) {
      Promise.all(csvRawArray.map((csvRaw) => readString(csvRaw)))
        .then((stringArray) => {
          setCsvStringArray(stringArray);
          setLoading(false);
        })
        .catch((error) => {
          // TODO track this spot with GA
          console.log('error:', error);
          setLoading(false);
          setCsvError(true);
        });
    }
  }, [csvStringArray]);

  const getHref = (index) => `#file-${index}`;

  const renderComponentRight = (index) => (
    <Box display="flex" width="100%" justifyContent="flex-end">
      <Button
        aria-label="next file"
        variant="plain"
        color="warning"
        size="sm"
        component="a"
        href={getHref(index + 1)}
        sx={{
          color: 'white',
          '&:hover': {
            color: 'black',
            backgroundColor: '#FFD480',
          },
        }}
        disabled={index === csvRawArray.length - 1}
        endDecorator={<FaChevronCircleDown size={20} />}
      >
        Scroll Next
      </Button>
    </Box>
  );

  const renderComponentLeft = (index) => (
    <Box display="flex" width="100%" justifyContent="flex-start">
      <Button
        aria-label="next file"
        variant="plain"
        color="warning"
        size="sm"
        component="a"
        href={getHref(index > 1 ? index : 0)}
        sx={{
          color: 'white',
          '&:hover': {
            color: 'black',
            backgroundColor: '#FFD480',
          },
        }}
        startDecorator={<FaChevronCircleUp size={20} />}
      >
        {index === 0 ? 'Scroll Top' : 'Scroll Previous'}
      </Button>
    </Box>
  );

  return (
    <Box margin="24px 24px 32px" height="100%" flexGrow={1}>
      {loading ? (
        <LoadingIndicator />
      ) : (
        csvRawArray.map((_, index) => (
          <Box key={`csv-${index}`} className="scrollBox" marginBottom={4}>
            <CsvToHtmlTable
              key={`string-${index}`}
              data={csvStringArray[index]}
              csvDelimiter=","
              tableClassName="csvTable"
              fillEmpty
              headerTitle={csvRawArray[index]?.name || `CSV ${index + 1}`}
              renderRightComponent={() =>
                csvStringArray.length > 1
                  ? renderComponentRight(index)
                  : undefined
              }
              renderLeftComponent={() => renderComponentLeft(index)}
              rightComponentSpan={csvStringArray.length > 1 ? 4 : 0}
              leftComponentSpan={1}
              bodyHash={`file-${index}`}
            />
          </Box>
        ))
      )}
      <Modal
        open={csvError}
        onClose={() => setCsvError(false)}
        title="CSV Parsing Error"
        message="Please try again or check your csv for issues."
      />
    </Box>
  );
}

export default CsvPage;
