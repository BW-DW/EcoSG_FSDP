import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button } from '@mui/material';
import { AccountCircle, AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import UserContext from '../contexts/UserContext';
import global from '../global';
import './Donations.css';

function Donations() {
    const [tutorialList, setTutorialList] = useState([]);
    const [search, setSearch] = useState('');
    const { user } = useContext(UserContext);

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getTutorials = () => {
        http.get('/tutorial').then((res) => {
            setTutorialList(res.data);
        });
    };

    const searchTutorials = () => {
        http.get(`/tutorial?search=${search}`).then((res) => {
            setTutorialList(res.data);
        });
    };

    useEffect(() => {
        getTutorials();
    }, []);

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
                Make a Donation
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
                        <Link to="/makedonations" style={{ textDecoration: 'none' }}>
                            <Button variant='contained'>
                                Donate
                            </Button>
                        </Link>
                    )
                }
            </Box>
            <div className="button-grid">
            <Link to="/makedonations/10">
      <button className="button">$10</button></Link>
      <Link to="/makedonations/20">
      <button className="button">$20</button></Link>
      <Link to="/makedonations/50">
      <button className="button">$50</button></Link>
      <Link to="/makedonations/100">
      <button className="button">$100</button></Link>
      <Link to="/makedonations/150">
      <button className="button">$150</button></Link>
      <Link to="/makedonations/200">
      <button className="button">$200</button></Link>
    </div>
        </Box>
    );
}

export default Donations;