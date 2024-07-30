import React, { useEffect, useState, useContext } from 'react';
import { Box, Typography, Input, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Select, MenuItem } from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import http from '../http'; // Ensure this is pointing to your axios instance
import UserContext from '../contexts/UserContext';

function UserTable() {
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState('');
    const [order, setOrder] = useState('descending');
    const [search, setSearch] = useState('');
    const { user } = useContext(UserContext);

    const fetchUsers = async () => {
        try {
            const response = await http.get('/user', {
                params: {
                    search,
                }
            });
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [search, filter, order]);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const handleOrderChange = (e) => {
        setOrder(e.target.value);
    };

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const filteredUsers = users
        .filter(user => user.name.toLowerCase().includes(search.toLowerCase()))
        .filter(user => (filter ? user.role.toLowerCase() === filter : true))
        .sort((a, b) => order === 'ascending' ? a.id - b.id : b.id - a.id);

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            fetchUsers();
        }
    };

    const handleClickSearch = () => {
        fetchUsers();
    };

    const handleClickClear = () => {
        setSearch('');
        fetchUsers();
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                User Database
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Select value={filter} onChange={handleFilterChange} displayEmpty>
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="staff">Staff</MenuItem>
                    <MenuItem value="customer">Customer</MenuItem>
                </Select>
                <Box sx={{ mx: 2 }}>
                    Order:
                    <Select value={order} onChange={handleOrderChange} displayEmpty>
                        <MenuItem value="ascending">Ascending</MenuItem>
                        <MenuItem value="descending">Descending</MenuItem>
                    </Select>
                </Box>
                <Input value={search} placeholder="Search"
                    onChange={handleSearchChange}
                    onKeyDown={handleSearchKeyDown} />
                <IconButton color="primary"
                    onClick={handleClickSearch}>
                    <Search />
                </IconButton>
                <IconButton color="primary"
                    onClick={handleClickClear}>
                    <Clear />
                </IconButton>
            </Box>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Points</TableCell>
                        <TableCell>Hours</TableCell>
                        <TableCell>Total Events</TableCell>
                        <TableCell>Donate($)</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredUsers.map(user => (
                        <TableRow key={user.id}>
                            <TableCell>{user.id}</TableCell>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell>{user.status}</TableCell>
                            <TableCell>{user.points !== null ? user.points : 'Null'}</TableCell>
                            <TableCell>{user.hours}</TableCell>
                            <TableCell>{user.totalEvents}</TableCell>
                            <TableCell>{user.donate !== null ? user.donate : 'Null'}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Box>
    );
}

export default UserTable;