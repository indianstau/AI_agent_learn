import React, { Component } from 'react';
import AuthService from '../services/AuthService';

class LoginComponent extends Component {
    state = {
        loginType: 'email',
        identifier: '',
        password: '',
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

    changeLoginType = (event) => {
        this.setState({ loginType: event.target.value, identifier: '', error: '' });
    };

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value, error: '' });
    };

    login = (event) => {
        event.preventDefault();
        const { loginType, identifier, password } = this.state;
        AuthService.login({ loginType, identifier, password })
            .then((response) => {
                localStorage.setItem('authUser', JSON.stringify({
                    id: response.data.id,
                    nickname: response.data.nickname,
                    email: response.data.email,
                    phone: response.data.phone
                }));
                this.showFeedback(response.data.message, 'success');
                setTimeout(() => this.props.history.push('/employees'), 1500);
            })
            .catch((error) => {
                const message = error.response && error.response.data && error.response.data.message;
                this.showFeedback(message || 'Login failed. Please try again.', 'error');
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
                <div className="auth-visual">
                    <div className="auth-visual-content">
                        <span className="auth-kicker">EMPLOYEE MANAGEMENT</span>
                        <h1>Work with<br />confidence.</h1>
                        <p>A clear space for your people, projects and progress.</p>
                    </div>
                </div>
                <div className="card auth-card login-card">
                    <span className="auth-kicker auth-kicker-dark">WELCOME BACK</span>
                    <h2>Sign in</h2>
                    <p className="text-muted">employee workspace.</p>
                    <form onSubmit={this.login}>
                        <div className="form-group">
                            <label>Sign in with</label>
                            <div className="auth-tabs" role="tablist" aria-label="Sign in method">
                                <button type="button" role="tab" aria-selected={this.state.loginType === 'email'} className={`auth-tab ${this.state.loginType === 'email' ? 'active' : ''}`} onClick={() => this.changeLoginType({ target: { value: 'email' } })}>
                                    <span className="auth-choice-icon" aria-hidden="true">&#9993;</span>
                                </button>
                                <button type="button" role="tab" aria-selected={this.state.loginType === 'phone'} className={`auth-tab ${this.state.loginType === 'phone' ? 'active' : ''}`} onClick={() => this.changeLoginType({ target: { value: 'phone' } })}>
                                    <span className="auth-choice-icon" aria-hidden="true">&#9742;</span>
                                </button>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="auth-input-wrap password-input-wrap">
                                <span className="auth-input-icon" aria-hidden="true">{this.state.loginType === 'email' ? '\u2709' : '\u260e'}</span>
                                <input aria-label={this.state.loginType === 'email' ? 'Email address' : 'Phone number'} placeholder={this.state.loginType === 'email' ? 'Email address' : 'Phone number'} className="form-control" name="identifier" value={this.state.identifier} onChange={this.handleChange} required />
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="auth-input-wrap">
                                <span className="auth-input-icon" aria-hidden="true">&#128274;</span>
                                <input type="password" aria-label="Password" placeholder="Password" className="form-control" name="password" value={this.state.password} onChange={this.handleChange} required />
                            </div>
                        </div>
                        <button className="btn btn-primary btn-block" type="submit">Sign in</button>
                    </form>
                    <button className="btn btn-link btn-block auth-register-link" onClick={() => this.props.history.push('/register')}>New here? Create an account</button>
                </div>
            </div>
        );
    }
}

export default LoginComponent;
