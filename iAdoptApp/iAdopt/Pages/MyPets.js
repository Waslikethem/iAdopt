import React from 'react';
import { Text, View, Modal, Image, Dimensions, StyleSheet, DrawerLayoutAndroid, ToolbarAndroid, ScrollView, TouchableOpacity, TouchableHighlight, FlatList, AsyncStorage, Alert } from 'react-native';
import Carousel, { ParallaxImage, Pagination } from 'react-native-snap-carousel';
import RNPickerSelect from 'react-native-picker-select';
import { Button, ButtonGroup, CheckBox } from "react-native-elements";
const URL = "http://ruppinmobile.tempdomain.co.il/site02/WebService.asmx";
const IMAGE_URL = "http://ruppinmobile.tempdomain.co.il/site02/ImageStorage/";

const { width: screenWidth } = Dimensions.get('window')


export default class MyPets extends React.Component {
    static navigationOptions = {
        title: 'Categories'
    };
    constructor(props) {
        super(props);
        this.openDrawer = this.openDrawer.bind(this);
        this.state = {
            user: null,
            defaultPic: IMAGE_URL + 'noPic.png',
            profilePic: '',
            userName: '',
            firstName: '',
            lastName: '',
            phone: '',
            //Misc
            indexSpacer: '\xa0\xa0\xa0\xa0\xa0\xa0\xa0',
            selectedIndex: 2,
            //Sorting
            sortByGender: false,
            sortByAge: false,
            regions: [],
            //Modal
            modalVisible: false,
            modalItem: {},
            //Pet
            data: [],
            petRegion: 0,
            CurrentPetId: 0,
            OwnerPhoneNumber: '',
            pet: [],
            petDetails: {
                PetId: 0,
                Gallery: ["1.jpg", "2.jpg", "3.jpg"]
            },
            userID: ''
        }
        this._renderItem = this._renderItem.bind(this);
    };

    componentDidMount() {
        AsyncStorage.getItem("user", (err, result) => {
            console.log("result (user) = " + result);
            if (result != null) {
                this.setState({ user: JSON.parse(result) });
                if (this.state.user.UserImage != null)
                    this.setState({
                        userID: this.state.user.UserID,
                        profilePic: IMAGE_URL + this.state.user.UserImage, userName: this.state.user.UserName,
                        firstName: this.state.user.Fname, lastName: this.state.user.Lname,
                        phone: this.state.user.Phone
                    }, function () { this.loadUserPets(this.state.userID) });
            }
        });
    }
    getNumberOfRecipes(categoryId) {
        let count = 0;
        recipes.map(data => {
            if (data.categoryId == categoryId) {
                count++;
            }
        });
        return count;
    }



    openDrawer() {
        this.drawer.openDrawer();

    }

    loadUserPets = (id) => {
        const data = {
            user_id: id
        }
        fetch(URL + "/ShowMyPets", {
            method: "post",
            headers: new Headers({
                "Content-Type": "application/json;"
            }),
            body: JSON.stringify(data)
        }).then(res => {
            return res.json();
        }).then(result => {
            let p = JSON.parse(result.d);
            if (p != null) {
                this.setState({ data: p });
                console.log('Data: ' + this.state.data)
            } else {
                alert('error');
            }
        }, error => {
            console.log("err post[loadPets]=", error);
        }).catch(function (error) {
            console.log('There has been a problem with your fetch operation: ' + error.message);
            // ADD THIS THROW error
            //throw error;
        });
    }


    updateIndex = (index) => {
        if (this.state.petRegion == null) {
            this.setState({ petRegion: 0 });
        }
        this.setState({ selectedIndex: index }, function () {
            this.renderNewTable();
        })
    }


    showAlert(item) {
        console.log(item);
        Alert.alert(JSON.stringify(item.PetID));
    }

    openModal(item) {
        this.setState({ modalItem: item });
        this.setModalVisible(true);
    }

    regionPicker = (value) => {
        this.setState({ userRegion: value }, function () { Alert.alert(this.state.userRegion) })
    }


    renderItem({ item, index }, parallaxProps) {
        return (
            <View style={{ justifyContent: 'flex-start', width: screenWidth - 60, height: screenWidth - 60 }} >
                <ParallaxImage
                    source={{ uri: item }}
                    containerStyle={{ flex: 1, borderRadius: 30 }}
                    parallaxFactor={0.4}
                    {...parallaxProps}
                />
            </View>
        );
    }
    navToLogin = () => {
        this.props.navigation.navigate("Login");
    }
    navToPets = () => {
        this.props.navigation.navigate("Pets");
    }
    navToEditProfile = () => {
        this.props.navigation.navigate("EditProfile");
    }
    deleteAsyncStorage = async () => {
        AsyncStorage.clear();
        Alert.alert('התנתקת בהצלחה מהמערכת');
        this.props.navigation.navigate("Login");
    }
    navToCategories = () => {
        this.props.navigation.navigate("Categories");
    }
    _renderItem({ item, index }) {
        return (
            <View style={{ flex: 1 }} />
        );
    }
    navToLoginPage = () => {
        this.props.navigation.navigate("LoginPage");
    }
    navToPublishPet = () => {
        this.props.navigation.navigate("PublishPet");
    }
    navToPetsPage = () => {
        this.props.navigation.navigate("PetsPage");
    }

    deletePet = (id) => {
        const data = {
            pet_id: id
        }
        fetch(URL + "/DeletePet", {
            method: "post",
            headers: new Headers({
                "Content-Type": "application/json;"
            }),
            body: JSON.stringify(data)
        }).then(res => {
            return res.json();
        }).then(result => {
            this.loadUserPets(this.state.userID);
        }, error => {
        }).catch(function (error) {
        });
    }

    renderCategory = ({ item }) => (
        <TouchableHighlight underlayColor='rgba(255,255,255,0.4)' onPress={() => this.onPressCategory(item)} style={{ width: "50%" }}>
            <View style={styles.categoriesItemContainer}>
                <Image style={styles.categoriesPhoto} source={{ uri: IMAGE_URL + "Pets/" + item.PetID + "/1.jpg" + '?time' + new Date() }} />
                <Text style={styles.categoriesName}>{item.Name}</Text>
                <Text style={styles.categoriesInfo}>הסר</Text>
            </View>
        </TouchableHighlight>
    );
    selectedCategory = async (index) => {
        try {
            await AsyncStorage.setItem('categoryNum', String(index));
            this.navToCategories();
        } catch (error) {
            alert(error);
        }
    }
    onPressCategory = item => {
        Alert.alert(
            'הסרת חיית מחמד',
            'האם הינך בטוח?',
            [
                {
                    text: 'לא',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'כן', onPress: () => this.deletePet(item.PetID) },
            ],
            { cancelable: false },
        );
        //Alert.alert(String('Pet ID: ' + item.PetID + " UserID: " + this.state.userID));
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
                    <View style={{ alignSelf: 'center' }}>
                    </View>
                    <View style={{ justifyContent: "center", alignItems: "center", flex: 1, flexDirection: "column", top: 20, height: 500 }}>
                        <FlatList
                            data={this.state.data}
                            renderItem={this.renderCategory}
                            keyExtractor={item => `${item.PetID}`}
                            numColumns={2}
                            marginTop={10}

                        />
                    </View>
                </DrawerLayoutAndroid>
            </View >
        );

    }
}




const styles = StyleSheet.create({
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
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333333',
        marginTop: 8
    },
    categoriesInfo: {
        marginTop: 3,
        marginBottom: 5,
        color: 'red'
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
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    menuIcos: {
        width: 25,
        height: 26
    },
    menuText: {
        fontSize: 16
    }
});

