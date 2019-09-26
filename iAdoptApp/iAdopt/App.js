import React from 'react';
import { createAppContainer } from '@react-navigation/native';
import { createStackNavigator } from 'react-navigation-stack';
import HomePage from "./Pages/HomePage";
import PetsPage from "./Pages/PetsPage";
import LoginPage from "./Pages/LoginPage";
import RegistrationPage from "./Pages/RegistrationPage";
import VeterianriansPage from "./Pages/VeterianriansPage";


class App extends React.Component {
  render() {
    return <AppNavigator />;
  }
}

const AppNavigator = createStackNavigator(
  {
    PetsPage,
    VeterianriansPage,   
    LoginPage,
    RegistrationPage,
    HomePage,
    
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
