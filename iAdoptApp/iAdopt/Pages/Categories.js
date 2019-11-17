import React from 'react';
import { ImageBackground, Text, View, Image, Dimensions, StyleSheet, DrawerLayoutAndroid, Modal, ToolbarAndroid, ScrollView, TouchableOpacity, TouchableHighlight, FlatList, AsyncStorage, Alert } from 'react-native';
import Carousel, { ParallaxImage, Pagination } from 'react-native-snap-carousel';
import RNPickerSelect from 'react-native-picker-select';
import { Button } from "react-native-elements";
const URL = "http://ruppinmobile.tempdomain.co.il/site02/WebService.asmx";
const IMAGE_URL = "http://ruppinmobile.tempdomain.co.il/site02/ImageStorage/";

const { width: screenWidth } = Dimensions.get('window')

export default class Categories extends React.Component {

    componentDidMount() {
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

        AsyncStorage.getItem("categoryNum", (err, result) => {
            if (result != null) {
                this.setState({ category: result }, function () {
                    console.log('Category: ' + this.state.category)
                });
            }
        });

        try {
            this.loadPage();
        } catch (error) {
            console.log("error: ", error);
        }
    }

    FetchTable = (Code) => {
        const data = {
            CatID: Code
        }
        fetch(URL + "/GetCategoryTable", {
            method: "post",
            headers: new Headers({
                "Content-Type": "application/json;"
            }),
            body: JSON.stringify(data)
        }).then(res => {
            return res.json();
        }).then(result => {
            console.log(JSON.stringify(result));
            let r = JSON.parse(result.d);
            //Alert.alert("retrieveRegionsTable:\n"+r);
            if (r != null) {
                this.setState({ folderName: 'Category/' + Code + '/' }, function () { this.setState({ data: r, filteredData: r }); });
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
            userName: '',
            userEmail: '',
            profilePic: '',
            regions: [],
            categoryRegion: 0,
            category: -1,
            folderName: '',
            categoryDetails: {
                ID: 0,
                CategoryCode: 0,
                Gallery: ["1.jpg", "2.jpg", "3.jpg"]
            },
            data: [],
            filteredData: [],
            indexSpacer: '\xa0\xa0\xa0\xa0\xa0\xa0\xa0',
            //Modal
            modalVisible: false,
            modalItem: {},
        }
        this._renderItem = this._renderItem.bind(this);
        this.onPress = this.ImagePress.bind(this);
    };
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
            this.FetchTable(parseInt(this.state.category));


        }, error => {
            console.log("err post=", error);
        }).catch(function (error) {
            console.log('There has been a problem with your fetch operation: ' + error.message);
            // ADD THIS THROW error
            //throw error;
        });
    }


    getCategoryDetails = (item_key) => {
        console.log("item_key: ", item_key);
        const data = {
            key: item_key
        }
        fetch(URL + '/GetCategoryDetails', {
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
                        this.setState({
                            categoryName: u.Name, categoryDescription: u.Description, categoryPhone: u.Phone, categoryAddress: u.Address,
                            category: u, categoryID: u.ID, categoryDetails: u
                        }, function () { console.log("categoryDetails: ", this.state.categoryDetails), this.openModal(this.state.categoryDetails) })

                    }
                    else {
                        Alert.alert('בעיה עם שליפת קטגוריה')
                    }
                },
                (error) => {
                    console.log("err post=", error);
                });
    }
    openModal(item) {
        this.setState({ modalItem: item });
        this.setModalVisible(true);
    }
    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
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

    createImagesArray = (category) => {
        let images = new Array();
        for (i = 0; i < 3; i++) {
            //category.Gallery[i]
            let url = IMAGE_URL + "Category/" + category.CategoryCode + "/" + category.ID + "/" + category.Gallery[i] + '?time' + new Date();
            images.push(url);
        }
        return images;
    }
    renderCategory = ({ item }) => (
        <TouchableHighlight underlayColor='rgba(255,255,255,0.4)' onPress={() => this.getCategoryDetails(item.ID)} style={{ width: "50%" }}>
            <View style={styles.categoriesItemContainer}>
                <Image style={styles.categoriesPhoto} source={{ uri: IMAGE_URL + "Category/" + item.CategoryCode + "/" + item.ID + "/1.jpg" + '?time' + new Date() }} />
                <Text style={styles.categoriesName}>{item.Name}</Text>
                {/*<Text style={styles.categoriesInfo}> recipes</Text>*/}
            </View>
        </TouchableHighlight>
    );
    // onPressCategory = item => {
    //     console.log("item.ID: ",item.ID);
    //     this.getCategoryDetails(item.ID);
    // }

    filterByArea = (value) => {
        if (value != null) {
            this.setState({ filteredData: this.state.data.filter(item => { return item.RegionCode == value }) });
        } else {
            this.setState({ filteredData: this.state.data });
        }
        //this.setState({ categoryRegion: value })
    }
    //Drawer Navigation Section
    deleteAsyncStorage = async () => {
        AsyncStorage.clear();
        Alert.alert('התנתקת בהצלחה מהמערכת');
        this.navToLogin();
    }
    navToPetsPage = () => {
        this.props.navigation.navigate("PetsPage");
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
                        onPress={() => this.FetchTable(6)}>
                        <Image source={require("../Images/store.png")} style={styles.menuIcos}></Image>
                        <Text style={styles.menuText}>   חנויות </Text>
                    </TouchableOpacity>
                    < TouchableOpacity style={{ margin: 15, fontSize: 15, textAlign: 'left', flexDirection: "row" }}
                        onPress={() => this.FetchTable(7)}>
                        <Image source={require("../Images/doctor.png")} style={styles.menuIcos}></Image>
                        <Text style={styles.menuText}>   וטרינרים</Text>
                    </TouchableOpacity>
                    < TouchableOpacity style={{ margin: 15, fontSize: 15, textAlign: 'left', flexDirection: "row" }}
                        onPress={() => this.FetchTable(2)}>
                        <Image source={require("../Images/forest.png")} style={styles.menuIcos}></Image>
                        <Text style={styles.menuText}>   פארקים</Text>
                    </TouchableOpacity>
                    < TouchableOpacity style={{ margin: 15, fontSize: 15, textAlign: 'left', flexDirection: "row" }}
                        onPress={() => this.FetchTable(4)}>
                        <Image source={require("../Images/treking.png")} style={styles.menuIcos}></Image>
                        <Text style={styles.menuText}>   מסלולים</Text>
                    </TouchableOpacity>
                    < TouchableOpacity style={{ margin: 15, fontSize: 15, textAlign: 'left', flexDirection: "row" }}
                        onPress={() => this.FetchTable(8)}>
                        <Image source={require("../Images/dogsitter.png")} style={styles.menuIcos}></Image>
                        <Text style={styles.menuText}>   דוגיסיטרים</Text>
                    </TouchableOpacity>
                    < TouchableOpacity style={{ margin: 15, fontSize: 15, textAlign: 'left', flexDirection: "row" }}
                        onPress={() => this.FetchTable(3)}>
                        <Image source={require("../Images/zimmer.png")} style={styles.menuIcos}></Image>
                        <Text style={styles.menuText}>   צימרים</Text>
                    </TouchableOpacity>
                    < TouchableOpacity style={{ margin: 15, fontSize: 15, textAlign: 'left', flexDirection: "row" }}
                        onPress={() => this.FetchTable(5)}>
                        <Image source={require("../Images/kennel.png")} style={styles.menuIcos}></Image>
                        <Text style={styles.menuText}>   פנסיונים</Text>
                    </TouchableOpacity>
                    < TouchableOpacity style={{ margin: 15, fontSize: 15, textAlign: 'left', flexDirection: "row" }}
                        onPress={() => this.FetchTable(1)}>
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
            <ImageBackground source={require("../Images/screen.png")} style={{ width: '100%', height: '100%', }}>
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
                                            data={this.createImagesArray(this.state.categoryDetails)}
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
                                    <Text style={{ alignSelf: 'center', fontSize: 15, color: 'white' }}>

                                    </Text>
                                    <Button buttonStyle={{ alignSelf: 'center', width: 90, marginTop: 20, backgroundColor: 'green' }} title='קבל מסלול' onPress={() => {
                                         Alert.alert(this.state.categoryAddress)
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
                        statusBarBackgroundColor='#FFFFFF' ref={_drawer => (this.drawer = _drawer)} drawerPosition={DrawerLayoutAndroid.positions.left}>
                        <View>
                            <ToolbarAndroid style={styles.toolbar} navIcon={require('../Images/tIcon.png')} onIconClicked={this.openDrawer} />
                        </View>
                        <View style={{ width: '100%' }}>
                            <Image source={require("../Images/Shadow.png")} style={{ width: '100%', resizeMode: 'cover', height: 50 }}></Image>
                        </View>

                        <View style={{ alignSelf: 'center', marginRight: 50, width: 200 }}>
                            <RNPickerSelect
                                placeholder={{ label: this.state.indexSpacer + 'הצג הכל', value: null }}
                                onValueChange={(value) => { this.filterByArea(value) }}
                                items={this.state.regions}
                            />
                        </View>


                        <View style={{ justifyContent: "center", alignItems: "center", flex: 1, flexDirection: "column", top: 20 }}>
                            <FlatList
                                data={this.state.filteredData}
                                renderItem={this.renderCategory}
                                keyExtractor={item => `${item.ID}`}
                                numColumns={2}
                                marginTop={10} />
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
    modalScreen: {
        flex: 1,
        backgroundColor: 'orange',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    imagesSlider: {
        flexDirection: 'row',
        textAlign: 'center',
        justifyContent: 'center',
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

