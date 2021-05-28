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

// redux stuff

import {connect} from 'react-redux';
import {signupUser} from '../redux/actions/userActions';

const styles = (theme) => ({
    ...theme.forms
  });

  class signup extends Component {
    constructor() {
      super();
      // object of the signup data
      this.state = {
        email: '',
        password: '',
        confirmPassword: '',
        handle: '',
        errors: {}
      };
    }
    // invoked immediately after this component is mounted
    componentWillReceiveProps(nextProps) {
      if (nextProps.UI.errors) {
        // set the errors given in response
        this.setState({ errors: nextProps.UI.errors });
      }
    }
    // event handle when submit
    handleSubmit = (event) => {
      event.preventDefault();
      this.setState({
        loading: true
      });
      // object with signup info
      const newUserData = {
        email: this.state.email,
        password: this.state.password,
        confirmPassword: this.state.confirmPassword,
        handle: this.state.handle
      };
      this.props.signupUser(newUserData, this.props.history);
    };
    // event handle when data change
    handleChange = (event) => {
      this.setState({
        [event.target.name]: event.target.value
      });
    };
    // render the page
    render() {
      const {
        classes,
        UI: { loading }
      } = this.props;
      const { errors } = this.state;
        return (
            // page is divided using grid
            <Grid container className={classes.form}>
                <Grid item sm/>
                <Grid item sm>
                    <img className={classes.image} src={AppIcon} alt="logo"/>
                    <Typography variant="h3" className={classes.pageTitle}>
                        Signup
                    </Typography>
                    {/* login form - input are validated in server side and will get the success response or not */}
                    <form noValidate onSubmit={this.handleSubmit}>
                        <TextField id="email" name="email" type="email" label="Email" className={classes.textField} helperText={errors.email} error={errors.email ? true : false} value={this.state.email} onChange={this.handleChange} fullWidth/>
                        <TextField id="password" name="password" type="password" label="Password" className={classes.textField} helperText={errors.password} error={errors.password ? true : false} value={this.state.password} onChange={this.handleChange} fullWidth/>
                        <TextField id="confirmPassword" name="confirmPassword" type="password" label="ConfirmPassword" className={classes.textField} helperText={errors.confirmPassword} error={errors.confirmPassword ? true : false} value={this.state.confirmPassword} onChange={this.handleChange} fullWidth/>
                        <TextField id="handle" name="handle" type="text" label="Handle" className={classes.textField} helperText={errors.handle} error={errors.handle ? true : false} value={this.state.handle} onChange={this.handleChange} fullWidth/>
                        {errors.general && (
                            <Typography variant="body2" className={classes.customError}>
                                {errors.general}
                            </Typography>

                        )}
                        {/* submit button */}
                        <Button type="submit" variant="contained" color="primary" className={classes.button} disabled={loading}>
                            Signup
                            {loading && (
                              // circular progression bar during loading of submit
                              <CircularProgress size={30} className={classes.progress}/>
                            )}
                            </Button>
                        <br/><small>Already have an account? Login <Link to="/login">here</Link></small>
                    </form>
                </Grid>
                <Grid item sm/>
            </Grid>
        )
    }
  }

signup.propTypes = {
    classes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired,
    signupUser: PropTypes.func.isRequired
  };
  
  const mapStateToProps = (state) => ({
    user: state.user,
    UI: state.UI
  });
  
  export default connect(
    mapStateToProps,
    { signupUser }
  )(withStyles(styles)(signup));
