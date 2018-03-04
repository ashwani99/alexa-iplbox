import React, { Component } from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import {
    Container, Header,
    Content, Tab, Tabs,
    Form, Item, Label,
    Input, Button, Body,
    Title, Left, Right,
    H1
} from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import { Icons, LogoSvg } from "./../Assets";
import { Auth } from "./../Resource";
import { authActions, notifiActions } from "./../Actions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import SVGImage from 'react-native-svg-image';

const styles = StyleSheet.create({ btnText: { color: "white", fontSize: 20, fontWeight: "bold", padding: 5 } });

class Login_Signup extends Component {
    state = {
        username: "",
        password: "",
        repassword: "",
        setPage: 0
    }

    onPageToggle = () => {
        this.props.actions.authPageSet((this.props.page === "login" ? "signup" : "login"));
    };
    componentDidMount() {
        this.props.actions.logoutAuth();
    }
    onLoginHandle = () => {
        this.props.actions.loginAuth({ username: this.state.username, password: this.state.password });
    };

    onSignupHandle = () => {
        this.props.actions.signupAuth({ username: this.state.username, password: this.state.password });
    };

    onHandleInput = (name, value) => {
        let newState = {};
        newState[name] = value;
        this.setState(newState);
    };

    onHandleInputCurry = (name) => {
        return (text) => {
            this.onHandleInput(name, text);
        }
    };

    componentWillReceiveProps(nextState) {
        console.log(nextState.page);
        const setPage = nextState.page === "login" ? 0 : 1;
        this.setState({ setPage });
    }

    render() {
        return (
            <Container>
                <Content>
                    <Grid style={{ backgroundColor: "#3f51b5" }}>
                        <Row>
                            <Col></Col>
                            <Col style={{ minHeight: 200 }}>
                                <View style={{ paddingTop: 20, alignItems: 'center' }}>
                                    <Image source={Icons.AlexaIPL} style={{ width: 200, height: 200, margin: 20 }} />
                                    <H1 style={{ padding: 15, fontWeight: "bold", color: "white" }}>IPL Box</H1>
                                </View>
                            </Col>
                            <Col></Col>
                        </Row>
                        <Row>
                            <Col>
                                <Tabs style={{ backgroundColor: "#154360" }} initialPage={this.state.setPage}>
                                    <Tab heading="Login">
                                        <Form>
                                            <Item><Input onChangeText={this.onHandleInputCurry("username")} placeholder="Username" /></Item>
                                            <Item><Input secureTextEntry onChangeText={this.onHandleInputCurry("password")} placeholder="Password" /></Item>
                                        </Form>
                                        <Button disabled={this.props.isFetchingItem} onPress={this.onLoginHandle} style={{ margin: 15 }} full rounded primary>
                                            <Text style={styles.btnText}> Login </Text>
                                        </Button>
                                    </Tab>
                                    <Tab heading="Signup">
                                        <Form>
                                            <Item><Input onChangeText={this.onHandleInputCurry("username")} placeholder="Username" /></Item>
                                            <Item><Input secureTextEntry onChangeText={this.onHandleInputCurry("password")} placeholder="Password" /></Item>
                                            <Item><Input secureTextEntry onChangeText={this.onHandleInputCurry("repassword")} placeholder="Re-Password" /></Item>
                                        </Form>
                                        <Button disabled={this.props.isCreating} onPress={this.onSignupHandle} style={{ margin: 15 }} full rounded primary>
                                            <Text style={styles.btnText}> Signup </Text>
                                        </Button>
                                    </Tab>
                                </Tabs>
                            </Col>
                        </Row>
                    </Grid>
                </Content>
            </Container>
        );
    };
};

const mapStateToProps = (state) => {
    const { auth, userAuth } = state;
    return {
        page: userAuth.page,
        isFetchingItem: auth.isFetchingItem,
        isCreating: auth.isCreating
    };
};
const mapDispatchToProps = (dispatch) => {
    const { loginAuth, signupAuth, logoutAuth, actions } = Auth;
    const { authPageSet } = authActions;
    return {
        actions: bindActionCreators({
            loginAuth, signupAuth,
            logoutAuth, authPageSet
        }, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Login_Signup);