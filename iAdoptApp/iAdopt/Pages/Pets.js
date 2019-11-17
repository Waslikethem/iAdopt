import React from 'react';
import { ImageBackground, Text, View, Modal, Image, Dimensions, StyleSheet, DrawerLayoutAndroid, ToolbarAndroid, ScrollView, TouchableOpacity, TouchableHighlight, FlatList, AsyncStorage, Alert } from 'react-native';
import Carousel, { ParallaxImage } from 'react-native-snap-carousel';
import RNPickerSelect from 'react-native-picker-select';
import { Button, ButtonGroup, CheckBox } from "react-native-elements";
const URL = "http://ruppinmobile.tempdomain.co.il/site02/WebService.asmx";
const IMAGE_URL = "http://ruppinmobile.tempdomain.co.il/site02/ImageStorage/";

const { width: screenWidth } = Dimensions.get('window')


export default class Pets extends React.Component {
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
    };

    componentDidMount() {
        AsyncStorage.getItem("user", (err, result) => {
            console.log("result (user) = " + result);
            if (result != null) {
                this.setState({ user: JSON.parse(result) });
                if (this.state.user.UserImage != null)
                    this.setState({
                        profilePic: IMAGE_URL + this.state.user.UserImage, userName: this.state.user.UserName,
                        firstName: this.state.user.Fname, lastName: this.state.user.Lname,
                        phone: this.state.user.Phone
                    }, function () { console.log(this.state.profilePic + " length=" + String(this.state.profilePic.length)) });
            }
        });
        try {
            this.loadPage();
        } catch (error) {
            console.log("error: ", error);
        }
    }

    openDrawer() {
        this.drawer.openDrawer();

    }

    getOwnerPhoneNumber = (this_userID) => {
        const data = {
            //Most be like the Csharp func Code!
            userID: String(this_userID),
        };
        fetch(URL + '/GetOwnerPhoneNumber', {
            method: 'post',
            headers: new Headers({
                'Content-Type': 'application/json;',
            }),
            body: JSON.stringify(data)
        })
            .then(res => {
                console.log('res=', res);
                return res.json()
            })
            .then(
                (result) => {
                    this.setState({
                        OwnerPhoneNumber: result.d,
                    }, function () { })
                },
                (error) => {
                    console.log("err post=", error);
                });
    }
    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }
    loadPage() {
        //this.loadPetsInfo(this.state.selectedIndex, this.petRegion, this.state.sortByAge, this.state.sortByGender);
        //-->Cannot be implemented this way, since petRegion is null atm
        this.loadPetsInfo(-1, 0, false, false);
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
                this.setState({ regions: r });

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

    getPetDetails = (id) => {
        const data = {
            //Most be like the Csharp func Code!
            petID: id
        };
        fetch(URL + '/GetPetDetails', {
            method: 'post',
            headers: new Headers({
                'Content-Type': 'application/json;',
            }),
            body: JSON.stringify(data)
        })
            .then(res => {
                console.log('res=', res);
                return res.json()
            })
            .then(
                (result) => {
                    let u = JSON.parse(result.d);
                    console.log("u: ", u);
                    if (u != null) {
                        this.setState({
                            petDetails: u, CurrentPetId: u.PetID, petVaccines: u.Vaccines, petName: u.Name,
                            petAge: u.Age, petRace: u.RaceCode, petGender: u.Gender
                        }, function () { this.getPetRace(this.state.petRace) })

                    }
                    else {
                        Alert.alert('בעיה עם שליפת בעל החיים')
                    }
                },
                (error) => {
                    console.log("err post=", error);
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

    renderNewTable = (value) => {
        if (this.state.selectedIndex == 2 && value == null) {
            this.loadPetsInfo(-1, 0, this.state.sortByAge, this.state.sortByGender);
            return;
        }
        if (this.state.selectedIndex != 2 && value == null) {
            this.loadPetsInfo(this.state.selectedIndex, 0, this.state.sortByAge, this.state.sortByGender);
            return;
        }
        if (this.state.sortByGender == false && this.state.sortByAge == false && this.state.selectedIndex == 2 && this.state.petRegion == 0) {
            this.loadPetsInfo(-1, this.state.petRegion, this.state.sortByAge, this.state.sortByGender);
            return;
        }
        else if (this.state.selectedIndex == 2) {
            this.loadPetsInfo(0, this.state.petRegion, this.state.sortByAge, this.state.sortByGender);
            return;
        }
        else if (this.state.selectedIndex != 2) {
            this.loadPetsInfo(this.state.selectedIndex, this.state.petRegion, this.state.sortByAge, this.state.sortByGender);
            return;
        }
    }

    openModal(item) {
        this.setState({ modalItem: item });
        this.setModalVisible(true);
    }

    regionPicker = (value) => {
        this.setState({ userRegion: value }, function () { Alert.alert(this.state.userRegion) })
    }
    loadPetsInfo = (isDog, regionId, sortByAge, sortByGender) => {
        const data = {
            isDog: isDog,
            regionId: regionId,
            sortByAge: sortByAge,
            sortByGender: sortByGender
        }
        fetch(URL + "/GetPetsInfo", {
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
                //data.sort((a, b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
                this.setState({ data: p },function(){});
                console.log('Data: ' + this.state.data)
            } else {
                alert('error');
            }
            this.retrieveRegionsTable();
        }, error => {
            console.log("err post[loadPets]=", error);
        }).catch(function (error) {
            console.log('There has been a problem with your fetch operation: ' + error.message);
            // ADD THIS THROW error
            //throw error;
        });
    }



    createImagesArray = (pet) => {
        let images = new Array();
        for (i = 0; i < 3; i++) {
            let url = IMAGE_URL + "Pets/" + pet.PetID + "/" + pet.Gallery[i] + '?time' + new Date();
            images.push(url);
        }
        return images;
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

    renderCategory = ({ item }) => (
        <TouchableHighlight underlayColor='rgba(255,255,255,0.4)' onPress={() => this.onPressCategory(item)} style={{ width: "50%" }}>
            <View style={styles.categoriesItemContainer}>
                <Image style={styles.categoriesPhoto} source={{ uri: IMAGE_URL + "Pets/" + item.PetID + "/1.jpg" + '?time' + new Date() }} />
                <Text style={styles.categoriesName}>{item.Name}</Text>
                {/*<Text style={styles.categoriesInfo}> recipes</Text>*/}
            </View>
        </TouchableHighlight>
    );

    getPetRace = (code, dog) => {
        const data = {
            //Most be like the Csharp func Code!
            raceCode: code,
            isDog: dog
        };
        fetch(URL + '/GetPetRace', {
            method: 'post',
            headers: new Headers({
                'Content-Type': 'application/json;',
            }),
            body: JSON.stringify(data)
        })
            .then(res => {
                console.log('res=', res);
                return res.json()
            })
            .then(
                (result) => {
                    let u = JSON.parse(result.d);
                    if (u != null) {
                        this.setState({ raceName: u }, function () {
                        })
                    }
                    else {
                        Alert.alert('לא הצלחת לשלוף את גזע החיה')
                    }
                },
                (error) => {
                    console.log("err post=", error);
                });
    }
    onPressCategory = item => {
        const title = item.Name;
        const category = item;
        this.setState({ pet: item }, function () {
            this.setState({ userID: item.UserCode }, function () { this.getOwnerPhoneNumber(this.state.userID) });
            this.getPetDetails(item.PetID);
            this.openModal(this.state.pet);
        })
        //this.props.navigation.navigate('RecipesList', { category, title });
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
    navToPublishPet = () => {
        this.props.navigation.navigate("PublishPet");
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
        const buttons = ['חתולים', 'כלבים', 'הצג הכל']
        const { selectedIndex } = this.state
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
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={this.state.modalVisible}
                        onRequestClose={() => {
                            Alert.alert('Modal has been closed.');
                        }}>
                        <View style={styles.modalScreen}>
                            <View>
                                <View style={styles.imagesSlider}>
                                    <View>
                                        <Carousel
                                            slideStyle={{ flex: 1 }}
                                            sliderWidth={500}
                                            sliderHeight={500}
                                            itemWidth={screenWidth - 60}
                                            data={this.createImagesArray(this.state.petDetails)}
                                            renderItem={this.renderItem}
                                            hasParallaxImages={true}
                                            autoplay={false}
                                            autoplayInterval={2000}
                                            loop={false}
                                            marginTop={5} />
                                    </View>
                                    {/*<Image style={{ marginTop:20,width: 250, height: 200, borderRadius: 5 }} source={{ uri: IMAGE_URL + "Pets/" + this.state.modalItem.PetID + "/2.jpg"+ '?time' + new Date() }} />*/}
                                </View>
                                <View style={{ justifyContent: 'center' }}>
                                    <Text style={{ alignSelf: 'center', fontSize: 15, color: 'black' }}>
                                        שם: {this.state.petName + '\n'}
                                        גיל: {this.state.petAge + '\n'}
                                        גזע: {this.state.raceName + '\n'}
                                        מין: {this.state.petGender == 'm' ? 'זכר\n' : 'נקבה\n'}
                                        הערות: {this.state.petVaccines + '\n'}
                                    </Text>
                                    {/*{this.state.OwnerPhoneNumber} --> מס הטלפון של בעל החיה*/}
                                    <Button buttonStyle={{ alignSelf: 'center', width: 90, marginTop: 20, backgroundColor: 'green' }} title='צור קשר' onPress={() => {
                                        Alert.alert(this.state.OwnerPhoneNumber);
                                    }} />
                                    <Button buttonStyle={{ alignSelf: 'center', width: 90, marginTop: 20, backgroundColor: 'blue' }} title='סגור' onPress={() => {
                                        this.setModalVisible(!this.state.modalVisible)
                                    }} />

                                </View>
                            </View>
                        </View>
                    </Modal>
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

                        <View style={styles.uppearScreen}>
                            <ButtonGroup
                                onPress={this.updateIndex}
                                selectedIndex={selectedIndex}
                                buttons={buttons}
                                containerStyle={{ marginTop: 25, height: 40, width: 200 }}
                            />
                            <View style={styles.checkBoxContainer}>
                                <CheckBox style={styles.cb} size={12} checkedIcon='check-square' uncheckedIcon='square' checked={this.state.sortByGender}
                                    onPress={() => this.setState({ sortByGender: !this.state.sortByGender }, function () { this.renderNewTable() })} /><Text style={styles.checkBoxText}>מין</Text>
                                <CheckBox style={styles.cb} size={12} checkedIcon='check-square' uncheckedIcon='square' checked={this.state.sortByAge}
                                    onPress={() => this.setState({ sortByAge: !this.state.sortByAge }, function () { this.renderNewTable() })} /><Text style={styles.checkBoxText}>גיל</Text>
                            </View>
                            <View style={{ marginRight: 50, width: 200 }}>
                                <RNPickerSelect
                                    placeholder={{ label: this.state.indexSpacer + 'הצג הכל', value: null }}
                                    onValueChange={(value) => { this.setState({ petRegion: value }, function () { this.renderNewTable(value) }) }}
                                    items={this.state.regions}
                                />
                            </View>
                        </View>

                        <View style={{ justifyContent: "center", alignItems: "center", flex: 1, flexDirection: "column", top: 20, height: 500 }}>
                            <FlatList
                                data={this.state.data.sort((a, b) => (a.PetID < b.PetID) ? 1 : ((b.PetID < a.PetID) ? -1 : 0))}
                                renderItem={this.renderCategory}
                                keyExtractor={item => `${item.PetID}`}
                                numColumns={2}
                                marginTop={10}

                            />
                            <TouchableOpacity
                                onPress={this.navToPublishPet}
                                style={{ height: 50, width: 50, justifyContent: "center", alignItems: "center", alignSelf: 'center', flexDirection: "column", marginBottom: 30 }}>
                                <Image source={require("../Images/plusIcon.png")} ></Image>
                            </TouchableOpacity>
                        </View>
                    </DrawerLayoutAndroid>
                </View >
            </ImageBackground>
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
        flex: 1,
        backgroundColor: '#fffff0',
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

