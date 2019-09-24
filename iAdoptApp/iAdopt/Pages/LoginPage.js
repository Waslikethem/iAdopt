import React from "react";
import { KeyboardAvoidingView, View, Text, StyleSheet, Image, ListView, FlatList, Alert, TouchableOpacity, ScrollView, ActivityIndicator, AsyncStorage } from "react-native";
import { Button, ThemeProvider, ListItem, List, ButtonGroup, CheckBox, Input, SocialIcon } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import { Col, Row, Grid } from "react-native-easy-grid";
import Icon from 'react-native-vector-icons/FontAwesome';
const URL = "http://ruppinmobile.tempdomain.co.il/site02/WebService.asmx";
const IMAGE_URL = "http://ruppinmobile.tempdomain.co.il/site02/ImageStorage/";

export default class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            //Screen
            title: 'התחברות לאפליקציה',
            //User
            userID: 0,
            userName: '',
            userPassword: '',
            userEmail: '',
            userFirstName: '',
            userLastName: '',
            userPhone: '',
            userRegion: 0,
            userGender: '',
            userImage: '',
            //AsyncStorage
            isMember: false,
            //Picture
            pic64base: '',
            picName64base: '',
            picUri: '',
            img: ' ',
        }
    }
    componentDidMount() {
        //Checks if the user already exists in the phone memory
        AsyncStorage.getItem("isMember", (err, result) => {
            console.log(result);
            this.setState({ isMember: JSON.parse(result) });
            if (this.state.isMember == true) {
                //this.props.navigation.navigate("HomePage");
                Alert.alert('We Remember You :D');
            }
        });
    }
    btnLogin = () => {
        const data = {
            //Most be like the Csharp func Code!
            userNameOrEmail: this.state.userName,
            userPass: this.state.userPassword,
        };
        fetch(URL + '/Login', {
            method: 'post',
            headers: new Headers({
                'Content-Type': 'application/json;',
            }),
            body: JSON.stringify(data)
        })
            .then(res => {
                console.log('res=', res);
                return res.json()
            })
            .then(
                (result) => {
                    let u = JSON.parse(result.d);
                    if (u != null) {
                        this.setState({
                            userID: u.UserID,
                            userName: u.UserName,
                            userPassword: u.Password,
                            userEmail: u.Email,
                            userFirstName: u.Fname,
                            userLastName: u.Lname,
                            userPhone: u.Phone,
                            userRegion: u.RegionCode,
                            userGender: u.Gender,
                            userImage: u.UserImage,
                            isMember: true,
                            member:u
                        }, function () { this.saveUser() })
                    }
                    else {
                        Alert.alert('שם משתמש או סיסמא אינם נכונים')
                    }
                },
                (error) => {
                    console.log("err post=", error);
                });
    }
    saveUser = async () => {
        try {
            await AsyncStorage.setItem("isMember", JSON.stringify(true));
            await AsyncStorage.setItem("userPassword", String(this.state.userID));
            await AsyncStorage.setItem("userName", this.state.userName);
            await AsyncStorage.setItem("userEmail", this.state.userEmail);
            await AsyncStorage.setItem("userFirstName", this.state.userFirstName);
            await AsyncStorage.setItem("userLastName", this.state.userLastName);
            await AsyncStorage.setItem("userPhone", this.state.userPhone);
            await AsyncStorage.setItem("userRegion", String(this.state.userRegion));
            await AsyncStorage.setItem("userGender", this.state.userGender);
            await AsyncStorage.setItem("userImage", this.state.userImage);
            await AsyncStorage.setItem("member", JSON.stringify(this.state.member));
            Alert.alert('התחברת בהצלחה');
            this.navToPetsPage();
            //this.navToHomePage();
        } catch (error) {
            alert(error);
        }
    }
navToPetsPage=()=>{
      this.props.navigation.navigate("PetsPage");
}
    txtPass = (e) => {
        this.setState({ userPassword: e });
    }
    txtUserName = (e) => {
        this.setState({ userName: e });
    }
    navToRegistrationPage = () => {
        this.props.navigation.navigate("RegistrationPage");
    }
    navToHomePage = () => {
        this.props.navigation.navigate("HomePage");
    }
    deleteAsyncStorage=async()=>{
        AsyncStorage.clear();
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.logo}>
                    <Image Image source={require("../Images/logo.png")} />
                </View>
                <Text style={styles.titleCss}>{this.state.title}</Text>
                <KeyboardAvoidingView style={styles.container} behavior="padding">
                    <View style={{ width: 225 }}>
                        <Input
                            onChangeText={this.txtUserName}
                            maxLength={12}
                            rightIcon={{ type: 'font-awesome', name: 'user' }}
                            placeholder='שם משתמש או אימייל'
                            errorStyle={{ color: 'red' }}
                        />
                        <Input
                            onChangeText={this.txtPass}
                            maxLength={12}
                            secureTextEntry={true}
                            rightIcon={{ type: 'font-awesome', name: 'lock' }}
                            placeholder='סיסמא'
                            errorStyle={{ color: 'red' }}
                        />
                    </View>
                    <Button buttonStyle={{ backgroundColor: 'orange', marginTop: 30 }} title='התחבר' onPress={this.btnLogin} />
                    <Button buttonStyle={{ backgroundColor: 'red', marginTop: 30 }} title='לא רשום עדיין?' onPress={this.navToRegistrationPage} />
                    {/*<Button buttonStyle={{ backgroundColor: 'purple', marginTop: 30 }} title='Delete AsyncStorage' onPress={this.deleteAsyncStorage} />*/}
                    {/*
                    <Button buttonStyle={{ backgroundColor: 'green', marginTop: 30 }} title='בחר תמונה' onPress={this.btnOpenGallery} />
                    <Button buttonStyle={{ backgroundColor: 'blue', marginTop: 30 }} title='הצגת כתובת תמונה' onPress={this.showImgUrl} />
                    */}
                </KeyboardAvoidingView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        //flex: 1,
        height: 45,
        marginTop: 24,
        width: '100%',
        borderBottomWidth: 0.5
    },
    footer: {
        height: 25,
        width: '100%',
        backgroundColor: 'green'
    },
    titleCss: {
        fontSize: 16,
        marginTop: 3
    },
    logo: {
        marginTop: 35
    },
    input: {
        width: 200
    },
    gridFont: {
        fontSize: 15,
    },
    gridTable: {
        margin: 5,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#ba55d3',
        width: 130,
        height: 110
    },
    gridColumn1: {
        backgroundColor: 'blue'
    },
    gridColumn2: {
        backgroundColor: 'yellow'
    },
    flatListWindow: {
        height: 350,
        //marginRight:5
    },
    checkBoxContainer: {
        marginRight: 0,
        marginLeft: 0,
        width: 370,
        flexDirection: 'row',
        textAlign: 'center',
        justifyContent: 'center',
        marginRight: 20
    },
    checkBoxText: {
        marginRight: 0,
        marginLeft: 0,
        fontSize: 13,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingTop: 12
    },
    cb: {
        margin: 0,
        marginLeft: 0,
        marginRight: 0,
        marginTop: 0,
    },
});