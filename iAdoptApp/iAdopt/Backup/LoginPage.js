import React from "react";
import { View, Text, StyleSheet,Image, ScrollView, ListView, FlatList, Alert } from "react-native";
import { Button, ThemeProvider } from 'react-native-elements';
import { Col, Row, Grid } from "react-native-easy-grid";
const URL = "http://ruppinmobile.tempdomain.co.il/site02/WebService.asmx";

export default class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            petID: '',
            name: '',
            age: '',
            raceCode: '',
            vaccineCode: '',
            isDog: '',
            userCode: '',
            gender: '',
            image: ' ',
            dueDate: ''
        }
    }

    getData = () => {
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
                    if (p != null) {
                        this.setState({ petID: p.petID });
                        this.setState({ name: p.Name });
                        this.setState({ age: p.Age });
                        this.setState({ raceCode: p.RaceCode });
                        this.setState({ vaccineCode: p.VaccineCode });
                        this.setState({ isDog: p.IsDog });
                        this.setState({ userCode: p.UserCode });
                        this.setState({ gender: p.Gender });
                        this.setState({ image: p.Image });
                        this.setState({ dueDate: p.DueDate });
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
    getAllPets = () => {
        return [
            {
                petID: '1',
                petName: 'Peach',
                petAge: '1',
                petRace: 'Lavrador'
            },
            {
                petID: '2',
                petName: 'Zlatan',
                petAge: '2',
                petRace: 'Debil'
            },
            {
                petID: '3',
                petName: '3',
                petAge: '3',
                petRace: '3'
            },
            {
                petID: '4',
                petName: '4',
                petAge: '4',
                petRace: '4'
            },
            {
                petID: '5',
                petName: '5',
                petAge: '5',
                petRace: '5'
            },
            {
                petID: '6',
                petName: '6',
                petAge: '6',
                petRace: '6'
            }
        ];
    }

    showAlert(item) {
        Alert.alert(item.petID);
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.logo}>
                    <Image Image source={require("../Images/logo.png")} />
                </View>
                {/*ButtonGroup*/}
                <Grid style={styles.gridTable}>
                    <Col style={styles.gridColumn1}>
                        {this.getAllPets().map((item, key) => {
                            return (
                                <Text style={styles.gridFont} key={key} onPress={this.showAlert.bind(this, item)}>Name: {item.petName} Age: {item.petAge}{'\n'}Race: {item.petRace} </Text>)
                        }
                        )}
                    </Col>
                    <Col style={styles.gridColumn2}>
                        {this.getAllPets().map((item, key) => {
                            return (
                                <Text style={styles.gridFont} key={key} onPress={this.showAlert.bind(this, item)}>Name: {item.petName} Age: {item.petAge}{'\n'}Race: {item.petRace} </Text>)
                        }
                        )}
                    </Col>
                </Grid>
                <Text>Pet Name Is: {this.state.name}</Text>
                <Button buttonStyle={{ backgroundColor: 'green' }} title='Login' onPress={this.getData()} />
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
    logo:{
        marginTop: 20
    },
    gridFont: {
        fontSize: 15,
    },
    gridTable: {
        marginTop: 25
    },
    gridColumn1: {
        backgroundColor: 'blue'
    },
    gridColumn2: {
        backgroundColor: 'yellow'
    },
});