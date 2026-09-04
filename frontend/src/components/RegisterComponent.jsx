import React, { Component } from 'react';
import AuthService from '../services/AuthService';

class RegisterComponent extends Component {
    state = {
        nickname: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        message: '',
        error: ''
    };

    feedbackTimer = null;

    componentWillUnmount() {
        clearTimeout(this.feedbackTimer);
    }

    showFeedback = (message, type) => {
        clearTimeout(this.feedbackTimer);
        this.setState({ message: type === 'success' ? message : '', error: type === 'error' ? message : '' });
        this.feedbackTimer = setTimeout(() => this.setState({ message: '', error: '' }), 3000);
    };

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value, error: '' });
    };

    register = (event) => {
        event.preventDefault();
        const { nickname, email, phone, password, confirmPassword } = this.state;
        if (password !== confirmPassword) {
            this.showFeedback('Passwords do not match', 'error');
            return;
        }
        AuthService.register({ nickname, email, phone, password })
            .then((response) => this.showFeedback(response.data.message, 'success'))
            .catch((error) => {
                const message = error.response && error.response.data && error.response.data.message;
                this.showFeedback(message || 'Registration failed. Please try again.', 'error');
            });
    };

    render() {
        return (
            <div className="auth-page">
                {(this.state.message || this.state.error) && (
                    <div className={`auth-feedback ${this.state.message ? 'success' : 'error'}`} role="alert">
                        {this.state.message || this.state.error}
                    </div>
                )}
                <div className="card auth-card register-card">
                    <span className="auth-kicker auth-kicker-dark">GET STARTED</span>
                    <h2>Create an account</h2>
                    <p className="text-muted">Set up your employee workspace access.</p>
                    <form onSubmit={this.register}>
                        <div className="form-group"><input aria-label="Nickname" placeholder="Nickname" className="form-control" name="nickname" value={this.state.nickname} onChange={this.handleChange} required /></div>
                        <div className="form-group"><input type="email" aria-label="Email address" placeholder="Email address" className="form-control" name="email" value={this.state.email} onChange={this.handleChange} required /></div>
                        <div className="form-group"><input type="tel" aria-label="Phone number" placeholder="Phone number" className="form-control" name="phone" value={this.state.phone} onChange={this.handleChange} required /></div>
                        <div className="form-group"><input type="password" aria-label="Password" placeholder="Password" className="form-control" name="password" value={this.state.password} onChange={this.handleChange} required /></div>
                        <div className="form-group confirm-password-group"><input type="password" aria-label="Confirm password" placeholder="Confirm password" className="form-control" name="confirmPassword" value={this.state.confirmPassword} onChange={this.handleChange} required /></div>
                        <button className="btn btn-success btn-block" type="submit">Create account</button>
                    </form>
                    <button className="btn btn-link btn-block auth-register-link" onClick={() => this.props.history.push('/')}>Already have an account? Sign in</button>
                </div>
            </div>
        );
    }
}

export default RegisterComponent;
