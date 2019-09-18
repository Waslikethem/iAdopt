import React from "react";
import { View, Text,StyleSheet } from "react-native";
export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <Text>This is HomePage</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex:1,
      flexDirection:'column',
      justifyContent:'center',
      alignItems:'flex-start',
      width: "100%",
      height: "100%"
    },
  });