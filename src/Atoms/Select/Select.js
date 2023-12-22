import React from 'react';
import {
  Option,
  Select as JoySelect,
  FormControl,
  FormHelperText,
  FormLabel,
} from '@mui/joy';
import './Select.css';
import Tooltip from '../Tooltip/Tooltip';

function Select({
  options,
  multiSelect,
  defaultValue,
  onChange,
  icon,
  label,
  helperText,
  tooltipText,
  accessibilityLabel,
  placeholder,
  renderValuePrefix,
  disabled,
}) {
  return (
    <div className="selectContainer">
      <FormControl sx={{ width: '100%' }}>
        <div className="labelContainer">
          <FormLabel
            id={`${accessibilityLabel}-label`}
            htmlFor={`${accessibilityLabel}-button`}
            sx={{
              alignSelf: 'flex-end',
              fontWeight: '500',
              fontFamily: `'Roboto', sans-serif`,
              fontSize: '15px',
            }}
          >
            {label}
          </FormLabel>
          {tooltipText && <Tooltip tooltipText={tooltipText} />}
        </div>
        <JoySelect
          defaultValue={defaultValue}
          multiple={multiSelect}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          slotProps={{
            listbox: {
              sx: {
                width: '100%',
              },
            },
            button: {
              id: `${accessibilityLabel}-button`,
              'aria-labelledby': `${accessibilityLabel}-helper ${accessibilityLabel}-label`,
            },
          }}
          startDecorator={icon}
          renderValue={(selected) =>
            Array.isArray(selected) ? (
              <div>
                {selected.map((item, index) => {
                  const suffix = selected.length === index + 1 ? '' : ', ';
                  return renderValuePrefix + item.value + suffix;
                })}
              </div>
            ) : (
              <div>{`${renderValuePrefix}${selected.value}`}</div>
            )
          }
        >
          {options.map((option, index) => (
            <Option
              key={option.title + option.value + index}
              value={option.value}
            >
              {option.title}
            </Option>
          ))}
        </JoySelect>
        {helperText && (
          <FormHelperText
            id={`${accessibilityLabel}-helper`}
            sx={{
              fontWeight: '300',
              fontFamily: `'Roboto', sans-serif`,
              fontSize: '12px',
            }}
          >
            {helperText}
          </FormHelperText>
        )}
      </FormControl>
    </div>
  );
}

export default Select;
