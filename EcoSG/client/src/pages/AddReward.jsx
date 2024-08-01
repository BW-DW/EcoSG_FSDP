import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';

function AddReward() {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            title: "",
            description: "",
            points: "",
        },
        validationSchema: yup.object({
            title: yup.string().trim()
                .min(3, 'Title must be at least 3 characters')
                .max(100, 'Title must be at most 100 characters')
                .required('Title is required'),
            description: yup.string().trim()
                .min(3, 'Description must be at least 3 characters')
                .max(500, 'Description must be at most 500 characters')
                .required('Description is required'),
            points: yup.number().integer()
                .typeError('Points must be a number')
                .min(1, 'Points must be at least 1')
                .max(100, 'Points must be at most 100')
                .required('Points is required'),
        }),
        onSubmit: (data) => {
            data.title = data.title.trim();
            data.description = data.description.trim();
            data.points = data.points;
            http.post("/reward", data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/rewards");
                });
        }
    });

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Add Reward
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <TextField
                    fullWidth margin="dense" autoComplete="off"
                    label="Title"
                    name="title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.title && Boolean(formik.errors.title)}
                    helperText={formik.touched.title && formik.errors.title}
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
                <TextField
                    fullWidth margin="dense" autoComplete="off"
                    multiline maxRows={1}
                    label="Points"
                    name="points"
                    value={formik.values.points}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.points && Boolean(formik.errors.points)}
                    helperText={formik.touched.points && formik.errors.points}
                    sx={{ width: 200 }}
                />
                <Box sx={{ mt: 2 }}>
                    <Button variant="contained" type="submit">
                        Add
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

export default AddReward;