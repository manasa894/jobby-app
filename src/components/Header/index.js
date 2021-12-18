import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {AiFillHome} from 'react-icons/ai'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'
import './index.css'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="nav_container">
      <ul className="header_container">
        <li className="logo_container">
          <Link className="link" to="/">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="logo"
            />
          </Link>
        </li>
        <li className="icons_container">
          <Link className="link" to="/">
            <AiFillHome className="icon" />
          </Link>
          <Link className="link" to="/jobs">
            <BsFillBriefcaseFill className="icon" />
          </Link>
          <button
            type="button"
            onClick={onClickLogout}
            className="logout-icon-btn"
          >
            <FiLogOut className="icon" />
          </button>
        </li>
        <li className="home_jobs_container">
          <Link className="link" to="/">
            <h1 className="nav_text">Home</h1>
          </Link>
          <Link className="link" to="/jobs">
            <h1 className="nav_text">Jobs</h1>
          </Link>
        </li>
        <li className="btn_container">
          <button type="button" className="logout_btn" onClick={onClickLogout}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default withRouter(Header)
