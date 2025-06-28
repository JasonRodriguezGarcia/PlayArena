import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';

const pages = ['Games', 'Pricing', 'About'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function MainPage() {
  const navigate = useNavigate()
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [logged, setLogged] = useState(false)

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
      setAnchorElUser(event.currentTarget);
    };
    
    const handleCloseNavMenu = () => {
      console.log("pulsado Menu!! ")
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
      console.log("pulsado UserMenu!! ")
    setAnchorElUser(null);
  };

  const handleClickedPage = (e) => {
  }
  return (
    <Box sx={{ width: "100vw", height: "100vh", display: {xs: 'none', md: 'flex'}}}>


    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
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
            LOGO
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
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography sx={{ textAlign: 'center' }} onClick={(e)=> handleClickedPage(e)}> {page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
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
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>
          <Box sx={{ flexGrow: 0, display: logged ? 'block' : 'none' }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 0, display: logged ? 'none' : 'block'}}>
            <Tooltip title="Sign up">
                <Button
                    onClick={handleCloseUserMenu}
                    sx={{ m: 2, color: 'white', display: 'block', "&:hover": {backgroundColor: 'lightgrey', color: "black"},
                    "&:selected": {backgroundColor: "grey"}
                    }}
                >
                    Sign Up
                </Button>

            </Tooltip>
          </Box>

        </Toolbar>
      </Container>
      {/* <button onClick={()=> navigate('/game')}>Ir a Game</button>
      <button onClick={()=> setLogged(!logged)}>Act/des logged</button> */}
    <Button
        onClick={()=> navigate('/game')}
        sx={{ width: { xs: '10%', sm: '100px' }, m: 2, color: 'white', display: 'block', "&:hover": {backgroundColor: 'lightgrey', color: "black"},
        "&:active": {backgroundColor: "grey"}
        }}
    >
        Ir a Game
    </Button>
    <Button
        onClick={()=> setLogged(!logged)}
        sx={{ width: { xs: '30%', sm: '100px' }, m: 2, color: 'white', display: 'block', "&:hover": {backgroundColor: 'lightgrey', color: "black"},
        "&:active": {backgroundColor: "grey"}
        }}
    >
        Act/des logged
    </Button>

    </AppBar>

    </Box>

  );
}
export default MainPage;