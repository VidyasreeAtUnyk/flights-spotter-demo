import React, { useEffect, useState } from 'react';
import { getData } from './services/api';
import { SearchFlightsEndpoint } from './services/endpoints';
import InputAirport from './components/InputAirport';
import InputDate from './components/InputDate';
import { Box, Select, MenuItem, Container } from '@mui/material';
import {  LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import PassengerSelector from './components/PassengerSelector';
import DisplayFlights from './components/DisplayFlights';


const App = () => {
  const [flights, setFlights] = useState(null);
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
      cabinClass: cabinClass,
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
      if(data && data.data){
        sessionStorage.setItem('flights', JSON.stringify(flights));
      }
    } catch (error) {
      console.error('Failed to fetch flights:', error);
    }
  };

  // Use sessionStorage to persist state after refresh
  useEffect(() => {
    const storedOrigin = JSON.parse(sessionStorage.getItem('origin'));
    if(storedOrigin) {
      setOrigin(storedOrigin)
    }

    const storedDestination = JSON.parse(sessionStorage.getItem('destination'));
    if(storedDestination) {
      setDestination(storedDestination)
    }

    const storedDepartureDate = sessionStorage.getItem('departureDate');
    if(storedDepartureDate) {
      setDepartureDate(new Date(storedDepartureDate))
    }

    const storedReturnDate = sessionStorage.getItem('returnDate');
    if(storedReturnDate) {
      setReturnDate(new Date(storedReturnDate))
    }

    const storedCabinClass = sessionStorage.getItem('cabinClass');
    if(storedCabinClass) {
      setCabinClass(storedCabinClass)
    }

    const storedAdults = sessionStorage.getItem('adults');
    if(storedAdults) {
      setAdults(parseInt(storedAdults))
    }

    const storedInfants = sessionStorage.getItem('infants');
    if(storedInfants) {
      setInfants(parseInt(storedInfants))
    }

    const storedChildrens = sessionStorage.getItem('childrens');
    if(storedChildrens) {
      setChildrens(parseInt(storedChildrens))
    }

    const storedFlights = JSON.parse(sessionStorage.getItem('flights'));
    if(storedFlights) {
      setFlights(storedFlights)
    }
  }, []);


  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container 
        maxWidth="lg" 
        >
      <Box display='flex' gap={2} flexDirection='column'>
      <p>Origin</p>
      <InputAirport value={origin} color='white' setInputValue={(val) => {
        setOrigin(val);
        sessionStorage.setItem('origin', JSON.stringify(val));
      }} /> 
      <p>Destination</p>
      <InputAirport value={destination} setInputValue={(val) => {
         setDestination(val);
         sessionStorage.setItem('destination', JSON.stringify(val));
      }} /> 
      <Box display="flex" gap={2}>
        <InputDate label='Departure' value={departureDate} setValue={(val) => {
           setDepartureDate(val);
           sessionStorage.setItem('departureDate', val.toISOString());
        }} disablePast/>
        <InputDate label='Return (Optional)' value={returnDate} setValue={(val) => {
           setReturnDate(val);
           sessionStorage.setItem('returnDate', val.toISOString());
        }} minDate={departureDate || new Date()}/>
      </Box>
      <Select
        labelId="cabin-class-label"
        id="cabin-class-select"
        value={cabinClass}
        label="Cabin Class"
        onChange={(event) => {
          setCabinClass(event.target.value);
          sessionStorage.setItem('cabinClass', event.target.value);
        }}
      >
        <MenuItem value="economy">Economy</MenuItem>
        <MenuItem value="premium_economy">Premium Economy</MenuItem>
        <MenuItem value="business">Business</MenuItem>
        <MenuItem value="first">First Class</MenuItem>
      </Select>
      <PassengerSelector adults={adults} childrens={childrens} infants={infants} setAdults={(val) => {
        setAdults(val);
        sessionStorage.setItem('adults', val);
      }} setChildrens={(val) => {
        setChildrens(val);
        sessionStorage.setItem('childrens', val);
      }} setInfants={(val) => {
        setInfants(val);
        sessionStorage.setItem('infants', val);
      }}/>
      <button disabled={!origin || !destination || !departureDate} onClick={() => getFlights()} style={{width: 'fit-content', padding: '10px 20px'}}>Search</button>
      </Box>
      </Container>
      <DisplayFlights flights={flights}/>
      </LocalizationProvider>
      </div>
  );
};

export default App;
