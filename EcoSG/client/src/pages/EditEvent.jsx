import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, MenuItem, Select, InputLabel, FormControl, Grid } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';

function EditEvent() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [event, setEvent] = useState({
        type: "",
        title: "",
        organisers: "",
        status: "Upcoming", // Initialize with "Ongoing"
        date: "",
        time: "",
        location: "",
        maxPax: "",
        facilities: "",
        manpower: "",
        description: ""
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        http.get(`/event/${id}`).then((res) => {
            setEvent(res.data);
            setLoading(false);
        });
    }, [id]);

    const formik = useFormik({
        initialValues: event,
        enableReinitialize: true,
        validationSchema: yup.object({
            title: yup.string().trim()
                .min(3, 'Title must be at least 3 characters')
                .max(100, 'Title must be at most 100 characters')
                .required('Title is required'),
            description: yup.string().trim()
                .min(3, 'Description must be at least 3 characters')
                .max(500, 'Description must be at most 500 characters')
                .required('Description is required'),
            date: yup.date().required('Date is required'),
            time: yup.string().required('Time is required'),
            status: yup.string().required('Status is required')
        }),
        onSubmit: (data) => {
            data.title = data.title.trim();
            data.description = data.description.trim();
            http.put(`/event/${id}`, data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/events");
                });
        }
    });

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const deleteEvent = () => {
        http.delete(`/event/${id}`)
            .then((res) => {
                console.log(res.data);
                navigate("/events");
            });
    };

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
                Edit Event
            </Typography>
            {
                !loading && (
                    <Box component="form" onSubmit={formik.handleSubmit}>
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Event Details
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth margin="dense">
                                        <InputLabel>Type</InputLabel>
                                        <Select
                                            label="Type"
                                            name="type"
                                            value={formik.values.type}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            disabled
                                        >
                                            <MenuItem value="Physical Activity">Physical Activity</MenuItem>
                                            <MenuItem value="Workshop">Workshop</MenuItem>
                                            <MenuItem value="Social Gathering">Social Gathering</MenuItem>
                                        </Select>
                                    </FormControl>
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
                                        type="date"
                                        label="Date"
                                        name="date"
                                        InputLabelProps={{ shrink: true }}
                                        value={formik.values.date}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.date && Boolean(formik.errors.date)}
                                        helperText={formik.touched.date && formik.errors.date}
                                    />
                                    <TextField
                                        fullWidth margin="dense" autoComplete="off"
                                        type="time"
                                        label="Time"
                                        name="time"
                                        InputLabelProps={{ shrink: true }}
                                        value={formik.values.time}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.time && Boolean(formik.errors.time)}
                                        helperText={formik.touched.time && formik.errors.time}
                                    />
                                    <TextField
                                        fullWidth margin="dense" autoComplete="off"
                                        label="Duration in Hours"
                                        name="duration"
                                        value={formik.values.duration}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.duration && Boolean(formik.errors.duration)}
                                        helperText={formik.touched.duration && formik.errors.duration}
                                        inputProps={{ min: 1 }} // Optionally enforce a minimum value
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth margin="dense">
                                        <InputLabel>Status</InputLabel>
                                        <Select
                                            label="Status"
                                            name="status"
                                            value={formik.values.status}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.status && Boolean(formik.errors.status)}
                                        >
                                            <MenuItem value="Ongoing">Upcoming</MenuItem>
                                            <MenuItem value="Ongoing">Ongoing</MenuItem>
                                            <MenuItem value="Completed">Completed</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <TextField
                                        fullWidth margin="dense" autoComplete="off"
                                        label="Location"
                                        name="location"
                                        value={formik.values.location}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        disabled
                                    />
                                    <TextField
                                        fullWidth margin="dense" autoComplete="off"
                                        label="Facilities Available"
                                        name="facilities"
                                        value={formik.values.facilities}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        disabled
                                    />
                                    <TextField
                                        fullWidth margin="dense" autoComplete="off"
                                        label="Max Pax"
                                        name="maxPax"
                                        value={formik.values.maxPax}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.maxPax && Boolean(formik.errors.maxPax)}
                                        helperText={formik.touched.maxPax && formik.errors.maxPax}
                                        inputProps={{ min: 1 }} // Optionally enforce a minimum value
                                    />
                                    <TextField
                                        fullWidth margin="dense" autoComplete="off"
                                        label="Manpower Needed"
                                        name="manpower"
                                        value={formik.values.manpower}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.manpower && Boolean(formik.errors.manpower)}
                                        helperText={formik.touched.manpower && formik.errors.manpower}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                            <Button variant="contained" type="submit">
                                Update
                            </Button>
                            <Button variant="contained" sx={{ ml: 2 }} color="error" onClick={handleOpen}>
                                Delete
                            </Button>
                        </Box>
                    </Box>
                )
            }
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    Delete Event
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this event?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="inherit" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error" onClick={deleteEvent}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default EditEvent;
