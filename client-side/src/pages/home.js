import React, { Component } from 'react'
import axios from 'axios';
import Grid from '@material-ui/core/Grid';

export class home extends Component {

    state = {
        tournaments: null
    }
    componentDidMount(){
        axios.get('/tournaments')
        .then((res) =>{
            console.log(res.data);
            this.setState({
                tournaments: res.data
            });
        })
        .catch((err) => console.log(err));

    }
    render() {
        let recentTournamentsMarkup = this.state.tournaments ? (
            this.state.tournaments.map((tournament) => <p>{tournament.name}</p>)
        ) : (
            <p>Loading...</p>
        );
        return (
            <Grid container>
                <Grid item sm={8} xs={12}>
                    {recentTournamentsMarkup}
                </Grid>
                <Grid item sm={4} xs={12}>
                    <p>Profile...</p>
                </Grid>
        </Grid>
        )
    }
}

export default home
