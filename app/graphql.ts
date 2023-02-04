import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  BigDecimal: any
  BigInt: any
  Bytes: any
}

export type Board = {
  __typename?: 'Board'
  baseIv: Scalars['BigInt']
  boardBaseIVHistory: Array<BoardBaseIvSnapshot>
  boardId: Scalars['BigInt']
  expiryTimestamp: Scalars['Int']
  expiryTimestampReadable: Scalars['String']
  id: Scalars['ID']
  isExpired: Scalars['Boolean']
  isPaused: Scalars['Boolean']
  market: Market
  spotPriceAtExpiry?: Maybe<Scalars['BigInt']>
  strikeIds: Array<Scalars['String']>
  strikes: Array<Strike>
}

export type BoardBaseIvSnapshot = {
  __typename?: 'BoardBaseIVSnapshot'
  baseIv: Scalars['BigInt']
  board: Board
  id: Scalars['ID']
  period: Scalars['Int']
  timestamp: Scalars['Int']
}

export type CircuitBreaker = {
  __typename?: 'CircuitBreaker'
  cbTimestamp: Scalars['Int']
  id: Scalars['ID']
  ivVarianceCrossed: Scalars['Boolean']
  liquidityVarianceCrossed: Scalars['Boolean']
  pool: Pool
  skewVarianceCrossed: Scalars['Boolean']
  timestamp: Scalars['Int']
  transactionHash: Scalars['Bytes']
}

export type CollateralUpdate = {
  __typename?: 'CollateralUpdate'
  amount: Scalars['BigInt']
  id: Scalars['ID']
  position: Position
  timestamp: Scalars['Int']
  transactionHash: Scalars['Bytes']
}

export type Global = {
  __typename?: 'Global'
  collateralShortAddress?: Maybe<Scalars['Bytes']>
  exchangeRatesAddress?: Maybe<Scalars['Bytes']>
  id: Scalars['ID']
  markets: Array<Market>
  resolverAddress?: Maybe<Scalars['Bytes']>
  synthetixAdapter?: Maybe<Scalars['Bytes']>
  viewerAddress?: Maybe<Scalars['Bytes']>
  wrapperAddress?: Maybe<Scalars['Bytes']>
}

export type GreekCache = {
  __typename?: 'GreekCache'
  id: Scalars['ID']
  market: Market
}

export type LpAction = {
  __typename?: 'LPAction'
  id: Scalars['ID']
  isDeposit?: Maybe<Scalars['Boolean']>
  lpUserLiquidity: LpUserLiquidity
  pool: Pool
  queueID: Scalars['BigInt']
  quoteAmount: Scalars['BigInt']
  timestamp: Scalars['Int']
  tokenAmount: Scalars['BigInt']
  tokenPrice: Scalars['BigInt']
  transactionHash: Scalars['Bytes']
}

export type LpPendingAction = {
  __typename?: 'LPPendingAction'
  id: Scalars['ID']
  isDeposit: Scalars['Boolean']
  lpUserLiquidity: LpUserLiquidity
  pendingAmount: Scalars['BigInt']
  pool: Pool
  processedAmount: Scalars['BigInt']
  queueID: Scalars['BigInt']
  timestamp: Scalars['Int']
  transactionHash: Scalars['Bytes']
}

export type LpUserLiquidity = {
  __typename?: 'LPUserLiquidity'
  depositsAndWithdrawals: Array<LpAction>
  id: Scalars['ID']
  pendingDepositsAndWithdrawals: Array<LpPendingAction>
  pool: Pool
  totalAmountDeposited: Scalars['BigInt']
  totalAmountWithdrawn: Scalars['BigInt']
  user: Scalars['Bytes']
}

export type Market = {
  __typename?: 'Market'
  SNXFeesHistory: Array<MarketSnxFeesSnapshot>
  activeBoardIds: Array<Scalars['String']>
  address: Scalars['Bytes']
  baseAddress: Scalars['Bytes']
  baseKey: Scalars['Bytes']
  boards: Array<Board>
  chainlinkAggregator: Scalars['Bytes']
  global: Global
  greekCache: GreekCache
  greeksHistory: Array<MarketGreeksSnapshot>
  id: Scalars['ID']
  isRemoved: Scalars['Boolean']
  latestGreeks: MarketGreeksSnapshot
  latestSNXFees: MarketSnxFeesSnapshot
  latestSpotPrice: Scalars['BigInt']
  latestTotalValue: MarketTotalValueSnapshot
  latestVolumeAndFees: MarketVolumeAndFeesSnapshot
  liquidityPool: Pool
  marketTotalValueHistory: Array<MarketTotalValueSnapshot>
  name: Scalars['String']
  optionMarketPricer: OptionMarketPricer
  optionToken: OptionToken
  owner: Scalars['Bytes']
  poolHedger: PoolHedger
  quoteAddress: Scalars['Bytes']
  quoteKey: Scalars['Bytes']
  rateAndCarry: Scalars['BigInt']
  shortCollateral: ShortCollateral
  skewAdjustmentFactor: Scalars['BigInt']
  spotPriceHistory: Array<SpotPriceSnapshot>
  standardSize: Scalars['BigInt']
  tradingCutoff: Scalars['Int']
  volumeAndFeesHistory: Array<MarketVolumeAndFeesSnapshot>
}

