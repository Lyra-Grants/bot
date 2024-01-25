import type * as types from './types'
import type { ConfigOptions, FetchResponse } from 'api/dist/core'
import Oas from 'oas'
import APICore from 'api/dist/core'
import definition from './openapi.json'

class SDK {
  spec: Oas
  core: APICore

  constructor() {
    this.spec = Oas.init(definition)
    this.core = new APICore(this.spec, 'lyra-api/1.0.0 (api/6.1.1)')
  }

  /**
   * Optionally configure various options that the SDK allows.
   *
   * @param config Object of supported SDK options and toggles.
   * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
   * should be represented in milliseconds.
   */
  config(config: ConfigOptions) {
    this.core.setConfig(config)
  }

  /**
   * If the API you're using requires authentication you can supply the required credentials
   * through this method and the library will magically determine how they should be used
   * within your API request.
   *
   * With the exception of OpenID and MutualTLS, it supports all forms of authentication
   * supported by the OpenAPI specification.
   *
   * @example <caption>HTTP Basic auth</caption>
   * sdk.auth('username', 'password');
   *
   * @example <caption>Bearer tokens (HTTP or OAuth 2)</caption>
   * sdk.auth('myBearerToken');
   *
   * @example <caption>API Keys</caption>
   * sdk.auth('myApiKey');
   *
   * @see {@link https://spec.openapis.org/oas/v3.0.3#fixed-fields-22}
   * @see {@link https://spec.openapis.org/oas/v3.1.0#fixed-fields-22}
   * @param values Your auth credentials for the API; can specify up to two strings or numbers.
   */
  auth(...values: string[] | number[]) {
    this.core.setAuth(...values)
    return this
  }

  /**
   * If the API you're using offers alternate server URLs, and server variables, you can tell
   * the SDK which one to use with this method. To use it you can supply either one of the
   * server URLs that are contained within the OpenAPI definition (along with any server
   * variables), or you can pass it a fully qualified URL to use (that may or may not exist
   * within the OpenAPI definition).
   *
   * @example <caption>Server URL with server variables</caption>
   * sdk.server('https://{region}.api.example.com/{basePath}', {
   *   name: 'eu',
   *   basePath: 'v14',
   * });
   *
   * @example <caption>Fully qualified server URL</caption>
   * sdk.server('https://eu.api.example.com/v14');
   *
   * @param url Server URL
   * @param variables An object of variables to replace into the server URL.
   */
  server(url: string, variables = {}) {
    this.core.setServer(url, variables)
  }

  /**
   * Create a new account
   *
   * @summary Create Account
   */
  // tsignore
  postPublicCreate_account(
    body: types.PostPublicCreateAccountBodyParam,
  ): Promise<FetchResponse<200, types.PostPublicCreateAccountResponse200>> {
    return this.core.fetch('/public/create_account', 'post', body)
  }

  /**
   * Build a signable transaction params dictionary.
   *
   * @summary Build Register Session Key Tx
   */
  postPublicBuild_register_session_key_tx(
    body: types.PostPublicBuildRegisterSessionKeyTxBodyParam,
  ): Promise<FetchResponse<200, types.PostPublicBuildRegisterSessionKeyTxResponse200>> {
    return this.core.fetch('/public/build_register_session_key_tx', 'post', body)
  }

  /**
   * Register or update expiry of an existing session key.
   *
   * @summary Register Session Key
   */
  postPublicRegister_session_key(
    body: types.PostPublicRegisterSessionKeyBodyParam,
  ): Promise<FetchResponse<200, types.PostPublicRegisterSessionKeyResponse200>> {
    return this.core.fetch('/public/register_session_key', 'post', body)
  }

  /**
   * Deregister Session Key
   *
   */
  postPublicDeregister_session_key(
    body: types.PostPublicDeregisterSessionKeyBodyParam,
  ): Promise<FetchResponse<200, types.PostPublicDeregisterSessionKeyResponse200>> {
    return this.core.fetch('/public/deregister_session_key', 'post', body)
  }

