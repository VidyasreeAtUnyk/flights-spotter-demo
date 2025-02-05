import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Menu,
  MenuItem,
} from '@mui/material';
import { Add, Remove, Person, ArrowDropDown } from '@mui/icons-material';

const PassengerSelector = ({adults, childrens, infants, setAdults, setChildrens, setInfants}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [passengers, setPassengers] = useState({
    adults: adults,
    childrens: childrens,
    infants: infants,
  });
  const [tempPassengers, setTempPassengers] = useState(passengers);

  const totalPassengers =
    passengers.adults + passengers.childrens + passengers.infants;

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
    setTempPassengers(passengers); 
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCancel = () => {
    setTempPassengers(passengers); 
    handleClose();
  };

  const handleDone = () => {
    setPassengers(tempPassengers); 
    handleClose();
  };

  const handleChange = (type, value) => {
    setTempPassengers((prev) => ({
      ...prev,
      [type]: Math.max(0, value),
    }));
  };

  useEffect(() => {
    setAdults(passengers.adults);
    setChildrens(passengers.childrens);
    setInfants(passengers.infants);
  }, [passengers])

  const renderCounter = (label, type, min = 0, max = 9) => (
    <Box display="flex" alignItems="center" justifyContent="space-between" my={1}>
      <Typography>{label}</Typography>
      <Box display="flex" alignItems="center">
        <IconButton
          size="small"
          onClick={() => handleChange(type, tempPassengers[type] - 1)}
          disabled={tempPassengers[type] === min}
        >
          <Remove />
        </IconButton>
        <TextField
          type="number"
          value={tempPassengers[type]}
          slotProps={{input: { min, max, style: { textAlign: 'center' } }}}
          onChange={(e) => handleChange(type, parseInt(e.target.value) || 0)}
          sx={{ width: 60, mx: 1 }}
        />
        <IconButton
          size="small"
          onClick={() => handleChange(type, tempPassengers[type] + 1)}
          disabled={tempPassengers[type] === max}
        >
          <Add />
        </IconButton>
      </Box>
    </Box>
  );

  return (
    <Box>
      <Box
        onClick={handleOpen}
        display="flex"
        alignItems="center"
        border="1px solid #ccc"
        borderRadius={4}
        p={1.5}
        sx={{ cursor: 'pointer', minWidth: 200 }}
      >
        <Box display="flex" alignItems="center">
          <Person sx={{ mr: 1 }} />
          {totalPassengers}
        </Box>
        <ArrowDropDown
          sx={{
            transform: Boolean(anchorEl) ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
          }}
        />
      </Box>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCancel}>
          <Box p={2}>
            {renderCounter('Adults', 'adults', 1)}
            {renderCounter('Childrens', 'childrens')}
            {renderCounter('Infants', 'infants')}

            <Box display="flex" justifyContent="space-between" mt={2}>
              <Button variant="outlined" onClick={handleCancel}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleDone}>
                Done
              </Button>
            </Box>
          </Box>
      </Menu>
    </Box>
  );
};

export default PassengerSelector;
