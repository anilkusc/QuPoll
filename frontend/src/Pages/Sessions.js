import React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import EditSession from '../Components/EditSession';
import CreateSession from '../Components/CreateSession';
import DeleteSession from '../Components/DeleteSession';
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

class Sessions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      session_name: "",
      password: "",
      openEdit: false,
      openCreate: false,
      openDelete: false,
      select: [],
      rows: [],
      columns: [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'session_name', headerName: 'Session Name', width: 130 },
      ]
    }
    this.handleDelete = this.handleDelete.bind(this);
    this.handleCloseEdit = this.handleCloseEdit.bind(this);
    this.handleCloseCreate = this.handleCloseCreate.bind(this);
    this.handleCloseDelete = this.handleCloseDelete.bind(this);
    this.handleOpenEdit = this.handleOpenEdit.bind(this);
    this.handleOpenCreate = this.handleOpenCreate.bind(this);
    this.handleOpenDelete = this.handleOpenDelete.bind(this);
    this.onChangeSessions = this.onChangeSessions.bind(this);

  }
  componentDidMount() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    };
    fetch('/backend/GetSessions', requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data != null) {
          this.setState({ rows: data })
        } else {
          alert("There is no session")
        }
      })
      .catch(error => {
        console.log("Error ========>", error);
        alert("There is error while fetching sessions")
      })
  }
  onChangeSessions(data){
    this.setState({ rows: data })
  }
  handleDelete() {
    if (this.state.select.rowIds == "" || this.state.select.rowIds == null || this.state.select.rowIds <= 0) {
      alert("You should select at least 1 session for delete")
      return
    } else {
      var selected = this.state.select.rowIds
    }
    var rows = this.state.rows
    var deleted = []

    for (var i = 0; i < selected.length; i++) {
      for (var j = 0; j < rows.length; j++) {
        if (rows[j].id == selected[i]) {
          deleted.push(rows[j])
          break
        }
      }
    }
    this.props.handleChangeSession(1)
  }
  handleCloseEdit() {
    this.setState({ openEdit: false })
  }
  handleOpenEdit() {
    if (this.state.select.rowIds == "" || this.state.select.rowIds == null || this.state.select.rowIds.length != 1) {
      alert("You should select 1 session for editing")
      return
    } else {
      var selected = this.state.select.rowIds
      var rows = this.state.rows
      var edited = []

      for (var i = 0; i < rows.length; i++) {
        if (rows[i].id == selected[0]) {
          edited.push(rows[i])
          break
        }
      }
      this.setState({ openEdit: true, id: edited[0].id, session_name: edited[0].session_name, password: "" })
    }
  }
  handleCloseCreate() {
    this.setState({ openCreate: false })
  }
  handleOpenCreate() {
    this.setState({ openCreate: true })
  }
  handleCloseDelete() {
    this.setState({ openDelete: false })
  }
  handleOpenDelete() {
    this.setState({ openDelete: true })
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
            <CreateSession handleCloseCreate={this.handleCloseCreate} onChangeSessions={this.onChangeSessions}/>
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
            <EditSession handleCloseEdit={this.handleCloseEdit} onChangeSessions={this.onChangeSessions} id={this.state.id} session_name={this.state.session_name} password={this.state.password} />
          </div>
        </Modal>
        <Button onClick={this.handleOpenEdit} variant="contained" color="default">
          Edit
          </Button>&nbsp;&nbsp;
          <Modal
          open={this.state.openDelete}
          onClose={this.handleCloseDelete}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <div className={classes.modal}>
          <DeleteSession sessions={this.state.select.rowIds} handleCloseDelete={this.handleCloseDelete} onChangeSessions={this.onChangeSessions}/>
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
export default withStyles(useStyles)(Sessions);