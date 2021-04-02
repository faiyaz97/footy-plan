import React, { Component } from 'react'
import PropTypes from 'prop-types';
import axios from 'axios';
import Tournament from '../components/tournament/Tournament';
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
      }

}

class tournament extends Component {
    state = {
        profile: null
    }
    componentDidMount(){
        const tournamentId = this.props.match.params.tournamentId;
        console.log("TEST " + tournamentId);
        this.props.getTournament(tournamentId);
        // axios.get(`/tournament/${tournamentId}`)
        //      .then(res => {
        //          this.setState({
        //              profile: res.data.user
        //          })
        //      })
        //     .catch(err => console.log(err));
    }
    render() {
        const { tournament } = this.props.data;

        const { classes } = this.props;

        console.log("TOURN? " + tournament.name);

        

        return (

            <Grid container spacing={0} direction="row" justify="center" alignItems="center">
                <Grid item sm={2} xs={10}>
                    <img src={tournament.userImage} height className={classes.image}/>
                </Grid>
                <Grid item sm={6} xs={10}>
                    <Typography variant="h4" color="primary" className={classes.typography}>{tournament.name}</Typography>
                </Grid>
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