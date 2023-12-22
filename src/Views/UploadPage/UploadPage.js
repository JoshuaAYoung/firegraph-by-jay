import React, { useEffect, useState } from 'react';
import { Button, IconButton, styled } from '@mui/joy';
import './UploadPage.css';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import { MdOutlineCloudUpload } from 'react-icons/md';
import { FaRegFile } from 'react-icons/fa';
import { IoRemoveCircleOutline, IoAddCircle } from 'react-icons/io5';
import { useFGContext } from '../../context/FGContext';
import Tooltip from '../../Atoms/Tooltip/Tooltip';
import Modal from '../../Atoms/Modal/Modal';

function UploadForm() {
  // Hook(s)
  const defaultButtonTitle = 'Choose a file...';
  const {
    csvRawArray,
    setCsvRawArray,
    setCsvParsedArray,
    resetState,
    setGlobalErrorMessage,
  } = useFGContext();
  const [uploadButtonArray, setUploadButtonArray] = useState([
    { title: defaultButtonTitle },
  ]);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  // Style(s)
  const VisuallyHiddenInput = styled('input')`
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    bottom: 0;
    left: 0;
    white-space: nowrap;
    width: 1px;
  `;

  // Computed Var(s)
  const parsingErrorMessage =
    'There was an issue parsing the CSV file you chose. Try uploading the file again, or check the file for obvious issues.';

  // Function(s)
  const chooseFile = (event, index) => {
    // Replace file in array if the user clicks on the same input to change files
    if (csvRawArray[index]) {
      setCsvRawArray(
        csvRawArray.map((file, ind) =>
          ind === index ? event.target.files[0] : file,
        ),
      );
    } else {
      setCsvRawArray([...csvRawArray, event.target.files[0]]);
    }
    const newUploadButtonArray = uploadButtonArray.filter(
      (item, ind) => item.title !== defaultButtonTitle && ind !== index,
    );

    newUploadButtonArray.push({ title: event.target.files[0].name });
    setUploadButtonArray(newUploadButtonArray);
  };

  const parseCsvArray = (event) => {
    event.preventDefault();
    const parsedFileArray = [];
    // the second file contains a duplicate of a lot of data (starting at a "block continue" entry)
    // This allows us to replace a certain number of rows from the previous file when adding the new one
    const blockContinueRowArray = [];

    if (csvRawArray.length) {
      Promise.all(
        csvRawArray.map(
          (csv) =>
            new Promise((resolve, reject) => {
              let isFirstRow = true;
              let fileIndex = 0;
              Papa.parse(csv, {
                header: true,
                skipEmptyLines: true,
                step: (row) => {
                  // So basically, these conditions target the first "block continue" of the 2nd file
                  // and matches the time with a time from the 1st file's array of "block continue" objects
                  if (
                    isFirstRow &&
                    blockContinueRowArray[row.data.time] &&
                    row.data.event === 'block continue' &&
                    fileIndex === 0
                  ) {
                    // Deletes all elements from the current file array after the index recorded in blockContinueRowArray
                    // which looks like "2023-7-3T16:08:59Z: 2691"
                    parsedFileArray.splice(
                      blockContinueRowArray[row.data.time],
                    );
                    isFirstRow = false;
                  }

                  // The if statement above should only occur on the first row (fileIndex 0), if it happens elsewhere
                  // it's likely an issue with reversed file order. Warn but don't redirect user.
                  if (
                    isFirstRow &&
                    blockContinueRowArray[row.data.time] &&
                    row.data.event === 'block continue' &&
                    fileIndex !== 0 &&
                    csvRawArray.length > 1
                  ) {
                    setGlobalErrorMessage(
                      'Files were likely uploaded in the wrong order. If the graph looks strange, try uploading the files again in order. From the menu, you can choose to view the raw CSV files to check the order.',
                    );
                  }

                  // This keeps track of the index of the last "block continue" event
                  if (row.data.event === 'block continue') {
                    blockContinueRowArray[row.data.time] =
                      parsedFileArray.length;
                  }

                  fileIndex += 1;
                  parsedFileArray.push(row.data);
                },
                complete: () => {
                  resolve();
                },
                error: reject,
              });
            }),
        ),
      )
        .then(() => {
          setCsvParsedArray(parsedFileArray);
        })
        .then(() => {
          navigate('/results');
        })
        .catch((error) => {
          // TODO log this with GA
          console.log('Papaparse error:', error);
          setErrorMessage(parsingErrorMessage);
        });
    } else {
      setErrorMessage(parsingErrorMessage);
    }
  };

  const removeFile = (index) => {
    const newUploadButtonArray = uploadButtonArray.filter(
      (_item, ind) => ind !== index,
    );

    if (newUploadButtonArray.length) {
      setUploadButtonArray(newUploadButtonArray);
    } else if (!newUploadButtonArray.length) {
      setUploadButtonArray([{ title: defaultButtonTitle }]);
    }

    const newCsvRawArray = csvRawArray.filter((_item, ind) => ind !== index);
    setCsvRawArray(newCsvRawArray);
  };

  // Effect(s)
  useEffect(() => {
    resetState();
    setUploadButtonArray([{ title: defaultButtonTitle }]);
  }, []);

  // Render Functions(s)
  const renderUploadButton = (title, index) => {
    const fileUploaded = title !== defaultButtonTitle;
    return (
      <div className="chooseFileButtons" key={`${title}-${index}`}>
        <Button
          component="label"
          role={undefined}
          tabIndex={-1}
          variant={fileUploaded ? 'soft' : 'solid'}
          color="warning"
          sx={{
            flexGrow: 1,
            minWidth: 0,
            '& .uploadTitle': {
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textAlign: 'left',
              display: 'block',
            },
          }}
          startDecorator={
            fileUploaded ? (
              <FaRegFile size={18} />
            ) : (
              <MdOutlineCloudUpload size={18} />
            )
          }
        >
          <span className="uploadTitle">{title}</span>
          <VisuallyHiddenInput
            type="file"
            accept=".csv"
            onChange={(e) => {
              chooseFile(e, index);
            }}
          />
        </Button>
        {fileUploaded && (
          <Tooltip
            tooltipText="Delete"
            icon={<IoRemoveCircleOutline size={24} />}
            onClick={() => removeFile(index)}
          />
        )}
        {fileUploaded && uploadButtonArray.length === index + 1 && (
          <Tooltip tooltipText="Add a file">
            <IconButton
              size="sm"
              component="label"
              role={undefined}
              tabIndex={-1}
            >
              <IoAddCircle size={24} />
              <VisuallyHiddenInput
                type="file"
                accept=".csv"
                onChange={(e) => {
                  chooseFile(e, index + 1);
                }}
              />
            </IconButton>
          </Tooltip>
        )}
      </div>
    );
  };

  return (
    <div className="uploadForm">
      <div className="uploadCard">
        <h2 className="uploadInstructions">
          Upload your Bartlett Genesis Log File(s) below.
        </h2>
        <div className="uploadButtonsContainer">
          {uploadButtonArray &&
            uploadButtonArray.map((arrayItem, index) =>
              renderUploadButton(arrayItem.title, index),
            )}
          <Button
            component="label"
            role={undefined}
            tabIndex={-1}
            variant="solid"
            color="warning"
            onClick={parseCsvArray}
            disabled={!csvRawArray.length}
          >
            Submit
          </Button>
        </div>
        <p className="uploadNote">
          Note: The Bartlett Genesis automatically creates multiple log files
          for a firing over 24 hours. Only upload multiple files (in order) if
          this is the case for your firing.
        </p>
      </div>
      <Modal
        open={!!errorMessage}
        onClose={() => setErrorMessage('')}
        title="Warning"
        message={errorMessage}
      />
    </div>
  );
}

export default UploadForm;