  /**
   * Authenticate a websocket connection. Unavailable via HTTP.
   *
   * @summary Login
   */
  postPublicLogin(body: types.PostPublicLoginBodyParam): Promise<FetchResponse<200, types.PostPublicLoginResponse200>> {
    return this.core.fetch('/public/login', 'post', body)
  }

  /**
   * Get single instrument by asset name
   *
   * @summary Get Instrument
   */
  postPublicGet_instrument(
    body: types.PostPublicGetInstrumentBodyParam,
  ): Promise<FetchResponse<200, types.PostPublicGetInstrumentResponse200>> {
    return this.core.fetch('/public/get_instrument', 'post', body)
  }

  /**
   * Get all active instruments for a given `currency` and `type`
   *
   * @summary Get Instruments
   */
  postPublicGet_instruments(
    body: types.PostPublicGetInstrumentsBodyParam,
  ): Promise<FetchResponse<200, types.PostPublicGetInstrumentsResponse200>> {
    return this.core.fetch('/public/get_instruments', 'post', body)
  }

  /**
   * Get all active instrument tickers for a given `currency` and `type`
   *
   * @summary Get Ticker
   */
  postPublicGet_ticker(
    body: types.PostPublicGetTickerBodyParam,
  ): Promise<FetchResponse<200, types.PostPublicGetTickerResponse200>> {
    return this.core.fetch('/public/get_ticker', 'post', body)
  }

  /**
   * Get latest signed data feeds
   *
   * @summary Get Latest Signed Feeds
   */
  postPublicGet_latest_signed_feeds(
    body: types.PostPublicGetLatestSignedFeedsBodyParam,
  ): Promise<FetchResponse<200, types.PostPublicGetLatestSignedFeedsResponse200>> {
    return this.core.fetch('/public/get_latest_signed_feeds', 'post', body)
  }

  /**
   * Get spot feed history by currency
   *
   * @summary Get Spot Feed History
   */
  postPublicGet_spot_feed_history(
    body: types.PostPublicGetSpotFeedHistoryBodyParam,
  ): Promise<FetchResponse<200, types.PostPublicGetSpotFeedHistoryResponse200>> {
    return this.core.fetch('/public/get_spot_feed_history', 'post', body)
  }

  /**
   * Get trade history for a subaccount, with filter parameters.
   *
   * @summary Get Trade History
   */
  postPublicGet_trade_history(
    body: types.PostPublicGetTradeHistoryBodyParam,
  ): Promise<FetchResponse<200, types.PostPublicGetTradeHistoryResponse200>> {
    return this.core.fetch('/public/get_trade_history', 'post', body)
  }

  /**
   * Used for getting a transaction by its transaction id
   *
   * @summary Get Transaction
   */
  postPublicGet_transaction(
    body: types.PostPublicGetTransactionBodyParam,
  ): Promise<FetchResponse<200, types.PostPublicGetTransactionResponse200>> {
    return this.core.fetch('/public/get_transaction', 'post', body)
  }

  /**
   * Calculates margin for a given portfolio and (optionally) a simulated state change. Does
   * not take into account
   * open orders margin requirements.
   *
   * @summary Get Margin
   */
  postPublicGet_margin(
    body: types.PostPublicGetMarginBodyParam,
  ): Promise<FetchResponse<200, types.PostPublicGetMarginResponse200>> {
    return this.core.fetch('/public/get_margin', 'post', body)
  }

  /**
   * Calculates MtM and maintenance margin for a given subaccount.
   *
   * @summary Margin Watch
   */
  postPublicMargin_watch(
    body: types.PostPublicMarginWatchBodyParam,
  ): Promise<FetchResponse<200, types.PostPublicMarginWatchResponse200>> {
    return this.core.fetch('/public/margin_watch', 'post', body)
  }

