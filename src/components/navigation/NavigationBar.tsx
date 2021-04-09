import './NavigationBar.less';

import { Button, Menu } from 'antd';
import React, { CSSProperties, ReactElement, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { ReactComponent as Logo } from '../../assets/logo.svg';
import { useAuthUser } from '../../contexts/AuthUserContext';
import UserService from '../../services/UserService';
import SearchBar from '../navigation/SearchBar';

enum Pages {
  Home = 'Home',
  Account = 'Account',
  UploadPromotion = 'UploadPromotion',
  MyPromotions = 'MyPromotions',
}

enum Paths {
  Home = '/',
  Account = '/account',
  UploadPromotion = '/promotion/upload',
  MyPromotions = '/mypromotions',
}

const PathsToPages: { [path: string]: Pages } = {
  [Paths.Home]: Pages.Home,
  [Paths.Account]: Pages.Account,
  [Paths.UploadPromotion]: Pages.UploadPromotion,
  [Paths.MyPromotions]: Pages.MyPromotions,
};

export default function NavigationBar(): ReactElement {
  const location: { pathname: string } = useLocation();

  const [current, setCurrent] = useState<Pages>(Pages.Home);
  const authUser = useAuthUser();

  // TODO: isActive is not highlighting the active page when the browser back button is pressed
  const isActive = (key: Pages): CSSProperties => ({
    fontWeight: current === key ? 'bold' : 'normal',
  });

  /**
   * Sets current key to be the page that the user is on.
   */
  useEffect(() => {
    setCurrent(PathsToPages[location.pathname]);
  }, [location.pathname]);

  return (
    <header id="navigation-header" className="navigation-header">
      <div className="navigation-header-container">
        <Logo title="PromoPal" className="logo" height={50} />
        <Menu
          mode="horizontal"
          className="navigation-menu"
          onClick={({ key }) => setCurrent(key as Pages)}
          selectedKeys={[current]}
        >
          <Menu.Item key={Pages.Home} className="navigation-menu-item" style={isActive(Pages.Home)}>
            <Link to={Paths.Home}>Home</Link>
          </Menu.Item>
          <Menu.Item
            key={Pages.Account}
            className="navigation-menu-item"
            style={isActive(Pages.Account)}
          >
            <Link to={Paths.Account}>{authUser ? 'My Account' : 'Login'}</Link>
          </Menu.Item>
          <Menu.Item
            key={Pages.UploadPromotion}
            className="navigation-menu-item"
            style={isActive(Pages.UploadPromotion)}
          >
            <Link to={Paths.UploadPromotion}>Upload Promotion</Link>
          </Menu.Item>
          <Menu.Item
            key={Pages.MyPromotions}
            className="navigation-menu-item"
            style={isActive(Pages.MyPromotions)}
          >
            <Link to={Paths.MyPromotions}>My Promotions</Link>
          </Menu.Item>
        </Menu>
      </div>
      <SearchBar />
      {authUser && <Button onClick={UserService.signUserOut}>Sign Out</Button>}
    </header>
  );
}
