import AddLocationAltSharpIcon from '@mui/icons-material/AddLocationAltSharp';
import MuiAppBar from '@mui/material/AppBar';
import MenuIcon from '@mui/icons-material/Menu';
import { useUserContext } from '../context/UserContext';
import { useItineraryContext } from '../context/ItineraryContext';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Divider, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import { useState } from 'react';
import { Box } from '@mui/material'; // keep this import at last as a workaround for MUI issue



const logo = "Travel Mate"

const loginModes = { loggedIn:1, loggedOut:2, any:3 }
const pages = [
  { name: "Homepage", route: "/", mode: loginModes.any }, 
  { name: "Itinerarypage", route: "/itinerary", mode: loginModes.loggedIn },
  { name: "Login", route: "/signin", mode: loginModes.loggedOut },
  { name: "Logout", route: "/signout", mode: loginModes.loggedIn },
];

export default function AppBar(props) {
    const [anchorElNav, setAnchorElNav] = useState(null);
    const navigate = useNavigate();
    const user = useUserContext();
    const itinerary = useItineraryContext();

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

    const mode = user.isLoggedIn() ? loginModes.loggedIn : loginModes.loggedOut;
    console.log("login mode: ", mode, user.isLoggedIn(), user);

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
                  (mode == loginModes.loggedIn) ?
                  <Button sx={{ my: 2, color: 'white', display: 'block', border:0 }}
                    onClick={() => { handleSaveMap() }}
                  >
                    Save Map
                  </Button>
                  :
                  null
                }
              </Box>
            </Toolbar>
          </Container>
        </MuiAppBar>
    )
}
