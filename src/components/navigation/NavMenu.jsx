import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from "react-i18next";

import { useAuthStore } from '../../store/auth';
import { useAppStore } from '../../store/app';
import { useContentStore } from '../../store/content';
import { useNotificationStore } from '../../store/notification';

const Ul = styled.ul`
  list-style: none;
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center; /* align vertical */
  z-index: 10;
  margin-bottom: 0px;
  @media (max-width: 768px) {
    flex-flow: column nowrap;
    justify-content: space-between;
    align-items: flex-end;
    background-color: #fafafa;
    border-right: solid 1px black;
    position: fixed;
    transform: ${({ $menuOpen }) => $menuOpen ? 'translateX(0)' : 'translateX(-100%)'};
    top: 0;
    left: 0;
    height: 100vh;
    width: 150px;
    padding: 20vh 12px;
    transition: transform 0.3s ease-in-out;
    li {
      color: black;
      text-align: end;
    }
  }
`;

const Li = styled.li`
  text-align: center;
  flex-grow: 1;
  height: 100%;
  @media (min-width: 768px) {
    :hover {
      background-color: var(--primary);
    }
  }
`;

const Link = styled.a`
  display:block;
  width: 100%;
  color: black;
  cursor: pointer;
  :hover {
    text-decoration: none;
  }
`;

export default function NavMenu(props) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { logoutUser } = useAuthStore();
  const { menuOpen, setMenuOpen } = useAppStore();
  const { clearSearch } = useContentStore();
  const addNotification = useNotificationStore(state => state.addNotification);

  const handleClick = (link, menuOpen) => {
    setMenuOpen(!menuOpen);
    if (link === '/') {
      clearSearch();
    }
    navigate(link);
  };
 
  const logoutClick = async () => {
    try {
      const result = await logoutUser();
      if (result) {
        navigate("/");
        addNotification(t('Logged out successfully!'), 'success');
      }
    } catch (error) {
      addNotification(t('Logout failed. Please try again.'), 'error');
    }

  };

  return (
    <Ul $menuOpen={menuOpen}>
      <Li><Link onClick={() => handleClick('/', menuOpen) } >{t("Home")}</Link></Li>
      <Li><Link onClick={() => handleClick('/addContent', menuOpen) } >{t("Add")}</Link></Li>
      {props.isLoggedIn ? (
          <>
            <Li><Link onClick={() => handleClick('/account', menuOpen) } >{t("Account")}</Link></Li>
            <Li><Link onClick={() => handleClick('/flashcards', menuOpen) } >{t("Flashcards")}</Link></Li>
            {props.isAdmin && <Li><Link onClick={() => handleClick('/admin', menuOpen) } >{t("Administer")}</Link></Li>}
            <Li><Link onClick={() => logoutClick() } >{t("Log Out")}</Link></Li>
          </>
        ) : (
          <>
            <Li><Link onClick={() => handleClick('/login', menuOpen) } >{t("Log In")}</Link></Li>
          </>
        )
      }
    </Ul>
  );
}