import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles';

// MUI stuffs
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

const styles = {
    card: {
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
        const { classes, tournament: { name, createdAt, userImage, userHandle, tournamentId, commentCount} } = this.props;
        return (
            <Card className={classes.card}>
                <CardMedia className={classes.image} image={userImage} title="Profile image"/>
                <CardContent className={classes.content}>
                    <Typography variant="h5" color="primary" component={Link} to={`/users/${userHandle}`}>{userHandle}</Typography>
                    <Typography variant="body2" color="textSecondary">{dayjs(createdAt).fromNow()}</Typography>
                    <Typography variant="body1">{name}</Typography>
                </CardContent>
            </Card>

            
        )
    }
}

export default withStyles(styles)(Tournament);
