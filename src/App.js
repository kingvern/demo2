import React from "react";
import { Root } from "native-base";
import { StackNavigator } from "react-navigation";

import MainPage from "./screens/MainPage";
import ImportWallet from "./screens/ImportWallet";
import NewWallet from "./screens/NewWallet";
import MyWallet from "./screens/MyWallet";

const AppNavigator = StackNavigator(
  {
    MainPage: { screen: MainPage },
    ImportWallet: { screen: ImportWallet },
    NewWallet: { screen: NewWallet },
    MyWallet: { screen: MyWallet }
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