export type MarketGreeksSnapshot = {
  __typename?: 'MarketGreeksSnapshot'
  id: Scalars['ID']
  market: Market
  netDelta: Scalars['BigInt']
  netGamma: Scalars['BigInt']
  netStdVega: Scalars['BigInt']
  period: Scalars['Int']
  timestamp: Scalars['Int']
}

export type MarketSnxFeesSnapshot = {
  __typename?: 'MarketSNXFeesSnapshot'
  id: Scalars['ID']
  liquidityPoolFees: Scalars['BigInt']
  market: Market
  otherFees: Scalars['BigInt']
  period: Scalars['Int']
  poolHedgerFees: Scalars['BigInt']
  shortCollateralFees: Scalars['BigInt']
  timestamp: Scalars['Int']
}

export type MarketTotalValueSnapshot = {
  __typename?: 'MarketTotalValueSnapshot'
  NAV: Scalars['BigInt']
  burnableLiquidity: Scalars['BigInt']
  freeLiquidity: Scalars['BigInt']
  id: Scalars['ID']
  market: Market
  netOptionValue: Scalars['BigInt']
  pendingDeltaLiquidity: Scalars['BigInt']
  period: Scalars['Int']
  timestamp: Scalars['Int']
  tokenPrice: Scalars['BigInt']
  usedCollatLiquidity: Scalars['BigInt']
  usedDeltaLiquidity: Scalars['BigInt']
}

export type MarketVolumeAndFeesSnapshot = {
  __typename?: 'MarketVolumeAndFeesSnapshot'
  deltaCutoffFees: Scalars['BigInt']
  id: Scalars['ID']
  liquidatorFees: Scalars['BigInt']
  lpLiquidationFees: Scalars['BigInt']
  market: Market
  notionalVolume: Scalars['BigInt']
  optionPriceFees: Scalars['BigInt']
  period: Scalars['Int']
  premiumVolume: Scalars['BigInt']
  smLiquidationFees: Scalars['BigInt']
  spotPriceFees: Scalars['BigInt']
  timestamp: Scalars['Int']
  totalLongCallOpenInterest: Scalars['BigInt']
  totalLongPutOpenInterest: Scalars['BigInt']
  totalNotionalVolume: Scalars['BigInt']
  totalPremiumVolume: Scalars['BigInt']
  totalShortCallOpenInterest: Scalars['BigInt']
  totalShortPutOpenInterest: Scalars['BigInt']
  vegaFees: Scalars['BigInt']
}

export type Option = {
  __typename?: 'Option'
  board: Board
  id: Scalars['ID']
  isCall: Scalars['Boolean']
  latestOptionPriceAndGreeks: OptionPriceAndGreeksSnapshot
  latestOptionVolume: OptionVolumeSnapshot
  market: Market
  optionPriceAndGreeksHistory: Array<OptionPriceAndGreeksSnapshot>
  optionVolumeHistory: Array<OptionVolumeSnapshot>
  positions: Array<Position>
  strike: Strike
}

export type OptionMarketPricer = {
  __typename?: 'OptionMarketPricer'
  id: Scalars['ID']
  market: Market
}

export type OptionPriceAndGreeksSnapshot = {
  __typename?: 'OptionPriceAndGreeksSnapshot'
  delta: Scalars['BigInt']
  id: Scalars['ID']
  option: Option
  optionPrice: Scalars['BigInt']
  period: Scalars['Int']
  rho: Scalars['BigInt']
  theta: Scalars['BigInt']
  timestamp: Scalars['Int']
}

export type OptionToken = {
  __typename?: 'OptionToken'
  id: Scalars['ID']
  market: Market
}

export type OptionTransfer = {
  __typename?: 'OptionTransfer'
  blockNumber: Scalars['Int']
  id: Scalars['ID']
  newOwner: Scalars['Bytes']
  oldOwner: Scalars['Bytes']
  position: Position
  timestamp: Scalars['Int']
  transactionHash: Scalars['Bytes']
}

