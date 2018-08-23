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
  Text, Tab, Tabs , Label, Input,Item,Textarea
} from "native-base";
import styles from "./styles";

export default class CertWord extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      privateKey: '0x0123456789012345678901234567890123456789012345678901234567890124',
      mnemonic: 'radar blur cabbage chef fix engine embark joy scheme fiction master release',
      // text: 'password123',
      // address:'0x4C42F75ceae7b0CfA9588B940553EB7008546C29',
      balance: -1,
      transactionCount: -1,
      to: '0x486c14c72bd37ead125c37d9d624118946d18a36',
      isOne: true
    };
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
            <Title>导入钱包</Title>
          </Body>
          <Right>
          </Right>
        </Header>

        <Content padder>
          <Tabs initialPage={0} onChangeTab={()=>{this.setState({isOne:!this.state.isOne})}}> 
            <Tab heading="助记词" >
            <Textarea rowSpan={5} bordered placeholder="输入助记词，按空格分隔" 
            onChangeText={(mnemonic) => this.setState({mnemonic})}
            value={this.state.mnemonic}/>
            
            </Tab>
            <Tab heading="私钥" >
            <Textarea rowSpan={5} bordered placeholder="输入明文私钥" 
            onChangeText={(privateKey) => this.setState({privateKey})}
            value={this.state.privateKey}/>
            
            </Tab>
          </Tabs>
          <Button full dark style={{ marginTop:20}}
          onPress={()=>
            { 
              if(!this.state.isOne){
              var mnemonic = this.state.mnemonic;
              var wallet =  ethers.Wallet.fromMnemonic(mnemonic);
              this.setState({address:wallet.address,wallet:wallet});
              }else{
              var privateKey = this.state.privateKey;
              var wallet = new ethers.Wallet(privateKey);
              this.setState({address:wallet.address,wallet:wallet});
              }
              alert(wallet.address);
              this.props.navigation.navigate("MyWallet", {address:wallet.address,wallet:wallet})
            }}>
            <Text>确定</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

