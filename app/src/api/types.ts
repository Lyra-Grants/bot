import type { FromSchema } from 'json-schema-to-ts';
import * as schemas from './schemas';

export type PostPrivateCancelAllBodyParam = FromSchema<typeof schemas.PostPrivateCancelAll.body>;
export type PostPrivateCancelAllResponse200 = FromSchema<typeof schemas.PostPrivateCancelAll.response['200']>;
export type PostPrivateCancelBodyParam = FromSchema<typeof schemas.PostPrivateCancel.body>;
export type PostPrivateCancelByInstrumentBodyParam = FromSchema<typeof schemas.PostPrivateCancelByInstrument.body>;
export type PostPrivateCancelByInstrumentResponse200 = FromSchema<typeof schemas.PostPrivateCancelByInstrument.response['200']>;
export type PostPrivateCancelByLabelBodyParam = FromSchema<typeof schemas.PostPrivateCancelByLabel.body>;
export type PostPrivateCancelByLabelResponse200 = FromSchema<typeof schemas.PostPrivateCancelByLabel.response['200']>;
export type PostPrivateCancelByNonceBodyParam = FromSchema<typeof schemas.PostPrivateCancelByNonce.body>;
export type PostPrivateCancelByNonceResponse200 = FromSchema<typeof schemas.PostPrivateCancelByNonce.response['200']>;
export type PostPrivateCancelResponse200 = FromSchema<typeof schemas.PostPrivateCancel.response['200']>;
export type PostPrivateChangeSessionKeyLabelBodyParam = FromSchema<typeof schemas.PostPrivateChangeSessionKeyLabel.body>;
export type PostPrivateChangeSessionKeyLabelResponse200 = FromSchema<typeof schemas.PostPrivateChangeSessionKeyLabel.response['200']>;
export type PostPrivateChangeSubaccountLabelBodyParam = FromSchema<typeof schemas.PostPrivateChangeSubaccountLabel.body>;
export type PostPrivateChangeSubaccountLabelResponse200 = FromSchema<typeof schemas.PostPrivateChangeSubaccountLabel.response['200']>;
export type PostPrivateCreateSubaccountBodyParam = FromSchema<typeof schemas.PostPrivateCreateSubaccount.body>;
export type PostPrivateCreateSubaccountResponse200 = FromSchema<typeof schemas.PostPrivateCreateSubaccount.response['200']>;
export type PostPrivateDepositBodyParam = FromSchema<typeof schemas.PostPrivateDeposit.body>;
export type PostPrivateDepositResponse200 = FromSchema<typeof schemas.PostPrivateDeposit.response['200']>;
export type PostPrivateExpiredAndCancelledHistoryBodyParam = FromSchema<typeof schemas.PostPrivateExpiredAndCancelledHistory.body>;
export type PostPrivateExpiredAndCancelledHistoryResponse200 = FromSchema<typeof schemas.PostPrivateExpiredAndCancelledHistory.response['200']>;
export type PostPrivateGetAccountBodyParam = FromSchema<typeof schemas.PostPrivateGetAccount.body>;
export type PostPrivateGetAccountResponse200 = FromSchema<typeof schemas.PostPrivateGetAccount.response['200']>;
export type PostPrivateGetCollateralsBodyParam = FromSchema<typeof schemas.PostPrivateGetCollaterals.body>;
export type PostPrivateGetCollateralsResponse200 = FromSchema<typeof schemas.PostPrivateGetCollaterals.response['200']>;
export type PostPrivateGetDepositHistoryBodyParam = FromSchema<typeof schemas.PostPrivateGetDepositHistory.body>;
export type PostPrivateGetDepositHistoryResponse200 = FromSchema<typeof schemas.PostPrivateGetDepositHistory.response['200']>;
export type PostPrivateGetErc20TransferHistoryBodyParam = FromSchema<typeof schemas.PostPrivateGetErc20TransferHistory.body>;
export type PostPrivateGetErc20TransferHistoryResponse200 = FromSchema<typeof schemas.PostPrivateGetErc20TransferHistory.response['200']>;
export type PostPrivateGetFundingHistoryBodyParam = FromSchema<typeof schemas.PostPrivateGetFundingHistory.body>;
export type PostPrivateGetFundingHistoryResponse200 = FromSchema<typeof schemas.PostPrivateGetFundingHistory.response['200']>;
export type PostPrivateGetInterestHistoryBodyParam = FromSchema<typeof schemas.PostPrivateGetInterestHistory.body>;
export type PostPrivateGetInterestHistoryResponse200 = FromSchema<typeof schemas.PostPrivateGetInterestHistory.response['200']>;
export type PostPrivateGetLiquidationHistoryBodyParam = FromSchema<typeof schemas.PostPrivateGetLiquidationHistory.body>;
export type PostPrivateGetLiquidationHistoryResponse200 = FromSchema<typeof schemas.PostPrivateGetLiquidationHistory.response['200']>;
export type PostPrivateGetMarginBodyParam = FromSchema<typeof schemas.PostPrivateGetMargin.body>;
export type PostPrivateGetMarginResponse200 = FromSchema<typeof schemas.PostPrivateGetMargin.response['200']>;
export type PostPrivateGetMmpConfigBodyParam = FromSchema<typeof schemas.PostPrivateGetMmpConfig.body>;
export type PostPrivateGetMmpConfigResponse200 = FromSchema<typeof schemas.PostPrivateGetMmpConfig.response['200']>;
export type PostPrivateGetNotificationsBodyParam = FromSchema<typeof schemas.PostPrivateGetNotifications.body>;
export type PostPrivateGetNotificationsResponse200 = FromSchema<typeof schemas.PostPrivateGetNotifications.response['200']>;
export type PostPrivateGetOpenOrdersBodyParam = FromSchema<typeof schemas.PostPrivateGetOpenOrders.body>;
export type PostPrivateGetOpenOrdersResponse200 = FromSchema<typeof schemas.PostPrivateGetOpenOrders.response['200']>;
export type PostPrivateGetOptionSettlementHistoryBodyParam = FromSchema<typeof schemas.PostPrivateGetOptionSettlementHistory.body>;
export type PostPrivateGetOptionSettlementHistoryResponse200 = FromSchema<typeof schemas.PostPrivateGetOptionSettlementHistory.response['200']>;
export type PostPrivateGetOrderBodyParam = FromSchema<typeof schemas.PostPrivateGetOrder.body>;
export type PostPrivateGetOrderHistoryBodyParam = FromSchema<typeof schemas.PostPrivateGetOrderHistory.body>;
export type PostPrivateGetOrderHistoryResponse200 = FromSchema<typeof schemas.PostPrivateGetOrderHistory.response['200']>;
export type PostPrivateGetOrderResponse200 = FromSchema<typeof schemas.PostPrivateGetOrder.response['200']>;
export type PostPrivateGetOrdersBodyParam = FromSchema<typeof schemas.PostPrivateGetOrders.body>;
export type PostPrivateGetOrdersResponse200 = FromSchema<typeof schemas.PostPrivateGetOrders.response['200']>;
export type PostPrivateGetPositionsBodyParam = FromSchema<typeof schemas.PostPrivateGetPositions.body>;
export type PostPrivateGetPositionsResponse200 = FromSchema<typeof schemas.PostPrivateGetPositions.response['200']>;
export type PostPrivateGetSubaccountBodyParam = FromSchema<typeof schemas.PostPrivateGetSubaccount.body>;
export type PostPrivateGetSubaccountResponse200 = FromSchema<typeof schemas.PostPrivateGetSubaccount.response['200']>;
export type PostPrivateGetSubaccountValueHistoryBodyParam = FromSchema<typeof schemas.PostPrivateGetSubaccountValueHistory.body>;
export type PostPrivateGetSubaccountValueHistoryResponse200 = FromSchema<typeof schemas.PostPrivateGetSubaccountValueHistory.response['200']>;
export type PostPrivateGetSubaccountsBodyParam = FromSchema<typeof schemas.PostPrivateGetSubaccounts.body>;
export type PostPrivateGetSubaccountsResponse200 = FromSchema<typeof schemas.PostPrivateGetSubaccounts.response['200']>;
export type PostPrivateGetTradeHistoryBodyParam = FromSchema<typeof schemas.PostPrivateGetTradeHistory.body>;
export type PostPrivateGetTradeHistoryResponse200 = FromSchema<typeof schemas.PostPrivateGetTradeHistory.response['200']>;
export type PostPrivateGetWithdrawalHistoryBodyParam = FromSchema<typeof schemas.PostPrivateGetWithdrawalHistory.body>;
export type PostPrivateGetWithdrawalHistoryResponse200 = FromSchema<typeof schemas.PostPrivateGetWithdrawalHistory.response['200']>;
export type PostPrivateOrderBodyParam = FromSchema<typeof schemas.PostPrivateOrder.body>;
export type PostPrivateOrderDebugBodyParam = FromSchema<typeof schemas.PostPrivateOrderDebug.body>;
export type PostPrivateOrderDebugResponse200 = FromSchema<typeof schemas.PostPrivateOrderDebug.response['200']>;
export type PostPrivateOrderResponse200 = FromSchema<typeof schemas.PostPrivateOrder.response['200']>;
export type PostPrivateResetMmpBodyParam = FromSchema<typeof schemas.PostPrivateResetMmp.body>;
export type PostPrivateResetMmpResponse200 = FromSchema<typeof schemas.PostPrivateResetMmp.response['200']>;
export type PostPrivateSessionKeysBodyParam = FromSchema<typeof schemas.PostPrivateSessionKeys.body>;
export type PostPrivateSessionKeysResponse200 = FromSchema<typeof schemas.PostPrivateSessionKeys.response['200']>;
export type PostPrivateSetCancelOnDisconnectBodyParam = FromSchema<typeof schemas.PostPrivateSetCancelOnDisconnect.body>;
export type PostPrivateSetCancelOnDisconnectResponse200 = FromSchema<typeof schemas.PostPrivateSetCancelOnDisconnect.response['200']>;
export type PostPrivateSetMmpConfigBodyParam = FromSchema<typeof schemas.PostPrivateSetMmpConfig.body>;
export type PostPrivateSetMmpConfigResponse200 = FromSchema<typeof schemas.PostPrivateSetMmpConfig.response['200']>;
export type PostPrivateTransferErc20BodyParam = FromSchema<typeof schemas.PostPrivateTransferErc20.body>;
export type PostPrivateTransferErc20Response200 = FromSchema<typeof schemas.PostPrivateTransferErc20.response['200']>;
export type PostPrivateTransferPositionBodyParam = FromSchema<typeof schemas.PostPrivateTransferPosition.body>;
export type PostPrivateTransferPositionResponse200 = FromSchema<typeof schemas.PostPrivateTransferPosition.response['200']>;
export type PostPrivateUpdateNotificationsBodyParam = FromSchema<typeof schemas.PostPrivateUpdateNotifications.body>;
export type PostPrivateUpdateNotificationsResponse200 = FromSchema<typeof schemas.PostPrivateUpdateNotifications.response['200']>;
export type PostPrivateWithdrawBodyParam = FromSchema<typeof schemas.PostPrivateWithdraw.body>;
export type PostPrivateWithdrawResponse200 = FromSchema<typeof schemas.PostPrivateWithdraw.response['200']>;
export type PostPublicBuildRegisterSessionKeyTxBodyParam = FromSchema<typeof schemas.PostPublicBuildRegisterSessionKeyTx.body>;
export type PostPublicBuildRegisterSessionKeyTxResponse200 = FromSchema<typeof schemas.PostPublicBuildRegisterSessionKeyTx.response['200']>;
export type PostPublicCreateAccountBodyParam = FromSchema<typeof schemas.PostPublicCreateAccount.body>;
export type PostPublicCreateAccountResponse200 = FromSchema<typeof schemas.PostPublicCreateAccount.response['200']>;
export type PostPublicCreateSubaccountDebugBodyParam = FromSchema<typeof schemas.PostPublicCreateSubaccountDebug.body>;
export type PostPublicCreateSubaccountDebugResponse200 = FromSchema<typeof schemas.PostPublicCreateSubaccountDebug.response['200']>;
export type PostPublicDeregisterSessionKeyBodyParam = FromSchema<typeof schemas.PostPublicDeregisterSessionKey.body>;
export type PostPublicDeregisterSessionKeyResponse200 = FromSchema<typeof schemas.PostPublicDeregisterSessionKey.response['200']>;
export type PostPublicGetInstrumentBodyParam = FromSchema<typeof schemas.PostPublicGetInstrument.body>;
export type PostPublicGetInstrumentResponse200 = FromSchema<typeof schemas.PostPublicGetInstrument.response['200']>;
export type PostPublicGetInstrumentsBodyParam = FromSchema<typeof schemas.PostPublicGetInstruments.body>;
export type PostPublicGetInstrumentsResponse200 = FromSchema<typeof schemas.PostPublicGetInstruments.response['200']>;
export type PostPublicGetLatestSignedFeedsBodyParam = FromSchema<typeof schemas.PostPublicGetLatestSignedFeeds.body>;
export type PostPublicGetLatestSignedFeedsResponse200 = FromSchema<typeof schemas.PostPublicGetLatestSignedFeeds.response['200']>;
export type PostPublicGetMarginBodyParam = FromSchema<typeof schemas.PostPublicGetMargin.body>;
export type PostPublicGetMarginResponse200 = FromSchema<typeof schemas.PostPublicGetMargin.response['200']>;
export type PostPublicGetSpotFeedHistoryBodyParam = FromSchema<typeof schemas.PostPublicGetSpotFeedHistory.body>;
export type PostPublicGetSpotFeedHistoryResponse200 = FromSchema<typeof schemas.PostPublicGetSpotFeedHistory.response['200']>;
export type PostPublicGetTickerBodyParam = FromSchema<typeof schemas.PostPublicGetTicker.body>;
export type PostPublicGetTickerResponse200 = FromSchema<typeof schemas.PostPublicGetTicker.response['200']>;
export type PostPublicGetTimeBodyParam = FromSchema<typeof schemas.PostPublicGetTime.body>;
export type PostPublicGetTimeResponse200 = FromSchema<typeof schemas.PostPublicGetTime.response['200']>;
export type PostPublicGetTradeHistoryBodyParam = FromSchema<typeof schemas.PostPublicGetTradeHistory.body>;
export type PostPublicGetTradeHistoryResponse200 = FromSchema<typeof schemas.PostPublicGetTradeHistory.response['200']>;
export type PostPublicGetTransactionBodyParam = FromSchema<typeof schemas.PostPublicGetTransaction.body>;
export type PostPublicGetTransactionResponse200 = FromSchema<typeof schemas.PostPublicGetTransaction.response['200']>;
export type PostPublicLoginBodyParam = FromSchema<typeof schemas.PostPublicLogin.body>;
export type PostPublicLoginResponse200 = FromSchema<typeof schemas.PostPublicLogin.response['200']>;
export type PostPublicMarginWatchBodyParam = FromSchema<typeof schemas.PostPublicMarginWatch.body>;
export type PostPublicMarginWatchResponse200 = FromSchema<typeof schemas.PostPublicMarginWatch.response['200']>;
export type PostPublicRegisterSessionKeyBodyParam = FromSchema<typeof schemas.PostPublicRegisterSessionKey.body>;
export type PostPublicRegisterSessionKeyResponse200 = FromSchema<typeof schemas.PostPublicRegisterSessionKey.response['200']>;
