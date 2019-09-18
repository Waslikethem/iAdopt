import React from 'react';
import { createStackNavigator, createAppContainer } from "react-navigation";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";

class App extends React.Component {
  render() {
    return <AppNavigator />;
  }
}

const AppNavigator = createStackNavigator(
  {
    LoginPage,
    HomePage
  },
  {
    headerMode: "none",
    defaultNavigationOptions: { headerVisable: false }
  },
  {
    initialRouteName: "LoginPage"
  }
);

export default createAppContainer(AppNavigator);
