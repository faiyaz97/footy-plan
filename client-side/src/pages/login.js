import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import AppIcon from '../images/logo.png';
import { Link } from 'react-router-dom';

// MUI stuff
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

// Redux stuff
import { connect } from 'react-redux';
import { loginUser } from '../redux/actions/userActions';

const styles = (theme) => ({
    ...theme.forms
  });

export class login extends Component {
    constructor() {
        super();
        // object of the login data
        this.state = {
          email: '',
          password: '',
          errors: {}
        };
    }
    // invoked immediately after this component is mounted
    componentWillReceiveProps(nextProps){
          if(nextProps.UI.errors){
            this.setState({ errors: nextProps.UI.errors });
          }
    }
    // event handle when submit
    handleSubmit = (event) => {
        event.preventDefault();
        // object with email and password
        const userData = {
            email: this.state.email,
            password: this.state.password
        };
        // props to login the user
        this.props.loginUser(userData, this.props.history);
    };
    // event handle when data change
    handleChange = (event) => {
        // reset the state - clean the errors
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    // render the page
    render() {
        // classes and uui props
        const { classes, UI: { loading }} = this.props;
        // errors state
        const { errors } = this.state;
        return (
            // page is divided using grid
            <Grid container className={classes.form}>
                <Grid item sm/>
                <Grid item sm>
                    <img className={classes.image} src={AppIcon} alt="logo"/>
                    <Typography variant="h3" className={classes.pageTitle}>
                        Login
                    </Typography>
                    {/* login form - input are validated in server side and will get the success response or not */}
                    <form noValidate onSubmit={this.handleSubmit}>
                        <TextField id="email" name="email" type="email" label="Email" className={classes.textField} helperText={errors.email} error={errors.email ? true : false} value={this.state.email} onChange={this.handleChange} fullWidth/>
                        <TextField id="password" name="password" type="password" label="Password" className={classes.textField} helperText={errors.password} error={errors.password ? true : false} value={this.state.password} onChange={this.handleChange} fullWidth/>
                        {errors.general && (
                            <Typography variant="body2" className={classes.customError}>
                                {errors.general}
                            </Typography>
                        )}
                        {/* submit button */}
                        <Button type="submit" variant="contained" color="primary" className={classes.button} disabled={loading}>
                            Login
                            {loading && (
                                // circular progression bar during loading of submit
                                <CircularProgress size={30} className={classes.progress}/>
                            )}
                        </Button>
                        <br/><small>don't have an account? Sign up <Link to="/signup">here</Link></small>
                    </form>
                </Grid>
                <Grid item sm/>
            </Grid>
        )
    }
}

login.propTypes = {
    classes: PropTypes.object.isRequired,
    loginUser: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    user: state.user,
    UI: state.UI
});

const mapActionToProps = {
    loginUser
}

export default connect(mapStateToProps, mapActionToProps)(withStyles(styles)(login));
