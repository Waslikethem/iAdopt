import React from "react";
import { View, Text, StyleSheet, Image, ListView, FlatList, Alert, TouchableOpacity, ScrollView, ActivityIndicator, AsyncStorage } from "react-native";
import { Button, ThemeProvider, ListItem, List, ButtonGroup, Input, CheckBox } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import { Icon } from 'react-native-elements';
import RNPickerSelect from 'react-native-picker-select';
import { Col, Row, Grid } from "react-native-easy-grid";
const URL = "http://ruppinmobile.tempdomain.co.il/site02/WebService.asmx";
const IMAGE_URL = "http://ruppinmobile.tempdomain.co.il/site02/ImageStorage/";
import { Dialog, DialogDefaultActions } from 'react-native-material-ui';


export default class EditProfile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            //User Interface
            userID: '',
            userPic: IMAGE_URL + 'noPic.png',
            userName: '',
            userPass: '',
            verifyPass: '',
            hidePW: '',
            userEmail: '',
            userPhone: '',
            userRegion: 0,
            temRegion: 0,
            //Screen
            title: 'עריכת פרופיל',
            //Handle Spaces In Labels
            indexSpacer: '\xa0\xa0\xa0\xa0\xa0\xa0\xa0',
            //Regions
            regions: []

        }
    }
    async componentDidMount() {
        AsyncStorage.getItem("member", (err, result) => {
            console.log("result (member) = " + result);
            if (result != null) {
                this.setState({ member: JSON.parse(result) });
                if (this.state.member.UserImage != null)
                    this.setState({
                        userID: this.state.member.UserID,
                        userPic: IMAGE_URL + this.state.member.UserImage, userName: this.state.member.UserName,
                        firstName: this.state.member.Fname, lastName: this.state.member.Lname,
                        userPass: this.state.member.Password, userPhone: this.state.member.Phone,
                        userEmail: this.state.member.Email, userRegion: this.state.member.RegionCode,
                        temRegion: this.state.member.RegionCode
                    }, function () { this.hidePassword() });
            }
        });
        //Retrieve Regions Table
        await this.retrieveRegionsTable();
    }
    hidePassword = () => {
        for (i = 0; i < this.state.userPass.length; i++) {
            this.setState(prevstate => ({ hidePW: prevstate.hidePW + '*' }));
        }
    }
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

    navToLoginPage = () => {
        this.props.navigation.navigate("LoginPage");
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
    txtUserPhone = (e) => {
        this.setState({ userPhone: e });
    }
    regionPicker = (value) => {
        this.setState({ userRegion: value }, function () { Alert.alert(this.state.userRegion) })
    }
    updateIndex2(selectedIndex2) {
        //Not Implemented
    }
    updateUser = () => {
        if (this.state.userPass == this.state.verifyPass) {
            if (!this.state.userRegion)
                this.setState({ userRegion: this.state.temRegion - 1 }, function () {
                    console.log('id: ' + this.state.userID + ' pass' + this.state.userPass + ' email' + this.state.userEmail + ' phone' + this.state.userPhone
                        + ' regionCode' + this.state.userRegion);
                    const data = {
                        //Most be like the Csharp func Code!
                        userID: this.state.userID,
                        password: this.state.userPass,
                        email: this.state.userEmail,
                        phone: this.state.userPhone,
                        regionCode: this.state.userRegion,
                    };
                    console.log(data);
                    fetch(URL + '/UpdateUser', {
                        method: 'post',
                        headers: new Headers({
                            'Content-Type': 'application/json;',
                        }),
                        body: JSON.stringify(data)
                    }).then(res => {
                        console.log('res=', res);
                        return res.json()
                    }).then(() => {
                        Alert.alert('חשבונך התעדכן בהצלחה')
                        //this.navToLoginPage();
                    }, (error) => {
                        console.log("err post=", error);
                    });
                })
        }
        else {
            Alert.alert('הסיסמאות אינם תואמות');
        }
    }
    btnOpenGallery = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 0.1,
            base64: true
        });

        if (!result.canclelled) {
            this.setState({
                img: result.uri,
                base64: result.base64,
                imgType: 'jpeg'
            });

            this.showImgUrl();

        }
    };
    showImgUrl = () => {
        const data = {
            userID: this.state.member.UserID,
            base64: this.state.base64,
            imageName: this.state.member.UserID,
            imageType: this.state.imgType
        }
        console.log(data);
        fetch(URL + '/SaveImage', {
            method: 'post',
            headers: new Headers({
                'Content-Type': 'application/json;',
            }),
            body: JSON.stringify(data)
        }).then(res => {
            console.log('res=', res);
            return res.json()
        }).then((result) => {
            let u = JSON.parse(result.d);
            console.log(u);
            let m = this.state.member;
            m.UserImage = u.UserImage;
            this.setState({
                userPic: IMAGE_URL + u.UserImage,
                member: m
            }, function () {
                console.log("userPic=" + this.state.userPic);
            });
        },
            (error) => {
                console.log("err post=", error);
            });
    }
    render() {
        const component1 = () => <Icon
            name='building'
            type='font-awesome'
            color='#517fa4'
        />
        const component2 = () => <Icon
            name='tags'
            type='font-awesome'
            color='#517fa4'
        />
        const component3 = () => <Icon
            name='paw'
            type='font-awesome'
            color='#517fa4'
        />
        const component4 = () => <Icon
            name='stethoscope'
            type='font-awesome'
            color='#517fa4'
            onPress={() => this.navToVeterianriansPage()}
        />
        const component5 = () => <Icon
            name='tree'
            type='font-awesome'
            color='#517fa4'
        />
        const navigationButtons = [{ element: component1 }, { element: component2 }
            , { element: component3 }, { element: component4 }, { element: component5 }]
        const { selectedIndex2 } = this.state
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity>
                        <Image
                            style={styles.profilePic}
                            source={{ uri: this.state.userPic + '?time' + new Date() }}
                        />
                    </TouchableOpacity>
                    <Text style={styles.userNameProfileName}>{this.state.firstName + ' ' + this.state.lastName}</Text>

                </View>
                <View style={styles.uppearScreen}>
                    <Text style={styles.titleCss}>{this.state.title}</Text>
                    <View style={{ width: 225 }}>
                        <Input
                            secureTextEntry={true}
                            onChangeText={this.txtUserPass}
                            maxLength={12}
                            placeholder={this.state.hidePW}
                            errorStyle={{ color: 'red' }}
                        />
                        <Input
                            secureTextEntry={true}
                            onChangeText={this.txtVerifyPass}
                            maxLength={12}
                            placeholder={this.state.hidePW}
                            errorStyle={{ color: 'red' }}
                        />
                        <Input
                            style={{ alignSelf: 'flex-end' }}
                            onChangeText={this.txtUserEmail}
                            maxLength={12}
                            placeholder={this.state.userEmail}
                            errorStyle={{ color: 'red' }}
                        />
                        <Input
                            onChangeText={this.txtUserPhone}
                            maxLength={12}
                            placeholder={this.state.userPhone}
                            errorStyle={{ color: 'red' }}
                        />
                    </View>
                    <View style={{ marginRight: 50, width: 200 }}>
                        <RNPickerSelect
                            placeholder={{ label: this.state.indexSpacer + 'בחר אזור', value: null }}
                            onValueChange={(value) => { this.setState({ userRegion: value }, function () { }) }}
                            items={this.state.regions}
                        />
                    </View>
                </View>
                <View style={styles.publishPet}>
                <Button buttonStyle={{ backgroundColor: 'green' }} title='עדכן תמונת משתמש' onPress={this.btnOpenGallery} />
                    <Button buttonStyle={{ backgroundColor: 'orange' }} title='עדכן משתמש' onPress={this.updateUser} />
                </View>
                <View style={styles.footer}>
                    <ButtonGroup
                        onPress={this.updateIndex2}
                        selectedIndex={selectedIndex2}
                        buttons={navigationButtons}
                        containerStyle={{ height: 45, width: 360, alignSelf: 'center' }} />
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
    uppearScreen: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50
    },
    header: {
        flexDirection: 'row',
        position: 'absolute',
        marginTop: 24,
        top: 0,
        height: 40,
        width: '100%',
        //borderBottomWidth: 0.5,
        //borderBottomColor:'grey'
    },
    titleCss: {
        color: 'blue'
    },
    profilePic: {
        borderRadius: 25,
        marginTop: 3,
        marginRight: 3,
        height: 32,
        width: 32
    },
    userNameProfileName: {
        marginTop: 12,
        fontSize: 14,
        color: 'blue'
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        height: 45,
        width: '100%',
        // justifyContent:'flex-end',
    },
    publishPet: {
        position: 'absolute',
        bottom: 50
    },
    titleCss: {
        fontSize: 16,
        fontFamily: 'sans-serif'
    },
    logo: {
        marginTop: 20
    },
    gridFont: {
        fontSize: 15,
    },
    gridTable: {
        margin: 5,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'black',
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
        height: 300,
        marginBottom: 155
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