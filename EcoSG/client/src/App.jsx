import './App.css';
import React, { useState, useEffect } from 'react';
// import { useState, useEffect } from 'react';
import { Container, AppBar, Toolbar, Typography, Box, Button, Menu, MenuItem } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import MyTheme from './themes/MyTheme';
import Tutorials from './pages/Tutorials';
import AddTutorial from './pages/AddTutorial';
import EditTutorial from './pages/EditTutorial';
import MyForm from './pages/MyForm';
import Register from './pages/Register';
import Login from './pages/Login';
import AccountSettings from './pages/AccountSettings'; // Import the AccountSettings component
import AccountDeleted from './pages/AccountDeleted'; // Import the AccountDeleted component
import UserTable from './pages/UserTable'; // Import the UserTable component
import http from './http';
import UserContext from './contexts/UserContext';
import ProtectedRoute from './components/ProtectedRoute';
import Donations from './pages/Donations';
import Makedon from './pages/makeDon';
import Viewdon from './pages/viewDonations';
import Updatedon from './pages/updateDonations';
import Checkout from './pages/checkout';
import ReceiptPage from './pages/receipt';
import UserDonation from './pages/userDonation';
import Viewdonstaff from './pages/viewDonStaff';

function App() {
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      http.get('/user/auth').then((res) => {
        setUser(res.data.user);
      });
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location = "/";
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAccountSettings = () => {
    window.location = "/account";
  };

  const handleDeleteAccount = () => {
    window.location = "/AccountDeleted"
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <ThemeProvider theme={MyTheme}>
          <AppBar position="static" className="AppBar">
            <Container>
              <Toolbar disableGutters={true}>
                <Link to="/">
                  <Typography variant="h6" component="div">
                    EcoSG
                  </Typography>
                </Link>
                <Link to="/tutorials" ><Typography>Tutorials</Typography></Link>
                {user && user.role === 'staff' && (
                  <Link to="/users" style={{ textDecoration: 'none' }}><Typography>Users</Typography></Link>
                )}
                {user && user.role === 'staff' && (
                  <Link to="/userdonations" style={{ textDecoration: 'none' }}><Typography>Users' Donations</Typography></Link>
                )}
                {user && user.role === 'customer' && (
                  <Link to="/donations" style={{ textDecoration: 'none' }}><Typography>Make a Donation</Typography></Link>
                )}
                {user && user.role === 'customer' && (
                  <Link to="/viewdonations" style={{ textDecoration: 'none' }}><Typography>View Current Donations</Typography></Link>
                )}
                <Box sx={{ flexGrow: 1 }}></Box>
                {user && (
                  <>
                    <Typography onClick={handleMenuOpen} style={{ cursor: 'pointer' }}>
                      {user.name}
                    </Typography>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                    >
                      <MenuItem onClick={handleAccountSettings}>Account Settings</MenuItem>
                      <MenuItem onClick={logout}>Logout</MenuItem>
                    </Menu>
                  </>
                )}
                {!user && (
                  <>
                    <Link to="/register" ><Typography>Register</Typography></Link>
                    <Link to="/login" ><Typography>Login</Typography></Link>
                  </>
                )}
              </Toolbar>
            </Container>
          </AppBar>

          <Container>
            <Routes>
              <Route path="/" element={<Tutorials />} />
              <Route path="/tutorials" element={<Tutorials />} />
              <Route path="/addtutorial" element={<AddTutorial />} />
              <Route path="/edittutorial/:id" element={<EditTutorial />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/account" element={<AccountSettings />} /> 
              <Route path="/accountdeleted" element={<AccountDeleted />} /> 
              <Route path="/form" element={<MyForm />} />
              <Route path="/donations" element={<Donations />} />
              <Route path="/makedonations" element={<Makedon />} />
              <Route path="/makedonations/:id" element={<Makedon />} />
              <Route path="/viewdonations" element={<Viewdon />} />
              <Route path="/viewdonation/:id" element={<Viewdonstaff />} />
              <Route path="/updatedonations/:id" element={<Updatedon />} />
              <Route path="/checkout/:id" element={<Checkout />} />
              <Route path="/receipt/:id" element={<ReceiptPage />} />
              <Route path="/users" element={
                <ProtectedRoute requiredRole="staff">
                  <UserTable />
                </ProtectedRoute>} 
              /> {/* Add the UserTable route and protected route */}
              <Route path="/userdonations" element={
                <ProtectedRoute requiredRole="staff">
                  <UserDonation />
                </ProtectedRoute>} 
              />
            </Routes>
          </Container>
        </ThemeProvider>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
