import React from "react";
import { KeyboardAvoidingView, Switch, View, Text, TextInput, StyleSheet, Image, ListView, FlatList, Alert, TouchableOpacity, ScrollView, ActivityIndicator, AsyncStorage } from "react-native";
import { Button, ThemeProvider, ListItem, List, ButtonGroup, CheckBox, Input, SocialIcon } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import { Col, Row, Grid } from "react-native-easy-grid";
import Icon from 'react-native-vector-icons/FontAwesome';
import RNPickerSelect from 'react-native-picker-select';
import InputSpinner from 'react-native-input-spinner';
const URL = "http://ruppinmobile.tempdomain.co.il/site02/WebService.asmx";
const IMAGE_URL = "http://ruppinmobile.tempdomain.co.il/site02/ImageStorage/";


export default class PublishImages extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            //Screen
            indexSpacer: '\xa0\xa0\xa0\xa0\xa0\xa0\xa0',
            title: 'פרסם תמונות לחיית מחמד',
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
            selectedKind: 0,
            switchValue: true,
            //PetDetails
            isDog: true,
            petName: 'null',
            petGender: 'm',
            petAge: 0,
            petVaccines: '',
            petRaces: [],
            petRace: 0,
            petImage: 'null'
        }
    }

    async componentDidMount() {
        await this.retrievePetRacesTable(true);
    }

    retrievePetRacesTable = async (isDog) => {
        const data = {
            //Most be like the Csharp func Code!
            isDog: isDog,
        }
        fetch(URL + "/GetPetRacesTable", {
            method: "post",
            headers: new Headers({
                "Content-Type": "application/json;"
            }),
            body: JSON.stringify(data)
        })
            .then(res => {
                return res.json();
            })
            .then(
                result => {
                    let pR = JSON.parse(result.d);
                    if (pR != null) {
                        this.setState({ petRaces: pR }, function () { console.log(this.state.petRaces) });
                    } else {
                        alert('error');
                    }
                },
                error => {
                    console.log("err post=", error);
                }
            );
    }
    navToPetsPage = () => {
        this.props.navigation.navigate("PetsPage");
    }
    txtVaccines = (e) => {
        this.setState({ petVaccines: e });
    }
    txtPetName = (e) => {
        this.setState({ petName: e });
    }
    navToRegistrationPage = () => {
        this.props.navigation.navigate("RegistrationPage");
    }
    navToHomePage = () => {
        this.props.navigation.navigate("HomePage");
    }
    btnPublishPet = () => {
        //Fetch Pet...
        if (this.state.petName == 'null') {
            Alert.alert('Pet Name Cannot Be Empty');
            return;
        }
        if (this.state.petImage == 'null') {
            Alert.alert('Pet Must Have an Image');
            return;
        }
        //this.state.showImgUrl();
    }
    updateIndex = (selectedKind) => {
        this.setState({ selectedKind });
        if (selectedKind == 0) {
            this.setState({ isDog: true }, function () { this.retrievePetRacesTable(true) })
        }
        else {
            this.setState({ isDog: false }, function () { this.retrievePetRacesTable(false) })
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
            petID: this.state.member.UserID,
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
    toggleSwitch = value => {
        this.setState({ switchValue: value });
        if (value) {
            this.setState({ petGender: 'm' }, function () { Alert.alert('' + this.state.petGender) })
        } else {
            this.setState({ petGender: 'f' }, function () { Alert.alert('' + this.state.petGender) })
        }
    }
    render() {
        const buttons = ['כלב/ה', 'חתול/ה']
        const { selectedKind } = this.state
        return (
            <View style={styles.container}>
                <View style={styles.logo}>
                    <Image Image source={require("../Images/logo.png")} />
                </View>
                <Text style={styles.titleCss}>{this.state.title}</Text>

                <View style={{ marginTop: 10, alignSelf: 'center' }}>
                    <ButtonGroup
                        onPress={this.updateIndex}
                        selectedIndex={selectedKind}
                        buttons={buttons}
                        containerStyle={{ height: 40, width: 150 }}
                        selectedButtonStyle={styles.selectedButtonStyle}
                    />
                </View>

                <View style={{ width: 150 }}>
                    <Input
                        onChangeText={this.txtPetName}
                        maxLength={12}
                        placeholder='שם חיית המחמד'
                        errorStyle={{ color: 'red' }}
                    />
                </View>
                <View style={{ width: 300 }}>
                    <Input
                        onChangeText={this.txtVaccines}
                        maxLength={30}
                        placeholder='חיסונים'
                        errorStyle={{ color: 'red' }}
                    />
                </View>
                <Text>מין</Text>
                <Switch
                    onValueChange={this.toggleSwitch}
                    value={this.state.switchValue}
                />
                <Text>גיל</Text>
                <InputSpinner
                    max={24}
                    min={0}
                    step={1}
                    color={"#40c5f4"}
                    //onIncrease={increased => { this.setState({ petAge: increased },function () { Alert.alert('petAge: ' + this.state.petAge) }) }}
                    //onDecrease={decreased => { this.setState({ petAge: decreased },function () { Alert.alert('petAge: ' + this.state.petAge) }) }}
                    onChange={value => { this.setState({ petAge: value }, function () { Alert.alert('petAge: ' + this.state.petAge) }) }}
                    value={this.state.petAge}
                />

                <View style={{ width: 140 }}>
                    <RNPickerSelect
                        placeholder={{ label: 'גזע', value: null }}
                        onValueChange={(value) => { this.setState({ petRace: value }, function () { Alert.alert(String(this.state.petRace)) }) }}
                        items={this.state.petRaces}
                    /></View>
                <Button buttonStyle={{ backgroundColor: 'green' }} title='תמונה' onPress={this.btnOpenGallery} />
                <Button buttonStyle={{ backgroundColor: 'orange', marginTop: 30 }} title='סיום' onPress={this.btnPublishPet} />
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
    selectedButtonStyle: {
        backgroundColor: "#40c5f4"
    }
});