  /**
   * Account details getter
   *
   * @summary Get Account
   */
  postPrivateGet_account(
    body: types.PostPrivateGetAccountBodyParam,
  ): Promise<FetchResponse<200, types.PostPrivateGetAccountResponse200>> {
    return this.core.fetch('/private/get_account', 'post', body)
  }

  /**
   * Create a new subaccount under a given wallet, and deposit an asset into that subaccount.
   *
   * @summary Create Subaccount
   */
  postPrivateCreate_subaccount(
    body: types.PostPrivateCreateSubaccountBodyParam,
  ): Promise<FetchResponse<200, types.PostPrivateCreateSubaccountResponse200>> {
    return this.core.fetch('/private/create_subaccount', 'post', body)
  }

  /**
   * Used for debugging only, do not use in production. Will return the incremental encoded
   * and hashed data.
   *
   * @summary Create Subaccount Debug
   */
  postPublicCreate_subaccount_debug(
    body: types.PostPublicCreateSubaccountDebugBodyParam,
  ): Promise<FetchResponse<200, types.PostPublicCreateSubaccountDebugResponse200>> {
    return this.core.fetch('/public/create_subaccount_debug', 'post', body)
  }

  /**
   * Get open orders, active positions, and collaterals of a subaccount
   *
   * @summary Get Subaccount
   */
  postPrivateGet_subaccount(
    body: types.PostPrivateGetSubaccountBodyParam,
  ): Promise<FetchResponse<200, types.PostPrivateGetSubaccountResponse200>> {
    return this.core.fetch('/private/get_subaccount', 'post', body)
  }

  /**
   * Get all subaccounts of an account / wallet
   *
   * @summary Get Subaccounts
   */
  postPrivateGet_subaccounts(
    body: types.PostPrivateGetSubaccountsBodyParam,
  ): Promise<FetchResponse<200, types.PostPrivateGetSubaccountsResponse200>> {
    return this.core.fetch('/private/get_subaccounts', 'post', body)
  }

  /**
   * Change a user defined label for given subaccount
   *
   * @summary Change Subaccount Label
   */
  postPrivateChange_subaccount_label(
    body: types.PostPrivateChangeSubaccountLabelBodyParam,
  ): Promise<FetchResponse<200, types.PostPrivateChangeSubaccountLabelResponse200>> {
    return this.core.fetch('/private/change_subaccount_label', 'post', body)
  }

  /**
   * Get the notifications related to a subaccount.
   *
   * @summary Get Notifications
   */
  postPrivateGet_notifications(
    body: types.PostPrivateGetNotificationsBodyParam,
  ): Promise<FetchResponse<200, types.PostPrivateGetNotificationsResponse200>> {
    return this.core.fetch('/private/get_notifications', 'post', body)
  }

  /**
   * RPC to mark specified notifications as seen for a given subaccount.
   *
   * @summary Update Notifications
   */
  postPrivateUpdate_notifications(
    body: types.PostPrivateUpdateNotificationsBodyParam,
  ): Promise<FetchResponse<200, types.PostPrivateUpdateNotificationsResponse200>> {
    return this.core.fetch('/private/update_notifications', 'post', body)
  }

  /**
   * Deposit an asset to a subaccount.
   *
   * @summary Deposit
   */
  postPrivateDeposit(
    body: types.PostPrivateDepositBodyParam,
  ): Promise<FetchResponse<200, types.PostPrivateDepositResponse200>> {
    return this.core.fetch('/private/deposit', 'post', body)
  }

  /**
   * Withdraw an asset to wallet.
   *
   * @summary Withdraw
   */
  postPrivateWithdraw(
    body: types.PostPrivateWithdrawBodyParam,
  ): Promise<FetchResponse<200, types.PostPrivateWithdrawResponse200>> {
    return this.core.fetch('/private/withdraw', 'post', body)
  }

