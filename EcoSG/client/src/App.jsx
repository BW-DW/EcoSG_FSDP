import './App.css';
import React, { useState, useEffect } from 'react';
// import { useState, useEffect } from 'react';
import { Container, AppBar, Toolbar, Typography, Box, Button, Menu, MenuItem } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import MyTheme from './themes/MyTheme';
import Rewards from './pages/Rewards';
import AddReward from './pages/AddReward';
import EditReward from './pages/EditReward';
import MyForm from './pages/MyForm';
import Register from './pages/Register';
import Login from './pages/Login';
import AccountSettings from './pages/AccountSettings'; // Import the AccountSettings component
import AccountDeleted from './pages/AccountDeleted'; // Import the AccountDeleted component
import UserTable from './pages/UserTable'; // Import the UserTable component
import UserTableEdit from './pages/UserTableEdit'; // Import UserTableEdit component
import AddAnnouncement from './pages/AddAnnouncement'; // Import AddAnnouncement component
import EditAnnouncement from './pages/EditAnnouncement'; // Import EditAnnouncement component
import Announcements from './pages/Announcements'; // Import Announcements component
import Homepage from './pages/Homepage';
// import AnnouncementStaff from './pages/AnnouncementStaff'; // Import AnnouncementStaff component
import http from './http';
import UserContext from './contexts/UserContext';
import ProtectedRoute from './components/ProtectedRoute';
import CreateFacilities from './pages/CreateFacilities';
import EditFacilities from './pages/EditFacilities';
import Facilities from "./pages/Facilities";
import ContactUs from "./pages/ContactUs";
import ContactMessages from "./pages/ContactMessages";
import UserFacilities from './pages/UserFacilities';
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


  const logout = () => {
    localStorage.clear();
    window.location = "/";
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <ThemeProvider theme={MyTheme}>
          <AppBar position="static" className="AppBar">
            <Container>
              <Toolbar disableGutters={true}>
                <Link to="/"><Typography variant="h6" component="div">EcoSG</Typography></Link>
                <Link to="/rewards" ><Typography>Rewards</Typography></Link>
                {user && user.role === 'staff' && (
                  <Link to="/users" style={{ textDecoration: 'none' }}><Typography>Users</Typography></Link>
                )}
                {user && (
                  <Link to="/announcements" ><Typography>Announcements</Typography></Link>
                )}
                <Link to="/createfacilities" ><Typography>Create Facilities</Typography></Link>
                <Link to="/facilities" ><Typography>Facilities</Typography></Link>
                <Link to="/contactus" ><Typography>Contact Us</Typography></Link>
                <Link to="/contactmessages" ><Typography>Contact Messages</Typography></Link>
                <Link to="/userfacilities" ><Typography>User Facilities</Typography></Link>
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
                )
                }
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
              <Route path="/" element={<Homepage />} />
              <Route path="/rewards" element={<Rewards />} />
              <Route path="/addreward" element={<AddReward />} />
              <Route path="/editreward/:id" element={<EditReward />} />
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
              <Route path="/users/edit/:id" element={
                <ProtectedRoute requiredRole="staff">
                  <UserTableEdit />
                </ProtectedRoute>} /> {/* Add the UserTableEdit route */}
              <Route path="/addannouncement" element={<AddAnnouncement />} />
              <Route path="/editannouncement/:id" element={<EditAnnouncement />} />
              <Route path="/announcements" element={<Announcements />} />
              {/* <Route path="/announcementsstaff" element={<AnnouncementStaff />} /> */}
              <Route path={"/createfacilities"} element={<CreateFacilities />} />
              <Route path={"/editfacilities/:id"} element={<EditFacilities />} />
              <Route path={"/facilities"} element={<Facilities />} />
              <Route path={"/contactus"} element={<ContactUs />} />
              {/* <Route path={"/contactMessages"} element={<ContactMessages />} /> */}
              <Route path={"/contactmessages"} element={<ContactMessages/>}/>
              <Route path={"/userfacilities"} element={<UserFacilities />} />
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
