import './App.css';
import { useState, useEffect } from 'react';
import { Container, AppBar, Toolbar, Typography, Box, Button, Menu, MenuItem } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import MyTheme from './themes/MyTheme';
import CreateEvent from './pages/CreateEvent';
import MyForm from './pages/MyForm';
import Register from './pages/Register';
import Login from './pages/Login';
import Events from './pages/Events';
import EditEvent from './pages/EditEvent';  // Ensure this import is present
import EventDetails from './pages/EventDetails'; // Add this import
import AdminEvents from './pages/AdminEvents'; // Add this import
import AdminEventDetails from './pages/AdminEventDetails'; // Add this import
import CompletedEvents from './pages/CompletedEvents';
import http from './http';
import UserContext from './contexts/UserContext';

function App() {
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [facilityAnchorEl, setFacilityAnchorEl] = useState(null); // For facility dropdown
  const [donationAnchorEl, setDonationAnchorEl] = useState(null); // For donation dropdown
  const open = Boolean(anchorEl);

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
    window.location = "/AccountDeleted"
  }


  const logout = () => {
    localStorage.clear();
    window.location = "/";
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
                <Link to="/announcements" ><Typography>Announcements</Typography></Link>
                {user && user.role === 'staff' && (
                  <Link to="/users" style={{ textDecoration: 'none' }}><Typography>Users</Typography></Link>
                )}
                

                  {/* Facility Dropdown for staff*/ }
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
                  <Link to="/facilities" ><Typography>Facilities</Typography></Link>
                )}

                {user && user.role === 'customer' && (
                  <Link to="/contactus" ><Typography>Contact Us</Typography></Link>
                )}
                {user && user.role === 'staff' && (
                  <Link to="/contactmessages" ><Typography>Contact Messages</Typography></Link>
                )}

                {/* <Link to="/userfacilities" ><Typography>User Facilities</Typography></Link> */}

                {user && user.role === 'staff' && (
                  <Link to="/userdonations" style={{ textDecoration: 'none' }}><Typography>Users' Donations</Typography></Link>
                )}

                {/* Donations Dropdown */}
                {user && user.role === 'customer' &&(
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
                  aria-controls={open ? 'basic-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClick}
                  sx={{ cursor: 'pointer', mr: 2 }}
                >
                  Events
                </Typography>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                >
                  <MenuItem onClick={handleClose}>
                    <Link to="/events" style={{ textDecoration: 'none', color: 'inherit' }}>
                      View Events
                    </Link>
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <Link to="/createevent" style={{ textDecoration: 'none', color: 'inherit' }}>
                      Create Event
                    </Link>
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <Link to="/completedevents" style={{ textDecoration: 'none', color: 'inherit' }}>
                      Completed Events                   
                    </Link>
                  </MenuItem>
                  {user && (
                    <MenuItem onClick={handleClose}>
                      <Link to="/admin/events" style={{ textDecoration: 'none', color: 'inherit' }}>
                        Admin Events
                      </Link>
                    </MenuItem>
                  )}
                </Menu>
                <Box sx={{ flexGrow: 1 }}></Box>

                {user && (
                  <>
                    <Typography>{user.name}</Typography>
                    <Button onClick={logout}>Logout</Button>
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
              <Route path="/" element={<Events />} />
              <Route path="/events" element={<Events />} />
              <Route path="/createevent" element={<CreateEvent />} />
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
              <Route path={"/contactmessages"} element={<ContactMessages />} />
              <Route path={"/userfacilities"} element={<UserFacilities />} />
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
