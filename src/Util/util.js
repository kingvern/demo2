'use strict'
import React , {Component} from 'react';
import {Dimensions, PixelRatio, AsyncStorage} from 'react-native';
var queryString = require('query-string')
var CryptoJS = require("crypto-js");

module.exports = {

    //device
    size: {
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width
    },
    
    pixel: 1 / PixelRatio.get(),


    //request
    get(url,param){
        if(param) url += '?' +queryString(param)
      return  fetch(url)
            .then((response) => response.json())
    },

    post(url,param){
      return  fetch(url, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(param),
          })
        .then((response) => response.json())
    },


    //wallet
    balance : -1,
    txCount : -1,
    txHash:'',

    getBalanceAndTxCount(wallet){
        var balancePromise = wallet.getBalance();
        var transactionCountPromise = wallet.getTransactionCount();
        balancePromise.then((balanceRaw)=>{
            balance = parseInt(balanceRaw);

            transactionCountPromise.then((transactionCountRaw)=>{
                txCount = parseInt(transactionCountRaw);
            }).catch(arg => alert('获取交易次数失败！原因是'+arg));
        });
        return balance,txCount
    },

    sendTx(fromWallet, toAddress, value){
        var amount = ethers.utils.parseEther(value);
        var sendPromise = fromWallet.send(toAddress, amount);
        sendPromise.then(transactionHash=>{
            txHash = transactionHash.hash
            balance,transactionCount = this.getBalanceAndTxCount(fromWallet);
            return txHash, balance, transactionCount
        }).catch(arg => {alert('交易失败！原因是'+arg);
        console.log('交易失败！原因是'+arg)});
    },

    //storage
    storeData(dataName,data){},

    getData(dataName){
        AsyncStorage.getItem(dataName)
            .then((data)=>{
              console.log(data)
              if(data){
                walletData = JSON.parse(data)
                 if(walletData.address && walletData.privateKey){
                  this.setState({
                    logined:true,
                    walletData: walletData})
                }
              }else{
                this.setState({
                  logined:false})
              }
              return data
            })
            
          }

}

// getBalanceAndTxCount(){
//     var wallet = this.state.wallet;
//     var balancePromise = wallet.getBalance();
//     var transactionCountPromise = wallet.getTransactionCount();
//     balancePromise.then((balance)=>{
//       balance = parseInt(balance);
//       this.setState({balance: balance});

//       transactionCountPromise.then((transactionCount)=>{
//         transactionCount = parseInt(transactionCount);
//         this.setState({transactionCount: transactionCount});
//     }).catch(arg => alert('获取交易次数失败！原因是'+arg));

//   }).then(()=>{
//       data={
//         address:this.state.wallet.address,
//         privateKey:this.state.wallet.privateKey,
//         mnemonic:this.state.wallet.mnemonic,
//         balance: this.state.balance,
//         transactionCount: this.state.transactionCount,
//       }
//       AsyncStorage.setItem('data',JSON.stringify(data))
//       console.log("AsyncStorage save success!")

//   }).catch(arg => alert('获取余额失败！原因是'+arg));
    
//   }

//   sendTx(){
//     var to = this.state.to;
//     var wallet = this.state.wallet;
//     var amount = ethers.utils.parseEther(this.state.value);
//     var sendPromise = wallet.send(to, amount);
//     sendPromise.then(transactionHash=>{
//       this.setState({transactionHash: transactionHash.hash,
//         transactionCount: this.state.transactionCount+1
//       });
//       // console.log(transactionHash);
//     }).catch(arg => {alert('交易失败！原因是'+arg);
//     console.log('交易失败！原因是'+arg)});
//   }

//   asyncAppstatus(){
//     AsyncStorage.getItem('data')
//     .then((data)=>{
//       console.log("data:"+data)
//       if(data){
//         walletData = JSON.parse(data)
//          if(walletData.address && walletData.privateKey){
//           this.setState({
//             logined:true,
//             walletData: walletData})
//         }
//       }else{
//         this.setState({
//           logined:false})
//       }
//     }).then(
//       ()=>{
//         if(this.state.logined){
//           this.props.navigation.navigate("MyWallet",{from:'MainPage',walletData:this.state.walletData});
//         }
//       }
//     )
//     .catch(arg=>console.log(arg));
//     console.log('start:'+this.state.logined)
    
//   }