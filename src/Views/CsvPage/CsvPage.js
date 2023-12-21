import React, { useEffect, useRef } from 'react';
import { CsvToHtmlTable } from 'react-csv-to-table-18';
import { Box, Button } from '@mui/joy';
import { FaChevronCircleDown, FaChevronCircleUp } from 'react-icons/fa';
import { useFGContext } from '../../context/FGContext';
import './CsvPage.css';

function CsvPage() {
  const { csvRawArray, csvStringArray, setCsvStringArray } = useFGContext();
  const refArray = useRef([]);

  const readString = (csv) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsText(csv);
    });

  useEffect(() => {
    if (!csvStringArray.length) {
      Promise.all(csvRawArray.map((csvRaw) => readString(csvRaw)))
        .then((stringArray) => {
          setCsvStringArray(stringArray);
        })
        .catch((error) => {
          console.log('filereader error', error);
        });
    }
  }, [csvStringArray]);

  useEffect(() => {
    refArray.current = refArray.current.slice(0, csvRawArray.length);
  }, [csvRawArray]);

  const scrollTo = (refCurrent, index) => {
    console.log('ref?', refCurrent, refArray, index);
    if (refCurrent) {
      refCurrent.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // TODO handle no csvRawArray with error modal
  return (
    <Box margin={2}>
      {csvRawArray.map((_, index) => (
        <Box position="relative" key={`csv-${index}`}>
          {csvStringArray.length > 1 && (
            <Box
              ref={(el) => {
                refArray[index] = el;
              }}
              display="flex"
              flexDirection="row"
              width="100%"
              justifyContent="space-between"
              position="absolute"
              zIndex={1}
            >
              <Button
                aria-label="next file"
                variant="solid"
                color="warning"
                size="sm"
                onClick={() => scrollTo(refArray[index - 1], index)}
                sx={{
                  backgroundColor: '#ffaa00',
                  color: '#272727',
                  left: '8px',
                  position: 'relative',
                  top: '8px',
                }}
                disabled={index === 0}
                endDecorator={<FaChevronCircleUp size={20} />}
              >
                Previous File
              </Button>
              <Button
                aria-label="next file"
                variant="solid"
                color="warning"
                size="sm"
                onClick={() => scrollTo(refArray[index + 1], index)}
                sx={{
                  backgroundColor: '#ffaa00',
                  color: '#272727',
                  right: '8px',
                  position: 'relative',
                  top: '8px',
                }}
                disabled={index === csvRawArray.length - 1}
                startDecorator={<FaChevronCircleDown size={20} />}
              >
                Next File
              </Button>
            </Box>
          )}
          <CsvToHtmlTable
            key={`string-${index}`}
            data={csvStringArray[index]}
            csvDelimiter=","
            tableClassName="csvTable"
            fillEmpty
            headerTitle={csvRawArray[index]?.name || `CSV ${index + 1}`}
          />
        </Box>
      ))}
    </Box>
  );
}

export default CsvPage;
