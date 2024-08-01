import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const locations = ["Central", "North", "South", "East", "West"];
const facilityTypes = ["Court", "Multi-purpose Hall", "Park"];

function EditFacility() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [facility, setFacilty] = useState({
        name: "",
        description: "",
        location: "",
        facilityType: ""
    });
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        http.get(`/facilities/${id}`).then((res) => {
            setFacilty(res.data);
            setImageFile(res.data.imageFile);
            setLoading(false);
        });
    }, []);

    const formik = useFormik({
        initialValues: facility,
        enableReinitialize: true,
        validationSchema: yup.object({
            name: yup.string().trim()
                .min(3, 'Name must be at least 3 characters')
                .max(100, 'Name must be at most 100 characters')
                .required('Name is required'),
            description: yup.string().trim()
                .min(3, 'Description must be at least 3 characters')
                .max(500, 'Description must be at most 500 characters')
                .required('Description is required'),
            location: yup.string().required('Location is required'),
            facilityType: yup.string().required('Facility Type is required')
        }),
        onSubmit: (data) => {
            if (imageFile) {
                data.imageFile = imageFile;
            }
            data.name = data.name.trim();
            data.description = data.description.trim();
            http.put(`/facilities/${id}`, data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/facilities");
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

    const deleteFacility = () => {
        http.delete(`/facilities/${id}`)
            .then((res) => {
                console.log(res.data);
                navigate("/facilities");
            });
    }

    const onFileChange = (e) => {
        let file = e.target.files[0];
        if (file) {
            if (file.size > 1024 * 1024) {
                toast.error('Maximum file size is 1MB');
                return;
            }

            let formData = new FormData();
            formData.append('file', file);
            http.post('/file/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then((res) => {
                    setImageFile(res.data.filename);
                })
                .catch(function (error) {
                    console.log(error.response);
                });
        }
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Edit Facility
            </Typography>
            {
                !loading && (
                    <Box component="form" onSubmit={formik.handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6} lg={8}>
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
                                    multiline minRows={2}
                                    label="Description"
                                    name="description"
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.description && Boolean(formik.errors.description)}
                                    helperText={formik.touched.description && formik.errors.description}
                                />
                            </Grid>
                            <Grid item xs={12} md={6} lg={4}>
                                <Box sx={{ textAlign: 'center', mt: 2 }} >
                                    <Button variant="contained" component="label">
                                        Upload Image
                                        <input hidden accept="image/*" multiple type="file"
                                            onChange={onFileChange} />
                                    </Button>
                                    {
                                        imageFile && (
                                            <Box className="aspect-ratio-container" sx={{ mt: 2 }}>
                                                <img alt="facilties"
                                                    src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`}>
                                                </img>
                                            </Box>
                                        )
                                    }
                                </Box>
                            </Grid>
                            <FormControl fullWidth margin="dense">
                                <InputLabel>Location</InputLabel>
                                <Select
                                    name="location"
                                    value={formik.values.location}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.location && Boolean(formik.errors.location)}
                                >
                                    {locations.map((loc) => (
                                        <MenuItem key={loc} value={loc}>{loc}</MenuItem>
                                    ))}
                                </Select>
                                {formik.touched.location && formik.errors.location && (
                                    <Typography color="error">{formik.errors.location}</Typography>
                                )}
                            </FormControl>
                            <FormControl fullWidth margin="dense">
                                <InputLabel>Facility Type</InputLabel>
                                <Select
                                    name="facilityType"
                                    value={formik.values.facilityType}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.facilityType && Boolean(formik.errors.facilityType)}
                                >
                                    {facilityTypes.map((type) => (
                                        <MenuItem key={type} value={type}>{type}</MenuItem>
                                    ))}
                                </Select>
                                {formik.touched.facilityType && formik.errors.facilityType && (
                                    <Typography color="error">{formik.errors.facilityType}</Typography>
                                )}
                            </FormControl>
                        </Grid>
                        <Box sx={{ mt: 2 }}>
                            <Button variant="contained" type="submit">
                                Update
                            </Button>
                            <Button variant="contained" sx={{ ml: 2 }} color="error"
                                onClick={handleOpen}>
                                Delete
                            </Button>
                        </Box>
                    </Box>
                )
            }

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    Delete Facility
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this facility?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="inherit"
                        onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error"
                        onClick={deleteFacility}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <ToastContainer />
        </Box>
    );
}

export default EditFacility;