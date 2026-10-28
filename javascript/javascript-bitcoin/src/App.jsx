
import React from 'react';
import { useConnection, useTrustModal } from '@trustwallet/connect-react';
import { useSignMessage } from '@trustwallet/connect-bip122-react';

export default function App() {
  const { open } = useTrustModal();

  const {
    isConnected,
    address,
    wallet,
    status,
  } = useConnection({
    namespaceId: 'bip122',
  });

  const {
    mutate: signMessage,
    data: signature,
    isPending,
    isSuccess,
    error,
  } = useSignMessage();

  return (
    <main
      style={{
        maxWidth: 600,
        margin: '40px auto',
        padding: 24,
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center',
        direction: 'rtl',
      }}
    >
      <h1>Oxana Bitcoin Wallet Pro</h1>
      <p>اتصال Trust Wallet · شبکه بیت‌کوین اصلی</p>

      {!isConnected ? (
        <button onClick={() => open()}>
          اتصال Trust Wallet
        </button>
      ) : (
        <>
          <p>وضعیت: متصل</p>
          <p>کیف پول: {wallet?.name || 'کیف پول متصل‌شده'}</p>
          <p>آدرس بیت‌کوین:</p>
          <code
            style={{
              display: 'block',
              direction: 'ltr',
              overflowWrap: 'anywhere',
              padding: 12,
            }}
          >
            {address || 'آدرس هنوز دریافت نشده است'}
          </code>

          <button
            onClick={() =>
              signMessage({
                message: 'Oxana Bitcoin Wallet Pro - Connection Test',
                protocol: 'ecdsa',
              })
            }
            disabled={isPending}
          >
            {isPending ? 'در حال امضا...' : 'آزمایش امضای پیام'}
          </button>

          {isSuccess && signature?.signature && (
            <p>امضای پیام با موفقیت دریافت شد.</p>
          )}

          {error && (
            <p role="alert" style={{ color: 'red' }}>
              خطا: {error.message}
            </p>
          )}
        </>
      )}

      <p style={{ fontSize: 13, color: '#666' }}>
        این آزمایش پیام را امضا می‌کند؛ بیت‌کوینی ارسال نمی‌کند.
      </p>
    </main>
  );
}
