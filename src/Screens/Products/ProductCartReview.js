import TabNav from '@Component/Common/TabNav';
import FavStyles from '@Screen/Member/Favorites/Style';
import Styles from '@Theme/Favorite';
import Style from '@Theme/Style';
import axios from 'axios';
import { Button, Container, Content, Icon } from 'native-base';
import React from 'react';
import { AsyncStorage, FlatList, ImageBackground, Text, ToastAndroid, View } from 'react-native';
import ProductCartRev from '../../Component/Resource/ProductCartRev';
import { config } from '../../helpers';

export default class ProductCartReview extends React.Component {

    constructor(props) {
        super(props)
    }

    state = {
        parishes: {},
        parishesFound: false,
        productString: ''
    }


    onSubtract = (item, index) => {
        const products = [...this.state.productItemLists];
        if (products[index].selQuantity > 1) {
            products[index].selQuantity -= 1;
            this.setState({ productItemLists: products });
        }
    }

    onAdd = (item, index) => {
        const products = [...this.state.productItemLists];
        products[index].selQuantity += 1;
        this.setState({ productItemLists: products });
    }

    onRemove = async (item, index) => {
        const { productItemLists } = this.state;

        newItemList = productItemLists.filter(function (obj) {
            return obj.id !== item.id;
        });

        // Update LS Cart
        let finalResult2 = [];
        newItemList.map(p => { finalResult2.push({ favorite: true, productId: p.id }) });

        this.saveStorageItem('@productCartItemsStore', JSON.stringify(finalResult2));
        this.setState({ productCartItemNumber: finalResult2.length, productItemLists: newItemList });
    }

    async componentDidMount() {
        const userTokenStore = await this.getStorageItem('@userToken');
        const productCartItemsStore = await this.getStorageItem('@productCartItemsStore');
        const userProfileStore = await this.getStorageItem('@userProfileStore');

        if (userProfileStore && userProfileStore !== 'none') {
            const parishCode2 = JSON.parse(userProfileStore);
            const userProfile = JSON.parse(parishCode2);

            this.setState({ userProfile, parishCode: userProfile.division.code });
        }

        if (productCartItemsStore && productCartItemsStore !== 'none') {
            const productCartItems2 = JSON.parse(productCartItemsStore);
            const productCartItems = JSON.parse(productCartItems2);

            this.setState({ productCartItems });
        }

        if (userTokenStore) {
            const userProfile = JSON.parse(userTokenStore);
            this.setState({ userProfile });
        }

        // Get ParishCode
        this.getParisheProducts();
        this.getCartItemNumber();

    }

    async getCartItemNumber() {
        const productCartItemsStore = await this.getStorageItem('@productCartItemsStore');
        if (productCartItemsStore && productCartItemsStore !== 'none') {
            const productCartItems2 = JSON.parse(productCartItemsStore);
            const productCartItems = JSON.parse(productCartItems2);
            this.setState({ productCartItemNumber: productCartItems.length });
        }
    }

    gotoProductDetails = (item, index) => {
        this.props.navigation.navigate('ProductDetail', { item: JSON.stringify(item) });
    }

    render() {

        const { userProfile, parishCode, productItemLists, productCartItemNumber } = this.state;

        let totalQuantity = 0;
        let totalPrice = 0;
        let productCodeString = '';

        if (productItemLists) {            
            productItemLists.forEach((item) => {
                selQuantity = 1;
                totalQuantity += item.selQuantity;
                totalPrice += item.selQuantity * item.item_amount;
            });

            productCodeString = productItemLists.map(m => m.item_code).join(',');

        }

        return <Container style={Style.bgMain}>
            <Content style={Style.layoutInner} contentContainerStyle={Style.layoutContent}>

                <ImageBackground source={require('@Asset/images/property-bg.png')} style={Styles.homeBg}>

                    <View style={FavStyles.section}>

                        <Text>Total Quantity: {totalQuantity}</Text>
                        <Text>Total Price: {totalPrice}</Text>

                        <FlatList
                            data={productItemLists}
                            style={FavStyles.item}
                            renderItem={({ item, index }) => (
                                <ProductCartRev
                                    item={item}
                                    onSubtract={() => this.onSubtract(item, index)}
                                    onAdd={() => this.onAdd(item, index)}
                                    onRemove={() => this.onRemove(item, index)}
                                    gotoProductDetails={() => this.gotoProductDetails(item, index)}
                                />
                            )}
                            keyExtractor={item => item.id}
                        />

                        <Text>Total Quantity: {totalQuantity}</Text>
                        <Text>Total Price: {totalPrice}</Text>


                        <Button style={Styles.btn} titleColor='white' onPress={() => {
                            this.registerPayment(userProfile.email, parishCode, productCodeString, totalPrice, totalQuantity)
                        }}>
                            <Text style={Styles.formBtnText}>{'Process Payment'.toUpperCase()}</Text>
                            <Icon active name="payment" type="MaterialIcons" style={Styles.formBtnIcon} />
                        </Button>

                    </View>

                </ImageBackground>

            </Content>


            <TabNav navigation={this.props.navigation}
                cartValue={productCartItemNumber ? productCartItemNumber : 0}
                gotoCart={() => this.props.navigation.navigate('ProductCartReview')}
            />
        </Container>
    }

    async registerPayment(email, parishCode, productCodeString, totalPrice, totalQuantity) {
        const pcode = parishCode.replace(/"/g, "");

        const { productItemLists } = this.state;
        quantityString = productItemLists.map(m => m.selQuantity).join(',');
        
        var data = `code=${pcode}&itemCodes=${productCodeString}&currency=NGN&amount=${totalPrice}&channel=web&email=${email}&quantities=${quantityString}&type=1`;
        
        return axios
            .post(config.apiBaseUrl + "/transaction/add", data, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            })
            .then(resp => {
                const stackValue = resp.data.data;
                this.props.navigation.navigate('StackSelection', { paydetail: JSON.stringify(resp.data.data.data) })
            })
            .catch(error => {
                ToastAndroid.show('Register Payment: ' + error.message, ToastAndroid.SHORT);
            });
    }


    getParisheProducts() {
        const { productCartItems, parishCode } = this.state;
        ////////////
        let finalResult = [];
        productCartItems.map(c => {
            var entIndx = productCartItems.indexOf(c);
            productCartItems[entIndx].selQuantity = 1;
        });

        this.setState({ productItemLists: productCartItems })

    }



    saveStorageItem = async (key, value) => {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            ToastAndroid.showWithGravityAndOffset(error.message, ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
        }
    };

    getStorageItem = async (key) => {
        let result = '';
        try {
            result = await AsyncStorage.getItem(key) || 'none';
        } catch (error) {
            ToastAndroid.showWithGravityAndOffset(error.message, ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
        }

        return result;
    }
}