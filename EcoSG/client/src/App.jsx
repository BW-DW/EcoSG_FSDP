import './App.css';
import React, { useState, useEffect } from 'react';
import { Container, AppBar, Toolbar, Typography, Box, Button, Menu, MenuItem } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import MyTheme from './themes/MyTheme';
import Rewards from './pages/Rewards';
import AddReward from './pages/AddReward';
import EditReward from './pages/EditReward';
import CreateEvent from './pages/CreateEvent';
import MyForm from './pages/MyForm';
import Register from './pages/Register';
import Login from './pages/Login';
import AccountSettings from './pages/AccountSettings';
import AccountDeleted from './pages/AccountDeleted';
import UserTable from './pages/UserTable';
import UserTableEdit from './pages/UserTableEdit';
import AddAnnouncement from './pages/AddAnnouncement';
import EditAnnouncement from './pages/EditAnnouncement';
import Announcements from './pages/Announcements';
import Homepage from './pages/Homepage';
import Events from './pages/Events';
import EditEvent from './pages/EditEvent';
import EventDetails from './pages/EventDetails';
import AdminEvents from './pages/AdminEvents';
import AdminEventDetails from './pages/AdminEventDetails';
import CompletedEvents from './pages/CompletedEvents';
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
import VerifyEmail from './pages/VerifyEmail';
import ForgetPassword from './pages/ForgetPassword';

