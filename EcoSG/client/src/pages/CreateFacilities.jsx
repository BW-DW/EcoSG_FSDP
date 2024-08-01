import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid , FormControl, InputLabel, Select, MenuItem} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const locations = ["Central", "North", "South", "East", "West"];
const facilityTypes = ["Court", "Multi-purpose Hall", "Park"];
function CreateFacilities() {
    const navigate = useNavigate();
    const [imageFile, setImageFile] = useState(null);

    const formik = useFormik({
        initialValues: {
            name: "",
            description: "",
            location: "", // New initial value
            facilityType: "" // New initial value
        },
        validationSchema: yup.object({
            name: yup.string().trim()
                .min(3, 'Name must be at least 3 characters')
                .max(100, 'Name must be at most 100 characters')
                .required('Name is required'),
            description: yup.string().trim()
                .min(3, 'Description must be at least 3 characters')
                .max(500, 'Description must be at most 500 characters')
                .required('Description is required'),
                location: yup.string().required('Location is required'), // New validation
                facilityType: yup.string().required('Facility Type is required') // New validation
        }),
        onSubmit: (data) => {
            if (imageFile) {
                data.imageFile = imageFile;
            }
            data.name = data.name.trim();
            data.description = data.description.trim();
            
            console.log('Submitting data:', data);  // Log the data being sent
            
            http.post("/facilities", data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/facilities");
                })
                .catch((error) => {
                    console.error('There was an error!', error.response);
                    toast.error('Failed to create facility');
                });
        }
    });

    const onFileChange = (e) => {
        let file = e.target.files[0];
        if (file) {
            if (file.size > 1024 * 1024) {
                toast.error('Maximum file size is 1MB');
                return;
            }

            let formData = new FormData();
            formData.append('file', file);
            
            console.log('Uploading file:', file);  // Log the file being uploaded
            
            http.post('/file/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then((res) => {
                    console.log('File uploaded successfully:', res.data);
                    setImageFile(res.data.filename);
                })
                .catch((error) => {
                    console.error('File upload error!', error.response);
                    toast.error('Failed to upload file');
                });
        }
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Create Facility
            </Typography>
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
                        {/* New fields for Location and Facility Type */}
                        <FormControl fullWidth margin="dense">
                            <InputLabel id="location-label">Location</InputLabel>
                            <Select
                                labelId="location-label"
                                name="location"
                                value={formik.values.location}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.location && Boolean(formik.errors.location)}
                            >
                                {locations.map((location) => (
                                    <MenuItem key={location} value={location}>
                                        {location}
                                    </MenuItem>
                                ))}
                            </Select>
                            {formik.touched.location && formik.errors.location && (
                                <Typography color="error">{formik.errors.location}</Typography>
                            )}
                        </FormControl>
                        <FormControl fullWidth margin="dense">
                            <InputLabel id="facility-type-label">Facility Type</InputLabel>
                            <Select
                                labelId="facility-type-label"
                                name="facilityType"
                                value={formik.values.facilityType}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.facilityType && Boolean(formik.errors.facilityType)}
                            >
                                {facilityTypes.map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </Select>
                            {formik.touched.facilityType && formik.errors.facilityType && (
                                <Typography color="error">{formik.errors.facilityType}</Typography>
                            )}
                        </FormControl>
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
                                        <img alt="facility"
                                            src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`}>
                                        </img>
                                    </Box>
                                )
                            }
                        </Box>
                    </Grid>
                </Grid>
                <Box sx={{ mt: 2 }}>
                    <Button variant="contained" type="submit">
                        Add
                    </Button>
                </Box>
            </Box>

            <ToastContainer />
        </Box>
    );
}

export default CreateFacilities;