export type OptionVolumeSnapshot = {
  __typename?: 'OptionVolumeSnapshot'
  id: Scalars['ID']
  longOpenInterest: Scalars['BigInt']
  notionalVolume: Scalars['BigInt']
  option: Option
  period: Scalars['Int']
  premiumVolume: Scalars['BigInt']
  shortOpenInterest: Scalars['BigInt']
  timestamp: Scalars['Int']
  totalNotionalVolume: Scalars['BigInt']
  totalPremiumVolume: Scalars['BigInt']
}

export type Pool = {
  __typename?: 'Pool'
  baseBalance: Scalars['BigInt']
  cbEvents: Array<CircuitBreaker>
  id: Scalars['ID']
  lpUsers: Array<LpUserLiquidity>
  market: Market
  quoteBalance: Scalars['BigInt']
  tokenPrice: Scalars['BigInt']
}

export type PoolHedger = {
  __typename?: 'PoolHedger'
  baseBalance: Scalars['BigInt']
  collateralQuoteBalance: Scalars['BigInt']
  id: Scalars['ID']
  latestPoolHedgerExposure: PoolHedgerExposureSnapshot
  market: Market
  poolHedgerExposureHistory: Array<PoolHedgerExposureSnapshot>
}

export type PoolHedgerExposureSnapshot = {
  __typename?: 'PoolHedgerExposureSnapshot'
  currentNetDelta: Scalars['BigInt']
  id: Scalars['ID']
  period: Scalars['Int']
  poolHedger: PoolHedger
  timestamp: Scalars['Int']
}

export type Position = {
  __typename?: 'Position'
  averageCostPerOption: Scalars['BigInt']
  closeTimestamp?: Maybe<Scalars['Int']>
  collateral: Scalars['BigInt']
  collateralUpdates: Array<CollateralUpdate>
  id: Scalars['ID']
  isBaseCollateralized?: Maybe<Scalars['Boolean']>
  isLong: Scalars['Boolean']
  openTimestamp: Scalars['Int']
  option: Option
  owner: Scalars['Bytes']
  positionId: Scalars['BigInt']
  settle?: Maybe<Settle>
  size: Scalars['BigInt']
  state: Scalars['Int']
  trades: Array<Trade>
  transfers: Array<OptionTransfer>
}

export type Query = {
  __typename?: 'Query'
  trade?: Maybe<Trade>
  trades: Array<Trade>
}

export type QueryTradeArgs = {
  id: Scalars['ID']
}

export type Settle = {
  __typename?: 'Settle'
  blockNumber: Scalars['Int']
  id: Scalars['ID']
  owner: Scalars['Bytes']
  position: Position
  size: Scalars['BigInt']
  spotPriceAtExpiry: Scalars['BigInt']
  timestamp: Scalars['Int']
  transactionHash: Scalars['Bytes']
}

export type ShortCollateral = {
  __typename?: 'ShortCollateral'
  baseBalance: Scalars['BigInt']
  id: Scalars['ID']
  market: Market
  quoteBalance: Scalars['BigInt']
}

export type SpotPriceSnapshot = {
  __typename?: 'SpotPriceSnapshot'
  id: Scalars['ID']
  market: Market
  period: Scalars['Int']
  spotPrice: Scalars['BigInt']
  timestamp: Scalars['Int']
}

export type Strike = {
  __typename?: 'Strike'
  board: Board
  callOption: Option
  id: Scalars['ID']
  iv: Scalars['BigInt']
  latestStrikeIVAndGreeks?: Maybe<StrikeIvAndGreeksSnapshot>
  market: Market
  putOption: Option
  skew: Scalars['BigInt']
  strikeIVAndGreeksHistory: Array<StrikeIvAndGreeksSnapshot>
  strikeId: Scalars['BigInt']
  strikePrice: Scalars['BigInt']
  strikePriceReadable: Scalars['String']
}

export type StrikeIvAndGreeksSnapshot = {
  __typename?: 'StrikeIVAndGreeksSnapshot'
  board: Board
  gamma: Scalars['BigInt']
  id: Scalars['ID']
  iv: Scalars['BigInt']
  period: Scalars['Int']
  skew: Scalars['BigInt']
  strike: Strike
  timestamp: Scalars['Int']
  vega: Scalars['BigInt']
}

