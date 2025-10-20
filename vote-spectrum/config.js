export const getConsentWebhookUrl = () => {
  if (typeof window !== 'undefined' && window.__VOTE_SPECTRUM_CONFIG__) {
    return window.__VOTE_SPECTRUM_CONFIG__.consentWebhookUrl || '';
  }

  if (typeof process !== 'undefined' && process.env) {
    return (
      process.env.VOTE_SPECTRUM_WEBHOOK_URL ||
      process.env.REACT_APP_VOTE_SPECTRUM_WEBHOOK_URL ||
      process.env.NEXT_PUBLIC_VOTE_SPECTRUM_WEBHOOK_URL ||
      ''
    );
  }

  return '';
};
