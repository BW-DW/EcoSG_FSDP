import React, { useContext, useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserContext from '../contexts/UserContext';
import ReCAPTCHA from "react-google-recaptcha";

function Login() {
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(false);
    const [showRecaptcha, setShowRecaptcha] = useState(false);
    const [recaptchaToken, setRecaptchaToken] = useState("");
    const [incorrectAttempts, setIncorrectAttempts] = useState(0);
    const [is2FARequired, setIs2FARequired] = useState(false);
    const [twoFACode, setTwoFACode] = useState(""); // New state for 2FA code
    const [email, setEmail] = useState(""); // Store email for 2FA submission

    const handleRecaptchaChange = (token) => {
        setRecaptchaToken(token);
    };

    const notifyLogin = async (userId) => {
        try {
            await http.post("/user/notify-login", { userId });
            toast.success('Login notification sent!');
        } catch (err) {
            toast.error('Failed to send login notification');
        }
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
            data.recaptchaToken = recaptchaToken;
            data.incorrectAttempts = incorrectAttempts;

            http.post("/user/login", data)
                .then((res) => {
                    if (res.data.twoFANeeded) {
                        setIs2FARequired(true);
                        setEmail(data.email); // Store email for 2FA submission
                        toast.info('2FA code sent to your email. Please enter the code.');
                    } else {
                        localStorage.setItem("accessToken", res.data.accessToken);
                        setUser(res.data.user);
                        toast.success('Login successful!');
                        notifyLogin(res.data.user.id);
                        navigate("/");
                    }
                })
                .catch(function (err) {
                    setIncorrectAttempts(prev => prev + 1);
                    if (incorrectAttempts >= 0) setShowRecaptcha(true);
                    const errorMessage = Array.isArray(err.response.data.message)
                        ? err.response.data.message.join(', ')
                        : err.response.data.message;
                    toast.error(errorMessage);
                })
                .finally(() => setIsLoading(false));
        }
    });

    const handle2FASubmit = () => {
        setIsLoading(true);
        http.post("/user/verify-2fa", { email, twoFACode })
            .then((res) => {
                localStorage.setItem("accessToken", res.data.accessToken);
                setUser(res.data.user);
                toast.success('Login successful!');
                notifyLogin(res.data.user.id);
                navigate("/");
            })
            .catch(function (err) {
                toast.error('Invalid 2FA code. Please try again.');
            })
            .finally(() => setIsLoading(false));
    };

    return (
        <Box sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <Typography variant="h5" sx={{ my: 2 }}>
                {is2FARequired ? 'Enter 2FA Code' : 'Login'}
            </Typography>
            {!is2FARequired ? (
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
                            sitekey="6LfbKSQqAAAAAFXdxb9hN5dQYW_XkmmflREUQc_p"
                            onChange={handleRecaptchaChange}
                        />
                    )}
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{ mt: 2 }}
                        type="submit"
                        disabled={isLoading || (showRecaptcha && !recaptchaToken)}
                    >
                        {isLoading ? 'Loading...' : 'Login'}
                    </Button>
                </Box>
            ) : (
                <Box sx={{ maxWidth: '500px' }}>
                    <TextField
                        fullWidth margin="dense" autoComplete="off"
                        label="2FA Code"
                        value={twoFACode}
                        onChange={(e) => setTwoFACode(e.target.value)}
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{ mt: 2 }}
                        onClick={handle2FASubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Verifying...' : 'Verify 2FA'}
                    </Button>
                </Box>
            )}

            {!is2FARequired && (
                <Button
                    variant="text"
                    sx={{ mt: 2 }}
                    onClick={() => navigate("/forgetpassword")}
                >
                    Forgot Password?
                </Button>
            )}

            <ToastContainer />
        </Box>
    );
}

export default Login;