var ethers = require("ethers");
// var bip39 = require('bip39');
var HDNode = require("ethers").HDNode;

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
  Text, Tab, Tabs, Label, Input, Item, Textarea
} from "native-base";
import styles from "./styles";

export default class NewWord extends Component {
  //测试页面，不用管
  constructor(props) {
    super(props);
    this.state = {
      privateKey: "0x0123456789012345678901234567890123456789012345678901234567890124",
      mnemonic: "radar blur cabbage chef fix engine embark joy scheme fiction master release",
      // text: 'password123',
      // address:'0x4C42F75ceae7b0CfA9588B940553EB7008546C29',
      balance: -1,
      to: "0x486c14c72bd37ead125c37d9d624118946d18a36",
      isOne: true
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
          <Tabs initialPage={0} onChangeTab={() => {
            this.setState({ isOne: !this.state.isOne });
          }}>
            <Tab heading="助记词">
            <Textarea rowSpan={5} bordered placeholder="输入助记词，按空格分隔"
                      onChangeText={(mnemonic) => this.setState({ mnemonic })}
                      value={this.state.mnemonic}/>

            </Tab>
            <Tab heading="私钥">
            <Textarea rowSpan={5} bordered placeholder="输入明文私钥"
                      onChangeText={(privateKey) => this.setState({ privateKey })}
                      value={this.state.privateKey}/>

            </Tab>
          </Tabs>
          <Button full dark style={{ marginTop: 20 }}
                  onPress={() => {
                    if (!this.state.isOne) {
                      var mnemonic = this.state.mnemonic;
                      var wallet = ethers.Wallet.fromMnemonic(mnemonic);
                      this.setState({ address: wallet.address, wallet: wallet });
                      // var masterNode = HDNode.fromMnemonic(mnemonic);
                      // console.log(masterNode)
                      var Entropy = HDNode.mnemonicToEntropy(mnemonic);
                      console.log("Entropy", Entropy);
                      var Seed = HDNode.mnemonicToSeed(mnemonic);
                      console.log("Seed", Seed);
                    } else {
                      var privateKey = this.state.privateKey;
                      // var wallet = new ethers.Wallet(privateKey);
                      // this.setState({address:wallet.address,wallet:wallet});

                      // var entropy = utils.randomBytes(16);
                      // var mnemonic = HDNode.entropyToMnemonic(entropy);
                      // console.log('mnemonic',mnemonic)

                      // alert(mnemonic)
                      var wallet = ethers.Wallet.createRandom(privateKey);
                      console.log("Address: " + wallet.mnemonic);
                      console.log(wallet);
                    }
                    // alert(wallet.address);

                    var password = "password123";

                    function callback(percent) {
                      // alert("Encrypting: " + parseInt(percent * 100) + "% complete");
                      console.log("Encrypting: " + parseInt(percent * 100) + "% complete");
                    }

                    // var encryptPromise = wallet.encrypt(password, callback);

                    // encryptPromise.then(function(json) {
                    //     // alert(json);
                    //     console.log(json);
                    // });
                    // this.props.navigation.navigate("MyWallet", {address:wallet.address,wallet:wallet})
                  }}>
            <Text>确定</Text>
          </Button>
          <Button full dark style={{ marginTop: 20 }}
                  onPress={() => {
                    var HDNode = require("ethers").HDNode;
                    var mnemonic = "radar blur cabbage chef fix engine embark joy scheme fiction master release";
                    var Entropy = HDNode.mnemonicToEntropy(mnemonic);
                    console.log(Entropy);
                    // alert(Entropy);
                    var Mnemonic = HDNode.entropyToMnemonic(Entropy);
                    console.log(Mnemonic);
                    // alert(Mnemonic);
                    var Seed = HDNode.mnemonicToSeed(mnemonic);
                    console.log(Seed);
                    // alert(Seed);
                    var IF = HDNode.isValidMnemonic(mnemonic);
                    console.log(IF);


                  }}>
            <Text>transform</Text>
          </Button>
          {/* <Button full dark style={{ marginTop:20}}
           onPress={()=>
          {
            // var mnemonic = bip39.generateMnemonic();
            // this.setState({mnemonic:mnemonic});


          }}>
            <Text>gen mnemonic</Text>
          </Button> */}
        </Content>
      </Container>
    );
  }
}

