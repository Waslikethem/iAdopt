import React from "react";
import { View, Text, StyleSheet, Image, ListView, FlatList, Alert, TouchableOpacity, ScrollView, ActivityIndicator, AsyncStorage } from "react-native";
import { Button, ThemeProvider, ListItem, List, ButtonGroup, CheckBox } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import { Icon } from 'react-native-elements';
import RNPickerSelect from 'react-native-picker-select';
import { Col, Row, Grid } from "react-native-easy-grid";
const URL = "http://ruppinmobile.tempdomain.co.il/site02/WebService.asmx";
const IMAGE_URL = "http://ruppinmobile.tempdomain.co.il/site02/ImageStorage/";
import { Dialog, DialogDefaultActions } from 'react-native-material-ui';

export default class Pets extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            //User Interface
            userPic: IMAGE_URL + 'noPic.png',
            userName: '',
            firstName: '',
            lastName: '',
            //Misc
            indexSpacer: '\xa0\xa0\xa0\xa0\xa0\xa0\xa0',
            selectedIndex: 2,
            //selectedIndex2: 2,
            sortByGender: false,
            petRegion: 0,
            sortByAge: false,
            loading: false,
            data: [],
            page: 1,
            error: null,
            title: 'אמץ בעל חיים',
            subTitle: '',
            regions: []
        }
        this.updateIndex = this.updateIndex.bind(this)
    }
    componentDidMount() {
        AsyncStorage.getItem("member", (err, result) => {
            console.log("result (member) = " + result);
            if (result != null) {
                this.setState({ member: JSON.parse(result) });
                if (this.state.member.UserImage != null)
                    this.setState({
                        userPic: IMAGE_URL + this.state.member.UserImage, userName: this.state.member.UserName,
                        firstName: this.state.member.Fname, lastName: this.state.member.Lname
                    }, function () { });
            }
        });
        this.loadPage();

    }
    loadPage() {
        this.loadPetsInfo(-1, 0, false, false);
        this.retrieveRegionsTable();
    }

    retrieveRegionsTable = () => {
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
                    //Alert.alert("retrieveRegionsTable:\n"+r);
                    if (r != null) {
                        this.setState({ regions: r });
                    } else {
                        alert('error');
                    }
                },
                error => {
                    console.log("err post=", error);
                }
            );
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


    updateIndex = (index) => {
        if (this.state.petRegion == null) {
            //this.setState({ petRegion: 0 });
        }
        this.setState({ selectedIndex: index }, function () {
            this.renderNewTable();
        })
    }

    renderNewTable = () => {
        if (this.state.sortByGender == false && this.state.sortByAge == false && this.state.selectedIndex == 2 && this.state.petRegion == 0) {
            this.loadPetsInfo(-1, this.state.petRegion, this.state.sortByAge, this.state.sortByGender);
            return;
        }
        else if (this.state.selectedIndex == 2) {
            this.loadPetsInfo(-1, this.state.petRegion, this.state.sortByAge, this.state.sortByGender);
            return;
        }
        else if (this.state.selectedIndex != 2) {
            this.loadPetsInfo(this.state.selectedIndex, this.state.petRegion, this.state.sortByAge, this.state.sortByGender);
            return;
        }

        /* 
        if (this.state.sortByGender == false && this.state.sortByAge == false && this.state.selectedIndex == 1 && this.state.petRegion == null) {
            Alert.alert('Dogs');
            this.loadPetsInfo(1, 0, false, false);
        }
        if (this.state.sortByGender == false && this.state.sortByAge == false && this.state.selectedIndex == 0 && this.state.petRegion == null) {
            Alert.alert('Cats');
            this.loadPetsInfo(0, 0, false, false);
        }
        */
    }

    showAlert(item) {
        console.log(item);
        Alert.alert(JSON.stringify(item.PetID));
    }

    chk = () => {
        console.log(this.state.pets);
    }



    regionPicker = (value) => {
        this.setState({ userRegion: value }, function () { Alert.alert(this.state.userRegion) })
    }
    loadPetsInfo = (isDog, regionId, sortByAge, sortByGender) => {
        const data = {
            isDog: isDog,
            regionId: regionId,
            sortByAge: sortByAge,
            sortByGender: sortByGender
        }
        fetch(URL + "/GetPetsInfo", {
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
                    let p = JSON.parse(result.d);
                    Alert.alert("loadPetsInfo:\n"+p);
                    if (p != null) {
                        this.setState({ data: p });
                        console.log('Data: ' + this.state.data)
                    } else {
                        alert('error');
                    }
                },
                error => {
                    console.log("err post=", error);
                }
            );
    }

    updateIndex2(selectedIndex2) {
        //Not Implemented
    }
    navToVeterianriansPage = () => {
        this.props.navigation.navigate("VeterianriansPage");
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
        const buttons = ['Cats', 'Dogs', 'All']
        const navigationButtons = [{ element: component1 }, { element: component2 }
            , { element: component3 }, { element: component4 }, { element: component5 }]
        const { selectedIndex2 } = this.state
        const { selectedIndex } = this.state
        //v = require('../Images/noPic.png')
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
                    <ButtonGroup
                        onPress={this.updateIndex}
                        selectedIndex={selectedIndex}
                        buttons={buttons}
                        containerStyle={{ height: 40, width: 150 }}
                    />
                    <View style={styles.checkBoxContainer}>
                        <CheckBox style={styles.cb} size={12} checkedIcon='check-square' uncheckedIcon='square' checked={this.state.sortByGender}
                            onPress={() => this.setState({ sortByGender: !this.state.sortByGender }, function () { this.renderNewTable() })} /><Text style={styles.checkBoxText}>מין</Text>
                        <CheckBox style={styles.cb} size={12} checkedIcon='check-square' uncheckedIcon='square' checked={this.state.sortByAge}
                            onPress={() => this.setState({ sortByAge: !this.state.sortByAge }, function () { this.renderNewTable() })} /><Text style={styles.checkBoxText}>גיל</Text>
                    </View>
                    <View style={{ marginRight: 50, width: 200 }}>
                        <RNPickerSelect
                            placeholder={{ label: this.state.indexSpacer + 'בחר אזור', value: null }}
                            onValueChange={(value) => { this.setState({ petRegion: value }, function () { this.renderNewTable() }) }}
                            items={this.state.regions}
                        />
                    </View>
                </View>
                <View style={styles.flatListWindow}>
                    <FlatList
                        data={this.state.data}
                        extraData={this.state}
                        renderItem={({ item }) => <View style={{ margin: 20, marginBottom: 40 }}>
                            <View style={styles.gridTable}>
                                <TouchableOpacity onPress={this.showAlert.bind(this, item)}>
                                    <Image style={{ width: 129, height: 109, borderRadius: 5 }} source={{ uri: IMAGE_URL + "Pets/" + item.PetID + "/1.jpg" }} />
                                </TouchableOpacity>
                                <Text>שם: {item.Name} גיל: {item.Age}{'\n'} גזע: {item.RaceCode}
                                    {'\n'}חיסונים: {item.Vaccines}</Text>
                            </View>
                        </View>}
                        numColumns={2}
                        keyExtractor={item => item.PetID}
                    />



                </View>
                <View style={styles.publishPet}>
                    <Button buttonStyle={{ backgroundColor: 'green' }} title='העלה תמונה לשרת' onPress={this.btnOpenGallery} />
                    <Button buttonStyle={{ backgroundColor: 'orange' }} title='פרסם בעל חיים לאימוץ' onPress={this.loadPets} />
                </View>
                {/*<Button buttonStyle={{ backgroundColor: 'red', marginTop: 30 }} title='CHECK' onPress={this.chk} />*/}
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