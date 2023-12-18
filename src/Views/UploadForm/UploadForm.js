// TODO
// - media query for header flexbox to go column, with lots of vertical margin
// Textarea component for inserting personal notes about the firing
// how about an alert component that one of their TCs was a certain deviation from the average?

// BUGS:

// google analytics with javascript error logger: https://www.analyticsmania.com/post/tracking-errors-with-google-tag-manager/#:~:text=Go%20to%20Triggers%20%3E%20New%20%3E%20Trigger,Error%20URL%2C%20and%20Error%20Line.
import React, { useEffect, useState } from 'react';
import { Button, styled } from '@mui/joy';
import './UploadForm.css';
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
              let isFirstStep = true;
              Papa.parse(csv, {
                header: true,
                skipEmptyLines: true,
                step: (row) => {
                  if (isFirstStep && blockContinueRowArray[row.data.time]) {
                    // For two files, we need to hack off the end of the first file,
                    // as there's a lot of duplicated rows in the second file
                    parsedFileArray.splice(
                      blockContinueRowArray[row.data.time],
                    );
                    isFirstStep = false;
                  }

                  if (row.data.event === 'block continue') {
                    blockContinueRowArray[row.data.time] =
                      parsedFileArray.length;
                  }

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

  useEffect(() => {
    if (csvParsedArray && csvParsedArray.length && csvRawArray.length) {
      navigate('/results');
    }
  }, [csvParsedArray]);

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
