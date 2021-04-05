import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

// MUI Stuff
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
    ...theme.forms,
    commentImage: {
        height: 50,
        width: 50,
        objectFit: 'cover',
        borderRadius: '50%'
    },
    commentData: {
        marginLeft: 20
    }
})

class Comments extends Component{
    render(){
        const { comments, classes } = this.props;
        return (
            <Grid container>
                {comments.map((comment, index) => {
                    const { body, createdAt, userImage, userHandle } = comment;
                    return (
                        <Fragment key={createdAt}> 
                        <Grid item sm={12}>
                            <Grid container>
                                <Grid item sm={1}>
                                    <img src={userImage} alt="comment" className={classes.commentImage}/>
                                </Grid>
                                <Grid item sm={9}>
                                    <div className={classes.commentData}>
                                        <Typography
                                            variant="h6"
                                            component={Link}
                                            to={`/users/${userHandle}`}
                                            color="primary">
                                                {userHandle}
                                            </Typography>
                                        <hr className={classes.invisibleSeparator}/>
                                        <Typography variant="body1">
                                            {body}
                                        </Typography>
                                    </div>
                                </Grid>
                                <Grid item sm={2}>
                                    <Typography variant="body2" color="textSecondary" align="right">
                                        {dayjs(createdAt).format('h:mm a, MMMM DD YYYY')}
                                    </Typography>
                                </Grid>
                                
                            </Grid>
                        </Grid>
                        {index !== comments.length - 1 && (
                            <hr className={classes.visibleSeparator}/>
                        )}
                        </Fragment>
                    )
                })}
            </Grid>
        )
    }

}

Comments.propTypes = {
    comments: PropTypes.array.isRequired
}

export default withStyles(styles)(Comments);