  /**
   * Transfer ERC20 assets from one subaccount to another (e.g. USDC or ETH).
   *
   * For transfering positions (e.g. options or perps), use `private/transfer_position`
   * instead.
   *
   * @summary Transfer Erc20
   */
  postPrivateTransfer_erc20(
    body: types.PostPrivateTransferErc20BodyParam,
  ): Promise<FetchResponse<200, types.PostPrivateTransferErc20Response200>> {
    return this.core.fetch('/private/transfer_erc20', 'post', body)
  }

  /**
   * Transfers a positions from one subaccount to another, owned by the same wallet.
   *
   * The transfer is executed as a pair of orders crossing each other.
   * The maker order is created first, followed by a taker order crossing it.
   * The order amounts, limit prices and instrument name must be the same for both orders.
   * Fee is not charged and a zero `max_fee` must be signed.
   * The maker order is forcibly considered to be `reduce_only`, meaning it can only reduce
   * the position size.
   *
   * History: For position transfer history, use the `private/get_trade_history` RPC (not
   * `private/get_erc20_transfer_history`).
   *
   * @summary Transfer Position
   */
  postPrivateTransfer_position(
    body: types.PostPrivateTransferPositionBodyParam,
  ): Promise<FetchResponse<200, types.PostPrivateTransferPositionResponse200>> {
    return this.core.fetch('/private/transfer_position', 'post', body)
  }

  /**
   * Create a new order
   *
   * @summary Order
   */
  postPrivateOrder(
    body: types.PostPrivateOrderBodyParam,
  ): Promise<FetchResponse<200, types.PostPrivateOrderResponse200>> {
    return this.core.fetch('/private/order', 'post', body)
  }

  /**
   * Debug a new order
   *
   * @summary Order Debug
   */
  postPrivateOrder_debug(
    body: types.PostPrivateOrderDebugBodyParam,
  ): Promise<FetchResponse<200, types.PostPrivateOrderDebugResponse200>> {
    return this.core.fetch('/private/order_debug', 'post', body)
  }

  /**
   * Get state of an order by order id
   *
   * @summary Get Order
   */
  postPrivateGet_order(
    body: types.PostPrivateGetOrderBodyParam,
  ): Promise<FetchResponse<200, types.PostPrivateGetOrderResponse200>> {
    return this.core.fetch('/private/get_order', 'post', body)
  }

  /**
   * Get orders for a subaccount, with optional filtering.
   *
   * @summary Get Orders
   */
  postPrivateGet_orders(
    body: types.PostPrivateGetOrdersBodyParam,
  ): Promise<FetchResponse<200, types.PostPrivateGetOrdersResponse200>> {
    return this.core.fetch('/private/get_orders', 'post', body)
  }

  /**
   * Get all open orders of a subacccount
   *
   * @summary Get Open Orders
   */
  postPrivateGet_open_orders(
    body: types.PostPrivateGetOpenOrdersBodyParam,
  ): Promise<FetchResponse<200, types.PostPrivateGetOpenOrdersResponse200>> {
    return this.core.fetch('/private/get_open_orders', 'post', body)
  }

  /**
   * Cancel a single order.
   *
   * @summary Cancel
   */
  postPrivateCancel(
    body: types.PostPrivateCancelBodyParam,
  ): Promise<FetchResponse<200, types.PostPrivateCancelResponse200>> {
    return this.core.fetch('/private/cancel', 'post', body)
  }

  /**
   * Cancel all open orders for a given subaccount and a given label.
   *
   * @summary Cancel By Label
   */
  postPrivateCancel_by_label(
    body: types.PostPrivateCancelByLabelBodyParam,
  ): Promise<FetchResponse<200, types.PostPrivateCancelByLabelResponse200>> {
    return this.core.fetch('/private/cancel_by_label', 'post', body)
  }

