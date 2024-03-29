import React, { useEffect, useState } from "react";
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
  Avatar,
} from "@nextui-org/react";

import { Playlist } from "@phosphor-icons/react";

import { logout, refreshToken, spotifyApi } from "../spotify";

const MainAppPage = () => {
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
                <Link color="foreground" href="#">
                  Features
                </Link>
              </NavbarItem>
              <NavbarItem isActive>
                <Link href="#" aria-current="page" color="secondary">
                  Customers
                </Link>
              </NavbarItem>
              <NavbarItem>
                <Link color="foreground" href="#">
                  Integrations
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
                  <DropdownItem key="settings">My Settings</DropdownItem>
                  <DropdownItem key="team_settings">Team Settings</DropdownItem>
                  <DropdownItem key="analytics">Analytics</DropdownItem>
                  <DropdownItem key="system">System</DropdownItem>
                  <DropdownItem key="configurations">Configurations</DropdownItem>
                  <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
                  <DropdownItem key="logout" color="danger" onClick={logout}>
                    Log Out
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </NavbarContent>
          </Navbar>
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
