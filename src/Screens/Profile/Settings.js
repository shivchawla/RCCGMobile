import Styles from '@Screen/Member/Settings/Style';
// import Styles from '@Theme/About';
import Style from '@Theme/Style';
import { Accordion, Body, Button, CheckBox, Container, Content, Footer, FooterTab, Icon, ListItem, Text, View } from 'native-base';
import React, { Component } from 'react';
import { Image, ImageBackground, StatusBar, TextInput } from 'react-native';

//const {width, height} = Dimensions.get('window')

export default class ProfileSettings extends Component {

    constructor(props) {
        super(props)

        this.state = {
            gender: null,
            itemId: null
        }

        this.renderAccordionHeader = this.renderAccordionHeader.bind(this)
        this.renderAccordionContent = this.renderAccordionContent.bind(this)

        this.renderAccordionContentProfileUpdate = this.renderAccordionContentProfileUpdate.bind(this)
        this.renderAccordionContentChangePassword = this.renderAccordionContentChangePassword.bind(this)
        this.renderAccordionContentNotifications = this.renderAccordionContentNotifications.bind(this)
        this.renderAccordionContentParishSetup = this.renderAccordionContentParishSetup.bind(this);
    }

    renderAccordionHeader(item, expanded) {
        return (
            <View style={Styles.accordionTab}>
                <Text style={Styles.accordionTabText}>
                    {" "}{item.title}
                </Text>
                {expanded
                    ? <Icon style={Styles.accordionTabIcon} name="minus" type="Foundation" />
                    : <Icon style={Styles.accordionTabIcon} name="plus" type="Foundation" />}
            </View>
        );
    }

    renderAccordionContent(item) {
        var fn = 'renderAccordionContent' + (item.type.charAt(0).toUpperCase() + item.type.substr(1));
        return <View style={Styles.accordionContent}>
            {this[fn]()}
        </View>
    }

    renderAccordionContentProfileUpdate() {
        return <View>
            <TextInput style={Styles.textInput} placeholder={'Current Password'} value={''} />
            <TextInput style={Styles.textInput} placeholder={'New Password'} value={''} />
            <TextInput style={Styles.textInput} placeholder={'Confirm Password'} value={''} />
            <Button style={Styles.btn} onPress={() => {
                this.props.navigation.navigate('MemberHome')
            }}>
                <Text style={Styles.formBtnText}>{'Save'.toUpperCase()}</Text>
                <Icon active name='arrow-right' type="Feather" style={Styles.formBtnIcon} />
            </Button>
        </View>
    }

    renderAccordionContentParishSetup() {
        return <View>
            <TextInput style={Styles.textInput} placeholder={'Current Password'} value={''} />
            <TextInput style={Styles.textInput} placeholder={'New Password'} value={''} />
            <TextInput style={Styles.textInput} placeholder={'Confirm Password'} value={''} />
            <Button style={Styles.btn} onPress={() => {
                this.props.navigation.navigate('MemberHome')
            }}>
                <Text style={Styles.formBtnText}>{'Save'.toUpperCase()}</Text>
                <Icon active name='arrow-right' type="Feather" style={Styles.formBtnIcon} />
            </Button>
        </View>
    }

    renderAccordionContentChangePassword() {
        return <View>
            <TextInput style={Styles.textInput} placeholder={'Current Password'} value={''} />
            <TextInput style={Styles.textInput} placeholder={'New Password'} value={''} />
            <TextInput style={Styles.textInput} placeholder={'Confirm Password'} value={''} />
            <Button style={Styles.btn} onPress={() => {
                this.props.navigation.navigate('MemberHome')
            }}>
                <Text style={Styles.formBtnText}>{'Save'.toUpperCase()}</Text>
                <Icon active name='arrow-right' type="Feather" style={Styles.formBtnIcon} />
            </Button>
        </View>
    }

