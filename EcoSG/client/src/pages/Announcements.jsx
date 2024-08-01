import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button } from '@mui/material';
import { AccountCircle, AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import UserContext from '../contexts/UserContext';
import global from '../global';

function Announcements() {
    const [announcementList, setAnnouncementList] = useState([]);
    const [search, setSearch] = useState('');
    const { user } = useContext(UserContext); // User context

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    // Fetch announcements from the backend
    const getAnnouncements = () => {
        http.get('/announcement').then((res) => {
            setAnnouncementList(res.data);
        });
    };

    // Filter announcements based on search input and user role
    const filterAnnouncements = () => {
        return announcementList.filter((announcement) => {
            const matchesSearch = announcement.subject.toLowerCase().includes(search.toLowerCase());
            if (user?.role === 'staff') return matchesSearch; // Staff can see all announcements
            return matchesSearch && announcement.for !== 'staff'; // Customers cannot see staff announcements
        });
    };

    // Fetch announcements whenever the component mounts or user changes
    useEffect(() => {
        getAnnouncements();
    }, [user]); // Fetch announcements again if user state changes

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            getAnnouncements(); // Refresh the announcement list
        }
    };

    const onClickSearch = () => {
        getAnnouncements(); // Refresh the announcement list
    }

    const onClickClear = () => {
        setSearch('');
        getAnnouncements(); // Refresh the announcement list
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Announcements
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Input
                    value={search}
                    placeholder="Search"
                    onChange={onSearchChange}
                    onKeyDown={onSearchKeyDown}
                />
                <IconButton color="primary" onClick={onClickSearch}>
                    <Search />
                </IconButton>
                <IconButton color="primary" onClick={onClickClear}>
                    <Clear />
                </IconButton>
                <Box sx={{ flexGrow: 1 }} />
                {user && (
                    <Link to="/addannouncement" style={{ textDecoration: 'none' }}>
                        <Button variant='contained'>
                            Create New
                        </Button>
                    </Link>
                )}
            </Box>

            <Grid container spacing={2}>
                {filterAnnouncements().map((announcement) => (
                    <Grid item xs={12} key={announcement.id}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', mb: 1 }}>
                                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                        {announcement.subject}
                                    </Typography>
                                    {user && user.id === announcement.userId && (
                                        <Link to={`/editannouncement/${announcement.id}`}>
                                            <IconButton color="primary" sx={{ padding: '4px' }}>
                                                <Edit />
                                            </IconButton>
                                        </Link>
                                    )}
                                </Box>
                                <Box
                                    sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                                    color="text.secondary"
                                >
                                    <Typography
                                        sx={{
                                            fontWeight: 'bold',
                                            mr: 1,
                                            color: announcement.type === 'urgent' ? 'red' : 'inherit'
                                        }}
                                    >
                                        {announcement.type === 'important' && 'Important'} {announcement.type === 'urgent' && 'Urgent'}
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                                    color="text.secondary"
                                >
                                    <AccountCircle sx={{ mr: 1 }} />
                                    <Typography>
                                        By: {announcement.user?.name}
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                                    color="text.secondary"
                                >
                                    <AccessTime sx={{ mr: 1 }} />
                                    <Typography>
                                        {dayjs(announcement.createdAt).format(global.datetimeFormat)}
                                    </Typography>
                                </Box>
                                <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                    {announcement.description}
                                </Typography>
                                <Typography sx={{ mt: 2 }}>
                                    Event: {announcement.for === 'staff' ? 'Staff' : announcement.for}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default Announcements;