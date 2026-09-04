import React, { Component } from 'react';
import AuthService from '../services/AuthService';

class ProfileComponent extends Component {
    constructor(props) {
        super(props);
        const user = JSON.parse(localStorage.getItem('authUser') || '{}');
        this.state = {
            id: user.id,
            nickname: user.nickname || '',
            email: user.email || '',
            phone: user.phone || '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
            message: '',
            error: ''
        };
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value, error: '', message: '' });
    };

    updateProfile = (event) => {
        event.preventDefault();
        const { id, nickname, email, phone, currentPassword, newPassword, confirmPassword } = this.state;
        if (!id) {
            this.setState({ error: 'Please sign in again before editing your profile' });
            return;
        }
        AuthService.updateProfile(id, { nickname, email, phone, currentPassword, newPassword, confirmPassword })
            .then((response) => {
                const user = { id: response.data.id, nickname: response.data.nickname, email: response.data.email, phone: response.data.phone };
                localStorage.setItem('authUser', JSON.stringify(user));
                window.dispatchEvent(new Event('profileUpdated'));
                this.setState({ ...user, currentPassword: '', newPassword: '', confirmPassword: '', message: response.data.message, error: '' });
            })
            .catch((error) => {
                const message = error.response && error.response.data && error.response.data.message;
                this.setState({ error: message || 'Profile update failed. Please try again.', message: '' });
            });
    };

    render() {
        return (
            <div className="employee-view-page profile-page">
                <div className="card employee-details-card">
                    <h3 className="text-center employee-details-title">My Profile</h3>
                    <div className="card-body">
                        {this.state.message && <div className="alert alert-success">{this.state.message}</div>}
                        {this.state.error && <div className="alert alert-danger">{this.state.error}</div>}
                        <form onSubmit={this.updateProfile}>
                            <div className="form-group"><label>Nickname</label><input className="form-control" name="nickname" value={this.state.nickname} onChange={this.handleChange} required /></div>
                            <div className="form-group"><label>Email</label><input type="email" className="form-control" name="email" value={this.state.email} onChange={this.handleChange} required /></div>
                            <div className="form-group"><label>Phone</label><input type="tel" className="form-control" name="phone" value={this.state.phone} onChange={this.handleChange} required /></div>
                            <hr />
                            <h5>Change password</h5>
                            <div className="form-group"><label>Current password</label><input type="password" className="form-control" name="currentPassword" value={this.state.currentPassword} onChange={this.handleChange} /></div>
                            <div className="form-group"><label>New password</label><input type="password" className="form-control" name="newPassword" value={this.state.newPassword} onChange={this.handleChange} /></div>
                            <div className="form-group"><label>Confirm new password</label><input type="password" className="form-control" name="confirmPassword" value={this.state.confirmPassword} onChange={this.handleChange} /></div>
                            <button className="btn btn-primary" type="submit">Save changes</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default ProfileComponent;
