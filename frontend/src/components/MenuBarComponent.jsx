import { useState } from 'react'
import { useNavigate , Link } from 'react-router-dom';
import {createContext, useContext} from 'react';
import LoginContext from '../context/LoginContext';
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
import AdbIcon from '@mui/icons-material/Adb'; // icono android
import HomeIcon from '@mui/icons-material/Home'; // icono home

const pages = ['Games', 'Pricing', 'About'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const MenuBarComponent = () => {
  const navigate = useNavigate()
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
//   const [logged, setLogged] = useState(false)
    const {logged, setLogged, userNick, setUserNick} = useContext(LoginContext)

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
      setAnchorElUser(event.currentTarget);
    };
    
    const handleCloseNavMenu = (e) => {
      console.log("pulsado Menu!! : ", e)
    setAnchorElNav(null);
  };

    const handleCloseUserMenu = (setting) => {
        console.log("pulsado UserMenu!! :", setting)
        switch (setting) {
            // case "Profile":
            //     navigate("/games");
            //     break;
            // case "Account":
            //     navigate("/pricing");
            //     break;
            case "Logout":
                setLogged(false)
                setUserNick('')
                navigate("/");
                break;
            default:
                break;
        }
        
        setAnchorElUser(null);
    };

    const handleClickedPage = (page) => {
        console.log("Página pulsada:", page);

        switch (page) {
            case "Games":
                navigate("/games");
                break;
            case "Pricing":
                navigate("/pricing");
                break;
            // case "About":
            //     navigate("/about");
            //     break;
            default:
                break;
        }
        setAnchorElNav(null); // cerrar menú móvil si estaba abierto
    }

  // filtramos las páginas y game aparece si estamos logeados
  const filteredPages = pages.filter(page => {
    if (page === "Games") return logged;
    return true;
    });
  return (

    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
            {/* MODO ESCRITORIO */}
          <Typography
            variant="h6"
            noWrap
            // component="a" <<-- Esto recarga toda la página y perdemos el estados
            // href="/"   
            component={Link} // usa Link
            to="/" // en lugar de href


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
            <HomeIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
            PlayArena
          </Typography>
{/* MENÚ MÓVIL */}
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
              {/* {pages.map((page) => ( */}
              {filteredPages.map((page) => (
                <MenuItem key={page} onClick={()=> handleClickedPage(page)}>
                  <Typography sx={{ textAlign: 'center' }}> {page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          {/* LOGO MOVIL */}
          <Typography
            variant="h5"
            noWrap
            // component="a"
            // href="/"
            component={Link} // usa Link
            to="/" // en lugar de href

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
            <HomeIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
            PlayArena
          </Typography>

          {/* MENU DESKTOP */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {/* {pages.map((page) => ( */}
            {filteredPages.map((page) => (
              <Button
                key={page}
                onClick={()=>handleClickedPage(page)}
                sx={{ my: 2, color: 'white', display: 'block', "&:hover": {backgroundColor: 'lightgrey', color: "black"},
                    "&:selected": {backgroundColor: "grey"} }}
              >
                {page}
              </Button>
            ))}
          </Box>

          {/* USUARIO LOGEADO */}
          <Box sx={{ flexGrow: 0, display: logged ? 'block' : 'none' }}>
            <Tooltip title="Open settings">
                <Box sx={{ display: "flex", alignItems: "center"}}>
                    <Box sx={{mx: 2}}>
                        {/* User */}
                        <Typography
                            variant="body1"
                            sx={{ mx: 2, color: 'white', fontWeight: 'bold', backgroundColor: '#1976d2', px: 1.5, py: 0.5, borderRadius: 1 }}
                        >
                            User: {userNick}
                        </Typography>
                    </Box>
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                        {/* <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" /> */}
                        <Avatar alt={userNick} src="/static/images/avatar/2.jpg" />
                    </IconButton>
                </Box>
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
                <MenuItem key={setting} onClick={()=> handleCloseUserMenu(setting)}>
                  <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 0, display: logged ? 'none' : 'block'}}>
            <Tooltip title="Sign up">
                <Button
                    // onClick={handleSignUp}
                    onClick={()=> navigate('/signup')}
                    sx={{ m: 2, color: 'white', display: 'block', "&:hover": {backgroundColor: 'lightgrey', color: "black"},
                    "&:selected": {backgroundColor: "grey"}
                    }}
                >
                    Sign Up
                </Button>

            </Tooltip>
          </Box>

          <Box sx={{ flexGrow: 0, display: logged ? 'none' : 'block'}}>
            <Tooltip title="Login">
                <Button
                    onClick={()=> navigate('/login')}
                    sx={{ m: 2, color: 'white', display: 'block', "&:hover": {backgroundColor: 'lightgrey', color: "black"},
                    "&:selected": {backgroundColor: "grey"}
                    }}
                >
                    Login
                </Button>

            </Tooltip>
          </Box>

        </Toolbar>
      </Container>
    {/* <Button
        onClick={()=> navigate('/game')}
        sx={{ width: { xs: '10%', sm: '100px' }, m: 2, color: 'white', display: 'block', "&:hover": {backgroundColor: 'lightgrey', color: "black"},
        "&:active": {backgroundColor: "grey"}
        }}
    >
        Ir a Game
    </Button> */}
    {/* <Button
        onClick={()=> setLogged(!logged)}
        sx={{ width: { xs: '30%', sm: '100px' }, m: 2, color: 'white', display: 'block', "&:hover": {backgroundColor: 'lightgrey', color: "black"},
        "&:active": {backgroundColor: "grey"}
        }}
    >
        Act/des logged
    </Button> */}

    </AppBar>

  );
}
export default MenuBarComponent