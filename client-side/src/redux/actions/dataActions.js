import { SET_TOURNAMENTS, LOADING_DATA, DELETE_TOURNAMENT } from '../types';
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


  export const deleteTournament = (tournamentId) => (dispatch) => {
    axios.delete(`/tournaments/${tournamentId}`)
      .then(() => {
        dispatch({ type: DELETE_TOURNAMENT, payload: tournamentId})
      })
      .catch(err => console.log(err));
  }