import React, { useContext, useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import http from '../http';
import UserContext from '../contexts/UserContext';
import dayjs from 'dayjs'; // Add dayjs for date formatting
import global from '../global'; // Ensure global settings for date formats

function Homepage() {
  const { user } = useContext(UserContext);
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    // Fetch featured events
    http.get('/events/featured').then((res) => {
      setEvents(res.data);
    });

    // Fetch announcements
    http.get('/announcement').then((res) => {
      // Sort announcements by createdAt date in descending order
      const sortedAnnouncements = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // Set only the most recent 3 announcements
      setAnnouncements(sortedAnnouncements.slice(0, 3));
    });
  }, []);

  return (
    <Box>
      <Typography variant="h4" sx={{ my: 2 }}>
        Hello, {user ? user.name : 'Guest'}!
      </Typography>

      <Typography variant="h5" sx={{ my: 2 }}>
        Featured Events:
      </Typography>
      <Grid container spacing={2}>
        {events.map((event) => (
          <Grid item xs={12} md={6} lg={4} key={event.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{event.title}</Typography>
                <Typography>{event.venue}</Typography>
                <Typography>{event.time}</Typography>
                <Typography>{event.date}</Typography>
                <Typography>{event.type}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Link to="/events">
          <Button variant="contained">View More</Button>
        </Link>
      </Box>

      <Typography variant="h5" sx={{ my: 2 }}>
        Recent Announcements:
      </Typography>
      <Grid container spacing={2}>
        {announcements.map((announcement) => (
          <Grid item xs={12} key={announcement.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{announcement.subject}</Typography> {/* Changed from title to subject */}
                {/* Conditionally render the event type */}
                {announcement.type !== 'default' && (
                  <Typography
                    variant="body2"
                    sx={{ color: announcement.type === 'urgent' || announcement.type === 'important' ? 'red' : 'inherit' }}
                  >
                    {announcement.type === 'important' ? 'Important' : 'Urgent'}
                  </Typography>
                )}
                <Typography>By: {announcement.user?.name || 'Unknown'}</Typography>
                <Typography>
                  {dayjs(announcement.createdAt).format(global.datetimeFormat)} {/* Formatting timestamp */}
                </Typography>
                <Typography>{announcement.for === 'staff' ? 'Staff' : announcement.for}</Typography> {/* Display announcement 'for' info */}
                <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                  {announcement.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Link to="/announcements">
          <Button variant="contained">View More</Button>
        </Link>
      </Box>
    </Box>
  );
}

export default Homepage;