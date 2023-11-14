// pages/api/getRedirectionUrl.js

import HandCashService from '../../src/services/HandCashService';

export default async function handler(req, res) {
  const handCashService = new HandCashService();
  const url = handCashService.getRedirectionUrl(req.query.hasPrompt === 'true');
  res.status(200).json({ url });
}
