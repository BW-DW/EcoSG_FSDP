import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Switch} from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, FormControlLabel,FormControl } from '@mui/material';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';

function EditReward() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [reward, setReward] = useState({
        title: "",
        description: "",
        points: "",
        isEnabled: true,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        http.get(`/reward/${id}`).then((res) => {
            setReward(res.data);
            setLoading(false);
        });
    }, []);

    const formik = useFormik({
        initialValues: reward,
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
            points: yup.number().integer()
                .typeError('Points must be a number')
                .min(1, 'Points must be at least 1')
                .max(100, 'Points must be at most 100')
                .required('Points is required'),
            isEnabled: yup.boolean(),
        }),
        onSubmit: (data) => {
            data.title = data.title.trim();
            data.description = data.description.trim();
            data.points=data.points;
            data.isEnabled = data.isEnabled;
            http.put(`/reward/${id}`, data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/rewards");
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

    const deleteReward = () => {
        http.delete(`/reward/${id}`)
            .then((res) => {
                console.log(res.data);
                navigate("/rewards");
            });
    }

    return (
        <Box>
            <Typography variant="h5" margin={2}>
                Edit Reward
            </Typography>
            {
                !loading && (
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
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                        <FormControl sx={{ml: 2 }}>
                            <FormControlLabel
                                control={
                                    <Switch
                                    checked={formik.values.isEnabled}
                                    onChange={formik.handleChange}
                                    name="isEnabled"
                                    />
                                }
                                label="Enable for customers"
                            />
                        </FormControl>
                        </Box>
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
                    Delete Reward
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this reward?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="inherit"
                        onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error"
                        onClick={deleteReward}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default EditReward;