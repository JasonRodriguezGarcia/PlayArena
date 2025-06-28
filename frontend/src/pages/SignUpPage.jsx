import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import MenuBarComponent from '../components/MenuBarComponent';
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
import LoginComponent from '../components/LoginComponent';

function SignUpPage() {
  
  return (
    <Box sx={{ width: "100vw", height: "100vh", backgroundColor: "blue", display: "flex", flexDirection: "column"}}>

        <Box sx={{height: "10vh", display: {xs: 'none', md: 'flex'}}}>
            <MenuBarComponent />
        </Box>
        <Box 
            sx={{
                height: '90vh',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <LoginComponent />

        </Box>
    </Box>
  );
}
export default SignUpPage;