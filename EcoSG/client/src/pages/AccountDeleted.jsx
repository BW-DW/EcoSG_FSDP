import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function AccountDeleted() {
    return (
        <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ my: 2 }}>
                Account Deleted
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
                Your account has been successfully deleted.
            </Typography>
            <Button variant="contained" color="primary" component={Link} to="/Register">
                Return to Home
            </Button>
        </Box>
    );
}

export default AccountDeleted;