import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, MenuItem, Select, InputLabel, FormControl, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';

function CreateEvent() {
    const [open, setOpen] = useState(false);
    const [eventName, setEventName] = useState('');
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            type: '',
            title: '',
            organisers: '',
            status: 'Upcoming',
            date: '',
            time: '',
            location: '',
            maxPax: '',
            facilities: '',
            manpower: '',
            description: ''
        },
        validationSchema: yup.object({
            type: yup.string().required('Type is required'),
            title: yup.string().trim()
                .min(3, 'Title must be at least 3 characters')
                .max(100, 'Title must be at most 100 characters')
                .required('Title is required'),
            organisers: yup.string().required('Organiser(s) name is required'),
            status: yup.string().required('Status is required'),
            date: yup.date().required('Date is required'),
            time: yup.string().required('Time is required'),
            location: yup.string().required('Location is required'),
            maxPax: yup.number().required('Max Pax is required'),
            facilities: yup.string().required('Facilities available is required'),
            manpower: yup.number().required('Manpower needed is required'),
            description: yup.string().trim()
                .min(3, 'Description must be at least 3 characters')
                .max(500, 'Description must be at most 500 characters')
                .required('Description is required')
        }),
        onSubmit: (data) => {
            data.title = data.title.trim();
            data.description = data.description.trim();
            http.post("/event", data)
                .then((res) => {
                    setEventName(data.title);
                    setOpen(true);
                });
        }
    });

    const handleClose = () => {
        setOpen(false);
        navigate('/events');
    };

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h4" sx={{ mb: 4 }}>
                What event would you like to create?
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <Box sx={{ mb: 4 }}>
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Type</InputLabel>
                        <Select
                            label="Type"
                            name="type"
                            value={formik.values.type}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.type && Boolean(formik.errors.type)}
                        >
                            <MenuItem value="Physical Activity">Physical Activity</MenuItem>
                            <MenuItem value="Workshop">Workshop</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" sx={{ mb: 2 }}>
                        Event Details
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth margin="dense" autoComplete="off"
                                label="Event Title"
                                name="title"
                                value={formik.values.title}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.title && Boolean(formik.errors.title)}
                                helperText={formik.touched.title && formik.errors.title}
                            />
                            <TextField
                                fullWidth margin="dense" autoComplete="off"
                                label="Organiser(s)' Name"
                                name="organisers"
                                value={formik.values.organisers}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.organisers && Boolean(formik.errors.organisers)}
                                helperText={formik.touched.organisers && formik.errors.organisers}
                            />
                            <FormControl fullWidth margin="dense">
                                <InputLabel>Status</InputLabel>
                                <Select
                                    label="Status"
                                    name="status"
                                    value={formik.values.status}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.status && Boolean(formik.errors.status)}
                                    disabled // Make it read-only
                                >
                                    <MenuItem value="Upcoming">Upcoming</MenuItem>
                                </Select>
                            </FormControl>
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
                            <TextField
                                fullWidth margin="dense" autoComplete="off"
                                label="Location"
                                name="location"
                                value={formik.values.location}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.location && Boolean(formik.errors.location)}
                                helperText={formik.touched.location && formik.errors.location}
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
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth margin="dense" autoComplete="off"
                                label="Facilities Available"
                                name="facilities"
                                value={formik.values.facilities}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.facilities && Boolean(formik.errors.facilities)}
                                helperText={formik.touched.facilities && formik.errors.facilities}
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
                            <TextField
                                fullWidth margin="dense" autoComplete="off"
                                multiline minRows={4}
                                label="Description"
                                name="description"
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.description && Boolean(formik.errors.description)}
                                helperText={formik.touched.description && formik.errors.description}
                            />
                        </Grid>
                    </Grid>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="contained" type="submit">
                        Create
                    </Button>
                </Box>
            </Box>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Congratulations"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        You have successfully created "{eventName}"
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} autoFocus>
                        Continue
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default CreateEvent;
