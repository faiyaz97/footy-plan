import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import MyButton from '../../utility/MyButton';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import Comments from './Comments';
// MUI Stuff
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
// icons
import CloseIcon from '@material-ui/icons/Close';
import UnfoldMore from '@material-ui/icons/UnfoldMore';
// Redux stuff
import { connect } from 'react-redux';
import { getTournament } from '../../redux/actions/dataActions';

const styles = theme => ({
    ...theme.forms,
    profileImage: {
        maxWidth: 200,
        height: 200,
        borderRadius: '50%',
        objectFit: 'cover'
    },
    dialogContent: {
        padding: 20
    },
    closeButton: {
        position: 'absolute',
        left: '90%',
        top: '6%'
    },
    expandButton: {
        position: 'absolute',
        left: '90%',
        top: '50%'
    },
    spinnerDiv: {
        textAlign: 'center',
        marginTop: 50,
        marginBottom: 50
    }
})

class TournamentDialog extends Component{
    state = {
        open: false
    }
    handleOpen = () => {
        this.setState({ open: true });
        this.props.getTournament(this.props.tournamentId);
    }
    handleClose = () => {
        this.setState({ open: false });
    }
    render(){
        const { 
            classes, 
            tournament: {
                tournamentId, 
                name, 
                createdAt, 
                likeCount, 
                commentCount, 
                userImage, 
                userHandle,
                comments}, 
                UI: { loading }
        } = this.props;

        const dialogMarkup = loading ? (
            <div className={classes.spinnerDiv}>
                <CircularProgress size={150} thickness={2}/>
            </div>
        ) : (
            <Grid container spacing={1}>
                <Grid item sm={5}>
                    <img src={userImage} alt="Profile" className={classes.profileImage}/>
                </Grid>
                <Grid item sm={7}>
                    <Typography
                        component={Link}
                        color="primary"
                        variant="h5"
                        to={`/user/${userHandle}`}>
                            @{userHandle}
                        </Typography>
                        <hr className={classes.invisibleSeparator}/>
                        <Typography variant="body2" color="textSecondary">
                            {dayjs(createdAt).format('h:mm a, MMMM DD YYYY')}
                        </Typography>
                        <hr className={classes.invisibleSeparator}/>
                        <Typography variand="body1">
                            {name}
                        </Typography>
                </Grid>
                <hr className={classes.visibleSeparator}/>
                <Comments  comments={comments}/>
            </Grid>
        )
        return (
            <Fragment>
                <MyButton onClick={this.handleOpen} tip="Expand Tournament" tipClassName={classes.expandButton}>
                    <UnfoldMore color="primary"/>
                </MyButton>
            <Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="sm">
                <MyButton tip="Close" onClick={this.handleClose} tipClassName={classes.closeButton}>
                    <CloseIcon/>
                </MyButton>
                <DialogContent className={classes.dialogContent}>
                    {dialogMarkup}
                </DialogContent>


            </Dialog>
            </Fragment>
        )
    }
}

TournamentDialog.propTypes = {
    getTournament: PropTypes.func.isRequired,
    tournamentId: PropTypes.string.isRequired,
    userHandle: PropTypes.string.isRequired,
    tournament: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    tournament: state.data.tournament,
    UI: state.UI
})

const mapActionsToProps = {
    getTournament
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(TournamentDialog));