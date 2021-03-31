import './NavigationBar.less';

import { Menu } from 'antd';
import React, { CSSProperties, ReactElement, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { ReactComponent as Logo } from '../../assets/logo.svg';
import SearchBar from '../navigation/SearchBar';

enum Pages {
  Home = 'Home',
  Account = 'Account',
  UploadPromotion = 'UploadPromotion',
}

enum Paths {
  Home = '/',
  Account = '/account',
  UploadPromotion = '/promotion/upload',
}

const PathsToPages: { [path: string]: Pages } = {
  [Paths.Home]: Pages.Home,
  [Paths.Account]: Pages.Account,
  [Paths.UploadPromotion]: Pages.UploadPromotion,
};

export default function NavigationBar(): ReactElement {
  const location: { pathname: string } = useLocation();

  const [current, setCurrent] = useState<Pages>(Pages.Home);

  const isActive = (key: Pages): CSSProperties => ({
    fontWeight: current === key ? 'bold' : 'normal',
  });

  /**
   * Sets current key to be the page that the user is on.
   */
  useEffect(() => {
    setCurrent(PathsToPages[location.pathname]);
  }, [location.pathname]);

  const loggedIn = false;

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
            <Link to={Paths.Account}>{loggedIn ? 'My Account' : 'Login'}</Link>
          </Menu.Item>
          <Menu.Item
            key={Pages.UploadPromotion}
            className="navigation-menu-item"
            style={isActive(Pages.UploadPromotion)}
          >
            <Link to={Paths.UploadPromotion}>Upload Promotion</Link>
          </Menu.Item>
        </Menu>
      </div>
      <SearchBar />
    </header>
  );
}
