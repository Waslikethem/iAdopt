import React from 'react';
import { createAppContainer } from '@react-navigation/native';
import { createStackNavigator } from 'react-navigation-stack';
import Home from "./Pages/Home";
import Pets from "./Pages/Pets";
import Login from "./Pages/Login";
import Registration from "./Pages/Registration";
import PublishPet from './Pages/PublishPet';
import PublishPetImages from './Pages/PublishPetImages';
import EditProfile from './Pages/EditProfile';
import Categories from './Pages/Categories';
import MyPets from './Pages/MyPets';


class App extends React.Component {
  render() {
    return <AppNavigator />;
  }
}

const AppNavigator = createStackNavigator(
  {
    Login,
    Home,
    Categories,
    PublishPet,
    EditProfile,
    PublishPet,
    PublishPetImages,
    Pets,
    Registration,
    MyPets,
  },
  {
    headerMode: "none",
    defaultNavigationOptions: { headerVisable: false }
  },
  {
    initialRouteName: "Login"
  }
);

export default createAppContainer(AppNavigator);