  /**
   * Cancel an order with a given subaccount and a given nonce.
   *
   * @summary Cancel By Nonce
   */
  postPrivateCancel_by_nonce(
    body: types.PostPrivateCancelByNonceBodyParam,
  ): Promise<FetchResponse<200, types.PostPrivateCancelByNonceResponse200>> {
    return this.core.fetch('/private/cancel_by_nonce', 'post', body)
  }

  /**
   * Cancel all open orders for a given subaccount and a given instrument.
   *
   * @summary Cancel By Instrument
   */
  postPrivateCancel_by_instrument(
    body: types.PostPrivateCancelByInstrumentBodyParam,
  ): Promise<FetchResponse<200, types.PostPrivateCancelByInstrumentResponse200>> {
    return this.core.fetch('/private/cancel_by_instrument', 'post', body)
  }

  /**
   * Cancel all open orders for a given subaccount.
   *
   * @summary Cancel All
   */
  postPrivateCancel_all(
    body: types.PostPrivateCancelAllBodyParam,
  ): Promise<FetchResponse<200, types.PostPrivateCancelAllResponse200>> {
    return this.core.fetch('/private/cancel_all', 'post', body)
  }

  /**
   * Get order history for a subaccount
   *
   * @summary Get Order History
   */
  postPrivateGet_order_history(
    body: types.PostPrivateGetOrderHistoryBodyParam,
  ): Promise<FetchResponse<200, types.PostPrivateGetOrderHistoryResponse200>> {
    return this.core.fetch('/private/get_order_history', 'post', body)
  }

  /**
   * Get trade history for a subaccount, with filter parameters.
   *
   * @summary Get Trade History
   */
  postPrivateGet_trade_history(
    body: types.PostPrivateGetTradeHistoryBodyParam,
  ): Promise<FetchResponse<200, types.PostPrivateGetTradeHistoryResponse200>> {
    return this.core.fetch('/private/get_trade_history', 'post', body)
  }

  /**
   * Get subaccount deposit history.
   *
   * @summary Get Deposit History
   */
  postPrivateGet_deposit_history(
    body: types.PostPrivateGetDepositHistoryBodyParam,
  ): Promise<FetchResponse<200, types.PostPrivateGetDepositHistoryResponse200>> {
    return this.core.fetch('/private/get_deposit_history', 'post', body)
  }

  /**
   * Get subaccount withdrawal history.
   *
   * @summary Get Withdrawal History
   */
  postPrivateGet_withdrawal_history(
    body: types.PostPrivateGetWithdrawalHistoryBodyParam,
  ): Promise<FetchResponse<200, types.PostPrivateGetWithdrawalHistoryResponse200>> {
    return this.core.fetch('/private/get_withdrawal_history', 'post', body)
  }

  /**
   * Calculates margin for a given subaccount and (optionally) a simulated state change. Does
   * not take into account
   * open orders margin requirements.
   *
   * @summary Get Margin
   */
  postPrivateGet_margin(
    body: types.PostPrivateGetMarginBodyParam,
  ): Promise<FetchResponse<200, types.PostPrivateGetMarginResponse200>> {
    return this.core.fetch('/private/get_margin', 'post', body)
  }

  /**
   * Get collaterals of a subaccount
   *
   * @summary Get Collaterals
   */
  postPrivateGet_collaterals(
    body: types.PostPrivateGetCollateralsBodyParam,
  ): Promise<FetchResponse<200, types.PostPrivateGetCollateralsResponse200>> {
    return this.core.fetch('/private/get_collaterals', 'post', body)
  }

  /**
   * Get active positions of a subaccount
   *
   * @summary Get Positions
   */
  postPrivateGet_positions(
    body: types.PostPrivateGetPositionsBodyParam,
  ): Promise<FetchResponse<200, types.PostPrivateGetPositionsResponse200>> {
    return this.core.fetch('/private/get_positions', 'post', body)
  }

