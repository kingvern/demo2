var ethers = require('ethers');
// var bip39 = require('bip39');

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
      textarea: '',
      textareaArray: [],
      // wordsItem:["radar","blur","cabbage","chef","fix","engine","embark","joy","scheme","fiction","master","release"],
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

    this._asyncAppstatus()
    console.log('state:'+this.state)
    var mnemonic = this.state.mnemonic;
    var words = mnemonic.split(' ');
    var wordState = new Array();
    words.map((item,i) => wordState[item]=true)
    console.log(words)
    this.setState({stateWord:words ,wordState:wordState},()=>{console.log(this.state)});
    console.log(this.state)
    console.log(this.state.wordsItem)
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
    if(this.state.textarea == this.state.mnemonic)
              // this.props.navigation.navigate("MyWallet", {address:wallet.address,wallet:wallet})
      this.props.navigation.navigate("MyWallet", {wallet:this.state.wallet});
      else
      alert("输入错误哦！")
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

