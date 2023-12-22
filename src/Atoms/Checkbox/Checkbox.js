import React from 'react';
import { Checkbox as JoyCheckbox } from '@mui/joy';
import Tooltip from '../Tooltip/Tooltip';
import './Checkbox.css';

function Checkbox({ isChecked, label, onChange, tooltipText }) {
  return (
    <div className="checkboxContainer">
      <JoyCheckbox
        slotProps={{
          checkbox: ({ checked }) => ({
            sx: checked
              ? {
                  backgroundColor: '#ffaa00',
                  '&:hover': { backgroundColor: 'gray' },
                }
              : {
                  borderColor: '#ffaa00',
                  borderWidth: '2px',
                  backgroundColor: 'light-gray',
                  '&:hover': { backgroundColor: '#ffaa00' },
                },
          }),
        }}
        label={label}
        checked={isChecked}
        onChange={onChange}
      />
      <Tooltip tooltipText={tooltipText} />
    </div>
  );
}

export default Checkbox;
