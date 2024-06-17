import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar
} from '@nextui-org/react';
import ComparePage from './ComparePage';
import SpotifyPage from './SpotifyPage';

import { Playlist } from '@phosphor-icons/react';
import Settings from './Settings.jsx';
import SearchPage from './SearchPage.jsx';

import { logout, refreshToken, spotifyApi } from '../spotify.js';
import PlaylistPage from './PlaylistPage.jsx';

const MainAppPage = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let spotifyUser;
    spotifyApi
      .getMe()
      .then((data) => {
        console.log(data.body);
        spotifyUser = data.body;
        setUser(spotifyUser);
      })
      .catch((error) => {
        console.log(error);
        // navigate to login page
        setUser(null);
      });
  }, []);
  return (
    <>
      {user ? (
        <>
          <Navbar className="flex-shrink-0 select-none">
            <NavbarBrand>
              <Playlist size={24} weight="duotone" />
              <p className="font-bold text-inherit pl-2">TRACKMATCH</p>
            </NavbarBrand>

            <NavbarContent className="hidden sm:flex gap-4" justify="center">
              <NavbarItem>
                <Link
                  href="/"
                  aria-current={location.pathname === '/' ? 'page' : undefined}
                  color={location.pathname === '/' ? 'primary' : 'foreground'}
                  className={
                    'transition-transform hover:scale-105' +
                    (location.pathname === '/' ? ' font-semibold' : '')
                  }>
                  Main
                </Link>
              </NavbarItem>
              <NavbarItem>
                <Link
                  href="/search"
                  aria-current={location.pathname === '/search' ? 'page' : undefined}
                  color={location.pathname === '/search' ? 'primary' : 'foreground'}
                  className={
                    'transition-transform hover:scale-105' +
                    (location.pathname === '/search' ? ' font-semibold' : '')
                  }>
                  Search
                </Link>
              </NavbarItem>
              <NavbarItem>
                <Link
                  href="/compare"
                  aria-current={location.pathname === '/compare' ? 'page' : undefined}
                  color={location.pathname === '/compare' ? 'primary' : 'foreground'}
                  className={
                    'transition-transform hover:scale-105' +
                    (location.pathname === '/compare' ? ' font-semibold' : '')
                  }>
                  Compare
                </Link>
              </NavbarItem>
              <NavbarItem>
                <Link
                  href="/spotify"
                  aria-current={location.pathname === '/spotify' ? 'page' : undefined}
                  color={location.pathname === '/spotify' ? 'primary' : 'foreground'}
                  className={
                    'transition-transform hover:scale-105' +
                    (location.pathname === '/spotify' ? ' font-semibold' : '')
                  }>
                  Spotify
                </Link>
              </NavbarItem>
            </NavbarContent>

            <NavbarContent as="div" justify="end">
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Avatar
                    isBordered
                    as="button"
                    className="transition-transform"
                    color="primary"
                    name={user.display_name}
                    size="sm"
                    src={user.images[0].url}
                  />
                </DropdownTrigger>
                <DropdownMenu aria-label="Profile Actions" variant="solid">
                  <DropdownItem key="profile" className="h-14 gap-2" textValue="profile">
                    <p className="font-semibold">Signed in as</p>
                    <p className="font-semibold">{user.display_name}</p>
                  </DropdownItem>
                  <DropdownItem textValue="settings" onClick={() => navigate('/settings')}>
                    My Settings
                  </DropdownItem>
                  <DropdownItem key="configurations" textValue="configurations">
                    Configurations
                  </DropdownItem>
                  <DropdownItem key="help_and_feedback" textValue="help and feedback">
                    Help & Feedback
                  </DropdownItem>
                  <DropdownItem key="refresh" onClick={refreshToken} textValue="refresh token">
                    Refresh Token
                  </DropdownItem>
                  <DropdownItem key="logout" color="danger" onClick={logout} textValue="logout">
                    Log Out
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </NavbarContent>
          </Navbar>
          <div className="overflow-y-auto">
            <Routes>
              <Route path="/" element={<p>Main</p>} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/compare" element={<ComparePage></ComparePage>} />
              <Route path="/settings" element={<Settings></Settings>} />
              <Route path="/spotify" element={<SpotifyPage></SpotifyPage>}></Route>
              <Route path="/playlist/:playlistId" Component={PlaylistPage} />
            </Routes>
          </div>
        </>
      ) : (
        <div>Loading</div>
      )}
    </>
  );
};

export default MainAppPage;
