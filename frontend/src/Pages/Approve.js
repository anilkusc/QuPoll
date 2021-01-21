import React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import EditUser from '../Components/EditUser';
import CreateUser from '../Components/CreateUser';
import DeleteUser from '../Components/DeleteUser';
import { withStyles } from '@material-ui/core/styles';

const useStyles = theme => ({
  modal: {
    top: `49%`,
    left: `51%`,
    transform: `translate(-49%, -51%)`,
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  }
});

class Approve extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      columns: [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'asker', headerName: 'Asker', width: 130 },
        { field: 'question', headerName: 'Question', width: 130 },
        { field: 'date', headerName: 'Date', width: 130 },
      ]
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <br></br>
        &nbsp;
        <Modal
          open={this.state.openCreate}
          onClose={this.handleCloseCreate}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <div className={classes.modal}>
            <CreateUser handleCloseCreate={this.handleCloseCreate} onChangeUsers={this.onChangeUsers}/>
          </div>
        </Modal>
        <Button variant="contained" color="primary" onClick={this.handleOpenCreate} >
          Create
          &nbsp; </Button> &nbsp;
        <Modal
          open={this.state.openEdit}
          onClose={this.handleCloseEdit}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <div className={classes.modal}>
            <EditUser handleCloseEdit={this.handleCloseEdit} onChangeUsers={this.onChangeUsers} id={this.state.id} username={this.state.username} password={this.state.password} role={this.state.role} />
          </div>
        </Modal>
        <Button onClick={this.handleOpenDelete} variant="contained" color="secondary">
          Delete
      </Button>
        <br></br>
        <br></br>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid onSelectionChange={(data) => this.setState({ select: data })} rows={this.state.rows} columns={this.state.columns} pageSize={5} checkboxSelection />
        </div>
      </div>
    );
  }
}
export default withStyles(useStyles)(Approve);