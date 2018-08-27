
var ethers = require('ethers');
import React, { Component } from "react";

import { AsyncStorage } from "react-native";
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
  Left,
  Right,
  Body,
  Text,Input, Item,H3, Footer
} from "native-base";
import styles from "./styles";

export default class MyWallet extends Component {

    constructor(props) {
        super(props);
      //   if(!this.props.navigation.state.params.from == 'MainPage'){

      //   }else{
      //     var wallet = this.props.navigation.state.params.wallet;
      //     var address = this.props.navigation.state.params.address;

      //   this.state = { 
      //     address: address,
      //     wallet: wallet,
      //     balance: "获取中",
      //     transactionCount: "获取中",
      //     to: '0x486c14c72bd37ead125c37d9d624118946d18a36',
      //     value: '0.0001'
      //   };
      // }
      // data={
      //   address:address,
      //   privateKey:'walletData.privateKey',
      //   mnemonic:'walletData.mnemonic',
      //   balance: this.state.balance,
      //   transactionCount: this.state.transactionCount,
      // }

        // AsyncStorage.setItem('data',JSON.stringify(data))
        //   .then(wallet=>this.setState({wallet: wallet}));

        this.state = { 
          address: this.props.navigation.state.params.wallet.address,
          wallet: this.props.navigation.state.params.wallet,
          balance: "获取中",
          transactionCount: "获取中",
          to: '0x486c14c72bd37ead125c37d9d624118946d18a36',
          value: '0.0001'
        };

        var wallet = this.state.wallet;
        wallet.provider = ethers.providers.getDefaultProvider('ropsten');

        this.getBalanceAndTxCount();

    }

  

  getBalanceAndTxCount(){
    var wallet = this.state.wallet;
    var balancePromise = wallet.getBalance();
    var transactionCountPromise = wallet.getTransactionCount();
    balancePromise.then((balance)=>{
      balance = parseInt(balance);
      this.setState({balance: balance});

      transactionCountPromise.then((transactionCount)=>{
        transactionCount = parseInt(transactionCount);
        this.setState({transactionCount: transactionCount});
    }).catch(arg => alert('获取交易次数失败！原因是'+arg));

  }).then(()=>{
      data={
        address:this.state.wallet.address,
        privateKey:this.state.wallet.privateKey,
        mnemonic:this.state.wallet.mnemonic,
        balance: this.state.balance,
        transactionCount: this.state.transactionCount,
      }
      AsyncStorage.setItem('data',JSON.stringify(data))
      console.log("AsyncStorage save success!")

  }).catch(arg => alert('获取余额失败！原因是'+arg));
    
  }

  sendTx(){
    var to = this.state.to;
    var wallet = this.state.wallet;
    var amount = ethers.utils.parseEther(this.state.value);
    var sendPromise = wallet.send(to, amount);
    sendPromise.then(transactionHash=>{
      this.setState({transactionHash: transactionHash.hash,
        transactionCount: this.state.transactionCount+1
      });
      // console.log(transactionHash);
    }).catch(arg => {alert('交易失败！原因是'+arg);
    console.log('交易失败！原因是'+arg)});
  }

  render() {
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>我的钱包</Title>
          </Body>
          <Right>
          </Right>
        </Header>

        <Content padder>
        
        <H3 style={{ color: "#000", alignSelf: "center" }}>转账</H3>
          <Item>
          <Input bordered placeholder="请输入对方地址" value={this.state.to} onChangeText={(to) => this.setState({to})}/>
          <Input bordered placeholder="请输入转账金额" value={this.state.value.toString()} onChangeText={(value) => this.setState({value})}/>
          </Item>
          <Button full dark style={{ marginTop:20}}
          onPress={ ()=>{var to = this.state.to;
            var wallet = this.state.wallet;
            var amount = ethers.utils.parseEther(this.state.value);
            var sendPromise = wallet.send(to, amount);
            sendPromise.then(transactionHash=>{
              this.setState({transactionHash: transactionHash.hash,
                transactionCount: this.state.transactionCount+1
              });
              // console.log(transactionHash);
            }).catch(arg => {alert('交易失败！原因是'+arg);
            console.log('交易失败！原因是'+arg)}); }}>
            <Text>转账</Text>
          </Button>
          <Text style={{padding: 10, fontSize:12}}>
          钱包地址:{this.state.address}
        </Text>
        <Text style={{padding: 10, fontSize:12}}>
          balance:{this.state.balance}；
          transactionCount:{this.state.transactionCount}
        </Text>
        <Text style={{padding: 10, fontSize:12}}>
          交易哈希: {this.state.transactionHash}
        </Text>
        <Button full dark onPress={ ()=>{
          this.props.navigation.navigate("PreBackup",{wallet:this.state.wallet})
        } }><Text>备份钱包</Text></Button>
        </Content>
        
        <Button full dark onPress={ ()=>{
          AsyncStorage.clear().then(()=>this.props.navigation.navigate("MainPage"))
        } }><Text>退出登录</Text></Button>
        <Footer>
        
        </Footer>
      </Container>
    );
  }
}


