
import { appKit } from './config/appKit';
import { store } from './store/appkitStore';
import {
  updateTheme,
  updateButtonVisibility
} from './utils/dom';
import {
  signMessage,
  getBalance
} from './services/wallet';
import { initializeSubscribers } from './utils/subscribers';

const getElement = (id) => document.getElementById(id);

const showError = (message) => {
  console.error(message);
  window.alert(message);
};

initializeSubscribers(appKit);

updateButtonVisibility(appKit.getIsConnectedState());

getElement('open-connect-modal')?.addEventListener(
  'click',
  () => appKit.open()
);

getElement('disconnect')?.addEventListener(
  'click',
  async () => {
    try {
      await appKit.disconnect();
    } catch (error) {
      showError(error.message || 'قطع اتصال کیف پول ناموفق بود.');
    }
  }
);

// امضای پیام آزمایشی؛ این کار تراکنش مالی نیست.
getElement('sign-message')?.addEventListener(
  'click',
  async () => {
    try {
      const address = store.accountState?.address;
      const provider = store.bip122Provider;

      if (!address || !provider) {
        throw new Error('ابتدا کیف پول بیت‌کوین را متصل کن.');
      }

      const signature = await signMessage(provider, address);
      const output = getElement('signatureState');

      if (output) {
        output.textContent =
          typeof signature === 'string'
            ? signature
            : JSON.stringify(signature, null, 2);
      }

      const section = getElement('signatureSection');
      if (section) section.style.display = '';
    } catch (error) {
      showError(error.message || 'امضای پیام ناموفق بود.');
    }
  }
);

// دریافت موجودی عمومی بیت‌کوین
getElement('get-balance')?.addEventListener(
  'click',
  async () => {
    try {
      const address = store.accountState?.address;
      const provider = store.bip122Provider;

      if (!address || !provider) {
        throw new Error('ابتدا کیف پول بیت‌کوین را متصل کن.');
      }

      const balance = await getBalance(provider, address);
      const output = getElement('balanceState');

      if (output) {
        output.textContent =
          `${balance.totalBTC.toFixed(8)} BTC ` +
          `(${balance.totalSats.toLocaleString('en-US')} sats)`;
      }

      const section = getElement('balanceSection');
      if (section) section.style.display = '';
    } catch (error) {
      showError(error.message || 'دریافت موجودی ناموفق بود.');
    }
  }
);

// ارسال واقعی هنوز پیاده‌سازی نشده است؛ از ارسال ساختگی جلوگیری می‌کنیم.
getElement('send-tx')?.addEventListener(
  'click',
  () => {
    showError(
      'ارسال تراکنش هنوز آماده نیست. ' +
      'ابتدا ساخت PSBT، تأیید جزئیات و امضای امن کیف پول باید پیاده‌سازی شود.'
    );
  }
);

updateTheme(store.themeState.themeMode);