    renderAccordionContentNotifications() {
        return <View>
            <ListItem>
                <CheckBox style={Styles.notify} checked={false} />
                <Body>
                    <Text style={Styles.notifyText}>When someone enquired property</Text>
                </Body>
            </ListItem>
            <ListItem>
                <CheckBox style={Styles.notifyChecked} checked={true} />
                <Body>
                    <Text style={Styles.notifyText}>When someone contact me</Text>
                </Body>
            </ListItem>
            <Button style={Styles.btn} onPress={() => {
                this.props.navigation.navigate('MemberHome')
            }}>
                <Text style={Styles.formBtnText}>{'Save'.toUpperCase()}</Text>
                <Icon active name='arrow-right' type="Feather" style={Styles.formBtnIcon} />
            </Button>
        </View>
    }

    componentDidMount() {
        const { navigation } = this.props;
        const itemId = navigation.getParam('paramId', 'NO-ID');
        var incomingParam = itemId === 'parish'? 1 : 0
        this.setState({itemId: incomingParam});
        // this.getParishDetail(itemId);
    }

    render() {
        const {itemId} = this.state;

        return <Container style={Style.bgMain}>
            <StatusBar backgroundColor="#7E8BF5" animated barStyle="light-content" />

            <Content style={Style.layoutInner} contentContainerStyle={Style.layoutContent}>

                <View style={Styles.profile}>
                    <ImageBackground source={{ uri: ('https://cdn.stocksnap.io/img-thumbs/960w/ZUAZ22R9AL.jpg') }} imageStyle={'cover'} style={Styles.coverImg}>
                    </ImageBackground>

                    <View style={Styles.bgBlue}>
                    </View>

                    <View style={[Styles.owner, Style.actionBarIn]}>
                        <View style={Styles.ownerBg}>
                            <Image source={{ uri: ('https://ssl.gstatic.com/images/branding/product/1x/android_for_work_settings_512dp.png') }} style={Styles.ownerAvatarImg} />
                        </View>
                        <View style={Styles.ownerInfo}>
                            <Text style={Styles.ownerName}>Settings</Text>
                        </View>
                    </View>

                </View>

                <View style={Styles.formBg}>
                    <Accordion
                        style={Styles.accordion}
                        dataArray={[
                            {
                                type: 'profileUpdate',
                                title: 'Profile Setup',
                            },
                            {
                                type: 'parishSetup',
                                title: 'Parish Setup',
                            },
                            {
                                type: 'changePassword',
                                title: 'Change Password',
                            },
                            {
                                type: 'notifications',
                                title: 'Notifications'
                            },
                        ]}
                        
                        expanded={1}
                        renderHeader={this.renderAccordionHeader}
                        renderContent={this.renderAccordionContent}
                    />
                </View>

            </Content>

            <Footer style={Style.greyTopLine}>
                <FooterTab style={Style.bgBot}>
                    <Button style={Style.bgBot} onPress={() => {
                        this.props.navigation.navigate('PublicHome')
                    }}>
                        <Icon name="home" type="FontAwesome" style={Style.textBlue} />
                    </Button>
                    <Button style={Style.bgBot} onPress={() => {
                        this.props.navigation.navigate('PublicPropertySearch')
                    }}>
                        <Icon name="search" type="Octicons" style={Style.textBlue} />
                    </Button>
                    <Button style={Style.bgBot} onPress={() => {
                        this.props.navigation.navigate('MemberHome')
                    }}>
                        <Icon name="user" type="FontAwesome" style={Style.textActive} />
                    </Button>
                    <Button style={Style.bgBot} onPress={() => {
                        this.props.navigation.navigate('MemberFavorites')
                    }}>
                        <Icon name="heart" type="FontAwesome" style={Style.textBlue} />
                    </Button>
                    <Button style={Style.bgBot} onPress={() => {
                        this.props.navigation.navigate('MemberMessages')
                    }}>
                        <Icon name="bell" type="Entypo" style={Style.textBlue} />
                    </Button>
                </FooterTab>
            </Footer>

        </Container>
    }


}