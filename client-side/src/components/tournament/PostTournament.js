import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import MyButton from '../../utility/MyButton';
// MUI Stuff
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
// icons
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
// Redux stuff
import { connect } from 'react-redux';
import { postTournament, clearErrors } from '../../redux/actions/dataActions';

const styles = theme => ({
    ...theme.forms,
    submitButton:{
        position: 'relative',
        float: 'right',
        marginTop: 10,
        marginBottom: 10
    },
    progressSpinner: {
        position: 'absolute'
    },
    closeButton: {
        position: 'absolute',
        left: '91%',
        top: '4%'
    }
})

class PostTournament extends Component {
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
    handleOpen = () => {
        this.setState({ open: true })
    };
    handleClose = () => {
        this.props.clearErrors();
        this.setState({ open: false, errors: {} })
    };
    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    };
    handleSubmit = (event) => {
        event.preventDefault();
        this.props.postTournament({ name: this.state.name });
    };
    render(){
        const { errors } = this.state;
        const { classes, UI: { loading }} = this.props;
        return (
            <Fragment>
                <MyButton onClick={this.handleOpen} tip="Post a Tournament">
                    <AddIcon/>
                </MyButton>
                <Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="sm">
                    <MyButton tip="Close" onClick={this.handleClose} tipClassName={classes.closeButton}>
                        <CloseIcon/>
                    </MyButton>
                    <DialogTitle>Post a new Tournament</DialogTitle>
                    <DialogContent>
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
                                    className={classes.submitButton} disabled={loading}>
                                        Submit
                                        {loading && (
                                            <CircularProgress size={30} className={classes.progressSpinner}/>
                                        )}
                                </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </Fragment>
        )
    }

}

PostTournament.propTypes = {
    postTournament: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    UI: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    UI: state.UI
})

export default connect(mapStateToProps, { postTournament, clearErrors })(withStyles(styles)(PostTournament))
