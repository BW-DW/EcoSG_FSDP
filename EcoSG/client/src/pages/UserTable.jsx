import React, { useEffect, useState, useContext } from 'react';
import { Box, Typography, Input, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Select, MenuItem, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Search, Clear, Edit, Delete } from '@mui/icons-material';
import http from '../http'; // Your axios instance
import UserContext from '../contexts/UserContext';
import EditDialog from '../components/EditDialog';
import { useNavigate } from 'react-router-dom';

function UserTable() {
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState('');
    const [order, setOrder] = useState('ascending');
    const [search, setSearch] = useState('');
    const { user } = useContext(UserContext);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [fieldToEdit, setFieldToEdit] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const navigate = useNavigate();

    const fetchUsers = async () => {
        try {
            const response = await http.get('/user', {
                params: { search, filter, order },
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

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

    const handleDialogOpen = (field, user) => {
        setFieldToEdit(field);
        setCurrentUser(user);
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setFieldToEdit('');
        setCurrentUser(null);
    };

    const handleSave = async (newValue, currentPassword) => {
        const updatedUser = { ...currentUser, [fieldToEdit]: newValue };
        setCurrentUser(updatedUser);

        const updateData = {
            name: updatedUser.name,
            email: updatedUser.email,
            dob: updatedUser.dob,
            password: fieldToEdit === 'password' ? newValue : undefined,
            currentPassword: fieldToEdit === 'password' ? currentPassword : undefined,
        };

        try {
            await http.put(`/user/${currentUser.id}`, updateData);
            fetchUsers();
            handleDialogClose();
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleDeleteUser = async () => {
        if (userToDelete) {
            try {
                await http.delete(`/user/${userToDelete.id}`);
                setConfirmDialogOpen(false);
                setUserToDelete(null);
                fetchUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                User Table
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Input
                        placeholder="Search by name or email"
                        value={search}
                        onChange={handleSearchChange}
                        startAdornment={<Search />}
                        endAdornment={search && <Clear onClick={() => setSearch('')} />}
                    />
                    <Select value={order} onChange={handleOrderChange} sx={{ ml: 2 }}>
                        <MenuItem value="ascending">Ascending</MenuItem>
                        <MenuItem value="descending">Descending</MenuItem>
                    </Select>
                    <Select
                        value={filter}
                        onChange={handleFilterChange}
                        displayEmpty
                        renderValue={(value) => value === '' ? 'All' : value}
                        sx={{ ml: 2 }}
                    >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="staff">Staff</MenuItem>
                        <MenuItem value="customer">Customer</MenuItem>
                    </Select>
                </Box>
            </Box>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Date of Birth</TableCell>
                        <TableCell>Role</TableCell>
                        {/* <TableCell>Points</TableCell>
                        <TableCell>Hours</TableCell>
                        <TableCell>Total Events</TableCell>
                        <TableCell>Donate</TableCell> */}
                        <TableCell>Edit</TableCell>
                        <TableCell>Delete</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.id}</TableCell>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.dob}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            {/* <TableCell>{user.points}</TableCell>
                            <TableCell>{user.hours}</TableCell>
                            <TableCell>{user.totalEvents}</TableCell>
                            <TableCell>{user.donate}</TableCell> */}
                            <TableCell>{user.donation !== null ? user.donation : 'Null'}</TableCell>
                            <TableCell>{new Date(user.createdAt).toLocaleString()}</TableCell>
                            <TableCell>{new Date(user.updatedAt).toLocaleString()}</TableCell>
                            <TableCell>
                                <IconButton onClick={() => navigate(`/users/edit/${user.id}`)}>
                                    <Edit />
                                </IconButton>
                            </TableCell>
                            <TableCell>
                                <IconButton onClick={() => { setConfirmDialogOpen(true); setUserToDelete(user); }}>
                                    <Delete />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <EditDialog open={dialogOpen} onClose={handleDialogClose} onSave={handleSave} field={fieldToEdit} user={currentUser} />
            <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to delete this user?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleDeleteUser} color="secondary">Delete</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default UserTable;