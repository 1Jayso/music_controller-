import React, { Component } from 'react'
import { TextField, Button, Grid, Typography } from "@material-ui/core";
import { Link } from "react-router-dom"

export default class RoomJoinPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            roomCode: "",
            error: ""
        };
        this._handleTextFieldChange = this._handleTextFieldChange.bind(this);
        this._handleRoomButtonPressed = this._handleRoomButtonPressed.bind(this);
    }

    
    render(){
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Typography variant="h4 component="h4>
                        Join a Room
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <TextField
                        error={this.state.error}
                        label="code"
                        placeholder="Enter a Room Code"
                        value={this.state.roomCode}
                        helperText={this.state.error}
                        variant="outlined"
                        onChange={this._handleTextFieldChange}
                        />
                </Grid>
                <Grid item xs={12} align="center">
                    <Button variant="contained" color="primary" onClick={this._handleRoomButtonPressed}>
                        Enter Room
                    </Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button variant="contained" color="secondary" to="/" component={Link}>
                        Back
                    </Button>
                </Grid>
            </Grid>
        );
        }
        // Handles changes in TextField
        _handleTextFieldChange(e){
            this.setState({
                roomCode: e.target.value,
            })
        }


        // handles what happens when a button is pressed
        _handleRoomButtonPressed(){
            console.log(this.state.roomCode)
        }

} 