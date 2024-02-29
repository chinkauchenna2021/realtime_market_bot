"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
// Symbol for the market you're interested in (e.g., BTCUSDT)
const symbol = 'BTCUSDT';
//  'BTCUSDT';
let binanceData;
// Create a WebSocket connection to Binance
const ws = new ws_1.default('wss://stream.binance.com:9443/ws/' + symbol.toLowerCase() + '@depth');
// Event handler for WebSocket connection opened
ws.on('open', () => {
    console.log('WebSocket connection opened');
});
// Event handler for WebSocket errors
ws.on('error', (error) => {
    console.error('WebSocket error:', error);
});
// Event handler for WebSocket messages
ws.on('message', (data) => {
    // Parse the message data
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    binanceData = JSON.parse(data);
    console.log(binanceData);
    // Check if the message contains data about buy or sell orders
    if (binanceData.a || binanceData.b) {
        console.log('Buy Orders:', binanceData.b); // Prints buy orders
        console.log('Sell Orders:', binanceData.a); // Prints sell orders
        // Here you can implement your notification logic
    }
});
//    if(binanceData == undefined) return 
//    return binanceData ; 
