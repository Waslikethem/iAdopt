import React from "react";
import { View, Text, StyleSheet, Image, ListView, FlatList, Alert, TouchableOpacity, ScrollView, ActivityIndicator, AsyncStorage } from "react-native";
import { Button, ThemeProvider, ListItem, List, ButtonGroup, CheckBox } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import { Icon } from 'react-native-elements'
import { Col, Row, Grid } from "react-native-easy-grid";
const URL = "http://ruppinmobile.tempdomain.co.il/site02/WebService.asmx";
const IMAGE_URL = "http://ruppinmobile.tempdomain.co.il/site02/ImageStorage/";

export default class Activities extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            //User Interface
            userPic: IMAGE_URL + 'noPic.png',
            userName: '',
            firstName: '',
            lastName: '',
            //Misc
            selectedIndex: 2,
            //selectedIndex2: 2,
            sortByRace: false,
            sortByGender: false,
            sortByAge: false,
            loading: false,
            data: [],
            buttonsData: [],
            page: 1,
            error: null,
            title: 'מצא פעילות',
            subTitle: '',
            //FlatViewTable

        }
        this.updateIndex = this.updateIndex.bind(this)
    }
    loadActivitesTypes = () => {
        fetch(URL + "/GetActivitiesTypesTable", {
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
                    let p = JSON.parse(result.d);
                    if (p != null) {
                        this.setState({ buttonsData: p }, function () { console.log(buttonsData) });
                    } else {
                        alert('error');
                    }
                },
                error => {
                    console.log("err post=", error);
                }
            );
    }
    loadActivities = () => {
        fetch(URL + "/GetActivitiesTable", {
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
                    let p = JSON.parse(result.d);
                    if (p != null) {
                        this.setState({ data: p });
                    } else {
                        alert('error');
                    }
                },
                error => {
                    console.log("err post=", error);
                }
            );
    }

    updateIndex(selectedIndex) {
        this.setState({ selectedIndex })
        Alert.alert(String(selectedIndex));
    }

    showAlert(item) {
        console.log(item);
        Alert.alert(JSON.stringify(item.PetID));
    }

    chk = () => {
        console.log(this.state.pets);
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
        this.loadActivitesTypes();
        this.loadActivites();
    }
    
    navToVeterianriansPage = () => {
        this.props.navigation.navigate("VeterianriansPage");
    }
    updateIndex2(selectedIndex2) {
        Alert.alert(String(selectedIndex2));
        if (selectedIndex2 == 3) {
            this.props.navigation.navigate("VeterianriansPage");
        }
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
        />
        const component5 = () => <Icon
            name='tree'
            type='font-awesome'
            color='#517fa4'
        />
        const newButtons = buttonsData;
        const buttons = ['Cats', 'Dogs', 'All']
        const navigationButtons = [{ element: component1 }, { element: component2 }
            , { element: component3 }, { element: component4 }, { element: component5 }]
        const { selectedIndex2 } = this.state
        const { selectedIndex } = this.state
        v = require('../Images/noPic.png')
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
                        buttons={newButtons.ActivityType}
                        containerStyle={{ height: 40, width: 150 }}
                    />
                    <View style={styles.checkBoxContainer}>
                        <CheckBox style={styles.cb} size={12} checkedIcon='check-square' uncheckedIcon='square' checked={this.state.sortByRace}
                            onPress={() => this.setState({ sortByRace: !this.state.sortByRace })} /><Text style={styles.checkBoxText}>גזע</Text>
                        <CheckBox style={styles.cb} size={12} checkedIcon='check-square' uncheckedIcon='square' checked={this.state.sortByGender}
                            onPress={() => this.setState({ sortByGender: !this.state.sortByGender })} /><Text style={styles.checkBoxText}>מין</Text>
                        <CheckBox style={styles.cb} size={12} checkedIcon='check-square' uncheckedIcon='square' checked={this.state.sortByAge}
                            onPress={() => this.setState({ sortByAge: !this.state.sortByAge })} /><Text style={styles.checkBoxText}>גיל</Text>
                    </View>
                </View>
                <View style={styles.flatListWindow}>
                    <FlatList
                        data={this.state.data}
                        extraData={this.state}
                        renderItem={({ item }) => <View style={{ margin: 20 }}>
                            <View style={styles.gridTable}>
                                <Text onPress={this.showAlert.bind(this, item)}>שם: {item.ActivityName}{'\n'}אזור: {item.RegionCode}
                                    {'\n'}תאור: {item.Description}</Text>
                            </View>
                        </View>}
                        numColumns={2}
                        keyExtractor={item => item.ActID}
                    />
                </View>
                <View style={styles.publishPet}>
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