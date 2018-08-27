var ethers = require('ethers');
import React, { Component } from "react";
import { ImageBackground, View, StatusBar } from "react-native";
import { Container, Button, H3, Text } from "native-base";

import styles from "./styles";

import { AsyncStorage } from "react-native";

const launchscreenBg = require("../../../assets/launchscreen-bg.png");
const launchscreenLogo = require("../../../assets/logo-kitchen-sink.png");

export default class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state={logined:false};
  }
  componentDidMount(){
    this._asyncAppstatus()
    console.log(this.state.logined)
    this.setState({logined:true},()=>console.log(this.state))
    
    if(this.state.logined){
      this.props.navigation.navigate("MyWallet",{from:'MainPage',wallet:this.state.wallet,mnemonic:this.state.mnemonic,privateKey:this.state.privateKey,address:this.state.address});
    }
  }
  _asyncAppstatus(){
    AsyncStorage.getItem('data')
    .then((data)=>{
      console.log("data:"+data)
      if(data){
        walletData = JSON.parse(data)
         if(walletData.address && walletData.privateKey){
          var wallet = new ethers.Wallet(walletData.privateKey);
          this.setState({
            logined:true,
            wallet: wallet,
            privateKey:walletData.privateKey,
            mnemonic:walletData.mnemonic,
            address:walletData.address})
        }else if(walletData.address && walletData.mnemonic){
          var wallet = ethers.Wallet.fromMnemonic(walletData.mnemonic);
          this.setState({
            logined:true,
            wallet: wallet,
            privateKey:'',
            mnemonic:walletData.mnemonic,
            address:walletData.address})
        }
      
      }else{
        this.setState({
          logined:false})
      }
    }).then(
      ()=>{
        if(this.state.logined){
          this.props.navigation.navigate("MyWallet",{from:'MainPage',wallet:this.state.wallet,mnemonic:this.state.mnemonic,privateKey:this.state.privateKey,address:this.state.address});
        }
      }
    )
    .catch(arg=>console.log(arg));
    console.log('start:'+this.state.logined)
    
  }

  render() {
    return (
      <Container>
        <StatusBar barStyle="light-content" />
        <ImageBackground source={launchscreenBg} style={styles.imageContainer}>
          <View style={styles.logoContainer}>
          </View>
          <View
            style={{
              alignItems: "center",
              marginBottom: 50,
              backgroundColor: "transparent"
            }}
          >
            <H3 style={styles.text}>在请先创建一个钱包</H3>
            <View style={{ marginTop: 8 }} />
            <Text style={styles.text}>可以通过新建或导入以太坊钱包创建钱包</Text>
            <View style={{ marginTop: 8 }} />
          </View>
          <View style={{ marginBottom: 80 }}>
            <Button
              style={{ backgroundColor: "#000", alignSelf: "center" }}
              onPress={() => this.props.navigation.navigate("NewWallet")}
            >
              <Text>新建钱包</Text>
            </Button>
          </View>
          <View style={{ marginBottom: 80 }}>
            <Button
              style={{ backgroundColor: "#fff", alignSelf: "center" }}
              onPress={() => this.props.navigation.navigate("ImportWallet")}
            >
              <Text style={{color:'#000' }}>导入钱包</Text>
            </Button>
          </View>
        </ImageBackground>
      </Container>
    );
  }
}


