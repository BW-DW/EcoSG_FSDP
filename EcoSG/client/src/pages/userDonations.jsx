import React, { useEffect, useState, useContext } from 'react';
import {
    Box,
    Typography,
    Input,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Select,
    MenuItem,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';
import { Search, Clear, Edit, Delete } from '@mui/icons-material';
import http from '../http'; // Your axios instance
import UserContext from '../contexts/UserContext';
import EditDialog from '../components/EditDialog';

function UserDonation() {
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

    // Function to fetch users based on search, filter, and order
    const fetchUsers = async () => {
        try {
            const response = await http.get('/user', {
                params: {
                    search,
                    filter,
                    order,
                },
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    // UseEffect to fetch users whenever search, filter, or order changes
    useEffect(() => {
        fetchUsers();
    }, [search, filter, order]);

    // Handle search input changes
    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    // Handle order selection changes
    const handleOrderChange = (e) => {
        setOrder(e.target.value);
    };

    // Handle filter selection changes
    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    // Open the dialog to edit a specific field for a user
    const handleDialogOpen = (field, user) => {
        setFieldToEdit(field);
        setCurrentUser(user);
        setDialogOpen(true);
    };

    // Close the edit dialog
    const handleDialogClose = () => {
        setDialogOpen(false);
        setFieldToEdit('');
        setCurrentUser(null);
    };

    // Save changes made in the dialog
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
        } catch (err) {
            console.error('Error updating user:', err);
        }
    };

    // Open the confirm delete dialog
    const handleConfirmDialogOpen = (user) => {
        setUserToDelete(user);
        setConfirmDialogOpen(true);
    };

    // Close the confirm delete dialog
    const handleConfirmDialogClose = () => {
        setConfirmDialogOpen(false);
        setUserToDelete(null);
    };

    // Delete the user
    const handleDelete = async () => {
        try {
            await http.delete(`/user/${userToDelete.id}`);
            fetchUsers();
            setConfirmDialogOpen(false);
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                User Database
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {/* Filter Dropdown */}
                <Select value={filter} onChange={handleFilterChange} displayEmpty>
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="staff">Staff</MenuItem>
                    <MenuItem value="customer">Customer</MenuItem>
                </Select>

                {/* Order Dropdown */}
                <Box sx={{ mx: 2 }}>
                    Order:
                    <Select value={order} onChange={handleOrderChange} displayEmpty>
                        <MenuItem value="ascending">Ascending (ID)</MenuItem>
                        <MenuItem value="descending">Descending (ID)</MenuItem>
                    </Select>
                </Box>

                {/* Search Input */}
                <Input
                    value={search}
                    placeholder="Search"
                    onChange={handleSearchChange}
                    onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
                />

                {/* Search and Clear Buttons */}
                <IconButton color="primary" onClick={fetchUsers}>
                    <Search />
                </IconButton>
                <IconButton
                    color="primary"
                    onClick={() => {
                        setSearch('');
                        fetchUsers();
                    }}
                >
                    <Clear />
                </IconButton>
            </Box>

            {/* Users Table */}
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Date of Birth (DoB)</TableCell>
                        <TableCell>Points</TableCell>
                        <TableCell>Hours</TableCell>
                        <TableCell>Total Events</TableCell>
                        <TableCell>Donate($)</TableCell>
                        <TableCell>Created At</TableCell>
                        <TableCell>Last Updated</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.id}</TableCell>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.dob}</TableCell>
                            <TableCell>{user.points !== null ? user.points : 'Null'}</TableCell>
                            <TableCell>{user.hours}</TableCell>
                            <TableCell>{user.totalEvents}</TableCell>
                            <TableCell>{user.donate !== null ? user.donate : 'Null'}</TableCell>
                            <TableCell>{new Date(user.createdAt).toLocaleString()}</TableCell>
                            <TableCell>{new Date(user.updatedAt).toLocaleString()}</TableCell>
                            <TableCell>
                                <IconButton color="primary" onClick={() => handleDialogOpen('name', user)}>
                                    <Edit />
                                </IconButton>
                                <IconButton color="error" onClick={() => handleConfirmDialogOpen(user)}>
                                    <Delete />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Edit Dialog */}
            <EditDialog
                open={dialogOpen}
                handleClose={handleDialogClose}
                field={fieldToEdit}
                handleSave={handleSave}
                initialValue={currentUser?.[fieldToEdit]}
            />

            {/* Confirm Delete Dialog */}
            <Dialog open={confirmDialogOpen} onClose={handleConfirmDialogClose}>
                <DialogTitle>Confirm User Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this user? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default UserDonation;