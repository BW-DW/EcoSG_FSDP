import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

const CompletedEvents = () => {
  // Hardcoded sample data with duration in hours
  const completedEvents = [
    { id: 1, title: 'Cleaning of Siloso Beach', description: 'Join us to clean up Siloso Beach!', date: '2024-02-08', status: 'Completed', duration: 3 },
    { id: 2, title: 'Workshop on Sustainable Living', description: 'Learn about sustainable living practices.', date: '2024-03-15', status: 'Completed', duration: 2 },
    { id: 3, title: 'Tree Planting Drive', description: 'Help us plant trees in the community park.', date: '2024-04-22', status: 'Completed', duration: 4 },
  ];

  return (
    <TableContainer component={Paper} style={{ margin: '20px' }}>
      <Typography variant="h6" component="div" style={{ padding: '10px', textAlign: 'center' }}>
        Completed Events
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Title</strong></TableCell>
            <TableCell><strong>Description</strong></TableCell>
            <TableCell><strong>Date</strong></TableCell>
            <TableCell><strong>Duration (Hours)</strong></TableCell>
            <TableCell><strong>Status</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {completedEvents.map((event) => (
            <TableRow key={event.id}>
              <TableCell>{event.title}</TableCell>
              <TableCell>{event.description}</TableCell>
              <TableCell>{event.date}</TableCell>
              <TableCell>{event.duration}</TableCell>
              <TableCell>{event.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CompletedEvents;
