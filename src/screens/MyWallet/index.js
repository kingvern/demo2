import React, { Component } from "react";
import {Modal,  TouchableHighlight, View} from 'react-native';
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
  Text,Input, Item,H3, Footer,Toast
} from "native-base";
import styles from "./styles";

var CryptoJS = require("crypto-js");
var ethers = require('ethers');

var walletUtil = require('../../Util/wallet')


      

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
          walletData:this.props.navigation.state.params.walletData,
          address: this.props.navigation.state.params.walletData.address,
          balance: this.props.navigation.state.params.walletData.balance,
          transactionCount: this.props.navigation.state.params.walletData.txCount,
          to: '0x486c14c72bd37ead125c37d9d624118946d18a36',
          value: '0.0001',
          ModalVisible:false,
          pin:'',
          task:'',
        };
        console.log(this.state.walletData)

        // wallet.provider = ethers.providers.getDefaultProvider('ropsten');

        // this.getBalanceAndTxCount();

    }
    setModalVisible(nimade) {
      this.setState({ModalVisible: nimade});
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
          onPress={ ()=>{
            // var to = this.state.to;
            // var wallet = this.state.wallet;
            // var amount = ethers.utils.parseEther(this.state.value);
            // var sendPromise = wallet.send(to, amount);
            // sendPromise.then(transactionHash=>{
            //   this.setState({transactionHash: transactionHash.hash,
            //     transactionCount: this.state.transactionCount+1
            //   });
            //   // console.log(transactionHash);
            // }).catch(arg => {alert('交易失败！原因是'+arg);
            // console.log('交易失败！原因是'+arg)}); 
            // this.setModalVisible(true);

          this.setState({ModalVisible:true,pin:'',task:'tx'})
            // this.setModalVisible(true);
            console.log('转账',this.state.ModalVisible)
            }}>
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
          交易哈希: {this.state.txHash}
        </Text>
        <Button full dark onPress={ ()=>{
          this.setState({ModalVisible:true,pin:'',task:'backup'})
            console.log('备份钱包',this.state.ModalVisible)
        //     this.props.navigation.navigate("PINPage",{walletData:this.state.walletData})
        // }
          
        } }><Text>备份钱包</Text></Button>
        </Content>

        <View style={{marginTop: 22}}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.ModalVisible}
          onRequestClose={() => {
            alert('Modal has been closed.');
          }}>
          <View style={{marginTop: 22}}>

                  <H3 style={{ color: "#000", alignSelf: "center" }}>转账输入PIN码</H3>
                  <Text style={{ color: "#000", alignSelf: "center" }}>PIN码用于交易签名。我们不存储PIN码，无法提供找回功能，请牢记</Text>
                  <Item>
                  <Input bordered placeholder="输入PIN码" value={this.state.pin}  onChangeText={pin=>this.setState({pin:pin})}/>
                  </Item>
                  <Button full dark style={{ marginTop:20}} onPress={()=>{
                    var wallet = walletUtil.checkPIN(this.state.walletData,this.state.pin)
                    console.log(wallet)
                    if(wallet){
                      var toastText = '验证成功'
                      if(this.state.task == 'tx'){
                        // var txHash = walletUtil.sendTx(wallet,this.state.to,this.state.value)
                        var amount = ethers.utils.parseEther(this.state.value);
                        wallet.provider = ethers.providers.getDefaultProvider('ropsten');
                        var sendPromise = wallet.send(this.state.to, amount);
                        sendPromise.then(transactionHash=>{
                            var txHash = transactionHash.hash
                            this.setState({txHash:txHash})
                            console.log('txHash',txHash)

                            if(txHash){
                              var oldBalance = this.state.balance
                              var oldTxCount = this.state.transactionCount
                              console.log(oldBalance)
                              console.log(oldTxCount)

                              // var balance,txCount=walletUtil.getBalanceAndTxCount(wallet)
                              var balance=0,txCount=0
                              // while(1!=2) console.log(balance,txCount)
                              // while(oldBalance >= balance || oldTxCount >= txCount){
                                var balancePromise = wallet.getBalance();
                                var transactionCountPromise = wallet.getTransactionCount();
                                balancePromise.then((balanceRaw)=>{
                                    balance = parseInt(balanceRaw);

                                    // this.setState({balance:balance,transactionCount:txCount})

                                    transactionCountPromise.then((transactionCountRaw)=>{
                                        txCount = parseInt(transactionCountRaw);
                                        console.log('getBalanceAndTxCount',balance,txCount)
                                        this.setState({balance:balance,transactionCount:txCount})
                                        
                                    }).catch(arg => alert('获取交易次数失败！原因是'+arg));
                                });
                              // }
                              

                        //  balance,txCount=walletUtil.getBalanceAndTxCount(wallet)
                            }

                        }).catch(arg => {alert('交易失败！原因是'+arg);
                        console.log('交易失败！原因是'+arg)});
                        


                      }else if(this.state.task == 'backup'){
                        this.props.navigation.navigate('PreBackup',{wallet:wallet,pin:this.state.pin})

                      }

                    }else{
                      var toastText = '验证失败'

                    }
                    this.setModalVisible(false);
                    Toast.show({
                      text: toastText,
                      buttonText: 'Okay'
                    })

                    console.log('下一步',this.state.ModalVisible)
                      // alert("PIN码错误！")
                  }}>
                    <Text>下一步</Text>
                  </Button>
                  <Button full dark style={{ marginTop:20}} onPress={()=>{
                    this.setModalVisible(false);
                    console.log('关闭',this.state.ModalVisible)
                  }}>
                    <Text>关闭</Text>
                  </Button>
          </View>
        </Modal>
      </View>
        
        
        <Footer>
        <Button full danger onPress={ ()=>{
          AsyncStorage.clear().then(()=>this.props.navigation.navigate("MainPage"))
        } }><Text>退出登录</Text></Button>
        </Footer>
      </Container>
    );
  }
}


