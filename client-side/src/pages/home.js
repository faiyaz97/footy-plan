import React, { Component } from 'react'
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';

import Tournament from '../components/tournament/Tournament'
import Profile from '../components/profile/Profile';
import TournamentTable from '../components/tournament/TournamentTable';

import Typography from '@material-ui/core/Typography';

import { connect } from 'react-redux';
import { getTournaments } from '../redux/actions/dataActions';

class home extends Component {

    componentDidMount(){
        this.props.getTournaments();
    }
    render() {
        const { tournaments, loading } = this.props.data;
        let recentTournamentsMarkup = !loading ? (
            // tournaments.map((tournament) => 
            //     <Tournament key={tournament.tournamentId} tournament={tournament}/>)
            <TournamentTable tournaments={tournaments}/>
        ) : (
            <p>Loading...</p>
        );

        return (
            <Grid container>
                <Typography variant="h5" color="primary"><b>Search Tournament</b></Typography>
                <Grid item sm={12} xs={12}>
                    {recentTournamentsMarkup}
                </Grid>
            </Grid>
        )
    }
}

home.propTypes = {
    getTournaments: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    data: state.data
})

export default connect(mapStateToProps, { getTournaments })(home);
