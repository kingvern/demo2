var ethers = require('ethers');
// var bip39 = require('bip39');

var CryptoJS = require("crypto-js");

import React, { Component } from "react";
import { View } from "react-native";
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

import { AsyncStorage } from "react-native";

import styles from "./styles";

// words = 'radar blur cabbage chef fix engine embark joy scheme fiction master release'.split(' ');


// export default class wordButton extends Component {

// }

Array.prototype.remove = function(val) {
  var index = this.indexOf(val);
  if (index > -1) {
  this.splice(index, 1);
  }
};

export default class Backup extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      wallet: this.props.navigation.state.params.wallet,
      mnemonic: this.props.navigation.state.params.wallet.mnemonic,
      pin:this.props.navigation.state.params.pin,
      textareaArray:[],
      textarea: '',
      stateWord:[],
      wordState:[]
    };

    this._checkMnemonic=this._checkMnemonic.bind(this)
    this._asyncAppstatus=this._asyncAppstatus.bind(this)
    // var mnemonic = this.state.mnemonic;
    // var words = mnemonic.split(' ');
    
    // console.log(words)
    // this.setState({word:['words']})
    // console.log(this.state.word)
    // console.log(this.state.wordsItem)
    // // words.map((word)=>console.log(word))

    
  }
  componentDidMount(){

    // this._asyncAppstatus()
    console.log(this.state)
    var mnemonic = this.state.mnemonic;
    var pin = this.state.pin;
    // var words = mnemonic.split(' ').sort(()=> .5 - Math.random());
    var words = mnemonic.split(' ');
    var wordState = new Array();
    words.map((item,i) => wordState[item]=true)
    this.setState({stateWord:words ,wordState:wordState},()=>{console.log(this.state)});

    //--------------------------click button => util----------------------------------------------------

    var wallet = this.state.wallet;
    wallet.provider = ethers.providers.getDefaultProvider('ropsten');
    var balancePromise = wallet.getBalance();
    var transactionCountPromise = wallet.getTransactionCount();

    balancePromise.then((balance)=>{
      balance = parseInt(balance);
      this.setState({balance: balance});
      console.log("balance:",balance)

      transactionCountPromise.then((transactionCount)=>{
        txCount = parseInt(transactionCount);
        this.setState({txCount: txCount});
        console.log("txCount:",txCount)
    }).then(()=>{
      
      var walletData = {
        address:wallet.address,
        privateKeyRaw: CryptoJS.AES.encrypt(wallet.privateKey, pin).toString(),
        mnemonicRaw: CryptoJS.AES.encrypt(wallet.mnemonic, pin).toString(),
        balance:this.state.balance,
        txCount:this.state.txCount
      }
      this.setState({walletData:walletData})
      console.log(CryptoJS.AES.encrypt(wallet.privateKey, pin).toString())
      console.log(walletData)
        AsyncStorage.setItem('data',JSON.stringify(walletData))
        console.log("AsyncStorage save success!")
  
    })

  }).catch(arg => alert('获取余额失败！原因是'+arg));
     //------------------------------------------------------------------------------

    // this.setState({walletData:walletData})
  }

  componentWillUnmount(){

  }

  _asyncAppstatus(){
    AsyncStorage.getItem('data')
    .then((data)=>{
      console.log(data)
      if(data){
        walletData = JSON.parse(data)
         if(walletData && walletData.mnemonic){
          var wallet = ethers.Wallet.fromMnemonic(walletData.mnemonic);
          this.setState({
            logined:true,
            wallet: wallet,
            privateKey:'',
            mnemonic:walletData.mnemonic,
            address:walletData.address})
        }
    console.log('mnemonic:'+this.state.mnemonic)
    console.log(this.state)
      
      }
    })
    .catch(arg=>console.log(arg));
    
    
  }

  renderItem(item,i) {
    // if(this.state.wordState[i])
    if(this.state.wordState[item])
    return (
           <Button dark style={styles.button} onPress={()=>{
            var wordState  = this.state.wordState
            var textarea  = this.state.textarea
            var textareaArray  = this.state.textareaArray
            textareaArray.push(item)
            console.log(textareaArray)
            textarea=='' ? textarea=item :textarea = textarea + " " + item 
            textarea = textareaArray.join(' ')
            wordState[item] = !wordState[item]
            this.setState({
              wordState:wordState,
              textarea:textarea,
              textareaArray:textareaArray
            })
           }} key={i} ><Text>{item}</Text></Button>
       );
    else
    return (
      <Button light style={styles.button} onPress={()=>{
       var wordState  = this.state.wordState
       var textarea  = this.state.textarea
       var textareaArray  = this.state.textareaArray
       textareaArray.remove(item)
       console.log(textareaArray)
       textarea = textarea.slice(0,-1-item.length)
       textarea = textareaArray.join(' ')
       wordState[item] = !wordState[item]
       this.setState({
         wordState:wordState,
         textarea:textarea,
         textareaArray:textareaArray
       })
      }}  key={i} ><Text>{item}</Text></Button>
  );
  }

  _checkMnemonic(){
    console.log('textarea:'+this.state.textarea)
    console.log('mnemonic:'+this.state.mnemonic)
    if(this.state.textarea == this.state.mnemonic){
      // this.crypoWallet();
      this.props.navigation.navigate("MyWallet", {walletData:this.state.walletData});}
      else
      alert("输入错误哦！")
  }

  // crypoWallet(){
  //   var walletRaw = this.state.wallet;
  //   var pin = this.state.pin;
  //   var mnemonic = walletRaw.mnemonic;
  //   var privateKey = walletRaw.privateKey;
    
  //   mnemonicRaw = CryptoJS.AES.encrypt(mnemonic, pin);
  //   mnemonic = CryptoJS.AES.decrypt(mnemonicRaw, pin);

  //   console.log(mnemonicRaw)
  //   console.log(mnemonicRaw)

  //   this.setState({
  //     walletRaw:walletRaw
  //   })
  // }


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
            <Title>点击输入助记词</Title>
          </Body>
          <Right>
          </Right>
        </Header>

        <Content padder  >
            <Textarea rowSpan={5} bordered placeholder="输入助记词，按空格分隔；或者直接点击助记词按钮输入" 
            value={this.state.textarea}
            onChangeText={(textarea) => this.setState({textarea})}/>

           
          <Content padder>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" ,flexWrap:"wrap"}}
          >
          {this.state.stateWord.map( (item,i) => this.renderItem(item,i) )}
          </View>
          </Content>
          <Button full dark style={{ marginTop:20}}
          onPress={
            this._checkMnemonic
          }
            >
            <Text>确定</Text>
          </Button>

        </Content>
      </Container>
    );
  }
}

