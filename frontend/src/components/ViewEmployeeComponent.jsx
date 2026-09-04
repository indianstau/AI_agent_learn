import React, { Component } from 'react'
import EmployeeService from '../services/EmployeeService'

class ViewEmployeeComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            id: (this.props.location.state && this.props.location.state.employeeId)
                || sessionStorage.getItem('selectedEmployeeId'),
            employee: {}
        }
    }

    componentDidMount(){
        EmployeeService.getEmployeeById(this.state.id).then( res => {
            this.setState({employee: res.data});
        })
    }

    render() {
        return (
            <div className="employee-view-page">
                <button className="btn btn-secondary employee-back-button" onClick={() => this.props.history.push('/employees')}>
                    Back
                </button>
                <div className="card employee-details-card">
                    <h3 className="text-center employee-details-title">Employee Details</h3>
                    <div className="card-body">
                        <table className="table table-bordered employee-details-table">
                            <tbody>
                                <tr>
                                    <th>First Name</th>
                                    <td>{this.state.employee.firstName}</td>
                                </tr>
                                <tr>
                                    <th>Last Name</th>
                                    <td>{this.state.employee.lastName}</td>
                                </tr>
                                <tr>
                                    <th>Email</th>
                                    <td>{this.state.employee.emailId}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}

export default ViewEmployeeComponent
