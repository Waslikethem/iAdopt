import React from "react";
import { View, StyleSheet, Image, Alert, ImageBackground } from "react-native";
import { Button, ButtonGroup, Input } from "react-native-elements";
import RNPickerSelect from 'react-native-picker-select';
const URL = "http://ruppinmobile.tempdomain.co.il/site02/WebService.asmx";
const URL2="http://localhost:65205/WebService.asmx";

export default class Registration extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            //Handle Spaces
            indexSpacer: '\xa0\xa0\xa0\xa0\xa0\xa0\xa0',
            //User Registration
            userName: '',
            userPass: '',
            verifyPass: '',
            userEmail: '',
            userFirstName: '',
            userLastName: '',
            userPhone: '',
            userRegion: 0,
            selectedGender: 0,
            userGender: 'm',
            //Regions
            regions: []

        }
        this.updateIndex = this.updateIndex.bind(this)
    }
    async componentDidMount() {
        //Retrieve Regions Table
        await this.retrieveRegionsTable();
    }
    //Fetch Retrieve Regions Table
    retrieveRegionsTable = async () => {
        fetch(URL + "/GetRegionsTable", {
            method: "post",
            headers: new Headers({
                "Content-Type": "application/json;"
            }),
            body: JSON.stringify()
        })
            .then(res => {
                return res.json();
            })
            .then(
                result => {
                    let r = JSON.parse(result.d);
                    if (r != null) {
                        this.setState({ regions: r }, function () { console.log(this.state.regions) });
                    } else {
                        alert('error');
                    }
                },
                error => {
                    console.log("err post=", error);
                }
            );
    }
    //End of Fetch Retrieve Regions Table
    //----------------------------------
    //Registration with Validations
    btnRegister = () => {
        //First Validation on Passwords
        if (this.state.userName.length > 12 || this.state.userName.length < 6) {
            Alert.alert('שם המשתמש חייב להיות בין 6  ל 12 תווים');
            return;
        }
        if ((this.state.userPass.length > 12 || this.state.userPass.length < 6) || (this.state.verifyPass.length > 12 || this.state.verifyPass.length < 6)) {
            Alert.alert('סיסמאת המשתמש חייבת להיות בין 6  ל 12 תווים');
            return;
        }
        if ((this.state.userPass !== this.state.verifyPass) || (this.state.userPass == '' || this.state.verifyPass == '')) {
            Alert.alert('אימות הסיסמא לא עבר בהצלחה');
            return;
        }
        if (this.state.userEmail === '') {
            Alert.alert('שורת האימייל ריקה');
            return;
        }
        if (this.state.userRegion == 0) {
            Alert.alert('אנא בחר אזור');
            return;
        }
        if
            ((this.state.userEmail.toUpperCase().includes('@GMAIL.COM')) || (this.state.userEmail.toUpperCase().includes('@YAHOO.COM')) || (this.state.userEmail.toUpperCase().includes('@WALLA.CO.IL'))
        ) {
            console.log('UserName: ' + this.state.userName + ' Password: ' + this.state.userPass + ' Email: ' + this.state.userEmail +
                ' FName: ' + this.state.userFirstName + ' LName: ' + this.state.userLastName + ' Phone: ' + this.state.userPhone +
                ' RegionCode: ' + this.state.userRegion + ' Gender: ' + this.state.userGender);
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
                gender: this.state.userGender,
                userImage:''
            };
            console.log(data);
            fetch(URL + '/Registration', {
                method: 'post',
                headers: new Headers({
                    'Content-Type': 'application/json;',
                }),
                body: JSON.stringify(data)
            }).then(res => {
                console.log('res=', res);
                return res.json()
            }).then(() => {
                Alert.alert('הרשמה בוצעה בהצלחה');
                this.navToLogin();
            }, (error) => {
                console.log("err post=", error);
            });
        }
        else {
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
        if (selectedGender == 0) {
            this.setState({ userGender: 'm' }, function () { })
        }
        else {
            this.setState({ userGender: 'f' }, function () { })
        }
    }
    regionPicker = (value) => {
        this.setState({ userRegion: value }, function () { })
    }
    //End of Registration with Validations
    //------------------------------------
    //Navigation
    navToLogin = () => {
        this.props.navigation.navigate("Login");
    }
    //End of Navigation
    render() {
        const buttons = ['זכר', 'נקבה']
        const { selectedGender } = this.state
        return (
            <ImageBackground source={require("../Images/Registration_Blue.png")} style={{ width: '100%', height: '100%', }}>
                <View style={styles.container}>
                    <View style={styles.logo}>
                        <Image Image source={require("../Images/logo.png")} />
                    </View>
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
                            maxLength={24}
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
                            onValueChange={(value) => { this.setState({ userRegion: value }) }}
                            items={this.state.regions}
                        />
                        {/* <Switch /> */}

                        <View style={{ marginTop: 10, alignSelf: 'center' }}>
                            <ButtonGroup
                                onPress={this.updateIndex}
                                selectedIndex={selectedGender}
                                buttons={buttons}
                                containerStyle={{ height: 40, width: 150 }}
                                selectedButtonStyle={styles.selectedButtonStyle}
                            />
                        </View>
                    </View>
                    <Button buttonStyle={{ backgroundColor: 'orange', marginTop: 30 }} title='סיום' onPress={this.btnRegister} />
                </View>
            </ImageBackground>
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
        marginBottom: 8
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
    selectedButtonStyle: {
        backgroundColor: 'blue'
    }
});