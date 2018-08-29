import React, { Component } from "react";
import { Modal, View } from "react-native";
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
  Text, Input, Item, H3, Footer, Toast
} from "native-base";
import styles from "./styles";

var CryptoJS = require("crypto-js");
var ethers = require("ethers");

var walletUtil = require("../../Util/wallet");
var storageUtil = require("../../Util/storage");

export default class MyWallet extends Component {
  // 从NewWallet或MyWallet传进参数：wallet，pin
  // 到Backup传出参数：wallet，pin
  constructor(props) {
    super(props);
    this.state = {
      walletData: this.props.navigation.state.params.walletData,
      address: this.props.navigation.state.params.walletData.address,
      privateKeyRaw: this.props.navigation.state.params.walletData.privateKeyRaw,
      mnemonicRaw: this.props.navigation.state.params.walletData.mnemonicRaw,
      balance: this.props.navigation.state.params.walletData.balance,
      to: "0x486c14c72bd37ead125c37d9d624118946d18a36",
      value: "0.0001",
      ModalVisible: false,
      pin: "",
      task: ""
    };
    console.log(this.state.walletData);

  }

  setModalVisible(nimade) {
    this.setState({ ModalVisible: nimade });
  }

  componentWillUnmount() {
    var walletData = {
      address: this.state.address,
      privateKeyRaw: this.state.privateKeyRaw,
      mnemonicRaw: this.state.mnemonicRaw,
      balance: this.state.balance
    };
    this.setState({ walletData: walletData });

    storageUtil.setData(walletData);
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
          <Title>我的钱包</Title>
          </Body>
          <Right>
          </Right>
        </Header>

        <Content padder>

          <H3 style={{ color: "#000", alignSelf: "center" }}>转账</H3>
          <Item>
            <Input bordered placeholder="请输入对方地址" value={this.state.to} onChangeText={(to) => this.setState({ to })}/>
            <Input bordered placeholder="请输入转账金额" value={this.state.value.toString()}
                   onChangeText={(value) => this.setState({ value })}/>
          </Item>
          <Button full dark style={{ marginTop: 20 }} onPress={() => {
            this.setState({ ModalVisible: true, pin: "", task: "tx" });
          }}>
            <Text>转账</Text>
          </Button>
          <Text style={{ padding: 10, fontSize: 11 }}>
            钱包地址:{this.state.address}
          </Text>
          <Text style={{ padding: 10, fontSize: 22, alignSelf: "center" }}>
            {this.state.balance.toFixed(18)}
          </Text>
          <Text style={{ padding: 10, fontSize: 11 }}>
            交易哈希: {this.state.txHash}
          </Text>
          <Button full dark style={{ marginTop: 20 }} onPress={() => {
            this.setState({ ModalVisible: true, pin: "", task: "backup" });
          }}><Text>备份钱包</Text></Button>
        </Content>

        <View style={{ marginTop: 22 }}>
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.ModalVisible}
            onRequestClose={() => {
              alert("Modal has been closed.");
            }}>
            <View style={{ marginTop: 22 }}>

              <H3 style={{ color: "#000", alignSelf: "center" }}>转账输入PIN码</H3>
              <Text style={{ color: "#000", alignSelf: "center" }}>PIN码用于交易签名。我们不存储PIN码，无法提供找回功能，请牢记</Text>
              <Item>
                <Input bordered placeholder="输入PIN码" value={this.state.pin}
                       onChangeText={pin => this.setState({ pin: pin })}/>
              </Item>
              <Button full dark style={{ marginTop: 20 }} onPress={() => {
                var wallet = walletUtil.checkPin(this.state.walletData, this.state.pin);
                console.log(wallet);
                if (wallet) {
                  var toastText = "验证成功";
                  if (this.state.task == "tx") {
                    // var txHash = walletUtil.sendTx(wallet,this.state.to,this.state.value)
                    var amount = ethers.utils.parseEther(this.state.value);
                    wallet.provider = ethers.providers.getDefaultProvider("ropsten");
                    var sendPromise = wallet.send(this.state.to, amount);
                    sendPromise.then(transactionHash => {
                      var txHash = transactionHash.hash;
                      this.setState({ txHash: txHash });
                      console.log("txHash", txHash);

                      if (txHash) {
                        Toast.show({
                          text: "交易成功",
                          buttonText: "Okay"
                        });
                        var oldBalance = this.state.balance;
                        console.log(oldBalance);
                        var balance = 0;
                        // while(1!=2) console.log(balance,txCount)
                        // while(oldBalance >= balance || oldTxCount >= txCount){
                        var balancePromise = wallet.getBalance();
                        balancePromise.then((balanceRaw) => {
                          balance = parseInt(balanceRaw) / 1000000000000000000;
                          this.setState({ balance: balance });

                        });
                      }

                    }).catch(arg => {
                      alert("交易失败！原因是" + arg);
                    });


                  } else if (this.state.task == "backup") {
                    this.props.navigation.navigate("PreBackup", { wallet: wallet, pin: this.state.pin });

                  }

                } else {
                  var toastText = "验证失败";

                }
                this.setModalVisible(false);
                Toast.show({
                  text: toastText,
                  buttonText: "Okay"
                });

                console.log("下一步", this.state.ModalVisible);
                // alert("PIN码错误！")
              }}>
                <Text>下一步</Text>
              </Button>
              <Button full dark style={{ marginTop: 20 }} onPress={() => {
                this.setModalVisible(false);
                console.log("关闭", this.state.ModalVisible);
              }}>
                <Text>关闭</Text>
              </Button>
            </View>
          </Modal>
        </View>


        <Footer>
          <Button full danger onPress={() => {
            AsyncStorage.clear().then(() => this.props.navigation.navigate("MainPage"));
          }}><Text>退出登录</Text></Button>
        </Footer>
      </Container>
    );
  }
}


