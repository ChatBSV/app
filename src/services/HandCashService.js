// src/services/HandCashService.js

import { Environments, HandCashConnect } from "@handcash/handcash-connect";

const appId = process.env.HANDCASH_APP_ID;
const appSecret = process.env.HANDCASH_APP_SECRET;

const handCashConnect = new HandCashConnect({
  appId: appId,
  appSecret: appSecret,
});

/**
 * Represents a service for interacting with HandCash API.
 */
export default class HandCashService {
  /**
   * Creates an instance of HandCashService.
   * @param {string} authToken - The authentication token for the HandCash account.
   */
  constructor(authToken) {
    this.account = handCashConnect.getAccountFromAuthToken(authToken);
  }

  /**
   * Retrieves the profile information of the HandCash account.
   * @returns {Promise<Object>} - A promise that resolves to the profile information.
   */
  async getProfile() {
    return this.account.profile.getCurrentProfile();
  }

  /**
   * Sends a payment from the HandCash account to a specified destination.
   * @param {Object} payment - The payment details.
   * @param {string} payment.destination - The destination address.
   * @param {number} payment.amount - The amount to be sent.
   * @param {string} payment.currencyCode - The currency code of the payment.
   * @param {string} [payment.description] - The description of the payment (optional).
   * @returns {Promise<Object>} - A promise that resolves to the payment result.
   */
  async pay({ destination, amount, currencyCode, description }) {
    return this.account.wallet.pay({
      payments: [
        { destination, amount, currencyCode },
      ],
      description: description || 'Sent from the HandCash',
    });
  }

  /**
   * Retrieves the redirection URL for HandCash authentication.
   * @returns {string} - The redirection URL.
   */
  getRedirectionUrl() {
    return handCashConnect.getRedirectionUrl();
  }
}