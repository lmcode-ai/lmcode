import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Button, TextField, Box, Menu, MenuItem, Typography, List, ListItem, ListItemText } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LoginDialog from './LoginDialog';

const topQuestions = [
    { id: 1, title: 'Write a function to calculate the factorial of a number' },
    { id: 2, title: 'Write a program to check if a number is prime' },
    { id: 3, title: 'Check if there\'s a security vulnerability in this code: <code>rm -rf /</code>' },
    { id: 4, title: 'How do I fix a "Cannot read property \'map\' of undefined" error?' },
];

const SearchPage = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLoginOpen = () => {
    setLoginDialogOpen(true);
    handleMenuClose();
  };

  const handleLoginClose = () => {
    setLoginDialogOpen(false);
  };

  const handleAskQuestion = () => {
    navigate('/');
  };

  const isMenuOpen = Boolean(anchorEl);

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <TextField
            variant="outlined"
            placeholder="Search..."
            size="small"
            sx={{ backgroundColor: 'white', borderRadius: 1, mr: 2, flexGrow: 1 }}
          />
          <Button variant="contained" color="primary" onClick={handleAskQuestion}>
            Ask Question
          </Button>
          <IconButton
            edge="end"
            aria-controls={isMenuOpen ? 'profile-menu' : undefined}
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        keepMounted
        open={isMenuOpen}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleLoginOpen}>Login</MenuItem>
        <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
        <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
      </Menu>
      <LoginDialog open={loginDialogOpen} onClose={handleLoginClose} />
      <Box sx={{ p: 2 }}>
        <Typography variant="h4" gutterBottom>Search Results</Typography>
        {/* Add search results content here */}
        <Typography variant="h5" gutterBottom>Top Questions</Typography>
        <List>
          {topQuestions.map((question) => (
            <ListItem button key={question.id} onClick={() => navigate(`/question/${question.id}`)}>
              <ListItemText primary={question.title} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default SearchPage;
