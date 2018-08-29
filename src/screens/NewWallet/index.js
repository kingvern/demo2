var ethers = require("ethers");

var CryptoJS = require("crypto-js");

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
  Text, Input, Item, H3
} from "native-base";
import styles from "./styles";

export default class NewWallet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pin: ""
    };
  }

  render() {
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back"/>
            </Button>
          </Left>
          <Body>
          <Title>新建钱包</Title>
          </Body>
          <Right>
          </Right>
        </Header>

        <Content padder>

          <H3 style={{ color: "#000", alignSelf: "center" }}>输入PIN码</H3>
          <Text style={{ color: "#000", alignSelf: "center" }}>PIN码用于交易签名。我们不存储PIN码，无法提供找回功能，请牢记</Text>
          <Item>
            <Input bordered placeholder="输入PIN码" onChangeText={(pin) => {
              console.log(pin);
              this.setState({ pin: pin });
            }}/>
          </Item>
          <Button full dark style={{ marginTop: 20 }} onPress={() => {
            var pin = this.state.pin;
            var wallet = ethers.Wallet.createRandom(pin);
            this.setState({ mnemonic: wallet.mnemonic });
            console.log(this.state);
            this.props.navigation.navigate("PreBackup", { wallet: wallet, pin: pin });
          }
          }>
            <Text>下一步</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}