  /**
   * Get expired option settlement history for a subaccount
   *
   * @summary Get Option Settlement History
   */
  postPrivateGet_option_settlement_history(
    body: types.PostPrivateGetOptionSettlementHistoryBodyParam,
  ): Promise<FetchResponse<200, types.PostPrivateGetOptionSettlementHistoryResponse200>> {
    return this.core.fetch('/private/get_option_settlement_history', 'post', body)
  }

  /**
   * Get the value history of a subaccount
   *
   * @summary Get Subaccount Value History
   */
  postPrivateGet_subaccount_value_history(
    body: types.PostPrivateGetSubaccountValueHistoryBodyParam,
  ): Promise<FetchResponse<200, types.PostPrivateGetSubaccountValueHistoryResponse200>> {
    return this.core.fetch('/private/get_subaccount_value_history', 'post', body)
  }

  /**
   * Generate a list of URLs to retrieve archived orders
   *
   * @summary Expired And Cancelled History
   */
  postPrivateExpired_and_cancelled_history(
    body: types.PostPrivateExpiredAndCancelledHistoryBodyParam,
  ): Promise<FetchResponse<200, types.PostPrivateExpiredAndCancelledHistoryResponse200>> {
    return this.core.fetch('/private/expired_and_cancelled_history', 'post', body)
  }

  /**
   * Get subaccount funding history.
   *
   * @summary Get Funding History
   */
  postPrivateGet_funding_history(
    body: types.PostPrivateGetFundingHistoryBodyParam,
  ): Promise<FetchResponse<200, types.PostPrivateGetFundingHistoryResponse200>> {
    return this.core.fetch('/private/get_funding_history', 'post', body)
  }

  /**
   * Get subaccount interest payment history.
   *
   * @summary Get Interest History
   */
  postPrivateGet_interest_history(
    body: types.PostPrivateGetInterestHistoryBodyParam,
  ): Promise<FetchResponse<200, types.PostPrivateGetInterestHistoryResponse200>> {
    return this.core.fetch('/private/get_interest_history', 'post', body)
  }

  /**
   * Get subaccount erc20 transfer history.
   *
   * Position transfers (e.g. options or perps) are treated as trades. Use
   * `private/get_trade_history` for position transfer history.
   *
   * @summary Get Erc20 Transfer History
   */
  postPrivateGet_erc20_transfer_history(
    body: types.PostPrivateGetErc20TransferHistoryBodyParam,
  ): Promise<FetchResponse<200, types.PostPrivateGetErc20TransferHistoryResponse200>> {
    return this.core.fetch('/private/get_erc20_transfer_history', 'post', body)
  }

  /**
   * Get Liquidation History
   *
   */
  postPrivateGet_liquidation_history(
    body: types.PostPrivateGetLiquidationHistoryBodyParam,
  ): Promise<FetchResponse<200, types.PostPrivateGetLiquidationHistoryResponse200>> {
    return this.core.fetch('/private/get_liquidation_history', 'post', body)
  }

  /**
   * Session Keys
   *
   */
  postPrivateSession_keys(
    body: types.PostPrivateSessionKeysBodyParam,
  ): Promise<FetchResponse<200, types.PostPrivateSessionKeysResponse200>> {
    return this.core.fetch('/private/session_keys', 'post', body)
  }

  /**
   * Change Session Key Label
   *
   */
  postPrivateChange_session_key_label(
    body: types.PostPrivateChangeSessionKeyLabelBodyParam,
  ): Promise<FetchResponse<200, types.PostPrivateChangeSessionKeyLabelResponse200>> {
    return this.core.fetch('/private/change_session_key_label', 'post', body)
  }

  /**
   * Get the current mmp config for a subaccount (optionally filtered by currency)
   *
   * @summary Get Mmp Config
   */
  postPrivateGet_mmp_config(
    body: types.PostPrivateGetMmpConfigBodyParam,
  ): Promise<FetchResponse<200, types.PostPrivateGetMmpConfigResponse200>> {
    return this.core.fetch('/private/get_mmp_config', 'post', body)
  }

