import React from "react";
import { KeyboardAvoidingView, View, Text, StyleSheet, Image, ListView, FlatList, Alert, TouchableOpacity, ScrollView, ActivityIndicator, AsyncStorage } from "react-native";
import { Button, ThemeProvider, ListItem, List, ButtonGroup, CheckBox, Input, SocialIcon } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import { Col, Row, Grid } from "react-native-easy-grid";
import Icon from 'react-native-vector-icons/FontAwesome';
const URL = "http://ruppinmobile.tempdomain.co.il/site02/WebService.asmx";
export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    render() {
        return (
            <View style={styles.container}>
            <View style={styles.header}>
                <Image style={{ marginTop: 1, alignSelf: 'flex-end' }} Image source={require("../Images/logo.png")} />
            </View>
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
                {/*<Button buttonStyle={{ backgroundColor: 'green', marginTop: 30 }} title='בחר תמונה' onPress={this.btnOpenGallery} />
                <Button buttonStyle={{ backgroundColor: 'blue', marginTop: 30 }} title='הצגת כתובת תמונה' onPress={this.showImgUrl} />*/}
            </KeyboardAvoidingView>
            <View style={styles.footer}>
            <TouchableOpacity onPress={this.navToSearchPet}>
                    <Image style={{width: 150, height: 140, borderRadius: 150,position:'absolute',top:-65,alignSelf:'center'}}
                    source={require("../Images/pet2.png")} />
                </TouchableOpacity>
            </View>
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
        position:'absolute',
        top:0,
        height:60,
        width: '100%',
        borderBottomWidth: 0.5
    },
    footer: {
        position:'absolute',
        bottom:0,
        height:35,
        width: '100%',
        backgroundColor: 'green',
       // justifyContent:'flex-end',
    },
    titleCss: {
        fontSize: 16,
        marginTop:3
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