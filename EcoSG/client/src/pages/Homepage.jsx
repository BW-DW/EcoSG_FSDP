import React, { useContext, useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import http from '../http';
import UserContext from '../contexts/UserContext';
import dayjs from 'dayjs';
import global from '../global';

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
      // Filter announcements based on user role
      const filteredAnnouncements = res.data.filter((announcement) => {
        // Show only staff announcements to staff members
        if (user?.role === 'staff') return true;
        // Show only customer announcements to non-staff users or guests
        return announcement.for !== 'staff';
      });

      // Sort announcements by createdAt date in descending order
      const sortedAnnouncements = filteredAnnouncements.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      // Set only the most recent 3 announcements
      setAnnouncements(sortedAnnouncements.slice(0, 3));
    });
  }, [user]);

  return (
    <Box>
      <Typography variant="h3" sx={{ my: 8, textAlign: 'center'}}>
        Hello, {user ? user.name : 'Guest'}!
      </Typography>

      {/* Conditional rendering for non-logged-in users */}
      {!user && (
        <Box sx={{ my: 3, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ mb: 1 }}>
            Create an Account and Sign up Now!
          </Typography>
          <Link to="/register" style={{ textDecoration: 'none' }}>
            <Button variant="contained" color="primary" sx={{ mb: 2 }}>
              Register
            </Button>
          </Link>
          <Typography variant="body1">
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 'bold' }}>
              Login
            </Link>
          </Typography>
        </Box>
      )}

      {/* <Typography variant="h5" sx={{ my: 2 }}>
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
      </Box> */}

      <Typography variant="h5" sx={{ my: 2 }}>
        Recent Announcements:
      </Typography>
      <Grid container spacing={2}>
        {announcements.map((announcement) => (
          <Grid item xs={12} key={announcement.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{announcement.subject}</Typography>
                {announcement.type !== 'default' && (
                  <Typography
                    variant="body2"
                    sx={{
                      color:
                        announcement.type === 'urgent' || announcement.type === 'important'
                          ? 'red'
                          : 'inherit',
                    }}
                  >
                    {announcement.type === 'important' ? 'Important' : 'Urgent'}
                  </Typography>
                )}
                <Typography>By: {announcement.user?.name || 'Unknown'}</Typography>
                <Typography>
                  {dayjs(announcement.createdAt).format(global.datetimeFormat)}
                </Typography>
                <Typography>{announcement.for === 'staff' ? 'Staff' : announcement.for}</Typography>
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