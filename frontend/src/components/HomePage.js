import React, { Component } from 'react'
import RoomJoinPage from './RoomJoinPage'
import CreateRoom from './CreateRoomPage'
import Room from './Room'
import {Grid, Button, ButtonGroup, Typography} from '@material-ui/core'
 
import { BrowserRouter as Router, Route, Switch,Link,Redirect } from 'react-router-dom';


export default class HomePage extends Component{
    constructor(props){
        super(props)
        this.state ={
            roommCode: null,
        };
        this.clearRoomCode =this.clearRoomCode.bind(this);
    }


    async componentDidMount(){
        fetch('/api/user-in-room')
        .then((response) => response.json())
        .then((data) => {
            this.setState({
                roomCode: data.code
            })
        });

    }


    renderHomePage(){
        return(
            <Grid container spacing={3}>
                <Grid item xs={12} align="center">
                    <Typography variant="h3"component="h3">
                        House Party
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <ButtonGroup disableElevation variant="contained" color="primary">
                        <Button color="primary" to='/join' component={Link}>
                            Join a Room
                        </Button>

                        <Button color="secondary" to='/create' component={Link}>
                            Create a Room
                        </Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
        );

    }

// This sets the roomcode 
// to null so that at anpoint when you leave a room it will
//  redirect you to the homePage instead of trying to enter the room again
clearRoomCode() {
    this.setState({
        roomCode: null,
    });
}

    render(){
        return(
            <Router>
                <Switch>
                    <Route exact path='/' render={() =>{
                        return this.state.roommCode ? 
                        (<Redirect to={`/room/${this.state.roommCode}`}/>) : (this.renderHomePage());
                    }}

                    /> 
                    
                    <Route path='/join' component={RoomJoinPage}/>
                    <Route  path='/create' component={CreateRoom} />
                    <Route
                        path="/room/:roomCode" 
                        render={(props) => {
                            return <Room {...props} leaveRoomCallback={this.clearRoomCode} />; 
                        }}
                    />
                </Switch>
            </Router>
        )
    }

} 