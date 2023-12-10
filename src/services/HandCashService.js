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

  async pay({ destination, amount, currencyCode, description }) {
    return this.account.wallet.pay({
      payments: [
        { destination, amount, currencyCode },
      ],
      description: description || 'Sent from the HandCash',
    });
  }

  getRedirectionUrl() {
    return handCashConnect.getRedirectionUrl();
  }
  async getSpendableBalance() {
    return await this.account.wallet.getSpendableBalance();
  }

}