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

// home page component
class home extends Component {
    // invoked immediately after this component is mounted
    componentDidMount(){
        // get tournament props
        this.props.getTournaments();
    }
    // render the page
    render() {
        // tournaments and loading props
        const { tournaments, loading } = this.props.data;
        // check if the tournament table loaded
        let tournamentTableMarkup = !loading ? (
            // tournaments.map((tournament) => 
            //     <Tournament key={tournament.tournamentId} tournament={tournament}/>)
            <TournamentTable tournaments={tournaments}/>
        ) : (
            // display loading... text until te tournament table is ready
            <p>Loading...</p>
        );

        return (
            // grid used to dsiplay the tournament table or the loading text
            <Grid container>
                <Grid item sm={12} xs={12}>
                    {tournamentTableMarkup}
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
