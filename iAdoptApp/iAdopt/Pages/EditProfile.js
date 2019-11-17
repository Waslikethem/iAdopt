import React from 'react';
import { ImageBackground, Text, View, Image, Dimensions, StyleSheet, DrawerLayoutAndroid, ToolbarAndroid, ScrollView, TouchableOpacity, TouchableHighlight, AsyncStorage, Alert } from 'react-native';
import { ParallaxImage, Pagination } from 'react-native-snap-carousel';
import * as ImagePicker from "expo-image-picker";
import RNPickerSelect from 'react-native-picker-select';
import { Button, Input } from "react-native-elements";
const URL = "http://ruppinmobile.tempdomain.co.il/site02/WebService.asmx";
const IMAGE_URL = "http://ruppinmobile.tempdomain.co.il/site02/ImageStorage/";

//Save New Settings in AsyncStorage!

const { width: screenWidth } = Dimensions.get('window')

export default class EditProfile extends React.Component {

    componentDidMount() {
        AsyncStorage.getItem("user", (err, result) => {
            if (result != null) {
                this.setState({ user: JSON.parse(result) }, function () { console.log('EditProfilePage - User', this.state.user) });
                if (this.state.user.UserImage != null)
                    this.setState({
                        profilePic: IMAGE_URL + this.state.user.UserImage,
                        userID: this.state.user.UserID,
                        userName: this.state.user.UserName,
                        userEmail: this.state.user.Email,
                        userPhone: this.state.user.Phone,
                        CurrentUserRegion: this.state.user.RegionCode,
                        userPass: this.state.user.Password,
                        verifyPass: this.state.user.Password
                    });
            }
        });
        try {
            this.loadPage();
        } catch (error) {
            console.log("error: ", error);
        }

    }

    loadPage() {
        this.retrieveRegionsTable();
    }
    constructor(props) {
        super(props);
        this.openDrawer = this.openDrawer.bind(this);
        this.state = {
            //Default Profile Picture
            defaultPic: IMAGE_URL + 'noPic.png',
            //User
            userID: '',
            userName: '',
            userPass: '',
            verifyPass: '',
            hidePW: '',
            userEmail: '',
            userPhone: '',
            userRegion: 0,
            profilePic: '',
            temRegion: 0,
            regions: [],
            regionFlag: false,
            indRegionChange: false,
            user: null,
            //Screen
            indexSpacer: '\xa0\xa0\xa0\xa0\xa0\xa0\xa0',
        };


    }
    openDrawer() {
        this.drawer.openDrawer();
    }

    retrieveRegionsTable = () => {
        fetch(URL + "/GetRegionsTable", {
            method: "post",
            headers: new Headers({
                "Content-Type": "application/json;"
            }),
            body: ''//JSON.stringify()
        }).then(res => {
            return res.json();
        }).then(result => {
            //Alert.alert(JSON.stringify(result));
            let r = JSON.parse(result.d);
            //Alert.alert("retrieveRegionsTable:\n"+r);
            if (r != null) {
                this.setState({ regions: r }, function () { this.hidePassword() });

            } else {
                alert('error');
            }

        }, error => {
            console.log("err post=", error);
        }).catch(function (error) {
            console.log('There has been a problem with your fetch operation: ' + error.message);
            // ADD THIS THROW error
            //throw error;
        });
    }

    saveUser = async (flag) => {
        try {
            if (flag) { this.state.user.RegionCode = this.state.userRegion; } else { this.state.user.RegionCode = this.state.CurrentUserRegion; }
            this.state.user.Password = this.state.userPass;
            this.state.user.Email = this.state.userEmail;
            this.state.user.Phone = this.state.userPhone;
            console.log('User: ', this.state.user)
            await AsyncStorage.setItem('user', JSON.stringify(this.state.user));

        } catch (error) {
            alert(error);
        }
    }

