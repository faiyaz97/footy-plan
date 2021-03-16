import React, { Component } from 'react'
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';

import Tournament from '../components/Tournament'
import Profile from '../components/Profile'

import { connect } from 'react-redux';
import { getTournaments } from '../redux/actions/dataActions';

class home extends Component {

    componentDidMount(){
        this.props.getTournaments();
    }
    render() {
        const { tournaments, loading } = this.props.data;
        let recentTournamentsMarkup = !loading ? (
            tournaments.map((tournament) => 
                <Tournament key={tournament.tournamentId} tournament={tournament}/>)
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

home.propTypes = {
    getTournaments: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    data: state.data
})

export default connect(mapStateToProps, { getTournaments })(home);
