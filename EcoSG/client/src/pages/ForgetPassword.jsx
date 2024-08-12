import React, { useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function ForgetPassword() {
    const [step, setStep] = useState(1); // Track the current step (1: Enter email, 2: Verify OTP, 3: Reset password)
    const [otp, setOtp] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate(); // Initialize navigate

    const formik = useFormik({
        initialValues: {
            email: "",
            otp: "",
            password: "",
            confirmPassword: "",
        },
        validationSchema: yup.object({
            email: yup.string().trim().email('Enter a valid email').max(50, 'Email must be at most 50 characters').required('Email is required'),
            otp: step === 2 ? yup.string().trim().required('OTP is required') : null,
            password: step === 3 ? yup.string().trim().min(8, 'Password must be at least 8 characters')
                .matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/, "Password must have at least 1 letter and 1 number").required('Password is required') : null,
            confirmPassword: step === 3 ? yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('Confirm Password is required') : null,
        }),
        onSubmit: async (data) => {
            if (step === 1) {
                // Send OTP to the user's email
                try {
                    await http.post('/send-verification-code-pass', { email: data.email });
                    setEmail(data.email);
                    setStep(2); // Move to step 2 (Verify OTP)
                    toast.success('OTP sent to your email.');
                } catch (error) {
                    toast.error('Failed to send OTP.');
                    console.log(error);
                }
            } else if (step === 2) {
                // Verify the OTP
                try {
                    const res = await http.post('/verify-otp', { email, otp: data.otp });
                    if (res.data.success) {
                        setOtp(data.otp);
                        setStep(3); // Move to step 3 (Reset password)
                    } else {
                        toast.error('Invalid OTP.');
                    }
                } catch (error) {
                    toast.error('Failed to verify OTP.');
                }
            } else if (step === 3) {
                // Reset the password
                try {
                    await http.put(`/user/${email}/reset-password`, {
                        otp,
                        password: data.password,
                        confirmPassword: data.confirmPassword
                    });
                    toast.success('Password has been reset successfully.');
                    navigate('/login'); // Redirect to login page
                } catch (error) {
                    toast.error('Failed to reset password.');
                }
            }
        }
    });

    return (
        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ my: 2 }}>
                Forget Password
            </Typography>
            <Box component="form" sx={{ maxWidth: '500px' }} onSubmit={formik.handleSubmit}>
                {step === 1 && (
                    <TextField
                        fullWidth margin="dense" autoComplete="off"
                        label="Email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                    />
                )}
                {step === 2 && (
                    <TextField
                        fullWidth margin="dense" autoComplete="off"
                        label="One-Time Password"
                        name="otp"
                        value={formik.values.otp}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.otp && Boolean(formik.errors.otp)}
                        helperText={formik.touched.otp && formik.errors.otp}
                    />
                )}
                {step === 3 && (
                    <>
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            label="New Password"
                            name="password"
                            type="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                        />
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            value={formik.values.confirmPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                        />
                    </>
                )}
                <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 2 }}
                    type="submit"
                >
                    {step === 1 ? 'Send OTP' : step === 2 ? 'Verify OTP' : 'Reset Password'}
                </Button>
            </Box>
            <ToastContainer />
        </Box>
    );
}

export default ForgetPassword;