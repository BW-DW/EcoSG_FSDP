import React from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';  // Import DesktopDatePicker
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';  // Import LocalizationProvider


function Register() {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            dob: null  
        },
        validationSchema: yup.object({
            name: yup.string().trim()
                .min(3, 'Name must be at least 3 characters')
                .max(50, 'Name must be at most 50 characters')
                .required('Name is required')
                .matches(/^[a-zA-Z '-,.]+$/,
                    "Name only allow letters, spaces and characters: ' - , ."),
            email: yup.string().trim()
                .email('Enter a valid email')
                .max(50, 'Email must be at most 50 characters')
                .required('Email is required'),
            password: yup.string().trim()
                .min(8, 'Password must be at least 8 characters')
                .max(50, 'Password must be at most 50 characters')
                .required('Password is required')
                .matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/,
                    "Password at least 1 letter and 1 number"),
            confirmPassword: yup.string().trim()
                .required('Confirm password is required')
                .oneOf([yup.ref('password')], 'Passwords must match'),
            dob: yup.date()
                .required('Date of Birth is required')
                .max(new Date(), "Date of Birth cannot be in the future")
                .min("1945-1-1", "Date is too early")
                .typeError('Invalid Date of Birth')
        }),
        onSubmit: (data) => {
            data.name = data.name.trim();
            data.email = data.email.trim().toLowerCase();
            data.password = data.password.trim();
            http.post("/user/register", data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/login");
                })
                .catch(function (err) {
                    toast.error(`${err.response.data.message}`);
                });
        }
    });

    return (

            <Box sx={{
                marginTop: 5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <Typography variant="h5" sx={{ my: 2 }}>
                    Register
                </Typography>
                <Box component="form" sx={{ maxWidth: '400px', width: '100%' }}
                    onSubmit={formik.handleSubmit}>
                    <TextField
                        fullWidth margin="dense" autoComplete="off"
                        label="Name"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                    />
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
                    <TextField
                        fullWidth margin="dense" autoComplete="off"
                        label="Password"
                        name="password" type="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                    />
                    <TextField
                        fullWidth margin="dense" autoComplete="off"
                        label="Confirm Password"
                        name="confirmPassword" type="password"
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                        helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                    />
                    <Box sx={{ display:'flex', justifyContent:'center', width: '100%', mt: 1}}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker 
                                disableFuture
                                format="DD/MM/YYYY"
                                label="Date Of Birth"
                                name="dob"
                                value={formik.values.dob}
                                onChange={(dob) => formik.setFieldValue('dob', dob)}
                                onBlur={() => formik.setFieldTouched('dob', true)}
                                error={formik.touched.dob && Boolean(formik.errors.dob)}
                                slotProps={{
                                    textField: {
                                        error: formik.touched.dob && Boolean(formik.errors.dob),
                                        helperText: formik.touched.dob && formik.errors.dob
                                    }
                                }}
                            />
                        </LocalizationProvider>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <Button variant="contained" type="submit">
                            Register
                        </Button>
                    </Box>
                </Box>

                <ToastContainer />
            </Box>

    );
}

export default Register;