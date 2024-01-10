import React from 'react';
import AddLocationAltSharpIcon from '@mui/icons-material/AddLocationAltSharp';
import MuiAppBar from '@mui/material/AppBar';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from "react-router-dom";
import { useUserContext } from '../context/UserContext';
import { useItineraryContext } from '../context/ItineraryContext';
import { Avatar, Button, Container, Divider, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import { Box } from '@mui/material'; // keep this import at last as a workaround for MUI issue
import { useAppBarStateContext } from '../context/AppBarStateContext';
import { TripDetailsForm, UploadProfilePictureForm } from '../components/InputForms';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import SettingsSuggestOutlinedIcon from '@mui/icons-material/SettingsSuggestOutlined';

const logo = "Travel Mate"

const loginModes = { loggedIn:1, loggedOut:2, any:3 }
const pages = [
  { name: "Homepage", route: "/", mode: loginModes.any }, 
  { name: "Profile", route: "/profile", mode: loginModes.loggedIn },
  { name: "Login", route: "/signin", mode: loginModes.loggedOut },
  { name: "Logout", route: "/signout", mode: loginModes.loggedIn },
];

export default function AppBar(props) {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [showUploadForm, setShowUploadForm] = React.useState(false);
    const [showMapSettingsForm, setShowMapSettingsForm] = React.useState(false);
    const navigate = useNavigate();
    const user = useUserContext();
    const itinerary = useItineraryContext();
    const buttonState = useAppBarStateContext();

    function handleOpenNavMenu(event) {
        setAnchorElNav(event.currentTarget);
    }

    function handleCloseNavMenu() {
        setAnchorElNav(null);
    }

    function handleNavButton(route) {
        navigate(route)
    }

    function handleSaveMap() {
      itinerary.saveItinery();
    }

    function handleCreateMap() {
      itinerary.resetItinery();
      navigate("/itinerary");
    }

    function closeUploadProfilePictureForm() {
      setShowUploadForm(false);
    }

    function showUploadProfilePictureForm() {
      setShowUploadForm(true);
    }

    const mode = user.isLoggedIn() ? loginModes.loggedIn : loginModes.loggedOut;
    console.log("login mode: ", mode, user.isLoggedIn(), user, showUploadForm, showMapSettingsForm);

    return (
        <MuiAppBar position="static">
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <AddLocationAltSharpIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
              <Typography
                variant="h6"
                noWrap
                component="a"
                href="#app-bar-with-responsive-menu"
                sx={{
                  mr: 2,
                  display: { xs: 'none', md: 'flex' },
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.3rem',
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                {logo}
              </Typography>
    
              <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: 'block', md: 'none' },
                  }}
                >
                  {pages.map((page) => (
                    // show only the options based on user is logged in or not
                    ((page.mode == loginModes.any) || (page.mode == mode)) ?
                    <MenuItem key={page.name} onClick={()=>handleNavButton(page.route)}>
                      <Typography textAlign="center">{page.name}</Typography>
                    </MenuItem>
                    :
                    null
                  ))}
                </Menu>
              </Box>
              <AddLocationAltSharpIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
              <Typography
                variant="h5"
                noWrap
                component="a"
                href="/"
                sx={{
                  mr: 2,
                  display: { xs: 'flex', md: 'none' },
                  flexGrow: 1,
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.3rem',
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                {logo}
              </Typography>
              <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                {pages.map((page) => (
                  // show only the options based on user is logged in or not
                  ((page.mode == loginModes.any) || (page.mode == mode)) ?
                  <Button
                    key={page.name}
                    onClick={()=>handleNavButton(page.route)}
                    sx={{ my: 2, color: 'white', display: 'block', border:0 }}
                  >
                    {page.name}
                  </Button>
                  :
                  null
                ))}
                <Divider orientation='vertical' variant='middle' flexItem/>
                {
                  (mode == loginModes.loggedIn && buttonState.showSaveMap()) ?
                  <Button sx={{ my: 2, color: 'white', display: 'block', border:0 }}
                    onClick={() => { handleSaveMap() }}
                  >
                    Save Map
                  </Button>
                  :
                  null
                }

                {
                  (mode == loginModes.loggedIn && buttonState.showCreateMap()) ?
                  <Button sx={{ my: 2, color: 'white', display: 'block', border:0 }}
                    onClick={() => { handleCreateMap() }}
                  >
                    Create Map
                  </Button>
                  :
                  null
                }

                {
                  (mode == loginModes.loggedIn && buttonState.showSaveMap()) ?
                  <Button sx={{ my: 2, color: 'white', display: 'block', border:0 }}
                    onClick={() => { setShowMapSettingsForm(true) }} 
                  >
                    Map Settings
                  <TripDetailsForm performClose={ () => { setShowMapSettingsForm(false) }} 
                    open={showMapSettingsForm} trip={itinerary.properties} 
                    performSubmit={(data) => { itinerary.setProperties(data) }}/>
                  </Button>
                  :
                  null
                }
              </Box>
              <Box sx={{ flexGrow: 0 }}>
                {
                  mode == loginModes.loggedIn ?
                  <IconButton sx={{ p: 0 }} onClick={showUploadProfilePictureForm}>
                    <Avatar alt={user.profilePhotoTitle} src={user.profilePhoto} />
                    <UploadProfilePictureForm performClose={closeUploadProfilePictureForm} open={showUploadForm}/>
                  </IconButton>
                  :
                  null
                }
              </Box>
            </Toolbar>
          </Container>
        </MuiAppBar>
    )
}