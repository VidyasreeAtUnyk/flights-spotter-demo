import React, { useEffect, useState } from 'react';
import { getData } from './services/api';
import { SearchFlightsEndpoint } from './services/endpoints';
import InputAirport from './components/InputAirport';
import InputDate from './components/InputDate';
import { Box, Select, MenuItem } from '@mui/material';
import {  LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import PassengerSelector from './components/PassengerSelector';

const App = () => {
  const [flights, setFlights] = useState([]);
  const [origin, setOrigin] = useState();
  const [destination, setDestination] = useState(null);
  const [departureDate, setDepartureDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [cabinClass, setCabinClass] = useState('economy');
  const [adults, setAdults] = useState(1);
  const [childrens, setChildrens] = useState(0);
  const [infants, setInfants] = useState(0);

  const getFlights = async () => {
    const params = {
      originSkyId: origin?.skyId,
      destinationSkyId: destination?.skyId,
      originEntityId: origin?.entityId,
      destinationEntityId: destination?.entityId,
      date: departureDate?.toLocaleDateString('en-CA'),
      returnDate: returnDate?.toLocaleDateString('en-CA'),
      cabinClass: 'economy',
      adults: adults?.toString(),
      childrens: childrens?.toString(),
      infants: infants?.toString(),
      sortBy: 'best',
      currency: 'USD',
      market: 'en-US',
      countryCode: 'US'
    }
    try {
      const data = await getData(SearchFlightsEndpoint, params);
      setFlights(data?.data);
    } catch (error) {
      console.error('Failed to fetch flights:', error);
    }
  };


  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
      <p>Origin</p>
      <InputAirport setInputValue={setOrigin} /> 
      <p>Destination</p>
      <InputAirport setInputValue={setDestination} /> 
      <Box display="flex" gap={2}>
        <InputDate label='Departure' value={departureDate} setValue={setDepartureDate} disablePast/>
        <InputDate label='Return (Optional)' value={returnDate} setValue={setReturnDate} minDate={departureDate || new Date()}/>
      </Box>
      <Select
        labelId="cabin-class-label"
        id="cabin-class-select"
        value={cabinClass}
        label="Cabin Class"
        onChange={(event) => setCabinClass(event.target.value)}
      >
        <MenuItem value="economy">Economy</MenuItem>
        <MenuItem value="premium_economy">Premium Economy</MenuItem>
        <MenuItem value="business">Business</MenuItem>
        <MenuItem value="first">First Class</MenuItem>
      </Select>
      <PassengerSelector adults={adults} childrens={childrens} infants={infants} setAdults={setAdults} setChildrens={setChildrens} setInfants={setInfants}/>
      <button disabled={!origin || !destination || !departureDate} onClick={() => getFlights()}>Search</button>
      <h1>Flights</h1>
      {flights?.itineraries?.length ? (
        <ul>
          {flights.itineraries.map((flight, index) => (
            <li key={index}>{flight?.price?.formatted}</li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
      </LocalizationProvider>
    </div>
  );
};

export default App;