export type Trade = {
  __typename?: 'Trade'
  blockNumber: Scalars['Int']
  deltaCutoffFee?: Maybe<Scalars['BigInt']>
  externalSwapFees?: Maybe<Scalars['BigInt']>
  id: Scalars['ID']
  isBuy: Scalars['Boolean']
  isLiquidate: Scalars['Boolean']
  isOpen: Scalars['Boolean']
  liquidatorFee?: Maybe<Scalars['BigInt']>
  lpLiquidationFee?: Maybe<Scalars['BigInt']>
  market: Market
  optionPriceFee: Scalars['BigInt']
  trader: Scalars['Bytes']
  position: Position
  premium: Scalars['BigInt']
  size: Scalars['BigInt']
  smLiquidationFee?: Maybe<Scalars['BigInt']>
  spotPrice: Scalars['BigInt']
  spotPriceFee: Scalars['BigInt']
  timestamp: Scalars['Int']
  transactionHash: Scalars['Bytes']
  vegaUtilFee: Scalars['BigInt']
  vol: Scalars['BigInt']
}

export type ResolverTypeWrapper<T> = Promise<T> | T

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>
}
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo,
) => boolean | Promise<boolean>

export type NextResolverFn<T> = () => Promise<T>

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  BigDecimal: ResolverTypeWrapper<Scalars['BigDecimal']>
  BigInt: ResolverTypeWrapper<Scalars['BigInt']>
  Board: ResolverTypeWrapper<Board>
  BoardBaseIVSnapshot: ResolverTypeWrapper<BoardBaseIvSnapshot>
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>
  Bytes: ResolverTypeWrapper<Scalars['Bytes']>
  CircuitBreaker: ResolverTypeWrapper<CircuitBreaker>
  CollateralUpdate: ResolverTypeWrapper<CollateralUpdate>
  Global: ResolverTypeWrapper<Global>
  GreekCache: ResolverTypeWrapper<GreekCache>
  ID: ResolverTypeWrapper<Scalars['ID']>
  Int: ResolverTypeWrapper<Scalars['Int']>
  LPAction: ResolverTypeWrapper<LpAction>
  LPPendingAction: ResolverTypeWrapper<LpPendingAction>
  LPUserLiquidity: ResolverTypeWrapper<LpUserLiquidity>
  Market: ResolverTypeWrapper<Market>
  MarketGreeksSnapshot: ResolverTypeWrapper<MarketGreeksSnapshot>
  MarketSNXFeesSnapshot: ResolverTypeWrapper<MarketSnxFeesSnapshot>
  MarketTotalValueSnapshot: ResolverTypeWrapper<MarketTotalValueSnapshot>
  MarketVolumeAndFeesSnapshot: ResolverTypeWrapper<MarketVolumeAndFeesSnapshot>
  Option: ResolverTypeWrapper<Option>
  OptionMarketPricer: ResolverTypeWrapper<OptionMarketPricer>
  OptionPriceAndGreeksSnapshot: ResolverTypeWrapper<OptionPriceAndGreeksSnapshot>
  OptionToken: ResolverTypeWrapper<OptionToken>
  OptionTransfer: ResolverTypeWrapper<OptionTransfer>
  OptionVolumeSnapshot: ResolverTypeWrapper<OptionVolumeSnapshot>
  Pool: ResolverTypeWrapper<Pool>
  PoolHedger: ResolverTypeWrapper<PoolHedger>
  PoolHedgerExposureSnapshot: ResolverTypeWrapper<PoolHedgerExposureSnapshot>
  Position: ResolverTypeWrapper<Position>
  Query: ResolverTypeWrapper<{}>
  Settle: ResolverTypeWrapper<Settle>
  ShortCollateral: ResolverTypeWrapper<ShortCollateral>
  SpotPriceSnapshot: ResolverTypeWrapper<SpotPriceSnapshot>
  Strike: ResolverTypeWrapper<Strike>
  StrikeIVAndGreeksSnapshot: ResolverTypeWrapper<StrikeIvAndGreeksSnapshot>
  String: ResolverTypeWrapper<Scalars['String']>
  Trade: ResolverTypeWrapper<Trade>
}

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  BigDecimal: Scalars['BigDecimal']
  BigInt: Scalars['BigInt']
  Board: Board
  BoardBaseIVSnapshot: BoardBaseIvSnapshot
  Boolean: Scalars['Boolean']
  Bytes: Scalars['Bytes']
  CircuitBreaker: CircuitBreaker
  CollateralUpdate: CollateralUpdate
  Global: Global
  GreekCache: GreekCache
  ID: Scalars['ID']
  Int: Scalars['Int']
  LPAction: LpAction
  LPPendingAction: LpPendingAction
  LPUserLiquidity: LpUserLiquidity
  Market: Market
  MarketGreeksSnapshot: MarketGreeksSnapshot
  MarketSNXFeesSnapshot: MarketSnxFeesSnapshot
  MarketTotalValueSnapshot: MarketTotalValueSnapshot
  MarketVolumeAndFeesSnapshot: MarketVolumeAndFeesSnapshot
  Option: Option
  OptionMarketPricer: OptionMarketPricer
  OptionPriceAndGreeksSnapshot: OptionPriceAndGreeksSnapshot
  OptionToken: OptionToken
  OptionTransfer: OptionTransfer
  OptionVolumeSnapshot: OptionVolumeSnapshot
  Pool: Pool
  PoolHedger: PoolHedger
  PoolHedgerExposureSnapshot: PoolHedgerExposureSnapshot
  Position: Position
  Query: {}
  Settle: Settle
  ShortCollateral: ShortCollateral
  SpotPriceSnapshot: SpotPriceSnapshot
  Strike: Strike
  StrikeIVAndGreeksSnapshot: StrikeIvAndGreeksSnapshot
  String: Scalars['String']
  Trade: Trade
}

