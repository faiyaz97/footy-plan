import { SET_TOURNAMENTS, LOADING_DATA, DELETE_TOURNAMENT} from '../types';

const initialState = {
    tournaments: [],
    tournament: {},
    loading: false
};

export default function(state = initialState, action){
    switch(action.type){
        case LOADING_DATA:
            return {
                ...state,
                loading: true
            };
        case SET_TOURNAMENTS:
            return {
                ...state,
                tournaments: action.payload,
                loading: false
            };
        case DELETE_TOURNAMENT:
            let index = state.tournaments.findIndex(tournament => tournament.tournamentId === action.payload);
            state.tournaments.splice(index, 1);
            return {
                ...state
            };
        default:
            return state;
    }
}