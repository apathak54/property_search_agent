import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  const navItems = ['Home', 'About', 'Contact'];

  return (
    <>
      <AppBar position="fixed" color="primary" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          {/* Mobile Menu Icon */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            sx={{ display: { xs: 'block', sm: 'none' }, mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          {/* Brand/Logo */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Property Search
          </Typography>
          {/* Desktop Menu Items */}
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {navItems.map((item) => (
              <Button key={item} color="inherit" sx={{ marginRight: 1 }}>
                {item}
              </Button>
            ))}
          </Box>
          {/* Authentication Buttons */}
          <Button color="inherit">Login</Button>
          <Button variant="outlined" color="inherit" sx={{ ml: 1 }}>
            Sign Up
          </Button>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer for Navigation */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
          <List>
            {navItems.map((text) => (
              <ListItem button key={text}>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
