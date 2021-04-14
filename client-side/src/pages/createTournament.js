import React, { Component } from 'react'
import PropTypes from 'prop-types';
import axios from 'axios';
import TournamentDetails from '../components/tournament/TournamentDetails';
import TournamentMatches from '../components/tournament/TournamentMatches';
import StaticProfile from '../components/profile/StaticProfile';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';



import { connect } from 'react-redux';
import { postTournament, clearErrors } from '../redux/actions/dataActions';

// MUI stuffs
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import MuiLink from '@material-ui/core/Link';

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

class createTournament extends Component {

    state = {
        open: false,
        name: '',
        errors: {}
    };

    componentWillReceiveProps(nextProps){
        if(nextProps.UI.errors){
            this.setState({
                errors: nextProps.UI.errors
            });
        }
        if (!nextProps.UI.errors && !nextProps.UI.loading) {
            this.setState({ name: '', open: false, errors: {} });
        }
    
    }

    handleChange = (event) => {
        this.props.clearErrors();
        this.setState({ [event.target.name]: event.target.value })
    };
    handleSubmit = (event) => {
        event.preventDefault();
        this.props.postTournament({ name: this.state.name });
    };

    render() {

        const { errors } = this.state;
        const { 
            classes, 
            user: { 
                authenticated
            }
        } = this.props;

        if(!authenticated){
            console.log("AUTH: " + authenticated)
        }

        const authText = (
            !authenticated ? (
                <Grid container className={classes.container} justify="center">
                    <Grid item  xs='auto'>
                        <Card className={classes.commentsCard}>
                            <CardContent className={classes.content}>
                                <Typography variant="body1" className={classes.typography}>You have to&nbsp;
                                    <MuiLink component={Link} to={`/login`} variant="body1">
                                         login 
                                    </MuiLink> 
                                    &nbsp;to create a Tournament!
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            ) : (
                <Grid container className={classes.container} direction="row">
                    <Grid item xs={12}>
                        <Card className={classes.commentsCard}>
                        <Grid container className={classes.container} direction="row">
                        <Grid item  sm={6} xs={12}>
                            <CardContent className={classes.content}>
                                    <form onSubmit={this.handleSubmit}>
                                    <TextField 
                                        name="name" 
                                        type="text" 
                                        label="Tournament name" 
                                        multiline 
                                        rows="3" 
                                        placeholder="tournament name" 
                                        error={errors.name ? true : false} 
                                        helperText={errors.name} 
                                        className={classes.textField}
                                        onChange={this.handleChange}
                                        fullWidth
                                        />
                                        <Button type="submit" variant="contained" color="primary"
                                            className={classes.submitButton}>
                                                Submit
                                        </Button>
                                    </form>
                                </CardContent>
                        </Grid>
                            
                            <Grid item  sm={6} xs={12}>
                            <CardContent className={classes.content}>
                                    <form onSubmit={this.handleSubmit}>
                                    <TextField 
                                        name="name" 
                                        type="text" 
                                        label="Tournament name" 
                                        multiline 
                                        rows="3" 
                                        placeholder="tournament name" 
                                        error={errors.name ? true : false} 
                                        helperText={errors.name} 
                                        className={classes.textField}
                                        onChange={this.handleChange}
                                        fullWidth
                                        />
                                        <Button type="submit" variant="contained" color="primary"
                                            className={classes.submitButton}>
                                                Submit
                                        </Button>
                                    </form>
                                </CardContent>
                            </Grid>
                            </Grid>
                        </Card>
                    </Grid>
                </Grid>
            )
        );
        

        return (

            

            <Grid container spacing={0} direction="row" alignItems="center">
                <Grid container className={classes.title}>
                    <Grid item sm={10} xs={12}>
                        <Typography variant="h5" color="primary" className={classes.typography}><b>Create Tournament</b></Typography>
                    </Grid>
                </Grid>
                {authText}
            </Grid>
        )
    }
}

createTournament.protoTypes = {
    classes: PropTypes.object.isRequired,

    user: PropTypes.object.isRequired,

    postTournament: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    UI: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    user: state.user,

    UI: state.UI
})

export default connect(mapStateToProps, {postTournament, clearErrors})(withStyles(styles)(createTournament));