  /**
   * Set the mmp config for the subaccount and currency
   *
   * @summary Set Mmp Config
   */
  postPrivateSet_mmp_config(
    body: types.PostPrivateSetMmpConfigBodyParam,
  ): Promise<FetchResponse<200, types.PostPrivateSetMmpConfigResponse200>> {
    return this.core.fetch('/private/set_mmp_config', 'post', body)
  }

  /**
   * Resets (unfreezes) the mmp state for a subaccount (optionally filtered by currency)
   *
   * @summary Reset Mmp
   */
  postPrivateReset_mmp(
    body: types.PostPrivateResetMmpBodyParam,
  ): Promise<FetchResponse<200, types.PostPrivateResetMmpResponse200>> {
    return this.core.fetch('/private/reset_mmp', 'post', body)
  }

  /**
   * Enables cancel on disconnect for the account
   *
   * @summary Set Cancel On Disconnect
   */
  postPrivateSet_cancel_on_disconnect(
    body: types.PostPrivateSetCancelOnDisconnectBodyParam,
  ): Promise<FetchResponse<200, types.PostPrivateSetCancelOnDisconnectResponse200>> {
    return this.core.fetch('/private/set_cancel_on_disconnect', 'post', body)
  }

  /**
   * Get Time
   *
   */
  postPublicGet_time(
    body: types.PostPublicGetTimeBodyParam,
  ): Promise<FetchResponse<200, types.PostPublicGetTimeResponse200>> {
    return this.core.fetch('/public/get_time', 'post', body)
  }
}

const createSDK = (() => {
  return new SDK()
})()
export default createSDK

