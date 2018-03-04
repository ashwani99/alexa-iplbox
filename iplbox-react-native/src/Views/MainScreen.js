import React, { Component } from 'react';

import { AppRegistry, StyleSheet, Image, BackHandler } from 'react-native';
import {
    Text, View, Container, Button,
    Header, Footer, Content, Body,
    Left, Right, Card, CardItem,
    Thumbnail, Toast, Fab, Icon
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
// import Icon from 'react-native-vector-icons/Ionicons';

window.navigator.userAgent = 'react-native';
import Moment from 'react-moment';
import {
    MenuProvider,
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from "react-native-popup-menu";
import isEmpty from "lodash/isEmpty";
import { Icons, LogoSvg } from "./../Assets";
import { Loader } from "./../Components";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Auth } from "./../Resource";

const dataLoader = [
    { message: "IPLBox", image: Icons.AlexaIPL, submessage: "" },
    {
        message: "",
        image: Icons.Cricket,
        submessage: `IPLBrainz is an application that answers any queries related to IPL matches with the help of your voice assistant Alexa`
    },
    {
        message: "",
        image: Icons.MicroHuman,
        submessage: `You can ask Alexa your query related to IPL by saying “Alexa start IPLbrain..” followed by your Question`
    }
];
class MainScreen extends Component {

    constructor(props) {
        super(props);

        this.getData();
        this.state = {
            logsList: [],
            active: 'true',
            showToast: 'false'
        };
        this.LogData = [
            // {
            //     timestamp: "1000",
            //     answer: "Alexa",
            //     query_text: "What is your lovers name",
            //     response_time: "1000"
            // }
        ];
    }

    getData = () => {
        setTimeout(() => {
            fetch("https://bot.defect94.hasura-app.io/logs")
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error('Network response was not ok.');
                })
                .then((response) => {
                    if (!isEmpty(this.LogData)) {
                        if (response.timestamp !== this.LogData[0].timestamp && !isEmpty(response.timestamp))
                            this.LogData.unshift(response);
                    } else {
                        this.LogData.unshift(response);
                    }

                    this.setState({ logsList: this.LogData });
                    this.getData();
                }).catch((err) => {
                    this.getData();
                });
        }, 1000);
    }

    handleClearLog = () => {

        this.setState({ logsList: [] });
        console.log('Array Cleared')
    };

    handleLogout = () => {
        this.props.actions.logoutAuth();
    };
    render() {
        let { state } = this;
        return (
            <MenuProvider>
                <Container>
                    <Header style={{ marginTop: 24, backgroundColor: '#154360' }} >
                        <Left>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#ffffff' }} >
                                IPLBox
                        </Text>
                        </Left>
                        <Body />
                        <Right>
                            <Menu>
                                <MenuTrigger >
                                    <Icon name="menu" />
                                </MenuTrigger >
                                {/* <MenuTrigger text='Select action' > */}
                                <MenuOptions>
                                    <MenuOption onSelect={this.handleClearLog} text='Clear Log' />
                                    <MenuOption onSelect={this.handleLogout} text='Logout' />
                                </MenuOptions>
                            </Menu>
                        </Right >
                    </Header>
                    <Content>
                        {isEmpty(state.logsList) ?
                            <Loader data={dataLoader} /> : <View />}
                        {state.logsList.map((singleQuery, i) => (
                            <Card style={{ margin: 20 }} key={i}>
                                <CardItem >
                                    <Left>
                                        <Thumbnail source={Icons.User} style={styles.title_thumbnail} />
                                        <Text style={styles.title_text} >
                                            Query
                                </Text>
                                    </Left>
                                    <Body />
                                    <Right style={styles.time_style} >
                                        <Thumbnail source={Icons.Time} style={styles.time_thumbnail} />
                                        <Text style={styles.time_text} > {singleQuery.timestamp} </Text>
                                    </Right>
                                </CardItem>
                                <CardItem style={styles.answer_item} >
                                    <Text style={styles.answer_text} >
                                        {singleQuery.query_text}
                                    </Text>
                                </CardItem>
                                <CardItem>
                                    <Left>
                                        <Thumbnail source={Icons.AlexaIPL} style={styles.title_thumbnail} />
                                        <Text style={styles.title_text}> Response </Text>
                                    </Left>
                                    <Body />
                                    <Right style={styles.time_style}>
                                        <Thumbnail source={Icons.Time} style={styles.time_thumbnail} />
                                        <Text style={styles.time_text} > {singleQuery.timestamp}</Text>
                                    </Right>
                                </CardItem>
                                <CardItem style={styles.answer_item} >
                                    <Text style={styles.answer_text} >
                                        {singleQuery.answer}
                                    </Text>
                                </CardItem>
                                <CardItem >
                                    <Left>
                                        <Thumbnail source={Icons.ResponseTime} style={styles.title_thumbnail} />
                                        <Text style={styles.title_text} >
                                            Response Time :
                                </Text>
                                        <Text style={styles.answer_text} > {singleQuery.response_time} seconds  </Text>
                                    </Left>
                                </CardItem>
                            </Card>
                        ))}
                    </Content>
                </Container>
            </MenuProvider>
        );
    }
}
const styles = StyleSheet.create({

    title_thumbnail: { width: 15, height: 15 },
    title_text: { fontSize: 15, fontWeight: 'bold' },
    time_style: { flexDirection: 'row', justifyContent: 'flex-end' },
    time_thumbnail: { width: 10, height: 10, marginRight: 5 },
    time_text: { fontSize: 10 },
    answer_item: { paddingTop: 0 },
    answer_text: { fontSize: 16 },
    error_text: { fontSize: 16, color: 'red' }
});

const mapDispatchToProps = (dispatch) => {
    const { logoutAuth } = Auth;
    return {
        actions: bindActionCreators({
            logoutAuth
        }, dispatch)
    }
};

export default connect(() => ({}), mapDispatchToProps)(MainScreen);