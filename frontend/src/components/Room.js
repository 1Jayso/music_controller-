import React, { Component } from 'react';
import { Grid, Button, Typography } from '@material-ui/core';
import HomePage from "./HomePage"

export default class Room extends Component{
    constructor(props){
        super(props);
        this.state = {
            votesToskip: 2,
            guestCanPause: false,
            isHost: false,

        };
        this.roomCode = this.props.match.params.roomCode;
        this.getRoomDetails();
        this.leaveButtonPressed = this.leaveButtonPressed.bind(this);

    }

    // this function displays the Room details
    getRoomDetails(){
        fetch('/api/get-room' + '?code=' +this.roomCode).then((response) => {
            // The if statement checks if response doesn't return data so that it will 
            // redirect the user to the homepage instead of empty data 
            //  fields in the browser.
            if (!response.ok){
                this.props.HomePage.leaveRoomCallback();
                this.props.history.push('/'); 
            }
        
        response.json()})
        .then((data) => {
            this.setState({
                votesToskip: data.votes_to_skip,
                guestCanPause: data.guest_can_pause,
                isHost: data.is_host,    
            });
        });
    }

// consuming the laeving room ApI
leaveButtonPressed(){
    const requestOptions = { 
        method: "POST",
        headers: {"content-Type": "application//json"}
    }

    fetch("/api/leave-room", requestOptions).then((_response) => {
        this.props.leaveRoomCallback();
        this.props.history.push('/'); 
    });

}

    render(){
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center"> 
                    <Typography varaiant="h6" component="h6">
                        Code: {this.roomCode } 
                    </Typography>
                </Grid>

                <Grid item xs={12} align="center">
                    <Typography varaiant="h6" component="h6">
                        votes: {this.state.votesToskip}
                    </Typography>          
                </Grid>

                <Grid item xs={12} align="center"> 
                    <Typography varaiant="h6" component="h6">
                        Guest Can Pause: {this.state.guestCanPause.toString()} 
                    </Typography>    
                </Grid>

                <Grid item xs={12} align="center">
                        <Typography varaiant="h6" component="h6">
                            Host: {this.state.isHost.toString()}
                        </Typography>
                </Grid>

                <Grid item xs={12} align="center">
                    <Button variant="contained" color="Secondary" onClick={this.leaveButtonPressed} >
                        Leave Room
                    </Button>
                </Grid>
            </Grid>

        
        );
    }
} 
