

import React, {useState} from 'react';
import { Container, Pagination } from "@mui/material";
import AccordionFlight from './AccordionFlight';
import { Box } from '@mui/material';

const DisplayFlights = ({flights}) => {
    const flightsPerPage = 10;
    const [page, setPage] = useState(1);

    const startIndex = (page - 1) * flightsPerPage;
  const currentFlights = flights?.itineraries.slice(startIndex, startIndex + flightsPerPage);

  return (
        <Container 
        maxWidth="lg" 
        sx={{ bgcolor: '#2a2a2e' }}
        >
            <Box
            sx={{
                display: "flex",
                justifyContent: "flex-end", 
                padding: 2,                 
            }}
            >
        {flights?.itineraries.length > 0 && 
            <Pagination
            count={Math.ceil(flights.itineraries.length / flightsPerPage)}
            page={page}
            onChange={(e, val) => setPage(val)}
            color="white"
            sx={{ mt: 2, display: "flex", justifyContent: "center", "& .MuiPaginationItem-root": {
            color: "white",         
            borderColor: "white",   
            },
            "& .Mui-selected": {
            backgroundColor: "white",
            color: "black",         
            }, }}
        />}
        </Box>
        <Box display='flex' gap={0} flexDirection='column' bgcolor='#2a2a2e'>
        {currentFlights?.map((flight) => (
            <AccordionFlight flight={flight} />
        ))}
        </Box>
  </Container>
  );
};

export default DisplayFlights;
