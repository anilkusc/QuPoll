import React from 'react';
import { DataGrid } from '@material-ui/data-grid';

class Sessions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [{ id: 1, username: 'Snow', role: 'admin' },],
      columns: [{ field: 'id', headerName: 'ID', width: 70 },
      { field: 'username', headerName: 'First name', width: 130 },
      { field: 'role', headerName: 'Last name', width: 130 },]
    }
  }
  componentDidMount() {
/*    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    };
    fetch('/backend/GetUsers', requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data != null) {
          this.setState({ questions: data })
        } else {
          alert("There is no question on this session ")
        }
      })
      .catch(error => {
        console.log("Error ========>", error);
        alert("There is error while fetching questions")
      })
    */  }
  render() {
    return (
      <div>
        <br></br>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid rows={this.state.rows} columns={this.state.columns} pageSize={5} checkboxSelection />
        </div>
      </div>
    );
  }
}
export default Sessions;