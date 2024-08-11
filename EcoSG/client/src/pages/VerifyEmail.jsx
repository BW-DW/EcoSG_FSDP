import React, { useState, useContext, useEffect } from 'react';
import { Box, Button, TextField, Typography, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import http from '../http';
import UserContext from '../contexts/UserContext';
import { ToastContainer, toast } from 'react-toastify';

function VerifyEmail() {
    const [code, setCode] = useState('');
    const { user, setUser } = useContext(UserContext);
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.verified) {
            setIsCodeSent(true);
        }
    }, [user]);

    const handleSendCode = async () => {
        setLoading(true); // Start loading
        try {
            const response = await http.post('/send-verification-code', { userId: user.id });
            if (response.data.success) {
                toast.success('Verification code sent to your email!');
                setIsCodeSent(true);
            } else {
                toast.error('Failed to send verification code.');
            }
        } catch (error) {
            toast.error('Error sending verification code.');
        } finally {
            setTimeout(() => {
                setLoading(false); // Stop loading after 5 seconds
            }, 5000);
        }
    };

    const handleVerify = async () => {
        try {
            const response = await http.post('/verify-email', { userId: user.id, code });
            if (response.data.success) {
                setUser({ ...user, verified: true });
                toast.success('Email verified successfully!');
            } else {
                toast.error('Invalid verification code.');
            }
        } catch (error) {
            toast.error('Error verifying email.');
        }
    };

    const handleReturnToHomepage = () => {
        navigate('/');
    };

    return (
        <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {user?.verified ? (
                <>
                    <Typography variant="h5" sx={{ my: 2 }}>Your email has been verified!</Typography>
                    <Button variant="contained" color="primary" onClick={handleReturnToHomepage}>
                        Return to Homepage
                    </Button>
                </>
            ) : (
                <>
                    <Typography variant="h5" sx={{ my: 2 }}>Verify Your Email</Typography>
                    {!isCodeSent ? (
                        <>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSendCode}
                                sx={{ mb: 2 }}
                                disabled={loading} // Disable button while loading
                            >
                                {loading ? <CircularProgress size={24} /> : 'Send Verification Code'}
                            </Button>
                        </>
                    ) : (
                        <>
                            <TextField
                                label="Verification Code"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                sx={{ mb: 2 }}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleVerify}
                                sx={{ mb: 2 }}
                            >
                                Verify
                            </Button>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={handleSendCode}
                                disabled={loading} // Disable button while loading
                            >
                                {loading ? <CircularProgress size={24} /> : 'Resend Verification Code'}
                            </Button>
                        </>
                    )}
                </>
            )}
            <ToastContainer />
        </Box>
    );
}

export default VerifyEmail;