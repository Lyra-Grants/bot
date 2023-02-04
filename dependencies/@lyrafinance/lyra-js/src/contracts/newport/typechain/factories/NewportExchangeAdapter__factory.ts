/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  NewportExchangeAdapter,
  NewportExchangeAdapterInterface,
} from "../NewportExchangeAdapter";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "chainlinkFeeds",
    outputs: [
      {
        internalType: "contract IAggregatorV3",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_optionMarket",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amountBase",
        type: "uint256",
      },
    ],
    name: "estimateExchangeToExactBase",
    outputs: [
      {
        internalType: "uint256",
        name: "quoteNeeded",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_optionMarket",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amountQuote",
        type: "uint256",
      },
    ],
    name: "estimateExchangeToExactQuote",
    outputs: [
      {
        internalType: "uint256",
        name: "baseNeeded",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_optionMarket",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amountBase",
        type: "uint256",
      },
    ],
    name: "exchangeFromExactBase",
    outputs: [
      {
        internalType: "uint256",
        name: "quoteReceived",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "optionMarket",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amountQuote",
        type: "uint256",
      },
    ],
    name: "exchangeFromExactQuote",
    outputs: [
      {
        internalType: "uint256",
        name: "baseReceived",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "optionMarket",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amountBase",
        type: "uint256",
      },
    ],
    name: "exchangeToExactBase",
    outputs: [
      {
        internalType: "uint256",
        name: "quoteSpent",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "baseReceived",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_optionMarket",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amountBase",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_quoteLimit",
        type: "uint256",
      },
    ],
    name: "exchangeToExactBaseWithLimit",
    outputs: [
      {
        internalType: "uint256",
        name: "quoteSpent",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "baseReceived",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "optionMarket",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amountQuote",
        type: "uint256",
      },
    ],
    name: "exchangeToExactQuote",
    outputs: [
      {
        internalType: "uint256",
        name: "baseSpent",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "quoteReceived",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "optionMarket",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amountQuote",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "baseLimit",
        type: "uint256",
      },
    ],
    name: "exchangeToExactQuoteWithLimit",
    outputs: [
      {
        internalType: "uint256",
        name: "quoteSpent",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "baseReceived",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "optionMarket",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "expiry",
        type: "uint256",
      },
    ],
    name: "getSettlementPriceForMarket",
    outputs: [
      {
        internalType: "uint256",
        name: "spotPrice",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "optionMarket",
        type: "address",
      },
      {
        internalType: "enum BaseExchangeAdapter.PriceType",
        name: "pricing",
        type: "uint8",
      },
    ],
    name: "getSpotPriceForMarket",
    outputs: [
      {
        internalType: "uint256",
        name: "spotPrice",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "isGlobalPaused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "isMarketPaused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "optionMarket",
        type: "address",
      },
    ],
    name: "requireNotGlobalPaused",
    outputs: [],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_asset",
        type: "address",
      },
      {
        internalType: "contract IAggregatorV3",
        name: "_assetPriceFeed",
        type: "address",
      },
    ],
    name: "setChainlinkFeed",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "isPaused",
        type: "bool",
      },
    ],
    name: "setGlobalPaused",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "optionMarket",
        type: "address",
      },
      {
        internalType: "bool",
        name: "isPaused",
        type: "bool",
      },
    ],
    name: "setMarketPaused",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_minReturnPercent",
        type: "uint256",
      },
    ],
    name: "setMinReturnPercent",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class NewportExchangeAdapter__factory {
  static readonly abi = _abi;
  static createInterface(): NewportExchangeAdapterInterface {
    return new utils.Interface(_abi) as NewportExchangeAdapterInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): NewportExchangeAdapter {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as NewportExchangeAdapter;
  }
}
