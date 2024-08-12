import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import http from '../http';
import dayjs from 'dayjs';
import UserContext from '../contexts/UserContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditDialog from '../components/EditDialog'; // Import the EditDialog component
import DateFnsUtils from '@date-io/date-fns';


function AccountSettings() {
    const { user, setUser } = useContext(UserContext);
    const [eventsHistory, setEventsHistory] = useState([]);
    const [purchaseHistory, setPurchaseHistory] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [fieldToEdit, setFieldToEdit] = useState('');
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

    const navigate = useNavigate();

    const fetchUserData = async () => {
        try {
            const res = await http.get(`/user/${user.id}`);
            setUser(res.data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchUserData();
            //     http.get(`/user/${user.id}/events`).then((res) => {
            //         setEventsHistory(res.data);
            //     });
            //     http.get(`/user/${user.id}/purchases`).then((res) => {
            //         setPurchaseHistory(res.data);
            //     });
        }
    }, [user]);

    const handleDialogOpen = (field) => {
        setFieldToEdit(field);
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setFieldToEdit('');
    };

    const handleSave = async (newValue, currentPassword) => {
        const updatedUser = {
            ...user,
            [fieldToEdit]: newValue,
            verified: fieldToEdit === 'email' ? false : user.verified
        };
        setUser(updatedUser);

        const updateData = {
            name: updatedUser.name,
            email: updatedUser.email,
            dob: updatedUser.dob,
            password: fieldToEdit === 'password' ? newValue : undefined,
            currentPassword: fieldToEdit === 'password' ? currentPassword : undefined,
            verified: updatedUser.verified
        };

        try {
            await http.put(`/user/${user.id}`, updateData);
            toast.success(`${fieldToEdit} updated successfully`);
            fetchUserData();

            // Notify user of changes
            if (fieldToEdit === 'name') {
                await http.post('/notify-username-change', { userId: user.id, newUsername: newValue });
            } else if (fieldToEdit === 'email') {
                await http.post('/notify-email-change', { userId: user.id, newEmail: newValue });
            } else if (fieldToEdit === 'dob') {
                await http.post('/notify-dob-change', { userId: user.id, newDob: newValue });
            } else if (fieldToEdit === 'password') {
                await http.post('/notify-password-change', { userId: user.id });
            }
        } catch (err) {
            throw new Error(err.response.data.message || 'Error updating field');
        }
    };

    const DeleteAccount = () => {
        http.delete(`/user/${user.id}`).then(() => {
            localStorage.removeItem("accessToken");
            setUser(null);
            toast.success('Account deleted successfully');
            navigate('/accountdeleted');
        }).catch((err) => {
            toast.error(`${err.response.data.message}`);
        });
    };

    const handleConfirmDialogOpen = () => {
        setConfirmDialogOpen(true);
    };

    const handleConfirmDialogClose = () => {
        setConfirmDialogOpen(false);
    };

    return (
        <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ my: 2 }}>
                Account Details
            </Typography>
            <Card sx={{ mb: 4, maxWidth: 600, width: '100%' }}>
                <CardContent>
                    <Typography variant="h6" sx={{ textAlign: 'center', mb: 2 }}>
                        Hello, {user?.name}!
                    </Typography>
                    {/* <Box sx={{ mb: 2, alignItems: 'center', textAlign: 'center'}}>
                        <Typography variant="subtitle1">Events History</Typography>
                        <Grid container spacing={1}>
                            {eventsHistory.map((event) => (
                                <Grid item xs={12} key={event.id}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1, backgroundColor: '#e8f5e9', borderRadius: 1 }}>
                                        <Typography>Role: {event.role}</Typography>
                                        <Typography>{event.title}</Typography>
                                        <Typography>{dayjs(event.date).format('DD MMMM YYYY')}</Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                    <Box sx={{ mb: 2, textAlign: 'center'}}>
                        <Typography variant="subtitle1">Purchase History</Typography>
                        <Grid container spacing={1}>
                            {purchaseHistory.map((purchase) => (
                                <Grid item xs={12} key={purchase.id}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1, backgroundColor: '#e8f5e9', borderRadius: 1 }}>
                                        <Typography>
                                            <Link to={`/showcode/${purchase.id}`}>Show Code</Link>
                                        </Typography>
                                        <Typography>{purchase.title}</Typography>
                                        <Typography>{dayjs(purchase.date).format('DD MMMM YYYY')}</Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Box> */}
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1" sx={{ textAlign: 'center' }}>Personal Details</Typography>
                        <Box sx={{ p: 1, backgroundColor: '#f1f8e9', borderRadius: 1 }}>
                            <Typography>Username: {user?.name} <Button onClick={() => handleDialogOpen('name')}>Edit</Button></Typography>
                            <Typography>Password: <Button onClick={() => handleDialogOpen('password')}>Change Password</Button></Typography>
                            <Typography>Email: {user?.email} <Button onClick={() => handleDialogOpen('email')}>Change Email</Button>
                                {!user?.verified && (
                                    <Box
                                        sx={{
                                            mt: 1,
                                            p: 1,
                                            backgroundColor: '#687864', // Highlighted box color
                                            color: '#ffffff',
                                            borderRadius: 1,
                                            textAlign: 'center',
                                        }}
                                    >
                                        <Typography sx={{ mb: 1 }}>
                                            To enable 2FA and email notifications, please verify your email.
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => navigate('/verify-email')}
                                        >
                                            Verify Email
                                        </Button>
                                    </Box>
                                )}
                            </Typography>
                            <Typography>Date of Birth: {dayjs(user?.dob).format('DD/MM/YYYY')} <Button onClick={() => handleDialogOpen('dob')}>Edit</Button></Typography>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Button variant="contained" color="error" onClick={handleConfirmDialogOpen}>
                            Delete Account
                        </Button>
                    </Box>
                </CardContent>
            </Card>
            <EditDialog
                open={dialogOpen}
                handleClose={handleDialogClose}
                field={fieldToEdit}
                handleSave={handleSave}
                userId={user?.id}
            />

            <Dialog
                open={confirmDialogOpen}
                onClose={handleConfirmDialogClose}
            >
                <DialogTitle>Confirm Account Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete your account? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={DeleteAccount} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            <ToastContainer />
        </Box>
    );
}

export default AccountSettings;