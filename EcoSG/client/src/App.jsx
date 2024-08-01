import './App.css';
import { useState, useEffect } from 'react';
import { Container, AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import MyTheme from './themes/MyTheme';
import Tutorials from './pages/Tutorials';
import AddTutorial from './pages/AddTutorial';
import EditTutorial from './pages/EditTutorial';
import MyForm from './pages/MyForm';
import Register from './pages/Register';
import Login from './pages/Login';
import CreateFacilities from './pages/CreateFacilities';
import EditFacilities from './pages/EditFacilities';
import Facilities from "./pages/Facilities";
import ContactUs from "./pages/ContactUs";
import ContactMessages from "./pages/ContactMessages";
import http from './http';
import UserContext from './contexts/UserContext';
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
                <Link to="/">
                  <Typography variant="h6" component="div">
                    Learning
                  </Typography>
                </Link>
                <Link to="/tutorials" ><Typography>Tutorials</Typography></Link>
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
              <Route path={"/"} element={<Facilities />} />
              <Route path={"/tutorials"} element={<Tutorials />} />
              <Route path={"/addtutorial"} element={<AddTutorial />} />
              <Route path={"/edittutorial/:id"} element={<EditTutorial />} />
              <Route path={"/register"} element={<Register />} />
              <Route path={"/login"} element={<Login />} />
              <Route path={"/form"} element={<MyForm />} />
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
