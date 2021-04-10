import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import MyButton from '../../utility/MyButton';
import DeleteTournament from './DeleteTournament';
import TournamentDialog from './TournamentDialog';
import StaticProfile from '../../components/profile/StaticProfile';
import axios from 'axios';
import Comments from './Comments';
import CommentForm from './CommentForm';
import Button from '@material-ui/core/Button';

// MUI stuffs
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';


import { connect } from 'react-redux' ;
import { getUserData } from '../../redux/actions/dataActions';
import { CardActions } from '@material-ui/core';


const styles = {
    grid:{
        
    },
    card: {
        position: 'relative',
        display: 'flex',
        flexDirection: "row"
    },
    commentsCard: {
        position: 'relative',
        display: 'flex',
        flexDirection: "column"
    },
    paper: {
        maxHeight: 300, 
        overflow: 'auto'
    },
    image: {
        minWidth: 200,
        objectFit: 'cover'
    },
    content: {
        
    },

    typography: {
        paddingBottom: 10
    },


    teamCard: {
        position: 'relative',
        display: 'flex',
        marginBottom: -10,
        alignItems: 'center',
        padding: "0px 20px 0px 20px"
    },
    teamsImage: {
        width: 50,
        height: 50,
        objectFit: 'cover',
        borderRadius: '50%',
    },
    teamContent: {
        padding: 20,

    },
    secondNav: {
        paddingBottom: "20px"
    },
    container: {
        paddingBottom: "20px"
    }

}

class TournamentDetails extends Component {

    state = {
        profile: null
    }

    render() {

        const { profile } = this.state;

        if (profile === null) {
            const handle = this.props.tournament.userHandle;
            console.log("TEST!!: " + this.props.tournament.userHandle);
            this.props.getUserData(handle);
            axios.get(`/user/${handle}`)
                .then(res => {
                    this.setState({
                        profile: res.data.user
                    })
                })
                .catch(err => console.log(err));
            return <p>Loading...</p>
        }
        
        dayjs.extend(relativeTime);
        const { classes,
             tournament: { 
                 name, createdAt, userImage, userHandle, tournamentId, commentCount, teamsN, type, format, location, description, comments, teams
                },
            user: { 
                authenticated, credentials: { handle }
            } 
        } = this.props;

        // fa check se' l'user giusto
        const commentForm = authenticated && userHandle === handle ? (
            <CommentForm tournamentId={tournamentId} />
        ) : null


        let teamsMarkup = (
            teams.map((team) => 
            <Card className={classes.teamCard}>
                <img src={team.teamLogo} height className={classes.teamsImage}/>
                <CardContent className={classes.teamContent}>
                    <Typography variant="h6">
                        {team.name}
                    </Typography>
                </CardContent>  
            </Card>
            )
        )
        
        return (
            
            <Grid container className={classes.grid} direction="row" >

                <Grid container className={classes.secondNav} spacing={2} >
                    <Grid item >
                        <Button variant="contained" color="primary" component={Link} to={`/tournaments/details/${tournamentId}`}>Details</Button>
                    </Grid>
                    <Grid item >
                        <Button variant="outlined" color="primary" component={Link} to={`/tournaments/matches/${tournamentId}`}>Matches</Button>
                    </Grid>
                    <Grid item >
                        <Button variant="outlined" color="primary">Player stats</Button>
                    </Grid>
                    <Grid item >
                        <Button variant="outlined" color="primary">Settings</Button>
                    </Grid>
                </Grid>

                <Grid container className={classes.container} spacing={2} >
                    <Grid item sm={8} xs={12}>
                        <Typography variant="h5" color="primary" className={classes.typography}><b>Tournament Details</b></Typography>
                        <Card className={classes.card}>
                            <CardContent className={classes.content}>
                                <Typography variant="h6" className={classes.typography}>
                                    <b>
                                    Teams #:
                                    </b>
                                </Typography>
                                <Typography variant="h6" className={classes.typography}>
                                    <b>Type:</b>
                                </Typography>
                                <Typography variant="h6" className={classes.typography}>
                                    <b>Format:</b>
                                </Typography>
                                <Typography variant="h6" className={classes.typography}>
                                    <b>Location:</b>
                                </Typography>
                                <Typography variant="h6">
                                    <b>Description:</b>
                                </Typography>
                            </CardContent>

                            <CardContent className={classes.content}>
                                <Typography variant="h6" className={classes.typography}>
                                    {teamsN}
                                </Typography>
                                <Typography variant="h6" className={classes.typography}>
                                    {type}
                                </Typography>
                                <Typography variant="h6" className={classes.typography}>
                                    {format}
                                </Typography>
                                <Typography variant="h6" className={classes.typography}>
                                    {location}
                                </Typography>
                                <Typography variant="h6">
                                    {description}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item sm={4} xs={12}>
                        <Typography variant="h5" color="primary" className={classes.typography}><b>Tournament Organiser</b></Typography>
                        <StaticProfile profile={this.state.profile}/>
                    </Grid>
                </Grid>

            
                                
                
                <Grid container className={classes.container} spacing={2} direction="row" >
                    <Grid item sm={8} xs={12}>
                        <Typography variant="h5" color="primary" className={classes.typography}><b>Organiser Communications</b></Typography>
                        <Card className={classes.commentsCard}>
                            <Paper className={classes.paper}>
                                <CardContent className={classes.content}>
                                    <Comments  comments={comments}/>
                                </CardContent>
                            </Paper>
                            {commentForm}
                        </Card>
                    </Grid>
                    <Grid item sm={4} xs={12}>
                        <Typography variant="h5" color="primary" className={classes.typography}><b>Teams</b></Typography>
                        {teamsMarkup}                        
                    </Grid>
                </Grid>
            </Grid>
            
        )
    }
}

TournamentDetails.propTypes = {
    user: PropTypes.object.isRequired,
    tournament: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    getUserData: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    user: state.user
})

const mapActionsToProps = {
    
}

export default connect(mapStateToProps, {getUserData})(withStyles(styles)(TournamentDetails));
