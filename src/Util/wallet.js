'use strict'
import React , {Component} from 'react';
import {Dimensions, PixelRatio, AsyncStorage} from 'react-native';
var queryString = require('query-string')
var CryptoJS = require("crypto-js");
var ethers = require('ethers');

module.exports = {
    balance : -1,
    txCount : -1,
    txHash:'',

    getBalanceAndTxCount(wallet){
        var balancePromise = wallet.getBalance();
        var transactionCountPromise = wallet.getTransactionCount();
        balancePromise.then((balanceRaw)=>{
            var balance = parseInt(balanceRaw);

            transactionCountPromise.then((transactionCountRaw)=>{
                var txCount = parseInt(transactionCountRaw);
                console.log('getBalanceAndTxCount',balance,txCount)
                return balance,txCount
            }).catch(arg => alert('获取交易次数失败！原因是'+arg));
        });
    },

    sendTx(fromWallet, toAddress, value){
        var amount = ethers.utils.parseEther(value);
        var wallet = fromWallet
        wallet.provider = ethers.providers.getDefaultProvider('ropsten');
        var sendPromise = wallet.send(toAddress, amount);
        sendPromise.then(transactionHash=>{
            var txHash = transactionHash.hash
            console.log('txHash',txHash)
            return txHash
        }).catch(arg => {alert('交易失败！原因是'+arg);
        console.log('交易失败！原因是'+arg)});
    },

    checkPIN(walletData,pin){
        console.log('privateKeyRaw',walletData.privateKeyRaw)
        console.log('pin',pin)
        var bytes  = CryptoJS.AES.decrypt(walletData.privateKeyRaw, pin);
        console.log('bytes',bytes)
        var privateKey = bytes.toString(CryptoJS.enc.Utf8);
        console.log('privateKey',privateKey)
        var wallet = new ethers.Wallet(privateKey)
        console.log(wallet.address+':'+walletData.address);
        if(wallet.address == walletData.address){
            return wallet
        }
        return  
    }
}