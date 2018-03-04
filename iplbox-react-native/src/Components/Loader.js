import React, { Component } from "react";
import { StyleSheet, Image, Text, View } from 'react-native';

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // flexDirection: 'column',
        // backgroundColor: 'gray',
        paddingTop: 10

    },
});


import { Container } from "native-base";
import { Col, Row, Grid } from 'react-native-easy-grid';

export default class Progress extends Component {

    constructor(props) {
        super(props);

        this.state = {
            message: "",
            image: "",
            submessage: "",
            selected: 0
        }
    }

    static defaultProps = {
        callback: () => { },
        repeat: true
    }


    componentDidMount() {

        this.intervalData = setInterval(() => {
            if (this.props.data.length > this.state.selected) {
                let selected = this.state.selected + 1;
                this.setState({
                    ...this.props.data[selected - 1],
                    selected
                });
            } else {
                if (!this.props.repeat) {
                    this.props.callback();
                    clearInterval(this.intervalData);
                } else {
                    let selected = 1;

                    this.setState({
                        ...this.props.data[selected - 1],
                        selected
                    });
                }
            }
        }, 2000);
    }
    componentWillUnmount() {
        clearInterval(this.intervalData);
    }

    render() {
        const { message, image, submessage } = this.state;
        return (
            <Grid>
                <Col style={styles.container}>
                    {message ?
                        <Text style={{ fontSize: 55, fontWeight: 'bold', color: 'gray' }}>
                            {message}
                        </Text>
                        : <View />}

                    {image ?
                        <Image source={image} />
                        : <View />}
                    {submessage ?
                        <Text style={{ color: 'gray', maxWidth: 500, fontSize: 22, textAlign: 'center', padding: 10 }}>
                            {submessage}
                        </Text>
                        : <View />}
                </Col>
            </Grid>
        );
    };
}