export interface BigDecimalScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigDecimal'], any> {
  name: 'BigDecimal'
}

export interface BigIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigInt'], any> {
  name: 'BigInt'
}

export type BoardResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Board'] = ResolversParentTypes['Board'],
> = {
  baseIv?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  boardBaseIVHistory?: Resolver<Array<ResolversTypes['BoardBaseIVSnapshot']>, ParentType, ContextType>
  boardId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  expiryTimestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  expiryTimestampReadable?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  isExpired?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  isPaused?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  market?: Resolver<ResolversTypes['Market'], ParentType, ContextType>
  spotPriceAtExpiry?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>
  strikeIds?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>
  strikes?: Resolver<Array<ResolversTypes['Strike']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type BoardBaseIvSnapshotResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['BoardBaseIVSnapshot'] = ResolversParentTypes['BoardBaseIVSnapshot'],
> = {
  baseIv?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  board?: Resolver<ResolversTypes['Board'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  period?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  timestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export interface BytesScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Bytes'], any> {
  name: 'Bytes'
}

export type CircuitBreakerResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['CircuitBreaker'] = ResolversParentTypes['CircuitBreaker'],
> = {
  cbTimestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  ivVarianceCrossed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  liquidityVarianceCrossed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  pool?: Resolver<ResolversTypes['Pool'], ParentType, ContextType>
  skewVarianceCrossed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  timestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  transactionHash?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type CollateralUpdateResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['CollateralUpdate'] = ResolversParentTypes['CollateralUpdate'],
> = {
  amount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  position?: Resolver<ResolversTypes['Position'], ParentType, ContextType>
  timestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  transactionHash?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type GlobalResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Global'] = ResolversParentTypes['Global'],
> = {
  collateralShortAddress?: Resolver<Maybe<ResolversTypes['Bytes']>, ParentType, ContextType>
  exchangeRatesAddress?: Resolver<Maybe<ResolversTypes['Bytes']>, ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  markets?: Resolver<Array<ResolversTypes['Market']>, ParentType, ContextType>
  resolverAddress?: Resolver<Maybe<ResolversTypes['Bytes']>, ParentType, ContextType>
  synthetixAdapter?: Resolver<Maybe<ResolversTypes['Bytes']>, ParentType, ContextType>
  viewerAddress?: Resolver<Maybe<ResolversTypes['Bytes']>, ParentType, ContextType>
  wrapperAddress?: Resolver<Maybe<ResolversTypes['Bytes']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type GreekCacheResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['GreekCache'] = ResolversParentTypes['GreekCache'],
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  market?: Resolver<ResolversTypes['Market'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type LpActionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['LPAction'] = ResolversParentTypes['LPAction'],
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  isDeposit?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  lpUserLiquidity?: Resolver<ResolversTypes['LPUserLiquidity'], ParentType, ContextType>
  pool?: Resolver<ResolversTypes['Pool'], ParentType, ContextType>
  queueID?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  quoteAmount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  timestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  tokenAmount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  tokenPrice?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  transactionHash?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type LpPendingActionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['LPPendingAction'] = ResolversParentTypes['LPPendingAction'],
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  isDeposit?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  lpUserLiquidity?: Resolver<ResolversTypes['LPUserLiquidity'], ParentType, ContextType>
  pendingAmount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  pool?: Resolver<ResolversTypes['Pool'], ParentType, ContextType>
  processedAmount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  queueID?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  timestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  transactionHash?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type LpUserLiquidityResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['LPUserLiquidity'] = ResolversParentTypes['LPUserLiquidity'],
> = {
  depositsAndWithdrawals?: Resolver<Array<ResolversTypes['LPAction']>, ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  pendingDepositsAndWithdrawals?: Resolver<Array<ResolversTypes['LPPendingAction']>, ParentType, ContextType>
  pool?: Resolver<ResolversTypes['Pool'], ParentType, ContextType>
  totalAmountDeposited?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  totalAmountWithdrawn?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  user?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type MarketResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Market'] = ResolversParentTypes['Market'],
> = {
  SNXFeesHistory?: Resolver<Array<ResolversTypes['MarketSNXFeesSnapshot']>, ParentType, ContextType>
  activeBoardIds?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>
  address?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>
  baseAddress?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>
  baseKey?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>
  boards?: Resolver<Array<ResolversTypes['Board']>, ParentType, ContextType>
  chainlinkAggregator?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>
  global?: Resolver<ResolversTypes['Global'], ParentType, ContextType>
  greekCache?: Resolver<ResolversTypes['GreekCache'], ParentType, ContextType>
  greeksHistory?: Resolver<Array<ResolversTypes['MarketGreeksSnapshot']>, ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  isRemoved?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  latestGreeks?: Resolver<ResolversTypes['MarketGreeksSnapshot'], ParentType, ContextType>
  latestSNXFees?: Resolver<ResolversTypes['MarketSNXFeesSnapshot'], ParentType, ContextType>
  latestSpotPrice?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  latestTotalValue?: Resolver<ResolversTypes['MarketTotalValueSnapshot'], ParentType, ContextType>
  latestVolumeAndFees?: Resolver<ResolversTypes['MarketVolumeAndFeesSnapshot'], ParentType, ContextType>
  liquidityPool?: Resolver<ResolversTypes['Pool'], ParentType, ContextType>
  marketTotalValueHistory?: Resolver<Array<ResolversTypes['MarketTotalValueSnapshot']>, ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  optionMarketPricer?: Resolver<ResolversTypes['OptionMarketPricer'], ParentType, ContextType>
  optionToken?: Resolver<ResolversTypes['OptionToken'], ParentType, ContextType>
  owner?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>
  poolHedger?: Resolver<ResolversTypes['PoolHedger'], ParentType, ContextType>
  quoteAddress?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>
  quoteKey?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>
  rateAndCarry?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  shortCollateral?: Resolver<ResolversTypes['ShortCollateral'], ParentType, ContextType>
  skewAdjustmentFactor?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  spotPriceHistory?: Resolver<Array<ResolversTypes['SpotPriceSnapshot']>, ParentType, ContextType>
  standardSize?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  tradingCutoff?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  volumeAndFeesHistory?: Resolver<Array<ResolversTypes['MarketVolumeAndFeesSnapshot']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type MarketGreeksSnapshotResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['MarketGreeksSnapshot'] = ResolversParentTypes['MarketGreeksSnapshot'],
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  market?: Resolver<ResolversTypes['Market'], ParentType, ContextType>
  netDelta?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  netGamma?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  netStdVega?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  period?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  timestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type MarketSnxFeesSnapshotResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['MarketSNXFeesSnapshot'] = ResolversParentTypes['MarketSNXFeesSnapshot'],
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  liquidityPoolFees?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  market?: Resolver<ResolversTypes['Market'], ParentType, ContextType>
  otherFees?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  period?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  poolHedgerFees?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  shortCollateralFees?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  timestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type MarketTotalValueSnapshotResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['MarketTotalValueSnapshot'] = ResolversParentTypes['MarketTotalValueSnapshot'],
> = {
  NAV?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  burnableLiquidity?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  freeLiquidity?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  market?: Resolver<ResolversTypes['Market'], ParentType, ContextType>
  netOptionValue?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  pendingDeltaLiquidity?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  period?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  timestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  tokenPrice?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  usedCollatLiquidity?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  usedDeltaLiquidity?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type MarketVolumeAndFeesSnapshotResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['MarketVolumeAndFeesSnapshot'] = ResolversParentTypes['MarketVolumeAndFeesSnapshot'],
> = {
  deltaCutoffFees?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  liquidatorFees?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  lpLiquidationFees?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  market?: Resolver<ResolversTypes['Market'], ParentType, ContextType>
  notionalVolume?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  optionPriceFees?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  period?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  premiumVolume?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  smLiquidationFees?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  spotPriceFees?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  timestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  totalLongCallOpenInterest?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  totalLongPutOpenInterest?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  totalNotionalVolume?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  totalPremiumVolume?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  totalShortCallOpenInterest?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  totalShortPutOpenInterest?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  vegaFees?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type OptionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Option'] = ResolversParentTypes['Option'],
> = {
  board?: Resolver<ResolversTypes['Board'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  isCall?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  latestOptionPriceAndGreeks?: Resolver<Maybe<ResolversTypes['OptionPriceAndGreeksSnapshot']>, ParentType, ContextType>
  latestOptionVolume?: Resolver<ResolversTypes['OptionVolumeSnapshot'], ParentType, ContextType>
  market?: Resolver<ResolversTypes['Market'], ParentType, ContextType>
  optionPriceAndGreeksHistory?: Resolver<Array<ResolversTypes['OptionPriceAndGreeksSnapshot']>, ParentType, ContextType>
  optionVolumeHistory?: Resolver<Array<ResolversTypes['OptionVolumeSnapshot']>, ParentType, ContextType>
  positions?: Resolver<Array<ResolversTypes['Position']>, ParentType, ContextType>
  strike?: Resolver<ResolversTypes['Strike'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type OptionMarketPricerResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['OptionMarketPricer'] = ResolversParentTypes['OptionMarketPricer'],
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  market?: Resolver<ResolversTypes['Market'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type OptionPriceAndGreeksSnapshotResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['OptionPriceAndGreeksSnapshot'] = ResolversParentTypes['OptionPriceAndGreeksSnapshot'],
> = {
  delta?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  option?: Resolver<ResolversTypes['Option'], ParentType, ContextType>
  optionPrice?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  period?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  rho?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  theta?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  timestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type OptionTokenResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['OptionToken'] = ResolversParentTypes['OptionToken'],
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  market?: Resolver<ResolversTypes['Market'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type OptionTransferResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['OptionTransfer'] = ResolversParentTypes['OptionTransfer'],
> = {
  blockNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  newOwner?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>
  oldOwner?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>
  position?: Resolver<ResolversTypes['Position'], ParentType, ContextType>
  timestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  transactionHash?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type OptionVolumeSnapshotResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['OptionVolumeSnapshot'] = ResolversParentTypes['OptionVolumeSnapshot'],
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  longOpenInterest?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  notionalVolume?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  option?: Resolver<ResolversTypes['Option'], ParentType, ContextType>
  period?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  premiumVolume?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  shortOpenInterest?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  timestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  totalNotionalVolume?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  totalPremiumVolume?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type PoolResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Pool'] = ResolversParentTypes['Pool'],
> = {
  baseBalance?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  cbEvents?: Resolver<Array<ResolversTypes['CircuitBreaker']>, ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  lpUsers?: Resolver<Array<ResolversTypes['LPUserLiquidity']>, ParentType, ContextType>
  market?: Resolver<ResolversTypes['Market'], ParentType, ContextType>
  quoteBalance?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  tokenPrice?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type PoolHedgerResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['PoolHedger'] = ResolversParentTypes['PoolHedger'],
> = {
  baseBalance?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  collateralQuoteBalance?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  latestPoolHedgerExposure?: Resolver<ResolversTypes['PoolHedgerExposureSnapshot'], ParentType, ContextType>
  market?: Resolver<ResolversTypes['Market'], ParentType, ContextType>
  poolHedgerExposureHistory?: Resolver<Array<ResolversTypes['PoolHedgerExposureSnapshot']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type PoolHedgerExposureSnapshotResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['PoolHedgerExposureSnapshot'] = ResolversParentTypes['PoolHedgerExposureSnapshot'],
> = {
  currentNetDelta?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  period?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  poolHedger?: Resolver<ResolversTypes['PoolHedger'], ParentType, ContextType>
  timestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type PositionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Position'] = ResolversParentTypes['Position'],
> = {
  averageCostPerOption?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  closeTimestamp?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  collateral?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  collateralUpdates?: Resolver<Array<ResolversTypes['CollateralUpdate']>, ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  isBaseCollateralized?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  isLong?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  openTimestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  option?: Resolver<ResolversTypes['Option'], ParentType, ContextType>
  owner?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>
  positionId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  settle?: Resolver<Maybe<ResolversTypes['Settle']>, ParentType, ContextType>
  size?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  state?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  trades?: Resolver<Array<ResolversTypes['Trade']>, ParentType, ContextType>
  transfers?: Resolver<Array<ResolversTypes['OptionTransfer']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type QueryResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query'],
> = {
  trade?: Resolver<Maybe<ResolversTypes['Trade']>, ParentType, ContextType, RequireFields<QueryTradeArgs, 'id'>>
  trades?: Resolver<Array<ResolversTypes['Trade']>, ParentType, ContextType>
}

export type SettleResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Settle'] = ResolversParentTypes['Settle'],
> = {
  blockNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  owner?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>
  position?: Resolver<ResolversTypes['Position'], ParentType, ContextType>
  size?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  spotPriceAtExpiry?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  timestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  transactionHash?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ShortCollateralResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ShortCollateral'] = ResolversParentTypes['ShortCollateral'],
> = {
  baseBalance?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  market?: Resolver<ResolversTypes['Market'], ParentType, ContextType>
  quoteBalance?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type SpotPriceSnapshotResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SpotPriceSnapshot'] = ResolversParentTypes['SpotPriceSnapshot'],
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  market?: Resolver<ResolversTypes['Market'], ParentType, ContextType>
  period?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  spotPrice?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  timestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type StrikeResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Strike'] = ResolversParentTypes['Strike'],
> = {
  board?: Resolver<ResolversTypes['Board'], ParentType, ContextType>
  callOption?: Resolver<ResolversTypes['Option'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  iv?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  latestStrikeIVAndGreeks?: Resolver<Maybe<ResolversTypes['StrikeIVAndGreeksSnapshot']>, ParentType, ContextType>
  market?: Resolver<ResolversTypes['Market'], ParentType, ContextType>
  putOption?: Resolver<ResolversTypes['Option'], ParentType, ContextType>
  skew?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  strikeIVAndGreeksHistory?: Resolver<Array<ResolversTypes['StrikeIVAndGreeksSnapshot']>, ParentType, ContextType>
  strikeId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  strikePrice?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  strikePriceReadable?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type StrikeIvAndGreeksSnapshotResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['StrikeIVAndGreeksSnapshot'] = ResolversParentTypes['StrikeIVAndGreeksSnapshot'],
> = {
  board?: Resolver<ResolversTypes['Board'], ParentType, ContextType>
  gamma?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  iv?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  period?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  skew?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  strike?: Resolver<ResolversTypes['Strike'], ParentType, ContextType>
  timestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  vega?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type TradeResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Trade'] = ResolversParentTypes['Trade'],
> = {
  blockNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  deltaCutoffFee?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>
  externalSwapFees?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  isBuy?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  isLiquidate?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  isOpen?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  liquidatorFee?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>
  lpLiquidationFee?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>
  market?: Resolver<ResolversTypes['Market'], ParentType, ContextType>
  optionPriceFee?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  owner?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>
  position?: Resolver<ResolversTypes['Position'], ParentType, ContextType>
  premium?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  size?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  smLiquidationFee?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>
  spotPrice?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  spotPriceFee?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  timestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  transactionHash?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>
  vegaUtilFee?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  vol?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type Resolvers<ContextType = any> = {
  BigDecimal?: GraphQLScalarType
  BigInt?: GraphQLScalarType
  Board?: BoardResolvers<ContextType>
  BoardBaseIVSnapshot?: BoardBaseIvSnapshotResolvers<ContextType>
  Bytes?: GraphQLScalarType
  CircuitBreaker?: CircuitBreakerResolvers<ContextType>
  CollateralUpdate?: CollateralUpdateResolvers<ContextType>
  Global?: GlobalResolvers<ContextType>
  GreekCache?: GreekCacheResolvers<ContextType>
  LPAction?: LpActionResolvers<ContextType>
  LPPendingAction?: LpPendingActionResolvers<ContextType>
  LPUserLiquidity?: LpUserLiquidityResolvers<ContextType>
  Market?: MarketResolvers<ContextType>
  MarketGreeksSnapshot?: MarketGreeksSnapshotResolvers<ContextType>
  MarketSNXFeesSnapshot?: MarketSnxFeesSnapshotResolvers<ContextType>
  MarketTotalValueSnapshot?: MarketTotalValueSnapshotResolvers<ContextType>
  MarketVolumeAndFeesSnapshot?: MarketVolumeAndFeesSnapshotResolvers<ContextType>
  Option?: OptionResolvers<ContextType>
  OptionMarketPricer?: OptionMarketPricerResolvers<ContextType>
  OptionPriceAndGreeksSnapshot?: OptionPriceAndGreeksSnapshotResolvers<ContextType>
  OptionToken?: OptionTokenResolvers<ContextType>
  OptionTransfer?: OptionTransferResolvers<ContextType>
  OptionVolumeSnapshot?: OptionVolumeSnapshotResolvers<ContextType>
  Pool?: PoolResolvers<ContextType>
  PoolHedger?: PoolHedgerResolvers<ContextType>
  PoolHedgerExposureSnapshot?: PoolHedgerExposureSnapshotResolvers<ContextType>
  Position?: PositionResolvers<ContextType>
  Query?: QueryResolvers<ContextType>
  Settle?: SettleResolvers<ContextType>
  ShortCollateral?: ShortCollateralResolvers<ContextType>
  SpotPriceSnapshot?: SpotPriceSnapshotResolvers<ContextType>
  Strike?: StrikeResolvers<ContextType>
  StrikeIVAndGreeksSnapshot?: StrikeIvAndGreeksSnapshotResolvers<ContextType>
  Trade?: TradeResolvers<ContextType>
}
