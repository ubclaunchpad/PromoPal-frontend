import { Button, Menu } from 'antd';
import React, { CSSProperties, ReactElement, useState } from 'react';
import { Link } from 'react-router-dom';

import { useAuthUser } from '../../contexts/AuthUserContext';
import { useFirebase } from '../../contexts/FirebaseContext';
import SearchBar from '../navigation/SearchBar';

enum Pages {
  Home = 'Home',
  Account = 'Account',
  UploadPromotion = 'UploadPromotion',
}

const styles: { [identifier: string]: CSSProperties } = {
  header: {
    alignItems: 'center',
    display: 'inline-flex',
    justifyContent: 'space-between',
    padding: 10,
    width: '100%',
  },
  logo: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 0,
    marginBottom: 0,
  },
  menu: {
    backgroundColor: '#fff',
    borderBottom: 0,
  },
  menuItem: {
    borderBottom: 0,
    color: 'black',
  },
  navigation: {
    display: 'inline-flex',
    verticalAlign: 'center',
  },
};

export default function NavigationBar(): ReactElement {
  const [current, setCurrent] = useState<Pages>(Pages.Home);
  const firebase = useFirebase();
  const authUser = useAuthUser();

  // TODO: isActive is not highlighting the active page when the browser back button is pressed
  const isActive = (key: Pages): CSSProperties => ({
    ...styles.menuItem,
    fontWeight: current === key ? 'bold' : 'normal',
  });

  return (
    <header id="navigation-header" style={styles.header}>
      <div style={styles.navigation}>
        <h1 style={styles.logo}>Logo</h1>
        <Menu
          onClick={({ key }) => setCurrent(key as Pages)}
          selectedKeys={[current]}
          mode="horizontal"
          style={styles.menu}
        >
          <Menu.Item key={Pages.Home} style={isActive(Pages.Home)}>
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Item key={Pages.Account} style={isActive(Pages.Account)}>
            <Link to="/account">{authUser ? 'My Account' : 'Login'}</Link>
          </Menu.Item>
          <Menu.Item key={Pages.UploadPromotion} style={isActive(Pages.UploadPromotion)}>
            <Link to="/promotion/upload">Upload Promotion</Link>
          </Menu.Item>
        </Menu>
      </div>
      <SearchBar />
      {authUser && <Button onClick={firebase.doSignOut}>Sign Out</Button>}
    </header>
  );
}
