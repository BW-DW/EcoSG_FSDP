import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import http from '../http';

function EventSignUp({ eventId, currentUserId }) {
    const [open, setOpen] = useState(false);
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSignedUp, setIsSignedUp] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await http.get(`/event/${eventId}`);
                setEvent(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch event details', error);
                setLoading(false);
            }
        };

        const checkSignUp = async () => {
            try {
                const response = await http.get(`/event/${eventId}/check-signup`);
                setIsSignedUp(response.data.signedUp);
            } catch (error) {
                console.error('Failed to check sign up status', error);
            }
        };

        fetchEvent();
        checkSignUp();
    }, [eventId]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSignUp = async () => {
        try {
            const response = await http.post(`/event/${eventId}/signup`);
            if (response.status === 200) {
                setIsSignedUp(true);
                alert('Signed up successfully for the event');
                handleClose();
            } else {
                throw new Error(response.statusText);
            }
        } catch (error) {
            alert(`Failed to sign up for the event: ${error.message}`);
        }
    };

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    if (!event) {
        return <Typography>Error loading event details.</Typography>;
    }

    return (
        <>
            {!isSignedUp && (
                <>
                    <Button variant="contained" color="primary" onClick={handleClickOpen}>
                        Sign Up
                    </Button>
                    <Dialog open={open} onClose={handleClose}>
                        <DialogTitle>Sign Up</DialogTitle>
                        <DialogContent>
                            <Typography>
                                Are you sure you want to sign up for this event?
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={handleSignUp} color="primary">
                                Continue
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            )}
        </>
    );
}

export default EventSignUp;
