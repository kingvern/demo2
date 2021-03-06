"use strict";
import React, { Component } from "react";
import { Dimensions, PixelRatio, AsyncStorage } from "react-native";

var queryString = require("query-string");
var CryptoJS = require("crypto-js");
var ethers = require("ethers");

module.exports = {
  balance: -1,
  txHash: "",

  getBalance(wallet) {
    var balancePromise = wallet.getBalance();
    balancePromise.then((balanceRaw) => {
      var balance = parseInt(balanceRaw) / 1000000000000000000;
        return balance;
      }).catch(arg => alert("获取交易次数失败！原因是" + arg));
  },

  sendTx(fromWallet, toAddress, value) {
    var amount = ethers.utils.parseEther(value);
    var wallet = fromWallet;
    wallet.provider = ethers.providers.getDefaultProvider("ropsten");
    var sendPromise = wallet.send(toAddress, amount);
    sendPromise.then(transactionHash => {
      var txHash = transactionHash.hash;
      console.log("txHash", txHash);
      return txHash;
    }).catch(arg => {
      alert("交易失败！原因是" + arg);
      console.log("交易失败！原因是" + arg);
    });
  },

  /*
  加密并存储wallet数据到walletData
  */

  saveWalletData(state) {

    var walletData = {
      address: state.wallet.address,
      privateKeyRaw: CryptoJS.AES.encrypt(state.wallet.privateKey, state.pin).toString(),
      mnemonicRaw: CryptoJS.AES.encrypt(state.wallet.mnemonic, state.pin).toString(),
      balance: state.balance
    };
    return walletData;
  },

  /*
  通过助记词检查钱包的正确性
  */
  checkPin(walletData, pin) {
    console.log("mnemonicRaw", walletData.mnemonicRaw);
    console.log("pin", pin);
    var bytes = CryptoJS.AES.decrypt(walletData.mnemonicRaw, pin);
    console.log("bytes", bytes);
    var mnemonic = bytes.toString(CryptoJS.enc.Utf8);
    console.log("mnemonic", mnemonic);
    var wallet = ethers.Wallet.fromMnemonic(mnemonic);
    console.log(wallet.address + ":" + walletData.address);
    if (wallet.address == walletData.address) {
      return wallet;
    }
    return;
  }
};
