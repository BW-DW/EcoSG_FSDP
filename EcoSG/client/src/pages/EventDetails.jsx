import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Box, Typography, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, CircularProgress, Divider } from '@mui/material';
import http from '../http';

function EventDetails() {
    const { id } = useParams();
    const [event, setEvent] = useState({});
    const [loading, setLoading] = useState(true);
    const [signedUp, setSignedUp] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [collectReward, setCollectReward] = useState(false);

    useEffect(() => {
        // Fetch event details
        http.get(`/event/${id}`)
            .then((res) => {
                setEvent(res.data);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                setError('Failed to load event details.');
            });

        // Fetch user data
        http.get('/user/auth')
            .then((res) => {
                setUser(res.data.user);
            })
            .catch((err) => {
                setError('Failed to load user data.');
            });

        // Check if the user has already signed up
        http.get(`/event/${id}/check-signup`)
            .then((res) => {
                setSignedUp(res.data.signedUp);
                if (res.data.signedUp && res.data.eventStatus === 'Completed') {
                    setCollectReward(true);
                }
            })
            .catch((err) => {
                setError('Failed to check sign-up status.');
            });
    }, [id]);

    const handleSignUp = () => {
        setOpenDialog(false);
        http.post(`/event/${id}/signup`)
            .then((res) => {
                setSignedUp(true);
                setError(null);
            })
            .catch((err) => {
                setError('Failed to sign up for the event.');
            });
    };

    const handleCollectReward = () => {
        http.post(`/event/${id}/collect-reward`)
            .then((res) => {
                alert('Reward collected successfully!');
            })
            .catch((err) => {
                setError('Failed to collect reward.');
            });
    };

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    if (!event.title) {
        return <Typography>Event not found</Typography>;
    }

    // Check if the current user is the creator of the event
    const isEventCreator = user && event.user && user.id === event.user.id;

    return (
        <Box sx={{ p: 2 }}>
            {/* Title and Status */}
            <Typography variant="h3" sx={{ mb: 1 }}>
                {event.title || 'N/A'}
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                {event.status || 'N/A'}
            </Typography>

            {/* Divider */}
            <Divider sx={{ mb: 2 }} />

            {/* Organiser */}
            <Typography variant="h6" sx={{ mb: 2 }}>
                Organiser(s): {event.organisers || 'N/A'}
            </Typography>

            {/* Divider */}
            <Divider sx={{ mb: 2 }} />

            {/* Details Section */}
            <Box sx={{ display: 'flex', flexDirection: 'row', mb: 2 }}>
                {/* Vertical Line 1 */}
                <Box sx={{ flex: '1 1 0', display: 'flex', flexDirection: 'column', gap: 2, mr: 2 }}>
                    <Box>
                        <Typography variant="h6">Type of Activity</Typography>
                        <Typography variant="body1">{event.type || 'N/A'}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="h6">Date</Typography>
                        <Typography variant="body1">{event.date || 'N/A'}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="h6">Time</Typography>
                        <Typography variant="body1">{event.time || 'N/A'}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="h6">Duration</Typography>
                        <Typography variant="body1">{event.duration || 'N/A'}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="h6">Max Pax</Typography>
                        <Typography variant="body1">{event.maxPax || 'N/A'}</Typography>
                    </Box>
                </Box>

                {/* Vertical Line 2 */}
                <Box sx={{ flex: '1 1 0', display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                        <Typography variant="h6">Location</Typography>
                        <Typography variant="body1">{event.location || 'N/A'}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="h6">Facilities</Typography>
                        <Typography variant="body1">{event.facilities || 'N/A'}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="h6">Man Power</Typography>
                        <Typography variant="body1">{event.manpower || 'N/A'}</Typography>
                    </Box>
                </Box>
            </Box>

            {/* Divider */}
            <Divider sx={{ mb: 2 }} />

            {/* Description */}
            <Typography variant="h6" sx={{ mb: 2 }}>
                Description
            </Typography>
            <Typography variant="body1">
                {event.description || 'N/A'}
            </Typography>

            {/* Buttons */}
            <Box sx={{ mt: 2 }}>
                <Link to="/events" style={{ textDecoration: 'none' }}>
                    <Button variant="contained">Back to Events</Button>
                </Link>

                {isEventCreator ? null : event.status === 'Completed' && signedUp ? (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCollectReward}
                    >
                        Collect Reward
                    </Button>
                ) : event.status === 'Ongoing' || event.status === 'Completed' ? (
                    <Button
                        variant="contained"
                        color="primary"
                        disabled
                    >
                        {event.status}
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setOpenDialog(true)}
                        disabled={signedUp}
                        sx={{ backgroundColor: signedUp ? 'grey' : undefined }}
                    >
                        {signedUp ? 'Signed Up' : 'Sign Up'}
                    </Button>
                )}
            </Box>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Sign Up</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to sign up for this event?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSignUp} color="primary">
                        Sign Up
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default EventDetails;