export type {
  PostPrivateCancelAllBodyParam,
  PostPrivateCancelAllResponse200,
  PostPrivateCancelBodyParam,
  PostPrivateCancelByInstrumentBodyParam,
  PostPrivateCancelByInstrumentResponse200,
  PostPrivateCancelByLabelBodyParam,
  PostPrivateCancelByLabelResponse200,
  PostPrivateCancelByNonceBodyParam,
  PostPrivateCancelByNonceResponse200,
  PostPrivateCancelResponse200,
  PostPrivateChangeSessionKeyLabelBodyParam,
  PostPrivateChangeSessionKeyLabelResponse200,
  PostPrivateChangeSubaccountLabelBodyParam,
  PostPrivateChangeSubaccountLabelResponse200,
  PostPrivateCreateSubaccountBodyParam,
  PostPrivateCreateSubaccountResponse200,
  PostPrivateDepositBodyParam,
  PostPrivateDepositResponse200,
  PostPrivateExpiredAndCancelledHistoryBodyParam,
  PostPrivateExpiredAndCancelledHistoryResponse200,
  PostPrivateGetAccountBodyParam,
  PostPrivateGetAccountResponse200,
  PostPrivateGetCollateralsBodyParam,
  PostPrivateGetCollateralsResponse200,
  PostPrivateGetDepositHistoryBodyParam,
  PostPrivateGetDepositHistoryResponse200,
  PostPrivateGetErc20TransferHistoryBodyParam,
  PostPrivateGetErc20TransferHistoryResponse200,
  PostPrivateGetFundingHistoryBodyParam,
  PostPrivateGetFundingHistoryResponse200,
  PostPrivateGetInterestHistoryBodyParam,
  PostPrivateGetInterestHistoryResponse200,
  PostPrivateGetLiquidationHistoryBodyParam,
  PostPrivateGetLiquidationHistoryResponse200,
  PostPrivateGetMarginBodyParam,
  PostPrivateGetMarginResponse200,
  PostPrivateGetMmpConfigBodyParam,
  PostPrivateGetMmpConfigResponse200,
  PostPrivateGetNotificationsBodyParam,
  PostPrivateGetNotificationsResponse200,
  PostPrivateGetOpenOrdersBodyParam,
  PostPrivateGetOpenOrdersResponse200,
  PostPrivateGetOptionSettlementHistoryBodyParam,
  PostPrivateGetOptionSettlementHistoryResponse200,
  PostPrivateGetOrderBodyParam,
  PostPrivateGetOrderHistoryBodyParam,
  PostPrivateGetOrderHistoryResponse200,
  PostPrivateGetOrderResponse200,
  PostPrivateGetOrdersBodyParam,
  PostPrivateGetOrdersResponse200,
  PostPrivateGetPositionsBodyParam,
  PostPrivateGetPositionsResponse200,
  PostPrivateGetSubaccountBodyParam,
  PostPrivateGetSubaccountResponse200,
  PostPrivateGetSubaccountValueHistoryBodyParam,
  PostPrivateGetSubaccountValueHistoryResponse200,
  PostPrivateGetSubaccountsBodyParam,
  PostPrivateGetSubaccountsResponse200,
  PostPrivateGetTradeHistoryBodyParam,
  PostPrivateGetTradeHistoryResponse200,
  PostPrivateGetWithdrawalHistoryBodyParam,
  PostPrivateGetWithdrawalHistoryResponse200,
  PostPrivateOrderBodyParam,
  PostPrivateOrderDebugBodyParam,
  PostPrivateOrderDebugResponse200,
  PostPrivateOrderResponse200,
  PostPrivateResetMmpBodyParam,
  PostPrivateResetMmpResponse200,
  PostPrivateSessionKeysBodyParam,
  PostPrivateSessionKeysResponse200,
  PostPrivateSetCancelOnDisconnectBodyParam,
  PostPrivateSetCancelOnDisconnectResponse200,
  PostPrivateSetMmpConfigBodyParam,
  PostPrivateSetMmpConfigResponse200,
  PostPrivateTransferErc20BodyParam,
  PostPrivateTransferErc20Response200,
  PostPrivateTransferPositionBodyParam,
  PostPrivateTransferPositionResponse200,
  PostPrivateUpdateNotificationsBodyParam,
  PostPrivateUpdateNotificationsResponse200,
  PostPrivateWithdrawBodyParam,
  PostPrivateWithdrawResponse200,
  PostPublicBuildRegisterSessionKeyTxBodyParam,
  PostPublicBuildRegisterSessionKeyTxResponse200,
  PostPublicCreateAccountBodyParam,
  PostPublicCreateAccountResponse200,
  PostPublicCreateSubaccountDebugBodyParam,
  PostPublicCreateSubaccountDebugResponse200,
  PostPublicDeregisterSessionKeyBodyParam,
  PostPublicDeregisterSessionKeyResponse200,
  PostPublicGetInstrumentBodyParam,
  PostPublicGetInstrumentResponse200,
  PostPublicGetInstrumentsBodyParam,
  PostPublicGetInstrumentsResponse200,
  PostPublicGetLatestSignedFeedsBodyParam,
  PostPublicGetLatestSignedFeedsResponse200,
  PostPublicGetMarginBodyParam,
  PostPublicGetMarginResponse200,
  PostPublicGetSpotFeedHistoryBodyParam,
  PostPublicGetSpotFeedHistoryResponse200,
  PostPublicGetTickerBodyParam,
  PostPublicGetTickerResponse200,
  PostPublicGetTimeBodyParam,
  PostPublicGetTimeResponse200,
  PostPublicGetTradeHistoryBodyParam,
  PostPublicGetTradeHistoryResponse200,
  PostPublicGetTransactionBodyParam,
  PostPublicGetTransactionResponse200,
  PostPublicLoginBodyParam,
  PostPublicLoginResponse200,
  PostPublicMarginWatchBodyParam,
  PostPublicMarginWatchResponse200,
  PostPublicRegisterSessionKeyBodyParam,
  PostPublicRegisterSessionKeyResponse200,
} from './types'
