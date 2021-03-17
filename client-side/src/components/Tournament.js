import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import MyButton from '../utility/MyButton';
import DeleteTournament from './DeleteTournament'

// MUI stuffs
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';


import { connect } from 'react-redux' ;
import { deleteTournament } from '../redux/actions/dataActions';


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

class Tournament extends Component {
    render() {
        dayjs.extend(relativeTime);
        const { classes,
             tournament: { 
                 name, createdAt, userImage, userHandle, tournamentId, commentCount
                },
            user: { 
                authenticated, credentials: { handle }
            } 
        } = this.props;
        const deleteButton = authenticated && userHandle === handle ? (
            <DeleteTournament tournamentId={tournamentId}/>
        ) : null
        return (
            <Card className={classes.card}>
                <CardMedia className={classes.image} image={userImage} title="Profile image"/>
                <CardContent className={classes.content}>
                    <Typography variant="h5" color="primary" component={Link} to={`/users/${userHandle}`}>
                        {userHandle}
                    </Typography>
                    {deleteButton}
                    <Typography variant="body2" color="textSecondary">
                        {dayjs(createdAt).fromNow()}
                    </Typography>
                    <Typography variant="body1">{name}</Typography>
                </CardContent>
            </Card>

            
        )
    }
}

Tournament.propTypes = {
    user: PropTypes.object.isRequired,
    tournament: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    user: state.user
})

const mapActionsToProps = {
    
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Tournament));
