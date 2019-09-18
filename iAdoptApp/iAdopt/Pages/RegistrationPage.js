import React from "react";
import { View, Text, StyleSheet, Image, ListView, FlatList, Alert, TouchableOpacity, ScrollView, ActivityIndicator, AsyncStorage } from "react-native";
import { Button, ThemeProvider, ListItem, List, ButtonGroup, CheckBox, Input,SocialIcon } from "react-native-elements";
import RNPickerSelect from 'react-native-picker-select';
import { Col, Row, Grid } from "react-native-easy-grid";
import Icon from 'react-native-vector-icons/FontAwesome';
const URL = "http://ruppinmobile.tempdomain.co.il/site02/WebService.asmx";


export default class Registration extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            //Handle Spaces In Labels
            indexSpacer: '\xa0\xa0\xa0\xa0\xa0\xa0\xa0',
            indexSpacer2: '\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0',
            //User Registration Values
            userName: '',
            userPass: '',
            verifyPass: '',
            userEmail: '',
            userFirstName: '',
            userLastName: '',
            userPhone: '',
            userRegion: 0,
            selectedGender:0,
            userGender: 'm',
            //Interface
            title: 'יצירת פרופיל'

        }
        this.updateIndex = this.updateIndex.bind(this)
    }

    btnRegister = () => {
        //First Validation on Passwords
        if ((this.state.userPass !== this.state.verifyPass) || (this.state.userPass == '' || this.state.verifyPass == '')) {
            Alert.alert('אימות הסיסמא לא עבר בהצלחה');
            return;
        }
        if(this.state.userEmail === ''){
            Alert.alert('שורת האימייל ריקה');
            return;
        }
        //Second Validation on Email
        if 
        ((this.state.userEmail.toUpperCase().includes('@GMAIL.COM')) ||(this.state.userEmail.toUpperCase().includes('@YAHOO.COM')) || (this.state.userEmail.toUpperCase().includes('@WALLA.CO.IL'))
        ) {
                //FETCH
                const data = {
                  //Most be like the Csharp func Code!
                  userName: this.state.userName,
                  password: this.state.userPass,
                  email: this.state.userEmail,
                  fName: this.state.userFirstName,
                  lName: this.state.userLastName,
                  phone: this.state.userPhone,
                  regionCode: this.state.userRegion,
                  gender: this.state.userGender
                };
                console.log(data);
                fetch( URL+'/Registration', {
                  method: 'post',
                  headers: new Headers({
                    'Content-Type': 'application/json;',
                  }),  
                  body: JSON.stringify(data)
                })
                  .then(res => {
                    console.log('res=', res);
                    return res.json()
                  }).then((result) => {
                    let u = JSON.parse(result.d);
                    if (u == null) {
                        this.setState({userFirstName:u.Fname})
                      console.log("There is a Problem!")
                      this.setState({
                        resLabel: "This Email already exists"
                      })
                    }
                  },
                    (error) => {
                      console.log("err post=", error);
                    });
            Alert.alert('נירשמת בהצלחה');
        }
        else{
            Alert.alert('האימייל אינו תקין');
            return;
        } 
    }
    txtUserName = (e) => {
        this.setState({ userName: e });
    }
    txtUserPass = (e) => {
        this.setState({ userPass: e });
    }
    txtVerifyPass = (e) => {
        this.setState({ verifyPass: e });
    }
    txtUserEmail = (e) => {
        this.setState({ userEmail: e });
    }
    txtUserFirstName = (e) => {
        this.setState({ userFirstName: e });
    }
    txtUserLastName = (e) => {
        this.setState({ userLastName: e });
    }
    txtUserPhone = (e) => {
        this.setState({ userPhone: e });
    }
    updateIndex(selectedGender) {
        this.setState({ selectedGender })
        if(selectedGender==0){
            this.setState({userGender:'m'},function(){Alert.alert(this.state.userGender)})
        }
        else{
            this.setState({userGender:'f'},function(){Alert.alert(this.state.userGender)})
        }
    }
    regionPicker=(value)=>{
        this.setState({userRegion:value},function(){Alert.alert(this.state.userRegion)})
    }
    render() {
        const buttons = ['זכר', 'נקבה']
        const { selectedGender } = this.state
        return (
            <View style={styles.container}>
                <View style={styles.logo}>
                    <Image Image source={require("../Images/logo.png")} />
                </View>
                <Text style={styles.titleCss}>{this.state.title}</Text>
                <View style={{ width: 225 }}>
                    <Input
                        onChangeText={this.txtUserName}
                        maxLength={12}
                        placeholder='שם משתמש'
                        errorStyle={{ color: 'red' }}
                    />
                    <Input
                        onChangeText={this.txtUserPass}
                        secureTextEntry={true}
                        maxLength={12}
                        placeholder='סיסמא'
                        errorStyle={{ color: 'red' }}
                    />
                    <Input
                        onChangeText={this.txtVerifyPass}
                        secureTextEntry={true}
                        maxLength={12}
                        placeholder='אימות סיסמא'
                        errorStyle={{ color: 'red' }}
                    />
                    <Input
                        onChangeText={this.txtUserEmail}
                        maxLength={12}
                        placeholder='אימייל'
                        errorStyle={{ color: 'red' }}
                    />
                    <Input
                        onChangeText={this.txtUserFirstName}
                        maxLength={12}
                        placeholder='שם פרטי'
                        errorStyle={{ color: 'red' }}
                    />
                    <Input
                        onChangeText={this.txtUserLastName}
                        maxLength={12}
                        placeholder='שם משפחה'
                        errorStyle={{ color: 'red' }}
                    />
                    <Input
                        onChangeText={this.txtUserPhone}
                        maxLength={12}
                        placeholder='פלאפון'
                        errorStyle={{ color: 'red' }}
                    />
                    <RNPickerSelect
                        placeholder={{ label: this.state.indexSpacer + 'בחר אזור', value: null }}
                        onValueChange={(value) => this.regionPicker(value)}
                        items={[
                            { label: this.state.indexSpacer2 + 'צפון', value: '1' },
                            { label: this.state.indexSpacer2 + 'חיפה', value: '2' },
                            { label: this.state.indexSpacer2 + 'תל אביב', value: '3' },
                            { label: this.state.indexSpacer2 + 'מרכז', value: '4' },
                            { label: this.state.indexSpacer2 + 'ירושלים', value: '5' },
                            { label: this.state.indexSpacer2 + 'דרום', value: '6' },
                        ]}
                    />
                    <View style={{ marginTop: 10, alignSelf: 'center' }}>
                        <ButtonGroup
                            onPress={this.updateIndex}
                            selectedIndex={selectedGender}
                            buttons={buttons}
                            containerStyle={{ height: 40, width: 150 }}
                        />
                    </View>
                </View>
                <Button buttonStyle={{ backgroundColor: 'orange', marginTop: 30 }} title='סיום' onPress={this.btnRegister} />

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
    titleCss: {
        fontSize: 16,
        //marginTop:3
    },
    logo: {
        //marginRight: 100,
        marginBottom:8
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