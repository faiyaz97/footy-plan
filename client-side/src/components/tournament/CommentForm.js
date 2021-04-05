import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';

// MUI stuff
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

// Redux stuff
import { connect } from 'react-redux';
import { submitComment } from '../../redux/actions/dataActions'

const styles = theme => ({
    ...theme.forms
})

 class CommentForm extends Component {

    state = {
        body: '',
        errors: {}
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.UI.errors){
            this.setState({errors: nextProps.UI.errors})
        }
        if(!nextProps.UI.errors && !nextProps.UI.loading){
            this.setState({body: ''})
        }
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.props.submitComment(this.props.tournamentId, {body: this.state.body});
    }


    render() {
        const { classes, authenticated } = this.props;
        const errors = this.state.errors;

        const CommentFormMarkup = authenticated ? (
            <Grid item sm={12} style={{ textAlign: 'center'}}>
                <Card>
                    <CardContent>
                    <form onSubmit={this.handleSubmit}>
                    <TextField
                        name="body"
                        type="text"
                        label="Post a communication"
                        error={errors.comment ? true : false}
                        helperText={errors.comment}
                        value={this.state.body}
                        onChange={this.handleChange}
                        fullWidth
                        className={classes.textField}/>
                        <Button 
                            type="submit"
                            variant="contained"
                            color="primary"
                            className={classes.button}>
                            Submit</Button>
                    </form>

                    </CardContent>
                </Card>
            </Grid>
        ) : null
        return CommentFormMarkup
    }
}

CommentForm.propTypes = {
    submitComment: PropTypes.func.isRequired,
    UI: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    tournamentId: PropTypes.string.isRequired,
    authenticated: PropTypes.bool.isRequired,
}

const mapStateToProps = state => ({
    UI: state.UI,
    authenticated: state.user.authenticated
})

export default connect(mapStateToProps, { submitComment })(withStyles(styles)(CommentForm));
