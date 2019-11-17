import React from 'react';
import { ImageBackground, Text, View, Image, Dimensions, StyleSheet, DrawerLayoutAndroid, ToolbarAndroid, ScrollView, TouchableOpacity, TouchableHighlight, FlatList, AsyncStorage, Alert } from 'react-native';
import Carousel, { ParallaxImage, Pagination } from 'react-native-snap-carousel';
const URL = "http://ruppinmobile.tempdomain.co.il/site02/WebService.asmx";
const IMAGE_URL = "http://ruppinmobile.tempdomain.co.il/site02/ImageStorage/";
import {NavigationEvents} from 'react-navigation';

const { width: screenWidth } = Dimensions.get('window')

export default class Home extends React.Component {

    componentDidMount() {
        AsyncStorage.getItem("user", (err, result) => {
            if (result != null) {
                this.setState({ user: JSON.parse(result) });
                if (this.state.user.UserImage != null)
                    this.setState({
                        profilePic: IMAGE_URL + this.state.user.UserImage,
                        userName: this.state.user.UserName,
                        userEmail: this.state.user.Email,
                    }, function () { console.log('HomePage - User', this.state.user), this.getCategoryTypes() });
            }
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
            //Categories
            categoryTypes: [],
            images: [
                {
                    name: "אלפא דוג",
                    photo_url: IMAGE_URL + 'Category/6/' + 39 + "/1.jpg" + '?time' + new Date()
                },
                {
                    name: 'זלאטן בחבורה',
                    photo_url: IMAGE_URL + 'Category/1/' + 20 + "/1.jpg" + '?time' + new Date()
                },
                {
                    name: 'שריטה',
                    photo_url: IMAGE_URL + 'Pets/' + 5 + "/3.jpg" + '?time' + new Date()
                },
                {
                    name: 'ביסלי',
                    photo_url: IMAGE_URL + 'Pets/' + 3 + "/1.jpg" + '?time' + new Date()
                },
                {
                    name: 'צימר יערות הדבש שבגליל',
                    photo_url: IMAGE_URL + 'Category/3/' + 10 + "/1.jpg" + '?time' + new Date()
                }
            ],
        }
        this._renderItem = this._renderItem.bind(this);
        this.onPress = this.ImagePress.bind(this);
    };


    getCategoryTypes = () => {
        fetch(URL + "/GetCategoriesTypes", {
            method: "post",
            headers: new Headers({
                "Content-Type": "application/json;"
            }),
            body: ''//JSON.stringify()
        }).then(res => {
            return res.json();
        }).then(result => {
            let c = JSON.parse(result.d);
            if (c != null) {
                this.setState({ categoryTypes: c }, function () { })

            } else {
                alert('error');
            }
        }, error => {
            console.log("err post(categories types)=", error);
        }).catch(function (error) {
            console.log('There has been a problem with your fetch operation: ' + error.message);
        });
    }

    renderCategory = ({ item }) => (
        <TouchableHighlight underlayColor='rgba(255,255,255,0.4)' onPress={() => this.onPressCategory(item)} style={{ width: "50%" }}>
            <View style={styles.categoriesItemContainer}>
                <Image style={styles.categoriesPhoto} source={{ uri: IMAGE_URL + item.CategoryImage + '?time' + new Date() }} />
                <Text style={styles.categoriesName}>{item.CategoryName}</Text>
                {/*<Text style={styles.categoriesInfo}> recipes</Text>*/}
            </View>
        </TouchableHighlight>
    );
    onPressCategory = item => {
        this.selectedCategory(item.CategoryID);
    }
    openDrawer() {
        this.drawer.openDrawer();
    }
    ImagePress() {
        Alert.alert('implement nav');
    }
    _renderItem({ item, index }, parallaxProps) {
        return (
            <View>
                <TouchableOpacity onPress={this.onPress} >
                    <View style={{ width: screenWidth - 60, height: screenWidth - 210 }}  >
                        <ParallaxImage
                            source={{ uri: item.photo_url }}
                            containerStyle={{ flex: 1, borderRadius: 30 }}
                            parallaxFactor={0.4}
                            {...parallaxProps}

                        />
                    </View>
                </TouchableOpacity>
                <View>
                    <Pagination
                        activeDotIndex={index}
                        dotsLength={this.state.images.length}
                        inactiveDotColor={"black"}
                        dotColor={'rgba(210, 41, 72, 1.0)'}
                        inactiveDotOpacity={0.6}
                        inactiveDotScale={0.60}
                        dotContainerStyle={{ width: "3%" }}
                        containerStyle={{ width: "100%", height: "1%" }}
                    >
                    </Pagination>
                </View>
            </View>

        );
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
        <NavigationEvents onDidFocus={() => console.log('I am triggered')} />
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
                        statusBarBackgroundColor='#FFFFFF' ref={_drawer => (this.drawer = _drawer)}
                        DrawerLayoutAndroid={DrawerLayoutAndroid.positions.Left}
                    >
                        <View>
                            <ToolbarAndroid style={styles.toolbar} navIcon={require('../Images/tIcon.png')} onIconClicked={this.openDrawer} />
                        </View>
                        <View style={{ width: '100%' }}>
                            <Image source={require("../Images/Shadow.png")} style={{ width: '100%', resizeMode: 'cover', height: 50 }}></Image>
                        </View>
                        <View style={{ height: 187 }}>
                            <Carousel
                                sliderWidth={screenWidth}
                                sliderHeight={screenWidth}
                                itemWidth={screenWidth - 60}
                                data={this.state.images}
                                renderItem={this._renderItem}
                                hasParallaxImages={true}
                                autoplay={true}
                                autoplayInterval={2000}
                                loop={true}
                                marginTop={5} />
                        </View>
                        <View style={{ justifyContent: "center", alignItems: "center", flex: 1, flexDirection: "column",marginBottom:15 }}>
                            <FlatList
                                data={this.state.categoryTypes}
                                renderItem={this.renderCategory}
                                keyExtractor={item => `${item.CategoryID}`}
                                numColumns={2}
                                marginTop={10} />
                        </View>
                        <TouchableOpacity
                            onPress={this.navToPets}
                            style={{ height: 50, width: screenWidth, /*borderRadius: 32,*/ backgroundColor: "#fff", justifyContent: "center", alignItems: "center", flexDirection: "row", marginTop: -15, paddingBottom: 15 }}>
                            <Image source={require("../Images/dogIcon.png")} ></Image>
                            <Text style={{ fontSize: 20, fontWeight: "400" }}>  אמץ בעל חיים</Text>
                        </TouchableOpacity>
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
    categoriesItemContainer: {
        flex: 1,
        backgroundColor:'white',
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
    menuIcos: {
        width: 25,
        height: 26
    },
    menuText: {
        fontSize: 16
    }
});

