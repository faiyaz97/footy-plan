import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import MyButton from '../../utility/MyButton';
import DeleteTournament from './DeleteTournament';
import TournamentDialog from './TournamentDialog';

// MUI stuffs
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';


import { connect } from 'react-redux' ;
import { deleteTournament } from '../../redux/actions/dataActions';


const styles = {
    card: {
        position: 'relative',
        display: 'flex',
        marginBottom: 20
    },
    image: {
        minWidth: 200,
        objectFit: 'cover'
    },
    content: {
        padding: 25
    }
}

class DispayRound extends Component {
    render() {

        const { classes } = this.props;


        const matches = this.props.round;


        let matchesView = matches !== null ? (

            matches.map((match) =>
            <>
                <Grid xs>
                    <Typography variant="body2">Match {match.matchN}</Typography>
                    <Typography variant="h6"  className={classes.typography}>{match.t1}   {match.t1score} - {match.t2score}   {match.t2}</Typography>
                </Grid>
            </>
            )

        ) : null
        


        
        return (
            <>
                <Typography variant="h5" color="primary" className={classes.typography}><b>{matches[0].round}</b></Typography>
                <Grid container justify="flex-start" alignItems="center" >
                    {matchesView}
                </Grid>
                    
            </>
        )
    }
}

DispayRound.propTypes = {
    user: PropTypes.object.isRequired,
    tournament: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    user: state.user
})

const mapActionsToProps = {
    
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(DispayRound));
