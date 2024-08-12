import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Box, Typography, Grid, Card, CardContent, Input, IconButton, Button, Checkbox, FormControlLabel, Modal
} from '@mui/material';
import { Search, Clear, Close } from '@mui/icons-material';
import http from '../http';
import UserContext from '../contexts/UserContext';

const locations = ["Central", "North", "South", "East", "West"];
const facilityTypes = ["Court", "Multi-purpose Hall", "Park"];

function UserFacilities() {
    const [facilityList, setFacilityList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedLocations, setSelectedLocations] = useState([]);
    const [selectedFacilityTypes, setSelectedFacilityTypes] = useState([]);
    const [selectedFacility, setSelectedFacility] = useState(null);
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation();

    const updateURL = () => {
        const query = `?search=${search}&locations=${selectedLocations.join(",")}&facilityTypes=${selectedFacilityTypes.join(",")}`;
        navigate(`/userfacilities${query}`);
    };

    const fetchFacilities = async () => {
        const query = `/facilities`;
        console.log("Fetching all facilities...");
        try {
            const res = await http.get(query);
            if (Array.isArray(res.data)) {
                setFacilityList(res.data);
                console.log("Facilities fetched:", res.data);
            } else {
                console.error('API response is not an array:', res.data);
            }
        } catch (err) {
            console.error('Error fetching facilities:', err);
        }
    };

    const filterFacilities = () => {
        const filteredData = facilityList.filter(facility => {
            const matchesSearch = facility.name.toLowerCase().includes(search.toLowerCase());
            const matchesLocation = selectedLocations.length === 0 || selectedLocations.includes(facility.location);
            const matchesType = selectedFacilityTypes.length === 0 || selectedFacilityTypes.includes(facility.facilityType);
            return matchesSearch && matchesLocation && matchesType;
        });
        setFilteredList(filteredData);
        console.log("Filtered results:", filteredData);
    };

    useEffect(() => {
        fetchFacilities();
    }, []);

    useEffect(() => {
        filterFacilities();
        updateURL();
    }, [search, selectedLocations, selectedFacilityTypes, facilityList]);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const search = queryParams.get('search') || '';
        const locations = queryParams.get('locations') ? queryParams.get('locations').split(',') : [];
        const facilityTypes = queryParams.get('facilityTypes') ? queryParams.get('facilityTypes').split(',') : [];
        setSearch(search);
        setSelectedLocations(locations);
        setSelectedFacilityTypes(facilityTypes);
    }, [location.search]);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const handleSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            filterFacilities();
        }
    };

    const handleSearchClick = () => {
        filterFacilities();
    };

    const handleClearClick = () => {
        setSearch('');
        setSelectedLocations([]);
        setSelectedFacilityTypes([]);
        fetchFacilities();
        navigate('/userfacilities');
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

    const handleViewDetails = (facility) => {
        setSelectedFacility(facility);
    };

    const handleCloseModal = () => {
        setSelectedFacility(null);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            {/* Left Sidebar for Search and Filters */}
            <Box sx={{ width: 300, minWidth: 300, maxWidth: 300, p: 2, borderRight: '1px solid #ddd', boxSizing: 'border-box' }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                    Filters
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Input value={search} placeholder="Search"
                        onChange={handleSearchChange}
                        onKeyDown={handleSearchKeyDown}
                        fullWidth />
                    <IconButton color="primary" onClick={handleSearchClick}>
                        <Search />
                    </IconButton>
                    <IconButton color="primary" onClick={handleClearClick}>
                        <Clear />
                    </IconButton>
                </Box>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1">Filter by Location</Typography>
                    {locations.map((loc) => (
                        <FormControlLabel
                            key={loc}
                            control={<Checkbox checked={selectedLocations.includes(loc)} onChange={handleLocationChange} name={loc} />}
                            label={loc}
                        />
                    ))}
                </Box>
                <Box>
                    <Typography variant="subtitle1">Filter by Facility Type</Typography>
                    {facilityTypes.map((type) => (
                        <FormControlLabel
                            key={type}
                            control={<Checkbox checked={selectedFacilityTypes.includes(type)} onChange={handleFacilityTypeChange} name={type} />}
                            label={type}
                        />
                    ))}
                </Box>
            </Box>

            {/* Right Content Area for Facility List */}
            <Box sx={{ flexGrow: 1, p: 2 }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                    Facilities
                </Typography>
                <Grid container spacing={2}>
                    {filteredList.map((facility) => (
                        <Grid item xs={12} md={6} lg={4} key={facility.id}>
                            <Card>
                                {facility.imageFile && (
                                    <Box className="aspect-ratio-container">
                                        <img alt="facility"
                                            src={`${import.meta.env.VITE_FILE_BASE_URL}${facility.imageFile}`}
                                            style={{ width: '100%' }} />
                                    </Box>
                                )}
                                <CardContent>
                                    
                                    
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                        <Button variant="outlined" color="primary"
                                            onClick={() => handleViewDetails(facility)}>
                                            View Details
                                        </Button>
                                        <Button variant="contained" color="secondary">
                                            Check Availability
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Modal for Facility Details */}
            <Modal
                open={!!selectedFacility}
                onClose={handleCloseModal}
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                <Box sx={{
                    backgroundColor: 'white', p: 4, width: 500, maxWidth: '100%',
                    boxShadow: 24, borderRadius: 2, position: 'relative'
                }}>
                    <IconButton
                        sx={{ position: 'absolute', top: 8, right: 8 }}
                        onClick={handleCloseModal}
                    >
                        <Close />
                    </IconButton>
                    {selectedFacility && (
                        <>
                            <Typography variant="h4" sx={{ mb: 2 }}>
                                {selectedFacility.name}
                            </Typography>
                            {selectedFacility.imageFile && (
                                <Box className="aspect-ratio-container" sx={{ mb: 2 }}>
                                    <img alt="facility"
                                        src={`${import.meta.env.VITE_FILE_BASE_URL}${selectedFacility.imageFile}`}
                                        style={{ width: '100%' }} />
                                </Box>
                            )}
                            <Typography sx={{ whiteSpace: 'pre-wrap', mb: 2 }}>
                                {selectedFacility.description}
                            </Typography>
                            <Typography sx={{ fontWeight: 'bold', mb: 1 }}>
                                Location: {selectedFacility.location}
                            </Typography>
                            <Typography sx={{ fontWeight: 'bold', mb: 1 }}>
                                Facility Type: {selectedFacility.facilityType}
                            </Typography>
                        </>
                    )}
                </Box>
            </Modal>
        </Box>
    );
}

export default UserFacilities;
