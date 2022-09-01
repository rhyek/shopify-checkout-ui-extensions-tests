import React, { useEffect, useState } from 'react';
import {
  useExtensionApi,
  render,
  Banner,
  useTranslate,
  Spinner, // https://shopify.dev/api/checkout-extensions/checkout/components/spinner
  TextField,
  useCustomer,
  Text,
  useAttributes, // https://shopify.dev/api/checkout-extensions/checkout/components/textfield
} from '@shopify/checkout-ui-extensions-react';

// render('Checkout::Reductions::RenderBefore', () => <App />);
// render('Checkout::Actions::RenderBefore', () => <App />);
// render('Checkout::Contact::RenderAfter', () => <App />);
render('Checkout::Dynamic::Render', () => <App />);

function App() {
  const extensionApi = useExtensionApi();
  const {
    buyerIdentity: {
      customer: { current: currentCustomer, subscribe },
    },
  } = extensionApi;
  // console.log(extensionApi);
  const customer = useCustomer();
  const attributes = useAttributes();

  console.log('attributes', attributes);

  useEffect(() => {
    console.log('current customer', currentCustomer);
    console.log('customer', customer);
    subscribe((customer) => {
      console.log('inside subscription', customer);
    });
  }, []);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch('https://b9f4e1b87bd3.ngrok.io/health')
      .then((response) => {
        console.log(response);
        return response.text();
      })
      .then((data) => {
        console.log('data', data);
      })
      .catch((error) => {
        console.log('error', error);
      });
    setTimeout(() => {
      setLoading(false);
    }, 2_000);
  }, []);
  if (loading) {
    return <Spinner />;
  } else {
    if (!customer) {
      return (
        <Text size='base'>
          Please log in so we can check your TYB wallet for benefits
        </Text>
      );
    }
    return <TextField label='hello dtyb' />;
  }
  // const {extensionPoint} = useExtensionApi();
  // const translate = useTranslate();
  // return <Banner>{translate('welcome', {extensionPoint})}</Banner>;
}
