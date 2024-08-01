import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';

function EditAnnouncement() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [announcement, setAnnouncement] = useState({
        subject: "",
        type: "default",
        description: "",
        for: "customer"
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        http.get(`/announcement/${id}`).then((res) => {
            setAnnouncement(res.data);
            setLoading(false);
        });
    }, [id]);

    const formik = useFormik({
        initialValues: announcement,
        enableReinitialize: true,
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
            http.put(`/announcement/${id}`, data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/announcements");
                });
        }
    });

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const deleteAnnouncement = () => {
        http.delete(`/announcement/${id}`).then((res) => {
            navigate("/announcements");
        });
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Edit Announcement
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
                        Update
                    </Button>
                    <Button color="error" sx={{ ml: 2 }}
                        onClick={handleClickOpen}>
                        Delete
                    </Button>
                </Box>
            </Box>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this announcement? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={deleteAnnouncement} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default EditAnnouncement;