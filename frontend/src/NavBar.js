import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import logo from './assets/images/lmcode-logo.png';
import React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar variant="dense" sx={{ display: 'flex', alignItems: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
          <Box
            component="img"
            src={logo}
            alt="Logo"
            sx={{ width: 30, height: 30, borderRadius: '50%', marginRight: 2 }}
          />
          <Typography variant="h7" component="div">
            LMCode
          </Typography>
        </Link>

        <Box
          sx={{
            flexGrow: 1,
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            ml: {
              xs: '10px',
              sm: '20px',
              md: '30px',
              lg: '40px',
              xl: '50px',
            }
          }}
        >
          {/* Leaderboard Link moved before About Us */}
          <Button
            key="leaderboard"
            sx={{ color: 'white', display: 'block' }}
            component={Link}
            to="/leaderboard"
          >
            Leaderboard
          </Button>

          <Button
            key="about-us"
            sx={{ color: 'white', display: 'block' }}
            component={Link}
            to="/about-us"
          >
            About Us
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
