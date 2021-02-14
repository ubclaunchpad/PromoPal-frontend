import { Button } from 'antd';
import React, { CSSProperties, ReactElement } from 'react';
import { useHistory } from 'react-router-dom';

const styles: { [identifier: string]: CSSProperties } = {
  button: {
    backgroundColor: '#FFC529',
  },

  text: {
    color: 'black',
    fontWeight: 'bold',
  },
};

export default function UploadPromoButton(): ReactElement {
  const history = useHistory();

  function handleClick() {
    history.push('/promotion/upload');
  }

  return (
    <Button size="large" shape="round" onClick={handleClick} style={styles.button}>
      <div style={styles.text}> Upload Promo </div>
    </Button>
  );
}
