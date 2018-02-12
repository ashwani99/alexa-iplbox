import React,{Component} from 'react';

import {AppRegistry,StyleSheet,Image,BackHandler} from 'react-native';
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
import io from '../node_modules/socket.io-client/dist/socket.io'
//import api from './utilities/api';
import Moment from 'react-moment';

export default class MainScreen extends Component
{   
    constructor(){
        super();
       this.state={
         timestamp:'',
         query_text:'',
         answer:'',
         response_time:'',
         is_error_occured:'',

        /*  query_text_array:[],
         timestamp_array:['one'],
         answer_array:['two'],
         response_time_array:['three'] */
       }
    
      }
    


      async getData(){
        var url='http://bot.defect94.hasura-app.io/logs';
        fetch(url)
        .then((res)=>res.json())
        .then((res)=>
    {
        this.setState({
            timestamp:res.timestamp,
            query_text:res.query_text,
            answer:res.answer,
            response_time:res.response_time,
            is_error_occured:res.is_error_occured,
        })
    })

    .catch((error) => {
        console.error(error);
    });

      }
      
      componentDidMount(){
        this.timer = setInterval(()=> this.getData(), 1000)
       }
    
    render()
    {
        
        return(
            <Container>
                {console.log('working')}
                
                {console.log('query_text: ',this.state.query_text)}
                {console.log('answer: ',this.state.answer)}
                {console.log('response_time: ',this.state.response_time)}
                {console.log('timestamp: ',this.state.timestamp)}
                {console.log('is_error_occured: ',this.state.is_error_occured)}

                {/* {console.log('query_text_array',this.state.query_text_array)} 
                {console.log('answer_array',this.state.answer_array)} 
                {console.log('timestap_array',this.state.timestamp_array)} 
                {console.log('respnse_time_array',this.state.response_time_array)} 
                {console.log(this.state.query_text_array.length)}
                {console.log(this.state.timestamp)} */}


                <Header style={{marginTop:24,backgroundColor:'#154360'}} >
                    <Left>
                        <Text style={{fontSize:18,fontWeight:'bold',color:'#ffffff'}} >
                            IPLBox
                        </Text>
                    </Left>
                    <Body/>
                    <Right/>
                </Header>
                <Content>

                    
                   { <Card>
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
                                <Text style={styles.time_text} > {this.state.timestamp} </Text>
                            </Right>
                        </CardItem>
                        <CardItem style={styles.answer_item} >
                            <Text style={styles.answer_text} >
                               {this.state.query_text}
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
                                <Text style={styles.time_text} > {this.state.timestamp}</Text>
                            </Right>
                        </CardItem>
                        <CardItem style={styles.answer_item} >
                            <Text style={styles.answer_text} >
                              {this.state.answer}
                            </Text>
                        </CardItem>
                        <CardItem >
                            <Left>
                                <Thumbnail source={require('./imgs/ResponseTime.png')} style={styles.title_thumbnail} />
                                <Text style={styles.title_text} >
                                    Response Time :
                                </Text>
                                <Text style={styles.answer_text} > {this.state.response_time} seconds  </Text>
                            </Left>
                        </CardItem>

                    </Card>}

                    {/* <Card>
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
                                <Text style={styles.time_text} > 20:23:31 </Text>
                            </Right>
                        </CardItem>
                        <CardItem style={styles.answer_item} >
                            <Text style={styles.answer_text} >
                                Alexa, ask IPLBox who has the highest ?
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
                                <Text style={styles.time_text} > 20:23:32 </Text>
                            </Right>
                        </CardItem>
                        <CardItem style={styles.answer_item} >
                            <Text style={styles.error_text} >
                                Error Slot Missing from the utterance!
                            </Text>
                        </CardItem>
                        <CardItem >
                            <Left>
                                <Thumbnail source={require('./imgs/ResponseTime.png')} style={styles.title_thumbnail} />
                                <Text style={styles.title_text} >
                                    Response Time :
                                </Text>
                                <Text style={styles.answer_text} > 1 second </Text>
                            </Left>
                        </CardItem>

                    </Card> */}
                    
                </Content>
            </Container>

        );
    }
}
const styles = StyleSheet.create({

    title_thumbnail:{width:15,height:15},
    title_text:{fontSize:15,fontWeight:'bold'},
    time_style:{flexDirection:'row',justifyContent:'flex-end'},
    time_thumbnail:{width:10,height:10,marginRight:5},
    time_text:{fontSize:10},
    answer_item:{paddingTop:0},
    answer_text:{fontSize:16},
    error_text:{fontSize:16,color:'red'}
  });

  