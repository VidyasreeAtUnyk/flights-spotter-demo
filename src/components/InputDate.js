import React from 'react';
import { TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

const InputDate = ({label, value, setValue, renderInput, disablePast = false, ...props}) => {

  return (
        <DatePicker
          label={label}
          value={value}
          onChange={(newDate) => setValue(newDate)}
          disablePast={disablePast}
          renderInput={(params) => <TextField {...params} fullWidth />}
          {...props}
        />
  );
};

export default InputDate;
