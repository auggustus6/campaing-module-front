import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Logo from '../Logo';
import { PATHS } from '../../utils/constants';
import { Link } from 'react-router-dom';
import Stack from '@mui/system/Stack';
import { useAuth } from '../../context/AuthContext';
import { useLayoutEffect, useState } from 'react';

const drawerWidth = 240;

export default function Header() {
  const { logout, user } = useAuth();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const MobileDrawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Logo />
      <Divider />
      <List>
        {PATHS.map((item) => {
          if (!item.isAdminRoute) {
            return (
              <Link to={item.path} key={item.path}>
                <ListItem disablePadding>
                  <ListItemButton sx={{ textAlign: 'center' }}>
                    <ListItemText primary={item.name} />
                  </ListItemButton>
                </ListItem>
              </Link>
            );
          } else if (user?.isAdmin) {
            return (
              <Link to={item.path} key={item.path}>
                <ListItem disablePadding>
                  <ListItemButton sx={{ textAlign: 'center' }}>
                    <ListItemText primary={item.name} />
                  </ListItemButton>
                </ListItem>
              </Link>
            );
          }
        })}
        <ListItem disablePadding onClick={logout}>
          <ListItemButton sx={{ textAlign: 'center' }}>
            <ListItemText primary={'Sair'} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar component="nav" sx={{ background: '#2069ca' }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Stack
            direction="row"
            width="100%"
            justifyContent={'space-between'}
            alignItems="center"
          >
            <Typography variant="h6" component="div" sx={{ display: {} }}>
              <Logo />
            </Typography>
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              {PATHS.map((item) => {
                if (!item.isAdminRoute) {
                  return (
                    <Link to={item.path} key={item.path}>
                      <Button sx={{ color: '#fff' }}>{item.name}</Button>
                    </Link>
                  );
                } else if (user?.isAdmin) {
                  return (
                    <Link to={item.path} key={item.path}>
                      <Button sx={{ color: '#fff' }}>{item.name}</Button>
                    </Link>
                  );
                }
              })}

              <Button sx={{ color: '#fff' }} onClick={logout}>
                Sair
              </Button>
            </Box>
          </Stack>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {MobileDrawer}
        </Drawer>
      </Box>
    </Box>
  );
}
