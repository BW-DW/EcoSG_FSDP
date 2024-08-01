import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button } from '@mui/material';
import { AccessTime, Search, Clear, Edit, Delete } from '@mui/icons-material';
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

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Events
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Input value={search} placeholder="Search"
                    onChange={onSearchChange}
                    onKeyDown={onSearchKeyDown} />
                <IconButton color="primary"
                    onClick={onClickSearch}>
                    <Search />
                </IconButton>
                <IconButton color="primary"
                    onClick={onClickClear}>
                    <Clear />
                </IconButton>
                <Box sx={{ flexGrow: 1 }} />
                {
                    user && (
                        <Link to="/createevent" style={{ textDecoration: 'none' }}>
                            <Button variant='contained'>
                                Add
                            </Button>
                        </Link>
                    )
                }
            </Box>

            <Grid container spacing={2}>
                {
                    eventList.map((event) => (
                        <Grid item xs={12} md={6} lg={4} key={event.id}>
                            <Card sx={{ position: 'relative' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', mb: 1 }}>
                                        <Link to={`/event/${event.id}`} style={{ textDecoration: 'none', flexGrow: 1 }}>
                                            <Typography variant="h6">
                                                {event.title}
                                            </Typography>
                                        </Link>
                                        {
                                            user && user.id === event.userId && (
                                                <>
                                                    <Link to={`/editevent/${event.id}`} style={{ position: 'absolute', top: 8, right: 8, textDecoration: 'none' }}>
                                                        <IconButton color="primary" sx={{ padding: '4px' }} aria-label="Edit event">
                                                            <Edit />
                                                        </IconButton>
                                                    </Link>
                                                    <IconButton color="error" onClick={() => deleteEvent(event.id)} sx={{ position: 'absolute', bottom: 8, right: 8, padding: '4px' }} aria-label="Delete event">
                                                        <Delete />
                                                    </IconButton>
                                                </>
                                            )
                                        }
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} color="text.secondary">
                                        <AccessTime sx={{ mr: 1 }} />
                                        <Typography>
                                            {dayjs(event.date).format(global.datetimeFormat)} {event.time}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                }
            </Grid>
        </Box>
    );
}

export default Events;
