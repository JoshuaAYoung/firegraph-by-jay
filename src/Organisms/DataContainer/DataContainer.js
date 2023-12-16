import React from 'react';
import './DataContainer.css';
import DataTable from '../../Molecules/DataTable/DataTable';
import DataGrid from '../../Molecules/DataGrid/DataGrid';

const DataContainer = () => {
  return (
    <div className="dataContainer">
      <DataGrid />
      <DataTable />
    </div>
  );
};

export default DataContainer;
