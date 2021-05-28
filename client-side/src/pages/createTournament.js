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

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

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
    },

}

class createTournament extends Component {

    // initialize tournament data object
    state = {
        name: '',
        teamsN: 4,
        location: '',
        date: '',
        description: '',
        type: '',
        format: '',
        logo: '',
        errors: {}
    };
    // invoked immediately after this component is mounted
    componentWillReceiveProps(nextProps){
        if(nextProps.UI.errors){
            this.setState({
                errors: nextProps.UI.errors
            });
        }
        if (!nextProps.UI.errors && !nextProps.UI.loading) {
            this.setState({ name: '', teamsN: 4, location: '', date: '', description: '', type: '5-A-Side', format: 'Single Elimination', logo: '', errors: {} });
        }
    
    }

    

    handleChange = (event) => {
        // different defauls logos url
        const logos = [
            "https://firebasestorage.googleapis.com/v0/b/football-tournament-ffu.appspot.com/o/logo1.jpg?alt=media&token=38d0740c-814c-4461-8999-a5f3dbede17c",
            "https://firebasestorage.googleapis.com/v0/b/football-tournament-ffu.appspot.com/o/logo2.jpg?alt=media&token=b8cdaa50-366a-4700-ac42-9ed2fb94b5d6",
            "https://firebasestorage.googleapis.com/v0/b/football-tournament-ffu.appspot.com/o/logo3.jpg?alt=media&token=30e4a4fb-bccd-4419-90d7-d6983a6fe182",
            "https://firebasestorage.googleapis.com/v0/b/football-tournament-ffu.appspot.com/o/logo4.jpg?alt=media&token=c7cdb482-90a9-4c00-89bc-aa01528cb789"
        ]
        // generate random number from 0 to 3
        const rand = Math.floor(Math.random() * 4)

        this.setState({ 
            [event.target.name]: event.target.value,
            [event.target.location]: event.target.value,
            [event.target.date]: event.target.value,
            [event.target.description]: event.target.value,
            logo: logos[rand]
        })
    };
    // event handle when type change
    handleChangeType = (event) => {
        this.setState({ 
            type: event.target.value,
        })
    };
    // event handle when format change
    handleChangeFormat = (event) => {
        this.setState({ 
            format: event.target.value,
        })
    };
    // event handle when teamN change
    handleChangeTeamsN = (event) => {
        this.setState({ 
            teamsN: event.target.value,
        })
    };

    // event handle when submit
    handleSubmit = (event) => {
        event.preventDefault();
        this.props.postTournament({ 
            name: this.state.name,
            location: this.state.location,
            date: this.state.date,
            description: this.state.description,
            teamsN: this.state.teamsN,
            type: this.state.type,
            format: this.state.format,
            logo: this.state.logo
        });
        console.log(this.state);
    };
    // render the page
    render() {
        // get errors
        const { errors } = this.state;
        // get user authenticated
        const { 
            classes, 
            user: { 
                authenticated
            }
        } = this.props;

        // check if the user is authenticated
        if(!authenticated){
            console.log("AUTH: " + authenticated)
        }

        // if the user is authenticated display the create tournament form, otherwise display e message which say that the user has to login
        const authText = (
            !authenticated ? (
                <Grid container  justify="center">
                    <Grid item  xs='auto'>
                        <Card >
                            <CardContent>
                                {/* display message */}
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
                <Grid container direction="row">
                    <Grid item sm={12} xs={12}>
                        {/* create tournament form */}
                        <form onSubmit={this.handleSubmit}>
                            <Grid container direction="row">
                                <Grid item sm={6} xs={12}>
                                    <Card>
                                        <CardContent>
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
                                            <TextField 
                                                name="location" 
                                                type="text" 
                                                label="Location" 
                                                multiline 
                                                rows="3" 
                                                placeholder="tournament location" 
                                                error={errors.location ? true : false} 
                                                helperText={errors.location} 
                                                className={classes.textField}
                                                onChange={this.handleChange}
                                                fullWidth
                                            />

                                            <TextField 
                                                name="date" 
                                                type="text" 
                                                label="Date" 
                                                multiline 
                                                rows="3" 
                                                placeholder="tournament date" 
                                                error={errors.date ? true : false} 
                                                helperText={errors.date} 
                                                className={classes.textField}
                                                onChange={this.handleChange}
                                                fullWidth
                                            />


                                            <TextField 
                                                name="description" 
                                                type="text" 
                                                label="Description" 
                                                multiline 
                                                rows="5" 
                                                placeholder="tournament description" 
                                                error={errors.description ? true : false} 
                                                helperText={errors.description} 
                                                className={classes.textField}
                                                onChange={this.handleChange}
                                                fullWidth
                                            />
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid item sm={6} xs={12}>
                                    <Card>
                                        <CardContent>
                                            
                                            <InputLabel id="demo-simple-select-label">Teams #</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={this.state.teamsN}
                                                onChange={this.handleChangeTeamsN}
                                                >
                                                <MenuItem value={4}>4</MenuItem>
                                                <MenuItem value={8}>8</MenuItem>
                                                <MenuItem value={16}>16</MenuItem>
                                            </Select>

                                            <InputLabel id="demo-simple-select-label">Type</InputLabel>
                                            <Select
                                                labelId="labelTypeId"
                                                id="typeId"
                                                value={this.state.type}
                                                onChange={this.handleChangeType}
                                                >
                                                <MenuItem value={"5-A-Side"}>5-A-Side</MenuItem>
                                                <MenuItem value={"6-A-Side"}>6-A-Side</MenuItem>
                                                <MenuItem value={"7-A-Side"}>7-A-Side</MenuItem>
                                                <MenuItem value={"8-A-Side"}>8-A-Side</MenuItem>
                                                <MenuItem value={"9-A-Side"}>9-A-Side</MenuItem>
                                                <MenuItem value={"11-A-Side"}>11-A-Side</MenuItem>
                                            </Select>


                                            <InputLabel id="demo-simple-select-label">Format</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label1"
                                                id="demo-simple-select1"
                                                value={this.state.format}
                                                onChange={this.handleChangeFormat}
                                                >
                                                <MenuItem value={"Single Elimination"}>Single Elimination</MenuItem>
                                                <MenuItem disabled={true} value={"Double Elimination"}>Double Eliminaton</MenuItem>
                                                <MenuItem disabled={true} value={"Straight Round Robin"}>Straight Round Robin</MenuItem>
                                            </Select>
                                            
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                            { /* submit button */}
                            <Button type="submit" variant="contained" color="primary"
                                className={classes.submitButton}>
                                    Submit
                            </Button>
                        </form>
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
                {/* display form or login message */}
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
