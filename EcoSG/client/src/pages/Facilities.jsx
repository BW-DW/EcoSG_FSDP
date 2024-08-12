import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button, Checkbox, FormControlLabel } from '@mui/material';
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
    const location = useLocation();

    const updateURL = () => {
        const query = `?search=${search}&locations=${selectedLocations.join(",")}&facilityTypes=${selectedFacilityTypes.join(",")}`;
        navigate(`/facilities${query}`);
    };

    const getFacilities = () => {
        console.log("Fetching all facilities...");
        http.get('/facilities')
            .then((res) => {
                if (Array.isArray(res.data)) {
                    setFacilityList(res.data);
                    console.log("Facilities fetched:", res.data);
                } else {
                    console.error('API response is not an array:', res.data);
                }
            })
            .catch((err) => {
                console.error('Error fetching facilities:', err);
            });
    };

    const searchFacilities = () => {
        const query = `/facilities?search=${search}&locations=${selectedLocations.join(",")}&facilityTypes=${selectedFacilityTypes.join(",")}`;
        console.log("Searching with query:", query);
        http.get(query)
            .then((res) => {
                if (Array.isArray(res.data)) {
                    // Apply additional filtering on the client-side
                    const filteredData = res.data.filter(facility => {
                        const matchesLocation = selectedLocations.length === 0 || selectedLocations.includes(facility.location);
                        const matchesType = selectedFacilityTypes.length === 0 || selectedFacilityTypes.includes(facility.facilityType);
                        return matchesLocation && matchesType;
                    });
                    setFacilityList(filteredData);
                    console.log("Filtered search results:", filteredData);
                } else {
                    console.error('API response is not an array:', res.data);
                }
            })
            .catch((err) => {
                console.error('Error searching facilities:', err);
            });
    };

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

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
        navigate('/facilities');
    };

    const handleLocationChange = (e) => {
        const { checked, name } = e.target;
        setSelectedLocations((prev) =>
            checked ? [...prev, name] : prev.filter((loc) => loc !== name)
        );
    };

    const handleFacilityTypeChange = (e) => {
        const { checked, name } = e.target;
        setSelectedFacilityTypes((prev) =>
            checked ? [...prev, name] : prev.filter((type) => type !== name)
        );
    };

    useEffect(() => {
        searchFacilities();
        updateURL();
    }, [search, selectedLocations, selectedFacilityTypes]);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const search = queryParams.get('search') || '';
        const locations = queryParams.get('locations') ? queryParams.get('locations').split(',') : [];
        const facilityTypes = queryParams.get('facilityTypes') ? queryParams.get('facilityTypes').split(',') : [];
        
        setSearch(search);
        setSelectedLocations(locations);
        setSelectedFacilityTypes(facilityTypes);

        searchFacilities();
    }, [location.search]);

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
                {
                    user && (
                        <Link to="/createfacilities">
                            <Button variant='contained'>
                                Add
                            </Button>
                        </Link>
                    )
                }
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
                    facilityList.map((facility) => (
                        <Grid item xs={12} md={6} lg={4} key={facility.id}>
                            <Card>
                                {facility.imageFile && (
                                    <Box className="aspect-ratio-container">
                                        <img alt="facility"
                                            src={`${import.meta.env.VITE_FILE_BASE_URL}${facility.imageFile}`}>
                                        </img>
                                    </Box>
                                )}
                                <CardContent>
                                    <Box sx={{ display: 'flex', mb: 1 }}>
                                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                            {facility.name}
                                        </Typography>
                                        {user && user.id === facility.userId && (
                                            <Link to={`/editfacilities/${facility.id}`}>
                                                <IconButton color="primary" sx={{ padding: '4px' }}>
                                                    <Edit />
                                                </IconButton>
                                            </Link>
                                        )}
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                                        color="text.secondary">
                                        <AccountCircle sx={{ mr: 1 }} />
                                        <Typography>
                                            {facility.user?.name}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                                        color="text.secondary">
                                        <AccessTime sx={{ mr: 1 }} />
                                        <Typography>
                                            {dayjs(facility.createdAt).format(global.datetimeFormat)}
                                        </Typography>
                                    </Box>
                                    <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                        {facility.description}
                                    </Typography>
                                    <Typography sx={{ mt: 1, fontWeight: 'bold' }}>
                                        Location: {facility.location}
                                    </Typography>
                                    <Typography sx={{ fontWeight: 'bold' }}>
                                        Facility Type: {facility.facilityType}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                }
            </Grid>
        </Box>
    );
}

export default Facilities;
