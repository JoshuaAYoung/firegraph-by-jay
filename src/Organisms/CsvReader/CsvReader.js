// TODO
// x button here to clear the current file (from state too)
// obviously the graph on the results page
// link to my instagram in a footer or something?
// mail instead of github for footer - thicker logos, yellow/orange
import React from 'react';
import { Button, icon, styled, SvgIcon } from '@mui/joy';
import './CsvReader.css';
import { useNavigate } from 'react-router-dom';
import CSVReader from 'react-csv-reader';
import { useFGContext } from '../../context/FGContext';

const CsvReader = (csv) => {
  const papaparseOptions = {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.toLowerCase().replace(/\W/g, '_'),
  };

  return (
    <CSVReader
      cssClass="csv-reader-input"
      label="Select CSV with secret Death Star statistics"
      onFileLoaded={this.handleForce}
      onError={this.handleDarkSideForce}
      parserOptions={papaparseOptions}
      inputId="ObiWan"
      inputName="ObiWan"
      inputStyle={{ color: 'red' }}
    />
  );
};

export default CsvReader;
