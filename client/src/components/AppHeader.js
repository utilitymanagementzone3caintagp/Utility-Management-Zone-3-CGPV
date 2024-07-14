import React, { useEffect, useRef, useState, useContext } from "react";
import { apiUrl } from "../../server.json";
import { AuthContext } from "../context/AuthContext";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CDropdownHeader,
  CDropdownDivider,
  CBadge,
  CNavLink,
  CNavItem,
  useColorModes,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilBell,
  cilContrast,
  cilEnvelopeOpen,
  cilList,
  cilMenu,
  cilMoon,
  cilSun,
} from "@coreui/icons";

import { AppBreadcrumb } from "./index";
import { AppHeaderDropdown } from "./header/index";

const AppHeader = () => {
  const { user } = useContext(AuthContext);
  const headerRef = useRef();
  const { colorMode, setColorMode } = useColorModes(
    "coreui-free-react-admin-template-theme"
  );

  const dispatch = useDispatch();
  const sidebarShow = useSelector((state) => state.sidebarShow);

  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    document.addEventListener("scroll", () => {
      headerRef.current &&
        headerRef.current.classList.toggle(
          "shadow-sm",
          document.documentElement.scrollTop > 0
        );
    });
  }, []);

  useEffect(() => {
    // Fetch notifications based on user's email
    const fetchNotifications = async () => {
      try {
        if (!user) return; // If user is not logged in, return

        const response = await fetch(
          `${apiUrl}/usernotifications?email=${user.email}`
        );
        if (response.ok) {
          const data = await response.json();
          setNotifications(data.data);
          setNotificationCount(data.data.length);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [user]);

  const handleDeleteNotification = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/usernotifications/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        const updatedNotifications = notifications.filter(
          (notification) => notification._id !== id
        );
        setNotifications(updatedNotifications);
        setNotificationCount(updatedNotifications.length);
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
      <CContainer className="border-bottom px-4" fluid>
        <CHeaderToggler
          onClick={() => dispatch({ type: "set", sidebarShow: !sidebarShow })}
          style={{ marginInlineStart: "-26px" }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderNav className="d-none d-md-flex"></CHeaderNav>

        {user ? (
          <CHeaderNav className="ms-auto">
            <CDropdown variant="nav-item">
              <CDropdownToggle
                placement="bottom-end"
                className="py-0 pe-0"
                caret={false}
              >
                <CNavItem>
                  <div style={{ position: "relative" }}>
                    <CIcon icon={cilBell} size="lg" />
                    {notificationCount > 0 && (
                      <CBadge
                        color="danger"
                        className="ms-2"
                        style={{
                          position: "absolute",
                          top: "-8px",
                          right: "-8px",
                        }}
                        textColor="white"
                      >
                        {notificationCount}
                      </CBadge>
                    )}
                  </div>
                </CNavItem>
              </CDropdownToggle>
              <CDropdownMenu
                className="pt-0"
                placement="bottom-end"
                onClick={handleDeleteNotification}
                style={{
                  maxHeight: "300px",
                  overflowY: "auto",
                  cursor: "pointer",
                }}
              >
                <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">
                  Notifications
                </CDropdownHeader>
                {notifications.length > 0 ? (
                  notifications.map((notification, index) => (
                    <React.Fragment key={notification._id}>
                      <CDropdownItem
                        onClick={() =>
                          handleDeleteNotification(notification._id)
                        }
                      >
                        <p id="definenotifi">
                          {notification.userdefinenotifi}
                          <p id="timedatenotifi">
                            {notification.usertimedatenotifi}
                          </p>
                        </p>
                      </CDropdownItem>
                      {index !== notifications.length - 1 && (
                        <CDropdownDivider />
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <CDropdownItem disabled>
                    You don't have any notifications yet!
                  </CDropdownItem>
                )}
              </CDropdownMenu>
            </CDropdown>
          </CHeaderNav>
        ) : (
          <div className="text-center mt-3"></div>
        )}

        <CHeaderNav>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          <CDropdown variant="nav-item" placement="bottom-end">
            <CDropdownToggle caret={false}>
              {colorMode === "dark" ? (
                <CIcon icon={cilMoon} size="lg" />
              ) : (
                <CIcon icon={cilSun} size="lg" />
              )}
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem
                active={colorMode === "light"}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode("light")}
              >
                <CIcon className="me-2" icon={cilSun} size="lg" /> Light
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === "dark"}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode("dark")}
              >
                <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      <CContainer className="px-4" fluid>
        <AppBreadcrumb />
      </CContainer>
    </CHeader>
  );
};

export default AppHeader;