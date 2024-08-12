import React, { useEffect, useState, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button } from '@mui/material';
import { AccountCircle, AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import UserContext from '../contexts/UserContext';
import global from '../global';
import './viewDon.css';

function Viewdonstaff() {
    let amt=0
    const [tutorialList, setTutorialList] = useState([]);
    const [search, setSearch] = useState('');
    const { id } = useParams();

    const [user, setUser] = useState(null); // Initialize user state with null

  useEffect(() => {
    http.get(`/user/${id}`)
      .then(response => response.json())
      .then(data => setUser(data)); // Update user state with fetched data
  }, [id]); // Run effect when id changes

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getTutorials = () => {
        http.get(`/tutorial/userId/${id}`).then((res) => {
            setTutorialList(res.data);
        });
    };

    const searchTutorials = () => {
        http.get(`/tutorial/userId/${id}?search=${search}`).then((res) => {
            setTutorialList(res.data);
        });
    };

    useEffect(() => {
        getTutorials();
    }, []);

    // const updateDonation = async (userId, donationAmount) => {
    //     try {
    //       const response = await http.put(`/user/${userId}`, {
    //         donation: donationAmount,
    //       });
    //       console.log(response.data);
    //     } catch (error) {
    //       console.error(error);
    //     }
    //   };

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchTutorials();
        }
    };

    const onClickSearch = () => {
        searchTutorials();
    }

    const onClickClear = () => {
        setSearch('');
        getTutorials();
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                View Donations
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
                        <Link to={`/logindon`} style={{ textDecoration: 'none' }}>
                            <Button variant='contained'>
                                Donate
                            </Button>
                        </Link>
                    
                }
            </Box>
            <Grid container spacing={2}>
                {
                    tutorialList.slice().reverse().map((tutorial, i) => {
                        return (
                            <Grid item xs={12} md={6} lg={4} key={tutorial.id}>
                                <Typography sx={{ color: 'white' }}>
                                {amt+=tutorial.amount}
                                </Typography>
                                
                                {
                                <Card>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', mb: 1 }}>
                                            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                                {tutorial.amount}
                                            </Typography>
                                            {
                                                    <Link to={`/logindonupdate/${tutorial.id}`}>
                                                        <IconButton color="primary" sx={{ padding: '4px' }}>
                                                            <Edit />
                                                        </IconButton>
                                                    </Link>
                                                
                                            }
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                                            color="text.secondary">
                                            <AccountCircle sx={{ mr: 1 }} />
                                            <Typography>
                                                {tutorial.user?.name}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                                            color="text.secondary">
                                            <AccessTime sx={{ mr: 1 }} />
                                            <Typography>
                                                {dayjs(tutorial.createdAt).format(global.datetimeFormat)}
                                            </Typography>
                                        </Box>
                                        <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                            {tutorial.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                                }
                            </Grid>
                        );
                    })
                }
                </Grid>
                                <Typography variant="h5" sx={{ my: 2 }}>
                                    Total Donations Made: ${amt}
                                </Typography>
                                <Typography variant="h5" sx={{ my: 2 }}>
                                    Make a donation <Link to="/logindon">here</Link>
                                </Typography>
        </Box>
    );
}

export default Viewdonstaff;