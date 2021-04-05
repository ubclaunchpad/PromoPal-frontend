import './NavigationBar.less';

import { Menu } from 'antd';
import React, { ReactElement, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { ReactComponent as Logo } from '../../assets/logo.svg';
import { className } from '../../utils/component';
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
          <Menu.Item
            key={Pages.Home}
            className={className(
              { 'navigation-menu-item--active': current === Pages.Home },
              'navigation-menu-item'
            )}
          >
            <Link to={Paths.Home}>Home</Link>
          </Menu.Item>
          <Menu.Item
            key={Pages.Account}
            className={className(
              { 'navigation-menu-item--active': current === Pages.Account },
              'navigation-menu-item'
            )}
          >
            <Link to={Paths.Account}>{loggedIn ? 'My Account' : 'Login'}</Link>
          </Menu.Item>
          <Menu.Item
            key={Pages.UploadPromotion}
            className={className(
              { 'navigation-menu-item--active': current === Pages.UploadPromotion },
              'navigation-menu-item'
            )}
          >
            <Link to={Paths.UploadPromotion}>Upload Promotion</Link>
          </Menu.Item>
        </Menu>
      </div>
      <SearchBar />
    </header>
  );
}
