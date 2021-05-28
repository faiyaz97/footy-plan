import React, { Component } from 'react'
import PropTypes from 'prop-types';
import axios from 'axios';
import TournamentDetails from '../components/tournament/TournamentDetails';
import TournamentMatches from '../components/tournament/TournamentMatches';
import StaticProfile from '../components/profile/StaticProfile';
import withStyles from '@material-ui/core/styles/withStyles';



import { connect } from 'react-redux';
import { getUserData, getTournament } from '../redux/actions/dataActions';

// MUI stuffs
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

// css style
const styles = {
    image: {
        width: 120,
        objectFit: 'cover',
        maxWidth: '100%',
        borderRadius: '50%'
    },
    typography: {
        flexGrow: 1,
        align: "center"
      },
    title: {
        paddingBottom: "20px"
    }

}

// display tournament component
class tournament extends Component {
    // profile object
    state = {
        profile: null
    }
    // invoked immediately after this component is mounted
    componentDidMount(){
        // get tournament id
        const tournamentId = this.props.match.params.tournamentId;
        // get tournament data
        this.props.getTournament(tournamentId);
    }

    // render page
    render() {
        // torunament, classes, page props
        const { tournament } = this.props.data;
        const { classes } = this.props;
        const page = this.props.match.params.page

        // display tournament details or matches page
        const pageView = page === "details" ? (
            <Grid container>
                <Grid item xs={12}>
                    {/* get TorunamentDetails component */}
                    <TournamentDetails tournament={tournament}/>
                </Grid>  
            </Grid>
        ) : (
            <Grid container>
                <Grid item xs={12}>
                    {/* get TorunamentMatches component */}
                    <TournamentMatches tournament={tournament}/>
                </Grid>  
            </Grid>
        )
        return (
            <Grid container spacing={0} direction="row" alignItems="center">
                <Grid container className={classes.title}>
                    <Grid item sm={2} xs={12}>
                        {/* display tournament logo */}
                        <img src={tournament.logo} height className={classes.image}/>
                    </Grid>
                    <Grid item sm={10} xs={12}>
                        {/* display tournament name */}
                        <Typography variant="h4" color="primary" className={classes.typography}><b>{tournament.name}</b></Typography>
                    </Grid>
                </Grid>
                {/* display matches or details page */}
                {pageView}     
            </Grid>
        )
    }
}

tournament.protoTypes = {
    getUserData: PropTypes.func.isRequired,
    getTournament: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    data: state.data
})

export default connect(mapStateToProps, {getUserData, getTournament})(withStyles(styles)(tournament));