    btnOpenGallery = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1,
            base64: true
        });
        if(result.cancelled)
        return
        if (!result.canclelled) {
            this.setState({
                img: result.uri,
                base64: result.base64,
                imgType: 'jpeg'
            });
            this.showImgUrl();
        }

    }
    btnLunchCamera = async () => {
        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 1,
            base64: true
        });
        if(result.cancelled)
        return
        if (!result.canclelled) {
            this.setState({
                img: result.uri,
                base64: result.base64,
                imgType: 'jpeg'
            });
            this.showImgUrl();
        }

    }

    EditPicture = () => {
        Alert.alert(
            'עדכן תמונת משתמש',
            'הפעל מצלמה או פתח גלריה',
            [
                {
                    text: 'הפעל מצלמה',
                    onPress: this.btnLunchCamera,
                },
                {
                    text: 'פתח גלריה',
                    onPress: this.btnOpenGallery
                },
            ],
            { cancelable: true },
        );
    };
    showImgUrl = () => {
        const data = {
            userID: this.state.user.UserID,
            base64: this.state.base64,
            imageName: this.state.user.UserID,
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
            let m = this.state.user;
            m.UserImage = u.UserImage;
            this.setState({
                profilePic: IMAGE_URL + u.UserImage,
                user: m
            }, function () {
                console.log("profilePic=" + this.state.profilePic),
                    console.log('PICTURE LENGTH: ' + this.state.profilePic.length);
                this.saveUser();
            });
        },
            (error) => {
                console.log("err post=", error);
            });
    }

    regionPicker = (value) => {
        if (this.state.regionFlag)
            this.setState({ userRegion: value, indRegionChange: true });
        this.setState({ regionFlag: true })
    }



    updateUser = () => {
        if ((!this.state.userEmail.toUpperCase().includes('@GMAIL.COM')) || (!this.state.userEmail.toUpperCase().includes('@YAHOO.COM')) || (!this.state.userEmail.toUpperCase().includes('@WALLA.CO.IL'))) {
            Alert.alert('האימייל אינו תקין');
            return;
        }
        if ((this.state.userPass.length > 12 || this.state.userPass.length < 6) || (this.state.verifyPass.length > 12 || this.state.verifyPass.length < 6)) {
            Alert.alert('סיסמאת המשתמש חייבת להיות בין 6  ל 12 תווים');
            return;
        }
        if (this.state.userPass != this.state.verifyPass) {
            Alert.alert('הסיסמאות אינם תואמות');
            return;
        }
        //FIXME
        if (!this.state.indRegionChange) {
            this.setState({ userRegion: this.state.temRegion }, function () {
                console.log('id: ' + this.state.userID + ' pass' + this.state.userPass + ' email' + this.state.userEmail + ' phone' + this.state.userPhone
                    + ' regionCode' + this.state.userRegion);
                const data = {
                    //Most be like the Csharp func Code!
                    userID: this.state.userID,
                    password: this.state.userPass,
                    email: this.state.userEmail,
                    phone: this.state.userPhone,
                    regionCode: this.state.CurrentUserRegion,
                };
                console.log('<<<<(1)MY DATA', data);
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
                    Alert.alert('חשבונך התעדכן בהצלחה');
                    this.saveUser(false);
                    this.navToHome();
                }, (error) => {
                    console.log("err post=", error);
                });
            })
            this.navToHome();
        }
        else {
            const data = {
                //Most be like the Csharp func Code!
                userID: this.state.userID,
                password: this.state.userPass,
                email: this.state.userEmail,
                phone: this.state.userPhone,
                regionCode: this.state.userRegion,
            };
            console.log('<<<<(2)MY DATA', data);
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
                Alert.alert('חשבונך התעדכן בהצלחה');
                this.saveUser(true);
                this.navToHome();
            }, (error) => {
                console.log("err post=", error);
            });
        }


    }

    selectedCategory = async (index) => {
        try {
            await AsyncStorage.setItem('categoryNum', String(index));
            this.navToCategories();
        } catch (error) {
            alert(error);
        }
    }
    navToCategories = () => {
        this.props.navigation.navigate("Categories");
    }
    navToHome = () => {
        this.props.navigation.navigate("Home");
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
    hidePassword = () => {
        for (i = 0; i < this.state.userPass.length; i++) {
            this.setState(prevstate => ({ hidePW: prevstate.hidePW + '*' }));
        }
    }

    deleteAsyncStorage = async () => {
        AsyncStorage.clear();
        Alert.alert('התנתקת בהצלחה מהמערכת');
        this.props.navigation.navigate("Login");
    }

    render() {
        var drawer = (
            <View style={{ backgroundColor: '#FFFF', flex: 1 }}>
                <View >
                    <Image source={require("../Images/background1.png")} style={{ resizeMode: 'cover', height: 200 }} />
                    <Image source={{ uri: String(this.state.profilePic.length) == 57 ? this.state.defaultPic : this.state.profilePic + '?time' + new Date() }} style={{ left: 20, top: 65, position: 'absolute', width: 65, height: 65, borderRadius: 100 }} />
                    <Text style={{ left: 20, top: 145, position: 'absolute', fontSize: 22, fontFamily: 'notoserif', fontWeight: '500' }}>{this.state.userName}</Text>
                    <Text style={{ left: 20, top: 175, position: 'absolute', fontSize: 17, fontFamily: 'sans-serif-condensed', fontWeight: '400' }}>{this.state.userEmail}</Text>
                </View>
                <ScrollView>
                    <Text style={{ margin: 20, fontSize: 17, textAlign: 'left' }}>────  קטגוריות  ────</Text>
                    < TouchableOpacity style={{ margin: 15, textAlign: 'left', flexDirection: "row" }}
                        onPress={() => this.selectedCategory(6)}>
                        <Image source={require("../Images/store.png")} style={styles.menuIcos}></Image>
                        <Text style={styles.menuText}>   חנויות </Text>
                    </TouchableOpacity>
                    < TouchableOpacity style={{ margin: 15, fontSize: 15, textAlign: 'left', flexDirection: "row" }}
                        onPress={() => this.selectedCategory(7)}>
                        <Image source={require("../Images/doctor.png")} style={styles.menuIcos}></Image>
                        <Text style={styles.menuText}>   וטרינרים</Text>
                    </TouchableOpacity>
                    < TouchableOpacity style={{ margin: 15, fontSize: 15, textAlign: 'left', flexDirection: "row" }}
                        onPress={() => this.selectedCategory(2)}>
                        <Image source={require("../Images/forest.png")} style={styles.menuIcos}></Image>
                        <Text style={styles.menuText}>   פארקים</Text>
                    </TouchableOpacity>
                    < TouchableOpacity style={{ margin: 15, fontSize: 15, textAlign: 'left', flexDirection: "row" }}
                        onPress={() => this.selectedCategory(4)}>
                        <Image source={require("../Images/treking.png")} style={styles.menuIcos}></Image>
                        <Text style={styles.menuText}>   מסלולים</Text>
                    </TouchableOpacity>
                    < TouchableOpacity style={{ margin: 15, fontSize: 15, textAlign: 'left', flexDirection: "row" }}
                        onPress={() => this.selectedCategory(8)}>
                        <Image source={require("../Images/dogsitter.png")} style={styles.menuIcos}></Image>
                        <Text style={styles.menuText}>   דוגיסיטרים</Text>
                    </TouchableOpacity>
                    < TouchableOpacity style={{ margin: 15, fontSize: 15, textAlign: 'left', flexDirection: "row" }}
                        onPress={() => this.selectedCategory(3)}>
                        <Image source={require("../Images/zimmer.png")} style={styles.menuIcos}></Image>
                        <Text style={styles.menuText}>   צימרים</Text>
                    </TouchableOpacity>
                    < TouchableOpacity style={{ margin: 15, fontSize: 15, textAlign: 'left', flexDirection: "row" }}
                        onPress={() => this.selectedCategory(5)}>
                        <Image source={require("../Images/kennel.png")} style={styles.menuIcos}></Image>
                        <Text style={styles.menuText}>   פנסיונים</Text>
                    </TouchableOpacity>
                    < TouchableOpacity style={{ margin: 15, fontSize: 15, textAlign: 'left', flexDirection: "row" }}
                        onPress={() => this.selectedCategory(1)}>
                        <Image source={require("../Images/meeting.png")} style={styles.menuIcos}></Image>
                        <Text style={styles.menuText}>   מפגשים</Text>
                    </TouchableOpacity>
                    <Text style={{ margin: 20, fontSize: 17, textAlign: 'left' }}>────  פרטיות  ────</Text>
                    < TouchableOpacity style={{ margin: 15, fontSize: 15, textAlign: 'left', flexDirection: "row" }}
                        onPress={this.navToEditProfile}>
                        <Image source={require("../Images/user.png")} style={styles.menuIcos}></Image>
                        <Text style={styles.menuText}>   עריכת פרופיל</Text>
                    </TouchableOpacity>
                    < TouchableOpacity style={{ margin: 15, fontSize: 15, textAlign: 'left', flexDirection: "row" }}
                        onPress={this.deleteAsyncStorage}>
                        <Image source={require("../Images/log-out.png")} style={styles.menuIcos}></Image>
                        <Text style={styles.menuText}>   התנתק </Text>
                    </TouchableOpacity>
                </ScrollView>

            </View>

        );
        return (
            <ImageBackground source={require("../Images/NewRegistration.png")} style={{ width: '100%', height: '100%', }}>
                <View style={{ flex: 1 }}>
                    {/*Open Burder Menu on Press */}
                    <TouchableOpacity>
                        <Image source={{ uri: String(this.state.profilePic.length) == 57 ? this.state.defaultPic : this.state.profilePic + '?time' + new Date() }} style={{ left: 10, top: 34, position: 'absolute', width: 35, height: 35, borderRadius: 100 }} />
                    </TouchableOpacity>
                    {/*Nav to Home Page on Press */}
                    <TouchableOpacity>
                        <Image Image source={require("../Images/logo.png")} style={{ right: 10, top: 34, position: 'absolute', width: 130, height: 35 }} />
                    </TouchableOpacity>
                    <DrawerLayoutAndroid renderNavigationView={() => drawer} drawerWidth={260}
                        statusBarBackgroundColor='#FFFFFF' ref={_drawer => (this.drawer = _drawer)} drawerPosition={DrawerLayoutAndroid.positions.Left}>
                        <View>
                            <ToolbarAndroid style={styles.toolbar} navIcon={require('../Images/tIcon.png')} onIconClicked={this.openDrawer} />
                        </View>
                        <View style={{ width: '100%' }}>
                            <Image source={require("../Images/Shadow.png")} style={{ width: '100%', resizeMode: 'cover', height: 50 }}></Image>
                        </View>
                        <View style={styles.container}>
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
                                        onValueChange={(value) => { this.regionPicker(value) }}
                                        items={this.state.regions}
                                    />
                                </View>
                            </View>
                            <View style={styles.publishPet}>
                                <Button buttonStyle={{ backgroundColor: '#00bfff', margin: 5 }} title='שנה תמונת משתמש' onPress={this.EditPicture} />
                                <Button buttonStyle={{ alignSelf: 'center', width: 130, backgroundColor: 'orange', margin: 5 }} title='עדכן משתמש' onPress={this.updateUser} />
                            </View>

                        </View>

                    </DrawerLayoutAndroid>
                </View >
            </ImageBackground>
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
    toolbar: {
        paddingTop: 10,
        height: 30,
        //backgroundColor: '#ffd187',
        width: '100%',
    },
    toolbar: navIcon = {
        width: 31,
        height: 31,
        zIndex: 999
    },
    uppearScreen: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: 80,
        marginBottom: 70
    },
    categoriesItemContainer: {
        flex: 1,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
        height: 200,
        width: 165,
        borderColor: '#cccccc',
        borderWidth: 0.5,
        borderRadius: 20,
    },
    categoriesPhoto: {
        width: '100%',
        height: "74%",
        borderRadius: 20,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        shadowRadius: 50,
        shadowOpacity: 1.0,
    },
    categoriesName: {
        flex: 1,
        fontSize: 19,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333333',
        marginTop: 8
    },
    categoriesInfo: {
        marginTop: 3,
        marginBottom: 5
    },
    checkBoxContainer: {
        marginRight: 0,
        marginLeft: 0,
        width: 370,
        flexDirection: 'row',
        textAlign: 'center',
        justifyContent: 'center',
        //marginRight: 20
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
    imagesSlider: {
        flexDirection: 'row',
        textAlign: 'center',
        justifyContent: 'center',
    },
    modalScreen: {
        flex: 0.82,
        backgroundColor: '#fff8dc',
        //borderRadius:2,
        //borderColor:'black',
        justifyContent: 'center',
        alignItems: 'center',
        width: 350,
        margin: 5,
        marginTop: 90
    },
    publishPet: {
        position: 'absolute',
        bottom: 50
    },
    menuIcos: {
        width: 25,
        height: 26
    },
    menuText: {
        fontSize: 16
    }
});

