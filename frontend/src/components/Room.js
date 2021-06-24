/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import { Grid, Button, Typography } from '@material-ui/core';
import HomePage from "./HomePage"
import CreateRoomPage from "./CreateRoomPage"
export default class Room extends Component{
    
    constructor(props){
        super(props);
        this.state = {
            votesToSkip: 2,
            guestCanPause: false,
            isHost: false,
            showSettings:false,
            spotifyAuthenticated:false,

        };
        this.roomCode = this.props.match.params.roomCode;
        this.leaveButtonPressed = this.leaveButtonPressed.bind(this);
        this.updateShowSetttings = this.updateShowSetttings.bind(this);
        this.renderSettings = this.renderSettings.bind(this);
        this.getRoomDetails = this.getRoomDetails.bind(this);
        this.authenticatespotify =  this.authenticatespotify.bind(this);
        this.renderSettingsButton = this.renderSettingsButton.bind(this);
        this.getRoomDetails()
    }



    // this function displays the Room details
    getRoomDetails(){
        return fetch('/api/get-room' + '?code=' +this.roomCode).then((response) => {
            // The if statement checks if response doesn't return data so that it will 
            // redirect the user to the homepage instead of empty data 
            //  fields in the browser.
            if (!response.ok){
                this.props.leaveRoomCallback();
                this.props.history.push('/'); 
            }
        
        return response.json();
        })
        .then((data) => {
            this.setState({
                votesToSkip: data.votes_to_skip,
                guestCanPause: data.guest_can_pause,
                isHost: data.is_host,    
            });
            if(this.state.isHost){
                this.authenticatespotify();
            }
        });
    }


    authenticatespotify(){
        fetch('/spotify/is-authenticated').then((response) => response.json()).then((data => {
            this.setState({ spotifyAuthenticated: data.status });
            if(!data.status){
                fetch('/spotify/get-auth-url').then((response) => response.json())
                .then((data) => {
                    window.location.replace(data.url);
                });
            }
        }))

    }




    
    // consuming the laeving room ApI
    leaveButtonPressed(){
        const requestOptions = { 
            method: "POST",
            headers: {"content-Type": "application/json"}
        }

        fetch("/api/leave-room", requestOptions).then((_response) => {
            this.props.leaveRoomCallback();
            this.props.history.push('/'); 
        });

    }

// this function will chnage the state of the 
// showSettings props
    updateShowSetttings(value){
        this.setState({
            showSettings: value,
        });
    }


    renderSettings(){
        return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <CreateRoomPage update={true} 
                votesToSkip={this.state.votesToSkip}
                guestCanPause={this.state.guestCanPause}
                roomCode={this.roomCode}
                updateCallback={this.getRoomDetails} >
                </CreateRoomPage> 

            </Grid>
            <Grid item xs={12} align="center">
                <Button color="secondary" variant="contained" onClick={()=> this.updateShowSetttings(false)}>
                    Close
                </Button>

            </Grid>
        </Grid>
        );
    }




    renderSettingsButton(){
        return (
            <Grid item xs={12} align="center">
                <Button variant="contained" color="primary" onClick={() => this.updateShowSetttings(true)}>
                    Settings
                </Button>
            </Grid>
        )
    }

    render(){
            if (this.state.showSettings){
                return this.renderSettings();
            }
            else{

            return(
            <Grid container spacing={1}>
                <Grid item xs={12} align="center"> 
                    <Typography variant="h4" component="h4">
                        Code: {this.roomCode } 
                    </Typography>
                </Grid>

                <Grid item xs={12} align="center">
                    <Typography variant="h6" component="h6">
                        Votes: {this.state.votesToSkip}
                    </Typography>          
                </Grid>

                <Grid item xs={12} align="center"> 
                    <Typography variant="h6" component="h6">
                        Guest Can Pause: {this.state.guestCanPause.toString()} 
                    </Typography>    
                </Grid>

                <Grid item xs={12} align="center">
                        <Typography variant="h6" component="h6">
                            Host: {this.state.isHost.toString()}
                        </Typography>
                </Grid>
                {this.state.isHost ? this.renderSettingsButton() : null} 
                <Grid item xs={12} align="center">
                    <Button variant="contained" color="Secondary" onClick={this.leaveButtonPressed} >
                        Leave Room
                    </Button>
                </Grid>
            </Grid>

            
            );
            }
    }
} 
