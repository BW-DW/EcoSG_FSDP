import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';

function AddAnnouncement() {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            subject: "",
            type: "default",
            description: "",
            for: "customer"
        },
        validationSchema: yup.object({
            subject: yup.string().trim()
                .min(3, 'Subject must be at least 3 characters')
                .max(100, 'Subject must be at most 100 characters')
                .required('Subject is required'),
            type: yup.string().oneOf(['default', 'important', 'urgent']).required('Type is required'),
            description: yup.string().trim()
                .min(3, 'Description must be at least 3 characters')
                .required('Description is required'),
            for: yup.string().oneOf(['staff', 'customer']).required('For field is required')
        }),
        onSubmit: (data) => {
            data.subject = data.subject.trim();
            data.description = data.description.trim();
            http.post("/announcement", data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/announcements");
                });
        }
    });

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Add Announcement
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <TextField
                    fullWidth margin="dense" autoComplete="off"
                    label="Subject"
                    name="subject"
                    value={formik.values.subject}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.subject && Boolean(formik.errors.subject)}
                    helperText={formik.touched.subject && formik.errors.subject}
                />
                <FormControl fullWidth margin="dense">
                    <InputLabel id="type-label">Type</InputLabel>
                    <Select
                        labelId="type-label"
                        id="type"
                        name="type"
                        value={formik.values.type}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.type && Boolean(formik.errors.type)}
                    >
                        <MenuItem value="default">Default</MenuItem>
                        <MenuItem value="important">Important</MenuItem>
                        <MenuItem value="urgent">Urgent</MenuItem>
                    </Select>
                </FormControl>
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
                <FormControl fullWidth margin="dense">
                    <InputLabel id="for-label">For</InputLabel>
                    <Select
                        labelId="for-label"
                        id="for"
                        name="for"
                        value={formik.values.for}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.for && Boolean(formik.errors.for)}
                    >
                        <MenuItem value="staff">Staff</MenuItem>
                        <MenuItem value="customer">Customer</MenuItem>
                    </Select>
                </FormControl>
                <Box sx={{ mt: 2 }}>
                    <Button variant="contained" type="submit">
                        Add
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

export default AddAnnouncement;