// src/services/HandCashService.js

import { Environments, HandCashConnect } from "@handcash/handcash-connect";

const appId = process.env.HANDCASH_APP_ID;
const appSecret = process.env.HANDCASH_APP_SECRET;

const handCashConnect = new HandCashConnect({
  appId: appId,
  appSecret: appSecret,
});

export default class HandCashService {
  constructor(authToken) {
    this.account = handCashConnect.getAccountFromAuthToken(authToken);
  }

  async getProfile() {
    return this.account.profile.getCurrentProfile();
  }

  async pay({ destination, amount, currencyCode, description, attachment }) {
    return this.account.wallet.pay({
      payments: [{ destination, amount, currencyCode }],
      description: description || 'Sent from HandCash',
      attachment: attachment, // Include attachment in the payment
    });
  }

  getRedirectionUrl() {
    return handCashConnect.getRedirectionUrl();
  }
  async getSpendableBalance() {
    return await this.account.wallet.getSpendableBalance();
  }

}