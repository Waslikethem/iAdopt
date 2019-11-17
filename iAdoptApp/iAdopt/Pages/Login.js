import React from "react";
import { KeyboardAvoidingView, View, StyleSheet, Image, Alert, AsyncStorage, ImageBackground } from "react-native";
import { Input } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
const URL = "http://ruppinmobile.tempdomain.co.il/site02/WebService.asmx";

export default class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            //User
            userExists: false,
            user: null,
            //Textboxes
            userNameOrEmail: '',
            userPassword: '',
        }
    }
    componentDidMount() {
        //Checks if the user already exists in the phone memory
        AsyncStorage.getItem("userExists", (err, result) => {
            console.log('User Exists? ' + result);
            this.setState({ userExists: JSON.parse(result) });
            if (this.state.userExists == true) {
                this.props.navigation.navigate("Home");
            }
        });
    }
    //Login
    txtPass = (e) => {
        this.setState({ userPassword: e });
    }
    txtUserNameOrEmail = (e) => {
        this.setState({ userNameOrEmail: e });
    }
    btnLogin = () => {
        const data = {
            //Most be like the Csharp func Code!
            userNameOrEmail: this.state.userNameOrEmail,
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
                            userExists: true,
                            user: u
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
            await AsyncStorage.setItem('user', JSON.stringify(this.state.user));
            await AsyncStorage.setItem('userExists', JSON.stringify(this.state.userExists));
            Alert.alert('התחברת בהצלחה');
            this.navToHome();
        } catch (error) {
            alert(error);
        }
    }
    //End of Login
    //------------
    //Navigation
    navToRegistration = () => {
        this.props.navigation.navigate("Registration");
    }
    navToHome = () => {
        this.props.navigation.navigate("Home");
    }
    //End of Navigation
    render() {
        return (
            <ImageBackground source={require("../Images/LOGIN_blue.png")} style={{ width: '100%', height: '100%', }}>
                <View style={styles.container}>
                    <View style={styles.logo}>
                        <Image Image source={require("../Images/logo.png")} />
                    </View>
                    <KeyboardAvoidingView style={styles.container} behavior="padding">
                        <View style={{ width: 225 }}>
                            <Input
                                onChangeText={this.txtUserNameOrEmail}
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
                        <View style={{ width: 150, marginRight: 70 }}>
                            <TouchableOpacity onPress={this.btnLogin}><Image source={require("../Images/login.png")} style={{ marginTop: 30, marginRight: 85 }} /></TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                </View>
                <View style={{ flexDirection: 'row-reverse' }}>
                    <TouchableOpacity onPress={this.navToRegistration}><Image source={require("../Images/register.png")} style={{ marginBottom: 15, marginRight: 20 }} /></TouchableOpacity>
                </View>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    container:
    {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        marginTop: 35
    },
});