import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import {
  firebaseConnect,
  isLoaded,
  isEmpty,
  pathToJS
} from 'react-redux-firebase'
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Icon from 'material-ui/Icon';
import { AppBar as UIAppBar } from 'material-ui';
import Toolbar from 'material-ui/Toolbar';
import Grid from 'material-ui/Grid';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';
import MenuIcon from 'material-ui-icons/Menu';
import Typography from 'material-ui/Typography';
import DeleteIcon from 'material-ui-icons/Delete';
import AccountCircle from 'material-ui-icons/AccountCircle';
import IMGFirebase from '../../../assets/images/google-firebase.png'
import IMGGoogle from '../../../assets/images/google-logo.svg'

import {
  LIST_PATH,
  ACCOUNT_PATH,
  LOGIN_PATH,
  SIGNUP_PATH
} from '../../../config/constants'

const styleSheet = createStyleSheet('AppBar', theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  avatar: {
    height: 24,
    width: 24,
  }
}));

class AppBar extends Component {

  constructor(props) {
    super()
    this.state = {
      isLoading: false,
    }
  }

  googleLogin = loginData => {
    this.setState({ isLoading: true })
    return this.props.firebase
      .login({ provider: 'google' })
      .then(() => {
        this.setState({ isLoading: false })
        // this is where you can redirect to another route
      })
      .catch((error) => {
        this.setState({ isLoading: false })
        console.log('there was an error', error)
        console.log('error prop:', this.props.authError) // thanks to connect
      })
  }

  render() {

    const { account } = this.props
    const accountExists = isLoaded(account) && !isEmpty(account)
    const classes = this.props.classes;

    return (
      <UIAppBar position="static" elevation={1}>
        <Grid container justify="space-between">
          <Grid item xs>
            <Toolbar>
              <img src={IMGFirebase} width={32} height={32} />
              <Typography type="title" color="inherit" className={classes.flex}>
                React Firebase Application
              </Typography>
            </Toolbar>
          </Grid>
          <Grid item xs>
            <Toolbar style={{ justifyContent: 'flex-end' }}>
              { !accountExists ? (
                <Button onClick={this.googleLogin} dense color="contrast" className={classes.button}>
                  <AccountCircle />
                  Fazer Login
                </Button>
              ) : (
                <Avatar alt="Remy Sharp" src={account.avatarUrl} className={classes.avatar} />
              ) }
            </Toolbar>
          </Grid>
        </Grid>
      </UIAppBar>
    );
  }
}

AppBar.propTypes = {
  classes: PropTypes.object.isRequired,
  account: PropTypes.object,
  firebase: PropTypes.object.isRequired
};

const styledAppBar = withStyles(styleSheet)(AppBar);

const fbWrappedComponent = firebaseConnect([
  '/markers'
])(styledAppBar)

const mapStateToProps = ({ firebase }) => ({
  authError: pathToJS(firebase, 'authError'),
  auth: pathToJS(firebase, 'auth'),
  account: pathToJS(firebase, 'profile')
})

export default connect(mapStateToProps)(fbWrappedComponent)