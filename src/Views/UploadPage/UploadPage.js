import React, { useEffect, useState } from 'react';
import { Button, styled } from '@mui/joy';
import './UploadPage.css';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import { MdOutlineCloudUpload } from 'react-icons/md';
import { FaRegFile } from 'react-icons/fa';
import { IoRemoveCircleOutline, IoAddCircle } from 'react-icons/io5';
import { useFGContext } from '../../context/FGContext';
import Tooltip from '../../Molecules/Tooltip/Tooltip';

function UploadForm() {
  // Hook(s)
  const defaultButtonTitle = 'Choose a file...';
  const {
    csvRawArray,
    setCsvRawArray,
    csvParsedArray,
    setCsvParsedArray,
    resetState,
  } = useFGContext();
  const [uploadButtonArray, setUploadButtonArray] = useState([
    { title: defaultButtonTitle },
  ]);
  // TODO error modal
  const [hasErrors, setHasErrors] = useState(false);

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

  // Function(s)
  const chooseFile = (event, index) => {
    setCsvRawArray([...csvRawArray, event.target.files[0]]);
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
                    // For two files, we need to hack off the end of the first file,
                    // as there's a lot of duplicated rows in the second file
                    console.log(
                      'parsedFileArraysplice',
                      parsedFileArray,
                      blockContinueRowArray,
                      blockContinueRowArray[row.data.time],
                    );

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
                    fileIndex !== 0
                  ) {
                    // TODO modal telling the user that they probably selected the files in the wrong order
                    // Try again if graph looks weird!
                    console.log('WRONNGNNNNGNG!!!!!!!!!!!!!!!');
                  }

                  // This keeps track of the index of the last "block continue" event
                  if (row.data.event === 'block continue') {
                    console.log(
                      'parsedFileArray.length',
                      parsedFileArray.length,
                    );
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
          console.log("row.data.event === 'block continue'", parsedFileArray);
          setCsvParsedArray(parsedFileArray);
        })
        .then(() => {
          navigate('/results');
        })
        .catch((error) => {
          console.log('Papaparse error:', error);
          setHasErrors(true);
        });
    } else {
      setHasErrors(true);
    }
  };

  const addUploadButton = () => {
    setUploadButtonArray([...uploadButtonArray, { title: defaultButtonTitle }]);
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
    setHasErrors(false);
  }, []);

  // useEffect(() => {
  //   if (csvParsedArray && csvParsedArray.length && csvRawArray.length) {
  //     navigate('/results');
  //   }
  // }, [csvParsedArray]);

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
          <Tooltip
            tooltipText="Add a file"
            icon={<IoAddCircle size={24} />}
            onClick={() => addUploadButton()}
          />
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
    </div>
  );
}

export default UploadForm;
