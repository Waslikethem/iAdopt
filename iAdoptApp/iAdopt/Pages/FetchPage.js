import React from "react";
import { View, Text, StyleSheet, Image, ListView, FlatList, Alert, TouchableOpacity, ScrollView, ActivityIndicator, AsyncStorage } from "react-native";
import { Button, ThemeProvider, ListItem, List, ButtonGroup, CheckBox } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import { Icon } from 'react-native-elements';
import RNPickerSelect from 'react-native-picker-select';
import { Col, Row, Grid } from "react-native-easy-grid";
const URL = "http://ruppinmobile.tempdomain.co.il/site02/WebService.asmx";
const IMAGE_URL = "http://ruppinmobile.tempdomain.co.il/site02/ImageStorage/";
class Fetch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            regions: []
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
                        return this.state.regions;
                    } else {
                        alert('error');
                    }
                },
                error => {
                    console.log("err post=", error);
                }
            );
    }
}
const fetch=new Fetch;
export default fetch;