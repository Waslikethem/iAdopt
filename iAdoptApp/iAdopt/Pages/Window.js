import React from 'react';
import { Text, View, TouchableOpacity, TextInput, Image } from 'react-native';
import styles from './pageStyle';
import { Button, Dialog, DialogDefaultActions } from 'react-native-material-ui';

export default class LoginPage extends React.Component {
    static navigationOptions = {
        title: 'LOGIN',
    };

    constructor(props) {
        super(props);
        this.state = {
            txtName: 'Avi',
            txtPass: '123'
        }
    }

    btnLogin = () => {
        debugger;
        if (this.state.txtName == 'Avi' && this.state.txtPass == '123') {
            this.setState({ lblErr: false });
            this.props.navigation.navigate('Home');
        } else {
            this.setState({ lblErr: true });
        }
    };

    btnPOST_Person = () => {
        let per = {
            Name: this.state.txtName,
            Pass: this.state.txtPass
        };

        // POST adds a random id to the object sent
        fetch('http://proj.ruppin.ac.il/igroup96/test1/api/login', {
            method: 'POST',
            body: JSON.stringify(per),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(response => response.json())
            .then(json => {
                if (json != null) {
                    alert(`
                    returned from server\n
                    json= ${json}\n
                    Name=${json.Name}\n
                    Pass=${json.Pass}\n
                    Age=${json.Age}`);
                    this.props.navigation.navigate('Home');
                } else {
                    this.setState({ lblErr: true });
                }
            });
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.Header}>
                    <Text style={styles.textBig}>Login Page</Text>
                    <Image
                    style={{alignSelf:'center', width:100, height:100}}
                        source={require('../assets/icon.png')} />
                </View>
                <View style={styles.Content}>
                    <Text style={styles.lblText}>NAME:</Text>
                    <TextInput
                        style={styles.TxtInp}
                        onChangeText={(text) => this.setState({ txtName: text })}
                        value={this.state.txtName}
                    />
                    <Text style={styles.lblText}>PASS:</Text>
                    <TextInput
                        style={styles.TxtInp}
                        onChangeText={(text) => this.setState({ txtPass: text })}
                        value={this.state.txtPass}
                    />
                    <TouchableOpacity
                        style={styles.Button}
                        onPress={this.btnLogin}>
                        <Text style={styles.textMedium}>go to home page</Text>
                    </TouchableOpacity>
                    {this.state.lblErr && <Text style={styles.Err}>WRONG NAME OR PASS!</Text>}
                    <View style={{ margin: 20 }}>
                        <Button
                            primary text="LOGIN with WebAPI"
                            icon="directions-car"
                            style={{ margin: 20 }}
                            onPress={this.btnPOST_Person}
                        />
                        {this.state.lblErr &&
                            <View style={{ position: 'absolute',bottom: 150, alignSelf: 'center' }}>
                                <Dialog>
                                    <Dialog.Title><Text>ERR Name or Pass!</Text></Dialog.Title>
                                    <Dialog.Content>
                                        <Text>stam dialog example!</Text>
                                    </Dialog.Content>
                                    <Dialog.Actions>
                                        <DialogDefaultActions
                                            actions={['cancel', 'we\'re good']}
                                            onActionPress={(data) => {
                                                alert(data);
                                                this.setState({ lblErr: false });
                                            }}
                                        />
                                    </Dialog.Actions>
                                </Dialog>
                            </View>
                        }
                    </View>
                </View>
            </View >
        );
    }
}