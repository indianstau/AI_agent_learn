import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'

class HeaderComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            menuOpen: false
        }
    }

    componentDidUpdate(previousProps) {
        if (previousProps.location.pathname !== this.props.location.pathname && this.state.menuOpen) {
            this.setState({ menuOpen: false });
        }
    }

    componentDidMount() {
        this.profileUpdated = () => this.forceUpdate();
        window.addEventListener('profileUpdated', this.profileUpdated);
    }

    componentWillUnmount() {
        window.removeEventListener('profileUpdated', this.profileUpdated);
    }

    render() {
        const isAuthPage = this.props.location.pathname === '/' || this.props.location.pathname === '/register';
        const user = JSON.parse(localStorage.getItem('authUser') || 'null');

        if (isAuthPage || !user) {
            return null;
        }

        return (
            <div>
                <header>
                    <nav className="navbar app-navbar">
                    <Link to="/employees" className="app-nav-brand">Employees List</Link>
                    <div className="app-nav-actions">
                        <Link to="/profile" className="app-user-name"><span className="app-user-icon" aria-hidden="true"></span>{user.nickname || 'User'}</Link>
                        <button type="button" className="app-menu-button" aria-label="Open navigation menu" onClick={() => this.setState({ menuOpen: !this.state.menuOpen })}>
                            <span></span><span></span><span></span>
                        </button>
                        {this.state.menuOpen && (
                            <div className="app-menu">
                                <Link to="/profile" onClick={() => this.setState({ menuOpen: false })}>My Profile</Link>
                                <button type="button" onClick={() => { localStorage.removeItem('authUser'); this.setState({ menuOpen: false }); this.props.history.push('/'); }}>Sign out</button>
                            </div>
                        )}
                    </div>
                    </nav>
                </header>
            </div>
        )
    }
}

export default withRouter(HeaderComponent)
