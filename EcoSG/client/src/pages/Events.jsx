import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button } from '@mui/material';
import { Search, Clear, Edit, Delete } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import UserContext from '../contexts/UserContext';
import global from '../global';

function Events() {
    const [eventList, setEventList] = useState([]);
    const [search, setSearch] = useState('');
    const { user } = useContext(UserContext);

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getEvents = () => {
        http.get('/event').then((res) => {
            setEventList(res.data);
        });
    };

    const searchEvents = () => {
        http.get(`/event?search=${search}`).then((res) => {
            setEventList(res.data);
        });
    };

    useEffect(() => {
        getEvents();
    }, []);

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchEvents();
        }
    };

    const onClickSearch = () => {
        searchEvents();
    };

    const onClickClear = () => {
        setSearch('');
        getEvents();
    };

    const deleteEvent = (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            http.delete(`/event/${id}`).then(() => {
                setEventList(eventList.filter(event => event.id !== id));
            });
        }
    };

    // Separate created events
    const createdEvents = eventList.filter(event => user && event.userId === user.id);

    // Order and group remaining events by status
    const orderedStatuses = ['Ongoing', 'Upcoming', 'Completed'];

    const groupedEvents = orderedStatuses.reduce((groups, status) => {
        groups[status] = eventList
            .filter(event => event.status === status && event.userId !== user.id); // Exclude created events
        return groups;
    }, {});

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Events
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Input value={search} placeholder="Search"
                    onChange={onSearchChange}
                    onKeyDown={onSearchKeyDown} />
                <IconButton color="primary" onClick={onClickSearch}>
                    <Search />
                </IconButton>
                <IconButton color="primary" onClick={onClickClear}>
                    <Clear />
                </IconButton>
                <Box sx={{ flexGrow: 1 }} />
                {user && (
                    <Link to="/createevent" style={{ textDecoration: 'none' }}>
                        <Button variant='contained'>Add</Button>
                    </Link>
                )}
            </Box>

            {/* Created Events Section */}
            {createdEvents.length > 0 && (
                <Box sx={{ mb: 4, backgroundColor: 'green', p: 2, borderRadius: 1 }}>
                    <Typography variant="h6" sx={{ mb: 2, color: 'white' }}>
                        Created Events
                    </Typography>
                    <Grid container spacing={2} justifyContent="center">
                        {createdEvents.map((event) => (
                            <Grid item xs={12} key={event.id}>
                                <Card sx={{ position: 'relative', display: 'flex', flexDirection: 'column', border: '2px solid green' }}>
                                    <CardContent>
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Link to={`/event/${event.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                <Typography variant="h4" sx={{ mb: 1, textAlign: 'center' }}>
                                                    {event.title}
                                                </Typography>
                                            </Link>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    {dayjs(event.date).format(global.datetimeFormat)}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {event.time}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            {/* Bottom Left: Organiser and Location */}
                                            <Box>
                                                <Typography variant="body2" color="text.secondary">
                                                    Organiser: {event.organisers}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Location: {event.location}
                                                </Typography>
                                            </Box>
                                            {/* Bottom Right: Status and Type */}
                                            <Box sx={{ textAlign: 'right' }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Status: {event.status}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Type: {event.type}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                    {/* Edit and Delete Buttons */}
                                    {user && user.id === event.userId && (
                                        <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                                            <Link to={`/editevent/${event.id}`} style={{ textDecoration: 'none' }}>
                                                <IconButton color="primary" aria-label="Edit event">
                                                    <Edit />
                                                </IconButton>
                                            </Link>
                                            <IconButton color="error" onClick={() => deleteEvent(event.id)} aria-label="Delete event">
                                                <Delete />
                                            </IconButton>
                                        </Box>
                                    )}
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}

            {/* Remaining Events Section */}
            {orderedStatuses.map((status) => (
                groupedEvents[status].length > 0 && (
                    <Box key={status} sx={{ mb: 4, backgroundColor: 'green', p: 2, borderRadius: 1 }}>
                        <Typography variant="h6" sx={{ mb: 2, color: 'white' }}>
                            {status}
                        </Typography>
                        <Grid container spacing={2} justifyContent="center">
                            {groupedEvents[status].map((event) => (
                                <Grid item xs={12} key={event.id}>
                                    <Card sx={{ position: 'relative', display: 'flex', flexDirection: 'column', border: '2px solid green' }}>
                                        <CardContent>
                                            <Box sx={{ flexGrow: 1 }}>
                                                <Link to={`/event/${event.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                    <Typography variant="h4" sx={{ mb: 1, textAlign: 'center' }}>
                                                        {event.title}
                                                    </Typography>
                                                </Link>
                                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {dayjs(event.date).format(global.datetimeFormat)}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {event.time}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                {/* Bottom Left: Organiser and Location */}
                                                <Box>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Organiser: {event.organisers}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Location: {event.location}
                                                    </Typography>
                                                </Box>
                                                {/* Bottom Right: Status and Type */}
                                                <Box sx={{ textAlign: 'right' }}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Status: {event.status}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Type: {event.type}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                        {/* Edit and Delete Buttons */}
                                        {user && user.id === event.userId && (
                                            <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                                                <Link to={`/editevent/${event.id}`} style={{ textDecoration: 'none' }}>
                                                    <IconButton color="primary" aria-label="Edit event">
                                                        <Edit />
                                                    </IconButton>
                                                </Link>
                                                <IconButton color="error" onClick={() => deleteEvent(event.id)} aria-label="Delete event">
                                                    <Delete />
                                                </IconButton>
                                            </Box>
                                        )}
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )
            ))}
        </Box>
    );
}

export default Events;
