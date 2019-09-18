import React from "react";
import { View, Text, StyleSheet, Image, ListView, FlatList, Alert, TouchableOpacity, ScrollView, ActivityIndicator, AsyncStorage } from "react-native";
import { Button, ThemeProvider, ListItem, List, ButtonGroup, CheckBox } from "react-native-elements";
import { Col, Row, Grid } from "react-native-easy-grid";
const URL = "http://ruppinmobile.tempdomain.co.il/site02/WebService.asmx";


export default class Veterianrians extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: 1,
            sortByRace: false,
            sortByGender: false,
            sortByAge: false,
            pets: [],
            loading: false,
            data: [],
            page: 1,
            error: null,
        }
        this.updateIndex = this.updateIndex.bind(this)
    }

    updateIndex(selectedIndex) {
        this.setState({ selectedIndex })
        Alert.alert(String(selectedIndex));
    }
    getPetName = () => {
        Alert.alert('Im inside the func');
        fetch(URL + "/Test", {
            method: "post",
            headers: new Headers({
                "Content-Type": "application/json;"
            }),
            body: JSON.stringify()
        })
            .then(res => {
                console.log("res=", res);
                return res.json();
            })
            .then(
                result => {
                    console.log("fetch POST= ", result);
                    console.log("fetch POST.d= ", result.d);
                    let p = JSON.parse(result.d);
                    if (p != null) {
                        this.setState({ petID: p.PetID });
                        this.setState({ name: p.Name });
                        console.log('Pet Name Is :' + this.state.name);
                    } else {
                        alert("no such pet!");
                    }
                },
                error => {
                    console.log("err post=", error);
                }
            );
    };
    btnLogin = () => {
        const data = {
            userName: 'Nathaniel',
            userPass: '123'
        };
        fetch(URL + "/Login", {
            method: "post",
            headers: new Headers({
                "Content-Type": "application/json;"
            }),
            body: JSON.stringify(data)
        })
            .then(res => {
                console.log("res=", res);
                return res.json();
            })
            .then(
                result => {
                    console.log("fetch POST= ", result);
                    console.log("fetch POST.d= ", result.d);
                    let u = JSON.parse(result.d);
                    if (u != null) {
                        this.setState({ n: u.UserName });
                        this.setState({ n: u.Password });
                        this.setState({ n: u.UserName });
                    } else {
                        alert("no such user!");
                    }
                },
                error => {
                    console.log("err post=", error);
                }
            );
    };
    showAlert(item) {
        console.log(item);
        Alert.alert(JSON.stringify(item.PetID));
    }
    myTable() {
        return this.state.pets;
    }
    chk = () => {
        console.log(this.state.pets);
    }
    componentDidMount() {
        //this.makeRemoteRequest();
    }
    loadPetList = () => {
        fetch(URL + "/GetPetsDetails", {
            method: "post",
            headers: new Headers({
                "Content-Type": "application/json;"
            }),
            body: JSON.stringify()
        })
            .then(res => {
                console.log("res=", res);
                return res.json();
            })
            .then(
                result => {
                    console.log("fetch POST= ", result);
                    console.log("fetch POST.d= ", result.d);
                    let p = JSON.parse(result.d);
                    console.log('p:===>'+p);
                    if (p != null) {
                        this.setState({pets:p});
                        console.log('obj:===> '+this.state.pets);
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
        return (
            <View style={styles.container}>
                <View style={styles.logo}>
                    <Image Image source={require("../Images/logo.png")} />
                </View>
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
                        data={this.state.pets}
                        extraData={this.state}
                        renderItem={({ item }) => <View style={{ margin: 20 }}>
                            <View style={styles.gridTable}>
                                <Text onPress={this.showAlert.bind(this, item)}>שם:{item.Name} גיל:{item.Age}{'\n'} גזע:{item.RaceCode}
                                {'\n'} חיסונים:{item.vaccines}</Text>
                            </View>
                        </View>}
                        numColumns={2}
                        keyExtractor={item => item.PetID}
                    //keyExtractor={(item, index) => index.toString()}
                    />
                </View>
                <Button buttonStyle={{ backgroundColor: 'red', marginTop: 30 }} title='CHECK' onPress={this.chk} />
                <Button buttonStyle={{ backgroundColor: 'green', marginTop: 30 }} title='Add Pet' onPress={this.loadPetList} />

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
    logo: {
        marginTop: 20
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