import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import MyButton from '../../utility/MyButton'
import PostTournament from '../tournament/PostTournament';
import withStyles from '@material-ui/core/styles/withStyles';

// material-ui stuff
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
// icons
import AddIcon from '@material-ui/icons/Add';
import HomeIcon from '@material-ui/icons/Home';
import Notifications from '@material-ui/icons/Notifications';

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

class Navbar extends Component {
    render() {
        const { authenticated, classes } = this.props

        return (
            <Grid container direction="row">
                <Grid xs={12}>
                        <Grid item sm={2} xs={12}>
                            <img src="https://firebasestorage.googleapis.com/v0/b/football-tournament-ffu.appspot.com/o/197493110840.jpg?alt=media" height className={classes.image}/>
                        </Grid>
                        <Grid item sm={10} xs={12}>
                            <Typography variant="h4" color="primary" className={classes.typography}><b>Footbal tournament management</b></Typography>
                        </Grid>
                </Grid>
                <Grid xs={12}>
                    <AppBar>
                        <Toolbar className="nav-container">
                            {authenticated ? (
                                <Fragment>
                                    <PostTournament/>

                                    <Link to="/">
                                        <MyButton tip="Home">
                                            <HomeIcon/>
                                        </MyButton>
                                    </Link>

                                    <MyButton tip="Notifications">
                                        <Notifications/>
                                    </MyButton>

                                </Fragment>

                            ) : (
                                <Fragment>
                                    <Button color="inherit" component={Link} to="/">Home</Button>
                                    <Button color="inherit" component={Link} to="/login">Login</Button>
                                    <Button color="inherit" component={Link} to="/signup">Signup</Button>
                                </Fragment>

                            )}
                        </Toolbar>
                    </AppBar>
                </Grid>

            </Grid>
            
        )
    }
}

Navbar.propTypes = {
    authenticated: PropTypes.bool.isRequired,
    classes: PropTypes.object.isRequired
}
const mapStateToProps = state => ({
    authenticated: state.user.authenticated
})

export default connect(mapStateToProps)(withStyles(styles)(Navbar));
