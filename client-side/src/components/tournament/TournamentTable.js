import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import MyButton from '../../utility/MyButton';
import DeleteTournament from './DeleteTournament';
import TournamentDialog from './TournamentDialog';

// MUI stuffs
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { DataGrid } from '@material-ui/data-grid';


import { connect } from 'react-redux' ;
import { deleteTournament } from '../../redux/actions/dataActions';


const styles = {
    table : {

        '& .MuiDataGrid-row.Mui-odd': {
            backgroundColor: '#e2e2e2',
        },
        '& .MuiDataGrid-columnsContainer': {
            backgroundColor: '#1b7700',
            color: '#fff',
        },
        '& .MuiDataGrid-main':{
            backgroundColor: 'white',
        },
        '& .MuiIconButton-label':{
            color: '#fff'
        },
        '& .MuiSvgIcon-root':{
            backgroundColor: '#1b7700',
        },
        '& .MuiDataGrid-colCellTitle':{
            fontWeight: 'bold'
        }

    }
    
    
}

const columns = [
    { field: 'id', headerName: '#', width: 70},
    { field: 'tournamentName', headerName: 'Tournament Name', width: 180 },
    { field: 'teamsN', headerName: 'Teams #', width: 110, },
    { field: 'type', headerName: 'Type', width: 100 },
    { field: 'format', headerName: 'Format', width: 150 },
    { field: 'location', headerName: 'Location', width: 200 },
    { field: 'description', headerName: 'Description', width: 250 },
    { field: 'date', headerName: 'Date', width: 110 },

    // {
    //   field: 'fullName',
    //   headerName: 'Full name',
    //   description: 'This column has a value getter and is not sortable.',
    //   sortable: false,
    //   width: 160,
    //   valueGetter: (params) =>
    //     `${params.getValue('firstName') || ''} ${params.getValue('lastName') || ''}`,
    // },
];
  
let rows = [];



class TournamentTable extends Component {

    

    render() {
        dayjs.extend(relativeTime);
        //console.log("TEST2: " + JSON.stringify(this.props.tournaments));
        const { classes } = this.props;

        const tournaments = this.props.tournaments;
        
        let count = 0;

        tournaments.map((tournament) => {

            let row = { id: 0, tournamentName: "", teamsN: 0, type: "", format: "", location: "", description: "", date: "" }
            
            row.id = count;
            row.tournamentName = tournament.name;
            row.teamsN = tournament.teamsN;
            row.type = tournament.type;
            row.format = tournament.format;
            row.location = tournament.location;
            row.description = tournament.description;
            row.date = tournament.date;

            rows.push(row);
            console.log("TORNEO " + count + " :" + JSON.stringify(tournament))
            count = count + 1;
        })


        
        return (
            <div style={{ height: 400, width: '100%' }}>
              <DataGrid autoHeight className={classes.table} rows={rows} columns={columns} pageSize={15} />
            </div>
          );
    }
}

TournamentTable.propTypes = {
    user: PropTypes.object.isRequired,
    tournament: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    user: state.user
})

const mapActionsToProps = {
    
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(TournamentTable));
