
var ethers = require('ethers');
import React, { Component } from "react";
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
  Text,Input, Item,H3
} from "native-base";
import styles from "./styles";

export default class MyWallet extends Component {

    constructor(props) {
        super(props);
        this.state = { 
          // text: '0x0123456789012345678901234567890123456789012345678901234567890124',
        //   text: 'radar blur cabbage chef fix engine embark joy scheme fiction master release',
        //   // text: 'password123',
          address: this.props.navigation.state.params.address,
          wallet: this.props.navigation.state.params.wallet,
          balance: -1,
          transactionCount: -1,
          to: '0x486c14c72bd37ead125c37d9d624118946d18a36',
          value: 0.001
        };


        var wallet = this.state.wallet;
        wallet.provider = ethers.providers.getDefaultProvider('ropsten');
        var balancePromise = wallet.getBalance();
        balancePromise.then((balance)=>{
            balance = parseInt(balance);
            // alert(balance);
            this.setState({balance: balance});
        });
        var transactionCountPromise = wallet.getTransactionCount();
        transactionCountPromise.then((transactionCount)=>{
            transactionCount = parseInt(transactionCount);
            // alert(transactionCount);
            this.setState({transactionCount: transactionCount});
        });
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
          onPress={()=>
            { 
                // console.log(this.props.navigation.state.params.address)
              var wallet = this.state.wallet;
              wallet.provider = ethers.providers.getDefaultProvider('ropsten');
              var to = this.state.to;
              
              var amount = ethers.utils.parseEther('0.01');
              var sendPromise = wallet.send(to, amount);
              sendPromise.then(transactionHash=>{
                alert('交易成功！交易Hash为'+transactionHash.hash);
                this.setState({transactionHash: transactionHash.hash});
                console.log(transactionHash);
                
                var balancePromise = wallet.getBalance();
                balancePromise.then((balance)=>{
                  balance = parseInt(balance);
                  // alert(balance);
                  this.setState({balance: balance});
                });
                var transactionCountPromise = wallet.getTransactionCount();
                transactionCountPromise.then(transactionCount=>{
                  transactionCount = parseInt(transactionCount);
                  // alert(transactionCount);
                  this.setState({transactionCount: transactionCount});
                })
              }).catch(arg => alert('交易失败！原因是'+arg));

                
            }}
          >
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
        </Content>
      </Container>
    );
  }
}


