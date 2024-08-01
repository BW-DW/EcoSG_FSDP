import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import http from '../http';
import UserContext from '../contexts/UserContext';

function AdminEventDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const [event, setEvent] = useState({});
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        http.get(`/event/${id}`).then((res) => {
            setEvent(res.data);
            setLoading(false);
        }).catch((err) => {
            console.error('Failed to fetch event details', err);
            setLoading(false);
        });
    }, [id]);

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            http.delete(`/event/${id}`).then(() => {
                navigate('/events');
            }).catch((err) => {
                alert('Failed to delete the event');
            });
        }
    };

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    if (!event.title) {
        return <Typography>Event not found</Typography>;
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" sx={{ mb: 2 }}>
                    {event.title || 'N/A'}
                </Typography>
                <Box>
                    <IconButton color="primary" component={Link} to={`/editevent/${event.id}`} sx={{ padding: '4px' }}>
                        <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={handleDelete} sx={{ padding: '4px' }}>
                        <Delete />
                    </IconButton>
                </Box>
            </Box>
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
                <Link to="/admin-events" style={{ textDecoration: 'none' }}>
                    <Button variant="contained">Back to Admin Events</Button>
                </Link>
            </Box>
        </Box>
    );
}

export default AdminEventDetails;
