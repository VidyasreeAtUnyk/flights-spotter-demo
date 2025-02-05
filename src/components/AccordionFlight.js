import React, {useState} from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import { Avatar, Box, Stack } from '@mui/material';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import EastIcon from '@mui/icons-material/East';

const FlightSummary = ({time, day, duration, stops, airlines, expanded, price, logo}) => {
    return (
        <>
        <Avatar
        src={logo}
        alt='airlines logo'
        variant="rounded" // Change to "rounded" if you prefer square edges
        sx={{ width: 40, height: 40 }}
        />
      <Box
        sx={{
            display: 'flex',
            alignItems: {xs: 'start', sm: 'center'},
            width: '100%',  
            justifyContent: 'space-between',
            px: 2,
            flexDirection: {xs: 'column', sm: 'row'}
        }}
      >
          <Box>
            <Typography variant="h6" fontSize={{
                xs: '18px',
                sm: '20px'
            }} fontWeight='bold' color='white'>
              {expanded ? `Departure • ${day}` : time}
            </Typography>
  
            {!expanded && <Typography variant="body2" color="white">
              {`${airlines} • ${duration} ${stops > 0 ? `• ${stops} stops` : ``} `}
            </Typography>}
          </Box>
  
            <Typography variant="h6" sx={{ color: 'success.main' }}>
                {price}
            </Typography>
        </Box>
        </>
    );
  };

  const FlightSegment = ({
    departureTime,
    arrivalTime,
    departureAirport,
    arrivalAirport,
    travelTime,
    airline,
    travelClass,
    border
  }) => {
    return (
      <Box display="flex" alignItems="flex-start" gap={2} p={2} bgcolor="#2a2a2e" borderBottom={border ? '0.1px solid gray' : '0'}>
        <Box display='flex' flexDirection="row" justifyContent='space-between' width='100%' gap={1}>
            <Box display='flex' flexDirection="column" width='50%'>
                <Stack alignItems="center" spacing={1}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>{departureTime}</Typography>
                    <Typography sx={{ color: 'white'}}>{departureAirport}</Typography>
                </Stack>
                <Typography sx={{ ml: {sm: 4}, color: 'gray', textAlign: {sm: 'center' }}}>
                    {airline} •&nbsp;{travelClass}
                </Typography>
            </Box>
            <Stack alignItems="center" spacing={1}>
                <EastIcon sx={{ fontSize: {xs: 20, sm: 40}, color: 'white', pt: 1 }} />
                <Typography sx={{ ml: 4, mt: 0, color: 'gray', textAlign: 'center', whiteSpace: {
                    sm: 'nowrap'
                } }}>{travelTime}</Typography>
            </Stack>
            <Box display='flex' flexDirection="column" width='50%'>
                <Stack alignItems="center" spacing={1}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>{arrivalTime}</Typography>
                    <Typography sx={{ color: 'white' }}>{arrivalAirport}</Typography>
                </Stack>
            </Box>
        </Box>
      </Box>
    );
  };
  

const AccordionFlight = ({flight}) => {
    const oneWayDetails = flight?.legs[0];
    const airlineDetails = oneWayDetails?.carriers?.marketing[0];
    const [isExpanded, setIsExpanded] = useState(false);

    const getFormattedFlightTime = (inputValue) => {
        const inputDate = new Date(inputValue);

        const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };

        return new Intl.DateTimeFormat('en-US', timeOptions).format(inputDate);
    }

    const formatFlightTime = (departure, arrival) => {

        const depDate = new Date(departure);
        const arrDate = new Date(arrival);
      
        // Formatted times
        const depTime = getFormattedFlightTime(departure);
        const arrTime = getFormattedFlightTime(arrival);
      
        // Check if arrival is on the next day
        const dayDifference = arrDate.getDate() - depDate.getDate();
        const dayOffset = dayDifference > 0 ? `+${dayDifference}` : '';
      
        return `${depTime} – ${arrTime}${dayOffset}`;
    }

    const formatFlightDate = (inputDate) => {
        const date = new Date(inputDate);
        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    const formatDuration = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return hours > 0 ? `${hours} hr ${remainingMinutes} mins` : `${remainingMinutes} mins`;
    }

  return (
    <div>
      {oneWayDetails && <Accordion sx={{bgcolor: "#2a2a2e", border: '0.5px solid gray'}}> 
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{color: 'white'}}/>}
          onClick={() => setIsExpanded(!isExpanded)}
        >
            <FlightSummary time={formatFlightTime(oneWayDetails.departure, oneWayDetails.arrival)} logo={airlineDetails.logoUrl} day={formatFlightDate(oneWayDetails.departure)} duration={formatDuration(oneWayDetails.durationInMinutes)} stops={oneWayDetails.stopCount} airlines={airlineDetails.name} price={flight.price.formatted} expanded={isExpanded}/>
        </AccordionSummary>
        <AccordionDetails sx={{pt: 0}}>
          {oneWayDetails.segments.map((segment, index) => (
            <FlightSegment departureTime={getFormattedFlightTime(segment.departure)} arrivalTime={getFormattedFlightTime(segment.arrival)} departureAirport={`${segment.origin.name} (${segment.origin.displayCode})`} arrivalAirport={`${segment.destination.name} (${segment.destination.displayCode})`}  travelTime={formatDuration(segment.durationInMinutes)} airline={segment.operatingCarrier.name} travelClass='economy' border={index !== oneWayDetails.segments.length - 1}></FlightSegment>
          ))}
        </AccordionDetails>
      </Accordion>}
    </div>
  );
}

export default AccordionFlight;
