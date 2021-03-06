import React, { Component, Fragment } from 'react'
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import MyButton from '../../utility/MyButton';

// MUI Stuff
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import DeleteOutline from  '@material-ui/icons/DeleteOutline'

import { connect } from 'react-redux';
import { deleteTournament } from '../../redux/actions/dataActions';

const styles = {
    deleteButton: {
        position: 'absolute',
        top: '10%',
        left: '90%'
    }
}

export class DeleteTournament extends Component {

    state = {
        open: false
    }

    handleOpen = () => {
        this.setState({ open: true});
    }
    handleClose = () => {
        this.setState({ open: false});
    }
    deleteTournament = () => {
        this.props.deleteTournament(this.props.tournamentId)
        this.setState({ open: false});
    }

    render() {

        const { classes } = this.props;
        return (
            <Fragment>
                <MyButton tip="Delete Tournament"
                onClick={this.handleOpen}
                btnClassName={classes.deleteButton}>
                    <DeleteOutline color="secondary"/>
                </MyButton>
                <Dialog 
                    open={this.state.open}
                    onClose={this.handleClose}
                    fullWidth
                    maxWidth="sm">
                        <DialogTitle>
                            Are you sure you want to delete this tournament?
                        </DialogTitle>
                        <DialogActions>
                            <Button onClick={this.handleClose} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={this.deleteTournament} color="secondary">
                                Delete
                            </Button>
                        </DialogActions>
                </Dialog>

            </Fragment>
        )
    }
}

DeleteTournament.propTypes = {
    deleteTournament: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    tournamentId: PropTypes.string.isRequired
}

export default connect(null, { deleteTournament })(withStyles(styles)(DeleteTournament));
