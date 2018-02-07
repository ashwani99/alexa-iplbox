import React, { Component } from 'react';

import { AppRegistry, StyleSheet, Image, BackHandler } from 'react-native';
import {
    Text,
    View,
    Container,
    Button,
    Header,
    Footer,
    Content,
    Body,
    Left,
    Right,
    Card,
    CardItem,
    Thumbnail,
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Icon from 'react-native-vector-icons/FontAwesome';
window.navigator.userAgent = 'react-native';
import Moment from 'react-moment';

export default class MainScreen extends Component {

    constructor(props) {
        super(props);

        this.getData();
        this.state = { logsList: [] };
        this.LogData = [];
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


    render() {
        let { state } = this;
        return (
            <Container>
                <Header style={{ marginTop: 24, backgroundColor: '#154360' }} >
                    <Left>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#ffffff' }} >
                            IPLBox
                        </Text>
                    </Left>
                    <Body />
                    <Right />
                </Header>
                <Content>
                    {state.logsList.map((singleQuery, i) => (
                        <Card key={i}>
                            <CardItem >
                                <Left>
                                    <Thumbnail source={require('./imgs/User.png')} style={styles.title_thumbnail} />
                                    <Text style={styles.title_text} >
                                        Query
                                </Text>
                                </Left>
                                <Body />
                                <Right style={styles.time_style} >
                                    <Thumbnail source={require('./imgs/Time.png')} style={styles.time_thumbnail} />
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
                                    <Thumbnail source={require('./imgs/AlexaIPL.png')} style={styles.title_thumbnail} />
                                    <Text style={styles.title_text}> Response </Text>
                                </Left>
                                <Body />
                                <Right style={styles.time_style}>
                                    <Thumbnail source={require('./imgs/Time.png')} style={styles.time_thumbnail} />
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
                                    <Thumbnail source={require('./imgs/ResponseTime.png')} style={styles.title_thumbnail} />
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

