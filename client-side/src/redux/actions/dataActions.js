import { SET_TOURNAMENTS, LOADING_DATA, DELETE_TOURNAMENT, LOADING_UI, CLEAR_ERRORS, SET_ERRORS, POST_TOURNAMENT } from '../types';
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