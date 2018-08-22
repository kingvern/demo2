import React, { Component } from "react";
import { ImageBackground, View, StatusBar } from "react-native";
import { Container, Button, H3, Text } from "native-base";

import styles from "./styles";

const launchscreenBg = require("../../../assets/launchscreen-bg.png");
const launchscreenLogo = require("../../../assets/logo-kitchen-sink.png");

export default class MainPage extends Component {
  render() {
    return (
      <Container>
        <StatusBar barStyle="light-content" />
        <ImageBackground source={launchscreenBg} style={styles.imageContainer}>
          <View style={styles.logoContainer}>
            {/* <ImageBackground source={launchscreenLogo} style={styles.logo} /> */}
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


