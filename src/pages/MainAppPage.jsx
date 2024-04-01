import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import {
  Button,
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

import { Playlist } from '@phosphor-icons/react';
import Settings from './Settings.jsx';
import SearchPage from './SearchPage.jsx';

import { logout, refreshToken, spotifyApi } from '../spotify.js';

const MainAppPage = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    let spotifyUser;
    spotifyApi.getMe().then((data) => {
      console.log(data.body);
      spotifyUser = data.body;
      setUser(spotifyUser);
    });
  }, []);
  return (
    <>
      {user ? (
        <>
          <Navbar>
            <NavbarBrand>
              <Playlist size={24} weight="duotone" />
              <p className="font-bold text-inherit pl-2">TRACKSEARCH</p>
            </NavbarBrand>

            <NavbarContent className="hidden sm:flex gap-4" justify="center">
              <NavbarItem>
                <Link
                  href="/"
                  aria-current={location.pathname === '/' ? 'page' : undefined}
                  color={location.pathname === '/' ? 'secondary' : 'foreground'}
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
                  color={location.pathname === '/search' ? 'secondary' : 'foreground'}
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
                  color={location.pathname === '/compare' ? 'secondary' : 'foreground'}
                  className={
                    'transition-transform hover:scale-105' +
                    (location.pathname === '/compare' ? ' font-semibold' : '')
                  }>
                  Compare
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
                    color="secondary"
                    name={user.display_name}
                    size="sm"
                    src={user.images[0].url}
                  />
                </DropdownTrigger>
                <DropdownMenu aria-label="Profile Actions" variant="flat">
                  <DropdownItem key="profile" className="h-14 gap-2">
                    <p className="font-semibold">Signed in as</p>
                    <p className="font-semibold">{user.display_name}</p>
                  </DropdownItem>
                  <DropdownItem>
                    <Link href="/settings" key="settings">
                      My Settings
                    </Link>
                  </DropdownItem>
                  <DropdownItem key="configurations">Configurations</DropdownItem>
                  <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
                  <DropdownItem key="logout" color="danger" onClick={logout}>
                    Log Out
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </NavbarContent>
          </Navbar>
          <Routes>
            <Route path="/" element={<p>Main</p>} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/compare" element={<ComparePage></ComparePage>} />
            <Route path="/settings" element={<Settings></Settings>} />
          </Routes>
          <Button color="secondary" size="large" id="refresh-button" onClick={refreshToken}>
            Refresh
          </Button>
        </>
      ) : (
        <div>Loading</div>
      )}
    </>
  );
};

export default MainAppPage;