function App() {
  const [user, setUser] = useState(null);
  const [anchorElEvents, setAnchorElEvents] = useState(null);
  const [anchorElAccount, setAnchorElAccount] = useState(null);
  const [facilityAnchorEl, setFacilityAnchorEl] = useState(null);
  const [donationAnchorEl, setDonationAnchorEl] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      http.get('/user/auth').then((res) => {
        setUser(res.data.user);
      });
    }
  }, []);

  const handleEventsMenuOpen = (event) => {
    setAnchorElEvents(event.currentTarget);
  };

  const handleEventsMenuClose = () => {
    setAnchorElEvents(null);
  };

  const handleAccountMenuOpen = (event) => {
    setAnchorElAccount(event.currentTarget);
  };

  const handleAccountMenuClose = () => {
    setAnchorElAccount(null);
  };

  const handleFacilityMenuOpen = (event) => {
    setFacilityAnchorEl(event.currentTarget);
  };

  const handleFacilityMenuClose = () => {
    setFacilityAnchorEl(null);
  };

  const handleDonationMenuOpen = (event) => {
    setDonationAnchorEl(event.currentTarget);
  };

  const handleDonationMenuClose = () => {
    setDonationAnchorEl(null);
  };

  const handleAccountSettings = () => {
    window.location = "/account";
  };

  const handleDeleteAccount = () => {
    window.location = "/AccountDeleted";
  };

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
                <Link to="/rewards"><Typography>Rewards</Typography></Link>
                <Link to="/announcements"><Typography>Announcements</Typography></Link>
                {user && user.role === 'staff' && (
                  <Link to="/users" style={{ textDecoration: 'none' }}><Typography>Users</Typography></Link>
                )}

                {/* Facility Dropdown for staff */}
                {user && user.role === 'staff' && (
                  <>
                    <Typography
                      onClick={handleFacilityMenuOpen}
                      style={{ cursor: 'pointer', marginRight: 16 }}
                    >
                      Facility
                    </Typography>
                    <Menu
                      anchorEl={facilityAnchorEl}
                      open={Boolean(facilityAnchorEl)}
                      onClose={handleFacilityMenuClose}
                    >
                      {user.role === 'staff' && (
                        <MenuItem
                          onClick={() => {
                            handleFacilityMenuClose();
                            window.location = '/createfacilities';
                          }}
                        >
                          Create Facilities
                        </MenuItem>
                      )}
                      <MenuItem
                        onClick={() => {
                          handleFacilityMenuClose();
                          window.location = '/facilities';
                        }}
                      >
                        Facilities
                      </MenuItem>
                    </Menu>
                  </>
                )}

                {user && user.role === 'customer' && (
                  <Link to="/userfacilities"><Typography>Facilities</Typography></Link>
                )}

                {user && user.role === 'customer' && (
                  <Link to="/contactus"><Typography>Contact Us</Typography></Link>
                )}
                {user && user.role === 'staff' && (
                  <Link to="/contactmessages"><Typography>Contact Messages</Typography></Link>
                )}

                {user && user.role === 'staff' && (
                  <Link to="/userdonations" style={{ textDecoration: 'none' }}><Typography>Users' Donations</Typography></Link>
                )}

                {/* Donations Dropdown */}
                {user && user.role === 'customer' && (
                  <>
                    <Typography
                      onClick={handleDonationMenuOpen}
                      style={{ cursor: 'pointer', marginRight: 16 }}
                    >
                      Donations
                    </Typography>
                    <Menu
                      anchorEl={donationAnchorEl}
                      open={Boolean(donationAnchorEl)}
                      onClose={handleDonationMenuClose}
                    >
                      {user.role === 'customer' && (
                        <MenuItem
                          onClick={() => {
                            handleDonationMenuClose();
                            window.location = '/donations';
                          }}
                        >
                          Make a Donation
                        </MenuItem>
                      )}
                      {user.role === 'customer' && (
                        <MenuItem
                          onClick={() => {
                            handleDonationMenuClose();
                            window.location = '/viewdonations';
                          }}
                        >
                          View Current Donations
                        </MenuItem>
                      )}
                      {user.role === 'staff' && (
                        <MenuItem
                          onClick={() => {
                            handleDonationMenuClose();
                            window.location = '/userdonations';
                          }}
                        >
                          Users' Donations
                        </MenuItem>
                      )}
                    </Menu>
                  </>
                )}

                <Typography
                  aria-controls={Boolean(anchorElEvents) ? 'events-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={Boolean(anchorElEvents) ? 'true' : undefined}
                  onClick={handleEventsMenuOpen}
                  sx={{ cursor: 'pointer', mr: 2 }}
                >
                  Events
                </Typography>
                <Menu
                  id="events-menu"
                  anchorEl={anchorElEvents}
                  open={Boolean(anchorElEvents)}
                  onClose={handleEventsMenuClose}
                  MenuListProps={{
                    'aria-labelledby': 'events-button',
                  }}
                >
                  <MenuItem onClick={handleEventsMenuClose}>
                    <Link to="/events" style={{ textDecoration: 'none', color: 'inherit' }}>
                      View Events
                    </Link>
                  </MenuItem>
                  <MenuItem onClick={handleEventsMenuClose}>
                    <Link to="/createevent" style={{ textDecoration: 'none', color: 'inherit' }}>
                      Create Event
                    </Link>
                  </MenuItem>
                  <MenuItem onClick={handleEventsMenuClose}>
                    <Link to="/completedevents" style={{ textDecoration: 'none', color: 'inherit' }}>
                      Completed Events
                    </Link>
                  </MenuItem>
                  {user && (
                    <MenuItem onClick={handleEventsMenuClose}>
                      <Link to="/admin/events" style={{ textDecoration: 'none', color: 'inherit' }}>
                        Admin Events
                      </Link>
                    </MenuItem>
                  )}
                </Menu>

                <Box sx={{ flexGrow: 1 }}></Box>

                {user && (
                  <>
                    <Typography onClick={handleAccountMenuOpen} style={{ cursor: 'pointer' }}>
                      {user.name}
                    </Typography>
                    <Menu
                      anchorEl={anchorElAccount}
                      open={Boolean(anchorElAccount)}
                      onClose={handleAccountMenuClose}
                    >
                      <MenuItem onClick={handleAccountSettings}>Account Settings</MenuItem>
                      <MenuItem onClick={logout}>Logout</MenuItem>
                    </Menu>
                  </>
                )}
                {!user && (
                  <>
                    <Link to="/register"><Typography>Register</Typography></Link>
                    <Link to="/login"><Typography>Login</Typography></Link>
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
              <Route path="/events" element={<Events />} />
              <Route path="/createevent" element={<CreateEvent />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgetpassword" element={<ForgetPassword />} />
              <Route path="/account" element={<AccountSettings />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
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
              />
              <Route path="/users/edit/:id" element={
                <ProtectedRoute requiredRole="staff">
                  <UserTableEdit />
                </ProtectedRoute>} />
              <Route path="/addannouncement" element={<AddAnnouncement />} />
              <Route path="/editannouncement/:id" element={<EditAnnouncement />} />
              <Route path="/announcements" element={<Announcements />} />
              <Route path="/createfacilities" element={<CreateFacilities />} />
              <Route path="/editfacilities/:id" element={<EditFacilities />} />
              <Route path="/facilities" element={<Facilities />} />
              <Route path="/contactus" element={<ContactUs />} />
              <Route path="/contactmessages" element={<ContactMessages />} />
              <Route path="/userfacilities" element={<UserFacilities />} />
              <Route path="/userdonations" element={
                <ProtectedRoute requiredRole="staff">
                  <UserDonation />
                </ProtectedRoute>}
              />
              <Route path="/event/:id" element={<EventDetails />} />
              <Route path="/editevent/:id" element={<EditEvent />} />
              <Route path="/admin/events" element={<AdminEvents />} />
              <Route path="/admin/event/:id" element={<AdminEventDetails />} />
              <Route path="/completedevents" element={<CompletedEvents />} />
            </Routes>
          </Container>
        </ThemeProvider>
      </Router>
    </UserContext.Provider>
  );
}

export default App;