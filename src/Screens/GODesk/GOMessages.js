import TabNav from '@Component/Common/TabNav';
import Styles from '@Theme/Favorite';
import Style from '@Theme/Style';
import axios from 'axios';
import { Container, Content, Icon, Text } from 'native-base';
import React from 'react';
import { AsyncStorage, FlatList, Image, ImageBackground, TouchableHighlight, View } from 'react-native';
import { config } from '../../helpers';

export default class GOMessages extends React.Component {

  constructor(props) {
    super(props)
  }

  state = {
    GODeskMessages: {},
    GODeskMessagesFound: false
  }

  componentDidMount() {
    this.getGOMessages();
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


  render() {
    const { GODeskMessages, productCartItemNumber } = this.state;

    return <Container style={Style.bgMain}>

      <Content style={Style.layoutInner} contentContainerStyle={Style.layoutContent}>

        <ImageBackground source={require('@Asset/images/property-bg.png')} style={Styles.homeBg}>

          <View style={Styles.section}>
            <FlatList
              data={GODeskMessages}
              style={Styles.item}
              renderItem={({ item, separators }) => (
                <TouchableHighlight underlayColor='transparent' onPress={() => { this.props.navigation.navigate('GOMessageDetail', {itemId: item.id}) }}>
                  <View style={Styles.record}>
                    <Image source={{ uri: item.imageThumbPath }} style={Styles.itemImg} />
                    <View style={Styles.itemInfo}>
                      <Text style={Styles.itemTitle}>{item.topic}</Text>
                      <Text style={Styles.itemLocation}>{item.summary}</Text>
                      <View style={Styles.itemRow}>
                        <View style={Styles.itemOverview}>
                          <Icon name="eye" type="FontAwesome" style={Styles.itemIcon} />
                          <Text style={Styles.itemNo}>{item.viewCount}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableHighlight>
              )}
            />
          </View>


        </ImageBackground>

      </Content>

  
      <TabNav navigation={this.props.navigation}
                    cartValue={productCartItemNumber? productCartItemNumber : 0} 
                    gotoCart={() => this.props.navigation.navigate('ProductCartReview')} 
                />
    </Container>
  }


  getGOMessages = () => {
    axios.get(config.apiUrl + '/api/godesk/messages').then(res => {
      var data = res.data ? res.data : false;

      if (data) {
        this.setState({ GODeskMessages: data });
      }
    }).catch(err => {
      this.setState({ GODeskMessagesFound: false });
    })
  }

  
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