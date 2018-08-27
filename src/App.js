import React from "react";
import { Root } from "native-base";
import { StackNavigator } from "react-navigation";

import MainPage from "./screens/MainPage";
import ImportWallet from "./screens/ImportWallet";
import NewWallet from "./screens/NewWallet";
import MyWallet from "./screens/MyWallet";
import NewWord from "./screens/NewWord";
import CertWord from "./screens/CertWord";
import PreBackup from "./screens/PreBackup";
import Backup from "./screens/Backup";

const AppNavigator = StackNavigator(
  {
    MainPage: { screen: MainPage },
    ImportWallet: { screen: ImportWallet },
    NewWallet: { screen: NewWallet },
    MyWallet: { screen: MyWallet },
    NewWord: { screen: NewWord },
    PreBackup: { screen: PreBackup },
    Backup: { screen: Backup },
    CertWord: { screen: CertWord }
  },
  {
    initialRouteName: "MainPage",
    headerMode: "none"
  }
);

export default () =>
  <Root>
    <AppNavigator />
  </Root>;
