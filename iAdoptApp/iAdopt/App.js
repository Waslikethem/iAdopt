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
    //LoginPage,
    RegistrationPage,
    //HomePage,
    LoginPage,
    PetsPage,
    VeterianriansPage,
    
    
  },
  {
    headerMode: "none",
    defaultNavigationOptions: { headerVisable: false }
  },
  {
    initialRouteName: "RegistrationPage"
  }
);

export default createAppContainer(AppNavigator);
