import React, { useCallback } from 'react';
import './App.css';

function App() {
  const handleProductClick = useCallback((productId: string) => {
    fetch(`http://localhost:5800/product/${productId}`, {
      // mode: 'no-cors',
      // redirect: 'manual',
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(response);
        // if (response.redirected) {
        //   console.log('sdsd', response.url);
        window.location.href = data.url;
        // }
      });
  }, []);

  return (
    <div className='App'>
      <a href='#ds' onClick={() => handleProductClick('chocolates1')}>
        buy chocolates
      </a>
    </div>
  );
}

export default App;
