import './App.css';
import { useState, useEffect } from 'react';
import { Container, AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
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

function App() {
  const [user, setUser] = useState(null);

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
                <Box sx={{ flexGrow: 1 }}></Box> 
                {user && (
                  <>
                    <Typography>{user.name}</Typography>
                    <Button onClick={logout}>Logout</Button>
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
            </Routes>
          </Container>
        </ThemeProvider>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
