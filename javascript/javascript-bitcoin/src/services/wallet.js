
const MEMPOOL_API = 'https://mempool.space/api';

function requireAddress(address) {
  if (
    typeof address !== 'string' ||
    !address.startsWith('bc1') &&
    !address.startsWith('1') &&
    !address.startsWith('3')
  ) {
    throw new Error('آدرس بیت‌کوین معتبر نیست.');
  }

  return address;
}

async function fetchJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `خطا در دریافت اطلاعات بیت‌کوین: ${response.status}`
    );
  }

  return response.json();
}

// امضای پیام آزمایشی؛ این کار تراکنش مالی نیست.
export async function signMessage(provider, address) {
  if (!provider) {
    throw new Error('ابتدا کیف پول را متصل کن.');
  }

  requireAddress(address);

  if (typeof provider.signMessage !== 'function') {
    throw new Error(
      'این اتصال، قابلیت امضای پیام را ارائه نمی‌کند.'
    );
  }

  return provider.signMessage({
    message: 'Oxana Bitcoin Wallet Pro - Connection Test',
    address
  });
}

// دریافت موجودی عمومی آدرس، بر حسب ساتوشی.
export async function getBalance(provider, address) {
  if (!provider) {
    throw new Error('ابتدا کیف پول را متصل کن.');
  }

  requireAddress(address);

  const data = await fetchJson(
    `${MEMPOOL_API}/address/${encodeURIComponent(address)}`
  );

  const confirmed =
    data.chain_stats.funded_txo_sum -
    data.chain_stats.spent_txo_sum;

  const unconfirmed =
    data.mempool_stats.funded_txo_sum -
    data.mempool_stats.spent_txo_sum;

  return {
    confirmedSats: confirmed,
    unconfirmedSats: unconfirmed,
    totalSats: confirmed + unconfirmed,
    totalBTC: (confirmed + unconfirmed) / 100000000
  };
}

// دریافت خروجی‌های خرج‌نشده؛ به‌تنهایی تراکنشی نمی‌سازد.
export async function getUTXOs(address) {
  requireAddress(address);

  return fetchJson(
    `${MEMPOOL_API}/address/${encodeURIComponent(address)}/utxo`
  );
}
