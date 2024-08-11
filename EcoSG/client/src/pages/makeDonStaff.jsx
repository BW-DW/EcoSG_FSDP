import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import axios from 'axios';
import UserContext from '../contexts/UserContext';

function Makedonstaff() {
    var amt = "";
    const { id } = useParams();
    const navigate = useNavigate();
    // const { user } = useContext(UserContext);
    // const { user, setUser } = useContext(UserContext);
    const formik = useFormik({
        initialValues: {
            amount: "",
            description: ""
        },
        validationSchema: yup.object({
            amount: yup.string().trim()
            .matches(/^[0-9\b]+$/, 'Amount must be in numbers only')
                .required('Amount is required'),
            description: yup.string().trim()
                .min(3, 'Description must be at least 3 characters')
                .max(500, 'Description must be at most 500 characters')
                .required('Description is required')
        }),
        onSubmit: (data) => {
            amt = data.amount.trim()
            data.amount = parseInt(data.amount.trim());
            data.description = data.description.trim();
            data.userId = parseInt(id)
            http.post("/tutorial", data)
                .then((res) => {
                    console.log(res.data);
                    // // setUser({...user, donations: [...user.donations, data.amount] });
                    navigate(`/checkout/${amt}`);
                });
        }
    });
    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Make a Donation
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <TextField
                    fullWidth margin="dense" autoComplete="off"
                    label="Amount"
                    name="amount"
                    value={formik.values.amount}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.amount && Boolean(formik.errors.amount)}
                    helperText={formik.touched.amount && formik.errors.amount}
                />
                <TextField
                    fullWidth margin="dense" autoComplete="off"
                    multiline minRows={2}
                    label="Description"
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.description && Boolean(formik.errors.description)}
                    helperText={formik.touched.description && formik.errors.description}
                />
                <Box sx={{ mt: 2 }}>
                    <Button variant="contained" type="submit">
                        Donate
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

export default Makedonstaff;