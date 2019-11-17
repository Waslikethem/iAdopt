import React from 'react';
import { ImageBackground, Text, View, Switch, Image, Dimensions, StyleSheet, DrawerLayoutAndroid, ToolbarAndroid, ScrollView, TouchableOpacity, TouchableHighlight, AsyncStorage, Alert } from 'react-native';
import { ParallaxImage, Pagination } from 'react-native-snap-carousel';
import InputSpinner from 'react-native-input-spinner';
import RNPickerSelect from 'react-native-picker-select';
import { Button, ButtonGroup, Input } from "react-native-elements";
const URL = "http://ruppinmobile.tempdomain.co.il/site02/WebService.asmx";
const IMAGE_URL = "http://ruppinmobile.tempdomain.co.il/site02/ImageStorage/";

const { width: screenWidth } = Dimensions.get('window')


export default class PublishPets extends React.Component {

    async componentDidMount() {
        AsyncStorage.getItem("user", (err, result) => {
            if (result != null) {
                this.setState({ user: JSON.parse(result) });
                if (this.state.user.UserImage != null)
                    this.setState({
                        UserID: this.state.user.UserID,
                        profilePic: IMAGE_URL + this.state.user.UserImage,
                        userName: this.state.user.UserName,
                        userEmail: this.state.user.Email,
                    }, function () { });
            }
        });
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


    registerPet = () => {
        if (this.state.petName == '' || this.state.petRace == null) {
            Alert.alert('הינך חייב למלא את שדה שם החיה ולבחור גזע');
            return;
        }
        const data = {
            //Most be like the Csharp func Code!
            name: this.state.petName,
            age: this.state.petAge,
            raceCode: this.state.petRace,
            isDog: this.state.isDog ? true : false,
            userCode: this.state.UserID,
            gender: this.state.petGender,
            vaccines: this.state.petVaccines,
            img: ''
        };
        console.log(data);
        fetch(URL + '/PetRegistration', {
            method: 'post',
            headers: new Headers({
                'Content-Type': 'application/json;',
            }),
            body: JSON.stringify(data)
        }).then(res => {
            return res.json()
        }).then((res) => {
            let pet = JSON.parse(res.d);
            this.savePetDetails(pet);
        }, (error) => {
            console.log("err post=", error);
        });
    }

    savePetDetails = async (pet) => {
        try {
            console.log("pet: ", pet);
            await AsyncStorage.setItem("thisPet", JSON.stringify(pet));
            this.navToPublishPetImages();
        } catch (error) {
            alert(error);
        }
    }

    txtPetName = (e) => {
        this.setState({ petName: e });
    }
    txtPetVaccines = (e) => {
        this.setState({ petVaccines: e });
    }

    constructor(props) {
        super(props);
        this.openDrawer = this.openDrawer.bind(this);
        this.state = {
            //Default Profile Picture
            defaultPic: IMAGE_URL + 'noPic.png',
            //User
            userName: '',
            userEmail: '',
            profilePic: '',
            //Screen
            indexSpacer: '\xa0\xa0\xa0\xa0\xa0\xa0\xa0',
            selectedKind: 0,
            switchValue: true,
            //PetDetails
            isDog: true,
            petName: '',
            petGender: 'm',
            petAge: 0,
            petVaccines: '',
            petRaces: [],
            petRace: 0,
            petImage: 'null',
            selectedIndex: 0
        };
    }
    openDrawer() {
        this.drawer.openDrawer();
    }


    toggleSwitch = value => {
        this.setState({ switchValue: value });
        if (value) {
            this.setState({ petGender: 'm' })
        } else {
            this.setState({ petGender: 'f' })
        }
    }

    updateIndex = (selectedKind) => {
        this.setState({ selectedKind });
        if (selectedKind == 0) {
            this.setState({ isDog: true }, function () { this.retrievePetRacesTable(this.state.isDog) })
        }
        else {
            this.setState({ isDog: false }, function () { this.retrievePetRacesTable(this.state.isDog) })
        }
    }


    //Drawer Navigation Section
    deleteAsyncStorage = async () => {
        AsyncStorage.clear();
        Alert.alert('התנתקת בהצלחה מהמערכת');
        this.navToLogin();
    }
    navToLogin = () => {
        this.props.navigation.navigate("Login");
    }
    navToPets = () => {
        this.props.navigation.navigate("Pets");
    }
    navToPublishPetImages = () => {
        this.props.navigation.navigate("PublishPetImages");
    }
    navToEditProfile = () => {
        this.props.navigation.navigate("EditProfile");
    }
    navToCategories = () => {
        this.props.navigation.navigate("Categories");
    }
    selectedCategory = async (index) => {
        try {
            await AsyncStorage.setItem('categoryNum', String(index));
            this.navToCategories();
        } catch (error) {
            alert(error);
        }
    }
    render() {
        const buttons = ['כלב/ה', 'חתול/ה']
        const { selectedKind } = this.state
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
            <ImageBackground source={require("../Images/NewScreen.png")} style={{ width: '100%', height: '100%', }}>
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
                                    onChangeText={this.txtPetVaccines}
                                    maxLength={30}
                                    placeholder='חיסונים'
                                    errorStyle={{ color: 'red' }}
                                />
                            </View>
                            <View style={styles.viewRow}>
                                <Text>נקבה</Text>
                                <Switch
                                    onValueChange={this.toggleSwitch}
                                    value={this.state.switchValue}
                                />
                                <Text>זכר</Text>
                            </View>
                            <Text>גיל</Text>
                            <InputSpinner
                                max={24}
                                min={0}
                                step={1}
                                color={"#40c5f4"}
                                //onIncrease={increased => { this.setState({ petAge: increased },function () { Alert.alert('petAge: ' + this.state.petAge) }) }}
                                //onDecrease={decreased => { this.setState({ petAge: decreased },function () { Alert.alert('petAge: ' + this.state.petAge) }) }}
                                onChange={value => { this.setState({ petAge: value }, function () { }) }}
                                value={this.state.petAge}
                            />

                            <View style={{ width: 140 }}>
                                <RNPickerSelect
                                    placeholder={{ label: 'גזע', value: null }}
                                    onValueChange={(value) => { this.setState({ petRace: value }, function () { }) }}
                                    items={this.state.petRaces}
                                /></View>
                            <Button buttonStyle={{ backgroundColor: 'orange', marginTop: 30 }} title='עבור לשלב הבא' onPress={this.registerPet} />
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
    viewRow: {
        flexDirection: 'row'
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
        height: 80
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
    menuIcos: {
        width: 25,
        height: 26
    },
    menuText: {
        fontSize: 16
    }
});

