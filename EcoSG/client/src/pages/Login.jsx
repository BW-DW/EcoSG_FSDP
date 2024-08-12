import React, { useContext, useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserContext from '../contexts/UserContext';
import ReCAPTCHA from "react-google-recaptcha"; // Import reCAPTCHA


function Login() {
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(false);
    const [showRecaptcha, setShowRecaptcha] = useState(false); // Track whether to show reCAPTCHA
    const [recaptchaToken, setRecaptchaToken] = useState(""); // Store the reCAPTCHA token
    const [incorrectAttempts, setIncorrectAttempts] = useState(0); // Track incorrect attempts

    const handleRecaptchaChange = (token) => {
        setRecaptchaToken(token);
    };

    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        validationSchema: yup.object({
            email: yup.string().trim()
                .email('Enter a valid email')
                .max(50, 'Email must be at most 50 characters')
                .required('Email is required'),
            password: yup.string().trim()
                .max(50, 'Password must be at most 50 characters')
                .required('Password is required')
        }),
        onSubmit: (data) => {
            setIsLoading(true);
            data.recaptchaToken = recaptchaToken; // Add reCAPTCHA token to the form data
            data.incorrectAttempts = incorrectAttempts; // Add incorrect attempts to the form data
            http.post("/user/login", data)
                .then((res) => {
                    localStorage.setItem("accessToken", res.data.accessToken);
                    setUser(res.data.user);
                    toast.success('Login successful!');
                    navigate("/");
                })
                .catch(function (err) {
                    setIncorrectAttempts(prev => prev + 1);
                    if (incorrectAttempts >= 0) setShowRecaptcha(true); // Show reCAPTCHA after incorrect attempt
                    const errorMessage = Array.isArray(err.response.data.message)
                        ? err.response.data.message.join(', ')
                        : err.response.data.message;
                    toast.error(errorMessage);
                })
                .finally(() => setIsLoading(false));
        }
    });

    return (
        <Box sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <Typography variant="h5" sx={{ my: 2 }}>
                Login
            </Typography>
            <Box component="form" sx={{ maxWidth: '500px' }}
                onSubmit={formik.handleSubmit}>
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
                {showRecaptcha && (
                    <ReCAPTCHA
                        sitekey="6LfbKSQqAAAAAFXdxb9hN5dQYW_XkmmflREUQc_p" // CHANGE WHEN FREE
                        onChange={handleRecaptchaChange}
                    />
                )}
                <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 2 }}
                    type="submit"
                    disabled={isLoading || (showRecaptcha && !recaptchaToken)} // Disable button until reCAPTCHA is solved
                >
                    {isLoading ? 'Loading...' : 'Login'}
                </Button>
            </Box>

            <Button
                variant="text"
                sx={{ mt: 2 }}
                onClick={() => navigate("/forgetpassword")}
            >
                Forgot Password?
            </Button>

            <ToastContainer />
        </Box>
    );
}

export default Login;