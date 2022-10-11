import React, { useCallback, useEffect, useState } from 'react';
import {
  useExtensionApi,
  render,
  Banner,
  useTranslate,
  Spinner, // https://shopify.dev/api/checkout-extensions/checkout/components/spinner
  TextField,
  useCustomer,
  Text,
  useAttributes,
  useBuyerJourneyIntercept,
  BlockStack, // https://shopify.dev/api/checkout-extensions/checkout/components/textfield
} from '@shopify/checkout-ui-extensions-react';
import ky from 'ky';

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
  const [wallet, setWallet] = useState<{ coins: number }>({ coins: 0 });
  const [formCoins, setFormCoins] = useState<string>('0');

  const updateWallet = useCallback(async () => {
    const data = await ky
      .get('https://d002c509b61c.ngrok.io/wallet', {
        timeout: 500,
      })
      .json<{ coins: number }>();
    setWallet(data);
    return data;
  }, []);

  useEffect(() => {
    let intervalId: number;
    (async () => {
      try {
        await updateWallet();
        intervalId = setInterval(updateWallet, 60_000) as any;
      } catch (error) {
        console.log('error', error);
      }
      setLoading(false);
    })();
    return () => {
      clearInterval(intervalId);
      setLoading(true);
    };
  }, []);

  const [formError, setFormError] = useState<string | null>(null);

  useBuyerJourneyIntercept(async (interceptor) => {
    // this will run when the user does an action like click "Pay now"
    console.log('can block progress', interceptor.canBlockProgress);

    const { coins } = await updateWallet();

    if (Number(formCoins) > coins) {
      return {
        behavior: 'block',
        reason: 'funds',
        perform: () => {
          setFormError('No funds');
        },
      };
    }
    return {
      behavior: 'allow',
      perform: () => {
        setFormError(null);
      },
    };
  });

  useEffect(() => {
    console.log('wallet', wallet);
    console.log('form coins', formCoins);
    // if (Number(formCoins) > wallet.coins) {

    // }
  }, [wallet.coins, formCoins]);

  if (loading) {
    return <Spinner />;
  } else {
    // if (!customer) {
    //   return (
    //     <Text size='base'>
    //       Please log in so we can check your TYB wallet for benefits
    //     </Text>
    //   );
    // }
    return (
      <BlockStack>
        {formError ?? <Text>{formError}</Text>}
        <TextField
          label='how many coins?'
          value={formCoins}
          onInput={(value) => setFormCoins(value)}
        />
      </BlockStack>
    );
  }
  // const {extensionPoint} = useExtensionApi();
  // const translate = useTranslate();
  // return <Banner>{translate('welcome', {extensionPoint})}</Banner>;
}
