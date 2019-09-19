import React from "react";
import { View, Text, StyleSheet, Image, ListView, FlatList, Alert, TouchableOpacity, ScrollView, ActivityIndicator, AsyncStorage } from "react-native";
import { Button, ThemeProvider, ListItem, List, ButtonGroup, CheckBox } from "react-native-elements";
import { Col, Row, Grid } from "react-native-easy-grid";
const URL = "http://ruppinmobile.tempdomain.co.il/site02/WebService.asmx";

export default class Pets extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            //User Interface
            profilePic: require('../Images/noPic.png'),
            userName: 'אופיר לוי',
            //Misc
            selectedIndex: 1,
            sortByRace: false,
            sortByGender: false,
            sortByAge: false,
            loading: false,
            data: [],
            page: 1,
            error: null,
            title: 'אמץ בעל חיים',
            subTitle: ''
        }
        this.updateIndex = this.updateIndex.bind(this)
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
        this.loadPets();
    }
    loadPets = () => {
        fetch(URL + "/GetPetsTable", {
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

    render() {
        const buttons = ['Cats', 'Dogs', 'All']
        const { selectedIndex } = this.state
        v = require('../Images/noPic.png')
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity>
                        <Image
                            style={styles.profilePic}
                            source={this.state.profilePic}
                        />
                    </TouchableOpacity>
                    <Text style={styles.userNameProfileName}>{this.state.userName}</Text>

                </View>
                <Text style={styles.titleCss}>{this.state.title}</Text>
                <ButtonGroup
                    onPress={this.updateIndex}
                    selectedIndex={selectedIndex}
                    buttons={buttons}
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
                <View style={styles.flatListWindow}>
                    <FlatList
                        data={this.state.data}
                        extraData={this.state}
                        renderItem={({ item }) => <View style={{ margin: 20 }}>
                            <View style={styles.gridTable}>
                                <Text onPress={this.showAlert.bind(this, item)}>שם:{item.Name} גיל:{item.Age}{'\n'} גזע:{item.RaceCode}
                                    {'\n'} חיסונים:{item.Vaccines}</Text>
                            </View>
                        </View>}
                        numColumns={2}
                        keyExtractor={item => item.PetID}
                    />
                </View>
                <View style={styles.publishPet}>
                    <Button buttonStyle={{ backgroundColor: 'orange' }} title='פרסם בעל חיים לאימוץ' onPress={this.loadPets} />
                </View>
                {/*<Button buttonStyle={{ backgroundColor: 'red', marginTop: 30 }} title='CHECK' onPress={this.chk} />*/}
                {/*<View style={styles.footer}></View>*/}
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
        flexDirection: 'row',
        position: 'absolute',
        marginTop: 24,
        top: 0,
        height: 40,
        width: '100%',
        borderBottomWidth: 0.5
    },
    profilePic: {
        marginTop: 3,
        marginRight: 3,
        height: 32,
        width: 32
    },
    userNameProfileName: {
        marginTop: 12,
        fontSize:14,
        color:'blue'
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        height: 35,
        width: '100%',
        backgroundColor: 'green',
        // justifyContent:'flex-end',
    },
    publishPet: {
        position: 'absolute',
        bottom: 20
    },
    titleCss: {
        fontSize: 16,
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
        height: 250,
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