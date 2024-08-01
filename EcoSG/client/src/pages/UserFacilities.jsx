import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button, Checkbox, FormControlLabel, MenuItem, Select } from '@mui/material';
import { AccountCircle, AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import UserContext from '../contexts/UserContext';
import global from '../global';

const locations = ["Central", "North", "South", "East", "West"];
const facilityTypes = ["Court", "Multi-purpose Hall", "Park"];

function Facilities() {
    const [facilityList, setFacilityList] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedLocations, setSelectedLocations] = useState([]);
    const [selectedFacilityTypes, setSelectedFacilityTypes] = useState([]);
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    // const updateURL = () => {
    //     let query = `?search=${search}`;
    //     if (selectedLocations.length > 0) {
    //         query += `&locations=${selectedLocations.join(",")}`;
    //     }
    //     if (selectedFacilityTypes.length > 0) {
    //         query += `&facilityTypes=${selectedFacilityTypes.join(",")}`;
    //     }
    //     navigate(`/facilities${query}`);
    // };

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const updateURL = () => {
        const query = `?search=${search}&locations=${selectedLocations.join(",")}&facilityTypes=${selectedFacilityTypes.join(",")}`;
        navigate(`/facilities${query}`);
    };


    const getFacilities = () => {
        http.get('/facilities').then((res) => {
            setFacilityList(res.data);
        });
    };

    // const searchFacilities = () => {
    //     let query = `/facilities?search=${search}`;
    //     if (selectedLocations.length > 0) {
    //         query += `&locations=${selectedLocations.join(",")}`;
    //     }
    //     if (selectedFacilityTypes.length > 0) {
    //         query += `&facilityTypes=${selectedFacilityTypes.join(",")}`;
    //     }
    //     console.log('Query:', query); // Log the constructed query
    //     http.get(query).then((res) => {
    //         setFacilityList(res.data);
    //         console.log('Updated facilityList:', facilityList); // Log the updated data
    //     });
    // };
    const searchFacilities = () => {
        const query = `/facilities?search=${search}&locations=${selectedLocations.join(",")}&facilityTypes=${selectedFacilityTypes.join(",")}`;
        http.get(query).then((res) => {
            setFacilityList(res.data);
        });
    };
    useEffect(() => {
        console.log('Updated facilityList:', facilityList);
    }, [facilityList]);
    useEffect(() => {
        getFacilities();
    }, []);

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchFacilities();
        }
    };

    const onClickSearch = () => {
        searchFacilities();
    };

    const onClickClear = () => {
        setSearch('');
        setSelectedLocations([]);
        setSelectedFacilityTypes([]);
        getFacilities();
    };

    const handleLocationChange = (e) => {
        const { checked, name } = e.target;
        setSelectedLocations((prev) =>
            checked ? [...prev, name] : prev.filter((loc) => loc !== name)
        );
        updateURL(); // Update URL when filter changes
        searchFacilities(); // Call searchFacilities when filter changes
    };

    const handleFacilityTypeChange = (e) => {
        const { checked, name } = e.target;
        setSelectedFacilityTypes((prev) =>
            checked ? [...prev, name] : prev.filter((type) => type !== name)
        );
        updateURL(); // Update URL when filter changes
        searchFacilities(); // Call searchFacilities when filter changes
    };

    useEffect(() => {
        console.log('URL changed:', window.location.search);
        // Fetch facilities based on URL parameters
        const queryParams = new URLSearchParams(window.location.search);
        const search = queryParams.get('search') || '';
        const locations = queryParams.get('locations') ? queryParams.get('locations').split(',') : [];
        const facilityTypes = queryParams.get('facilityTypes') ? queryParams.get('facilityTypes').split(',') : [];
        console.log('Query params:', search, locations, facilityTypes);
        setSearch(search);
        setSelectedLocations(locations);
        setSelectedFacilityTypes(facilityTypes);

        // Fetch facilities based on filters
        searchFacilities();
    }, [window.location.search]); // Re-run when URL changes
    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Facilities
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
            </Box>

            <Box sx={{ display: 'flex', mb: 2 }}>
                <Box sx={{ mr: 2 }}>
                    <Typography variant="subtitle1">Filters by Location</Typography>
                    {locations.map((loc) => (
                        <FormControlLabel
                            key={loc}
                            control={<Checkbox checked={selectedLocations.includes(loc)} onChange={handleLocationChange} name={loc} />}
                            label={loc}
                        />
                    ))}
                </Box>
                <Box>
                    <Typography variant="subtitle1">Filters by Facility</Typography>
                    {facilityTypes.map((type) => (
                        <FormControlLabel
                            key={type}
                            control={<Checkbox checked={selectedFacilityTypes.includes(type)} onChange={handleFacilityTypeChange} name={type} />}
                            label={type}
                        />
                    ))}
                </Box>
            </Box>

            <Grid container spacing={2}>
                {
                    facilityList.map((facilities, i) => {
                        return (
                            <Grid item xs={12} md={6} lg={4} key={facilities.id}>
                                <Card>
                                    {
                                        facilities.imageFile && (
                                            <Box className="aspect-ratio-container">
                                                <img alt="facility"
                                                    src={`${import.meta.env.VITE_FILE_BASE_URL}${facilities.imageFile}`}>
                                                </img>
                                            </Box>
                                        )
                                    }
                                    <CardContent>
                                        <Box sx={{ display: 'flex', mb: 1 }}>
                                            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                                {facilities.name}
                                            </Typography>

                                        </Box>


                                        <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                            {facilities.description}
                                        </Typography>
                                        <Typography sx={{ mt: 1, fontWeight: 'bold' }}>
                                            Location: {facilities.location}
                                        </Typography>
                                        <Typography sx={{ fontWeight: 'bold' }}>
                                            Facility Type: {facilities.facilityType}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })
                }
            </Grid>
        </Box>
    );
}

export default Facilities;