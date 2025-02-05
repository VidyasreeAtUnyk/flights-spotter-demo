import React, { useState } from 'react';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';
import { getData } from '../services/api';
import { SearchAirportsEndpoint } from '../services/endpoints';

const InputAirport = ({setInputValue, value}) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = async (event, value) => {
    if (value.length >= 3) { 
      setLoading(true);
      try {
        const response = await getData(SearchAirportsEndpoint, {
           query: value, locale: 'en-US' 
        });
        setOptions(response.data);
      } catch (error) {
        console.error('Error fetching airport data:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) => option.presentation.suggestionTitle || ''}
      onInputChange={handleInputChange}
      onChange={(e, val) => setInputValue(val)}
      value={value || null}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Enter Airport or City"
          variant="outlined"
          slotProps={{
            input: {...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
            }
          }}
        />
      )}
    />
  );
};

export default InputAirport;
