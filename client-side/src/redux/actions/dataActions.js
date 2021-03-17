import { SET_TOURNAMENT, SET_TOURNAMENTS, LOADING_DATA, STOP_LOADING_UI, DELETE_TOURNAMENT, LOADING_UI, CLEAR_ERRORS, SET_ERRORS, POST_TOURNAMENT } from '../types';
import axios from 'axios';

// get all tournaments
export const getTournaments = () => (dispatch) => {
    dispatch({ type: LOADING_DATA });
    axios
      .get('/tournaments')
      .then((res) => {
        dispatch({
          type: SET_TOURNAMENTS,
          payload: res.data
        });
      })
      .catch((err) => {
        dispatch({
          type: SET_TOURNAMENTS,
          payload: []
        });
      });
  };

// get a tournament
export const getTournament = (tournamentId) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .get(`/tournament/${tournamentId}`)
    .then((res) => {
      dispatch({
        type: SET_TOURNAMENT,
        payload: res.data
      });
      dispatch({ type: STOP_LOADING_UI });
    })
    .catch((err) => console.log(err));
};

  // post a torunament
  export const postTournament = (newTournament) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios
      .post('/tournament', newTournament)
      .then((res) => {
        dispatch({
          type: POST_TOURNAMENT,
          payload: res.data
        });
        dispatch({type: CLEAR_ERRORS});
      })
      .catch((err) => {
        dispatch({
          type: SET_ERRORS,
          payload: err.response.data
        });
      });
  };


  export const deleteTournament = (tournamentId) => (dispatch) => {
    axios.delete(`/tournament/${tournamentId}`)
      .then(() => {
        dispatch({ type: DELETE_TOURNAMENT, payload: tournamentId})
      })
      .catch(err => console.log(err));
  }

  export const clearErrors = () => dispatch => {
    dispatch({ type: CLEAR_ERRORS })
  }