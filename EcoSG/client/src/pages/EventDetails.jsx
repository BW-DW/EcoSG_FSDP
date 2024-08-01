import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Box, Typography, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import http from '../http';

function EventDetails() {
    const { id } = useParams();
    const [event, setEvent] = useState({});
    const [loading, setLoading] = useState(true);
    const [signedUp, setSignedUp] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        http.get(`/event/${id}`).then((res) => {
            setEvent(res.data);
            setLoading(false);
        });

        // Check if the user has already signed up for this event
        http.get(`/event/${id}/check-signup`).then((res) => {
            if (res.data.signedUp) {
                setSignedUp(true);
            }
        });
    }, [id]);

    const handleSignUp = () => {
        setOpenDialog(false);
        http.post(`/event/${id}/signup`)
            .then((res) => {
                setSignedUp(true);
            })
            .catch((err) => {
                alert('Failed to sign up for the event');
            });
    };

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    if (!event.title) {
        return <Typography>Event not found</Typography>;
    }

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
                {event.title || 'N/A'}
            </Typography>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Type: {event.type || 'N/A'}
            </Typography>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Organiser(s): {event.organisers || 'N/A'}
            </Typography>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Status: {event.status || 'N/A'}
            </Typography>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Date: {event.date || 'N/A'}
            </Typography>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Time: {event.time || 'N/A'}
            </Typography>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Duration in Hours: {event.duration || 'N/A'}
            </Typography>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Location: {event.location || 'N/A'}
            </Typography>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Max Pax: {event.maxPax || 'N/A'}
            </Typography>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Facilities: {event.facilities || 'N/A'}
            </Typography>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Manpower: {event.manpower || 'N/A'}
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
                {event.description || 'N/A'}
            </Typography>
            <Box sx={{ mt: 2 }}>
                <Link to="/events" style={{ textDecoration: 'none' }}>
                    <Button variant="contained">Back to Events</Button>
                </Link>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setOpenDialog(true)}
                    disabled={signedUp}
                    sx={{ ml: 2, bgcolor: signedUp ? 'grey' : 'primary.main' }}
                >
                    {signedUp ? 'Signed Up' : 'Sign Up'}
                </Button>
            </Box>
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
            >
                <DialogTitle>Sign Up</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to sign up for this event?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleSignUp} autoFocus>
                        Continue
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default EventDetails;
