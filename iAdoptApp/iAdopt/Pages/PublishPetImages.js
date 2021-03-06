import React from 'react';
import { ImageBackground, Text, View, Image, Dimensions, StyleSheet, DrawerLayoutAndroid, ToolbarAndroid, ScrollView, TouchableOpacity,AsyncStorage, Alert } from 'react-native';
import { ParallaxImage } from 'react-native-snap-carousel';
import * as ImagePicker from "expo-image-picker";
import { Button} from "react-native-elements";
const URL = "http://ruppinmobile.tempdomain.co.il/site02/WebService.asmx";
const IMAGE_URL = "http://ruppinmobile.tempdomain.co.il/site02/ImageStorage/";

const { width: screenWidth } = Dimensions.get('window')

export default class PublishPetsImages extends React.Component {

    async componentDidMount() {
        AsyncStorage.getItem("user", (err, result) => {
            if (result != null) {
                this.setState({ user: JSON.parse(result) });
                if (this.state.user.UserImage != null)
                    this.setState({
                        profilePic: IMAGE_URL + this.state.user.UserImage,
                        userName: this.state.user.UserName,
                        userEmail: this.state.user.Email,
                    });
            }
        });
        AsyncStorage.getItem("thisPet", (err, result) => {
            this.setState({ thisPet: JSON.parse(result) });
            console.log("thisPet: ", this.state.thisPet);
        });
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
            //Images
            img_1: IMAGE_URL + 'no_pet_image.png',
            img_2: IMAGE_URL + 'no_pet_image.png',
            img_3: IMAGE_URL + 'no_pet_image.png',
            //PetDetails
            isDog: true,
            petName: 'null',
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

    renderItem({ item, index }, parallaxProps) {
        return (
            <View style={{ width: screenWidth - 60, height: screenWidth - 210 }} >
                <ParallaxImage
                    
                    source={{ uri: IMAGE_URL + "Pets/" + item.PetID + "/" + 1 + ".jpg" + '?time' + new Date() }}
                    containerStyle={{ flex: 1, borderRadius: 30 }}
                    parallaxFactor={0.4}
                    {...parallaxProps}
                />
            </View>
        );
    }



    btnOpenGallery = async (value) => {
        console.log("value: ", value);
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
                imgType: 'jpg'
            });
            this.showImgUrl(value);
        }
    };
    showImgUrl = (value) => {
        const data = {
            petID: this.state.thisPet.PetID,
            base64: this.state.base64,
            imageName: value,
            imageType: this.state.imgType
        }
        console.log(data);
        fetch(URL + '/SavePetImage', {
            method: 'post',
            headers: new Headers({
                'Content-Type': 'application/json;',
            }),
            body: JSON.stringify(data)
        }).then(res => {
            return res.json()
        }).then((result) => {
            switch (value) {
                case 1:
                    this.setState({ img_1: IMAGE_URL + 'Pets/' + data.petID + '/1.jpg' })
                    break;
                case 2:
                    this.setState({ img_2: IMAGE_URL + 'Pets/' + data.petID + '/2.jpg' })
                    break;
                case 3:
                    this.setState({ img_3: IMAGE_URL + 'Pets/' + data.petID + '/3.jpg' })
                    break;
                default:
                    break;
            }

        },
            (error) => {
                console.log("err post=", error);
            });
    }

    uploadPet = () => {
        if (this.state.img_1 != IMAGE_URL + 'no_pet_image.png' || this.state.img_2 != IMAGE_URL + 'no_pet_image.png' || this.state.img_3 != IMAGE_URL + 'no_pet_image.png') {
            this.navToHome();
        } else {
            Alert.alert('הינך חייב להעלות תמונה אחת לפחות של החיה');
        }

    }

    //Drawer Navigation Section
    deleteAsyncStorage = async () => {
        AsyncStorage.clear();
        Alert.alert('התנתקת בהצלחה מהמערכת');
        this.navToLogin();
    }
    navToHome = () => {
        this.props.navigation.navigate("Home");
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
                            <View style={styles.imagesRowView}>
                                <TouchableOpacity style={{ marginLeft: 5 }} onPress={() => this.btnOpenGallery(1)}><Image style={{ width: 110, height: 110 }} source={{ uri: this.state.img_1 + '?time' + new Date() }} /></TouchableOpacity>
                                <TouchableOpacity style={{ marginLeft: 5 }} onPress={() => this.btnOpenGallery(2)}><Image style={{ width: 110, height: 110 }} source={{ uri: this.state.img_2 + '?time' + new Date() }} /></TouchableOpacity>
                                <TouchableOpacity style={{ marginLeft: 5 }} onPress={() => this.btnOpenGallery(3)}><Image style={{ width: 110, height: 110 }} source={{ uri: this.state.img_3 + '?time' + new Date() }} /></TouchableOpacity>
                            </View>
                            <View style={{ position: 'absolute', right: 120, left: 120, top: 425, bottom: 0 }}>
                                <Button buttonStyle={{ backgroundColor: 'orange' }} title='סיים' onPress={this.uploadPet} />
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
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    viewRow: {
        flexDirection: 'row'
    },
    imagesRowView: {
        flexDirection: 'row',
        margin: 10
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

