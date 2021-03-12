import React, { Component } from 'react'
import axios from 'axios';
import Grid from '@material-ui/core/Grid';

import Tournament from '../components/Tournament'
import Profile from '../components/Profile'

class home extends Component {

    state = {
        tournaments: null
    }
    componentDidMount(){
        axios.get('/tournaments')
        .then((res) =>{
            //console.log(res.data);
            this.setState({
                tournaments: res.data
            });
        })
        .catch((err) => console.log(err));

    }
    render() {
        let recentTournamentsMarkup = this.state.tournaments ? (
            this.state.tournaments.map((tournament) => <Tournament key={tournament.tournamentId} tournament={tournament}/>)
        ) : (
            <p>Loading...</p>
        );
        return (
            <Grid container spacing={2}>
                <Grid item sm={8} xs={12}>
                    {recentTournamentsMarkup}
                </Grid>
                <Grid item sm={4} xs={12}>
                    <Profile/>
                </Grid>
        </Grid>
        )
    }
}

export default home
