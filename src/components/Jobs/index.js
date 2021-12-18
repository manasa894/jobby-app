import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import Header from '../Header'
import JobItem from '../JobItem'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    profileData: [],
    jobsData: [],
    checkBoxInput: [],
    radioInput: '',
    searchInput: '',
    apiStatus: apiStatusConstants.initial,
    apiJobStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobDetails()
  }

  getProfileDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const url = 'https://apis.ccbp.in/profile'
    const token = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const fetchedData = [await response.json()]
      const updatedData = fetchedData.map(eachItem => ({
        name: eachItem.profile_details.name,
        profileImageUrl: eachItem.profile_details.profile_image_url,
        shortBio: eachItem.profile_details.short_bio,
      }))
      this.setState({
        profileData: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  getJobDetails = async () => {
    this.setState({apiJobStatus: apiStatusConstants.inProgress})
    const {checkBoxInput, radioInput, searchInput} = this.state
    const token = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs?employment_type=${checkBoxInput.join(
      ',',
    )}&minimum_package=${radioInput}&search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.jobs.map(eachItem => ({
        id: eachItem.id,
        title: eachItem.title,
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        packagePerAnnum: eachItem.package_per_annum,
        rating: eachItem.rating,
      }))
      this.setState({
        jobsData: updatedData,
        apiJobStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiJobStatus: apiStatusConstants.failure})
    }
  }

  onGetRadioOption = event => {
    this.setState({radioInput: event.target.id}, this.getJobDetails)
  }

  onGetInputOption = event => {
    const {checkBoxInput} = this.state
    const checkedItemList = checkBoxInput.filter(
      each => each === event.target.id,
    )
    if (checkedItemList.length === 0) {
      this.setState(
        prevState => ({
          checkBoxInput: [...prevState.checkBoxInput, event.target.id],
        }),
        this.getJobDetails,
      )
    } else {
      const updatedCheckedList = checkBoxInput.filter(
        each => each !== event.target.id,
      )
      this.setState({checkBoxInput: updatedCheckedList}, this.getJobDetails)
    }
  }

  renderProfileView = () => {
    const {profileData} = this.state
    const {name, profileImageUrl, shortBio} = profileData[0]
    return (
      <div className="profile-container">
        <img src={profileImageUrl} className="profile-icon" alt="profile" />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-description">{shortBio}</p>
      </div>
    )
  }

  onRetryProfile = () => {
    this.getProfileDetails()
  }

  renderProfileFailureView = () => (
    <div className="failure-button-container">
      <button
        className="failure-button"
        type="button"
        onClick={this.onRetryProfile}
      >
        retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderProfile = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProfileView()
      case apiStatusConstants.failure:
        return this.renderProfileFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  getJobsView = () => {
    const {jobsData} = this.state
    const noJobs = jobsData.length === 0
    return noJobs ? (
      <div className="no-jobs-container">
        <img
          className="no-jobs-img"
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
        />
        <h1 className="no-job-heading">No jobs found</h1>
        <p>We could not find any jobs. Try other filters.</p>
      </div>
    ) : (
      <ul className="ul-job-items-container">
        {jobsData.map(eachItem => (
          <JobItem key={eachItem.id} jobData={eachItem} />
        ))}
      </ul>
    )
  }

  onRetryJobs = () => {
    this.getJobDetails()
  }

  getJobsFailureView = () => (
    <div className="failure-img-button-container">
      <img
        className="failure-img"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-paragraph">
        we cannot seem to find the page you are looking for
      </p>
      <div className="jobs-failure-button-container">
        <button
          className="failure-button"
          type="button"
          onClick={this.onRetryJobs}
        >
          retry
        </button>
      </div>
    </div>
  )

  renderJobs = () => {
    const {apiJobStatus} = this.state

    switch (apiJobStatus) {
      case apiStatusConstants.success:
        return this.getJobsView()
      case apiStatusConstants.failure:
        return this.getJobsFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  renderSalaryFilters = () => (
    <ul className="radio-button-container">
      {salaryRangesList.map(eachItem => (
        <li className="li-container" key={eachItem.salaryRangeId}>
          <input
            className="radio"
            id={eachItem.salaryRangeId}
            type="radio"
            name="option"
            onChange={this.onGetRadioOption}
          />
          <label className="label" htmlFor={eachItem.salaryRangeId}>
            {eachItem.label}
          </label>
        </li>
      ))}
    </ul>
  )

  renderCheckBoxFilters = () => (
    <ul className="check-boxes-container">
      {employmentTypesList.map(eachItem => (
        <li className="li-container" key={eachItem.employmentTypeId}>
          <input
            className="input"
            id={eachItem.employmentTypeId}
            type="checkbox"
            onChange={this.onGetInputOption}
          />
          <label className="label" htmlFor={eachItem.employmentTypeId}>
            {eachItem.label}
          </label>
        </li>
      ))}
    </ul>
  )

  onClickSearch = () => {
    this.getJobDetails()
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  render() {
    const {searchInput} = this.state

    return (
      <>
        <Header />
        <div className="all-jobs-container">
          <div className="mobile-search-container">
            <input
              type="search"
              value={searchInput}
              placeholder="Search"
              className="search-input"
              onChange={this.onChangeSearchInput}
            />
            <button
              type="button"
              className="search-button"
              onClick={this.onClickSearch}
              testid="searchButton"
            >
              <BsSearch className="search-icon" />
            </button>
          </div>
          <div className="side-bar-container">
            {this.renderProfile()}
            <hr className="hr-line" />
            <h1 className="text">Type of Employment</h1>
            {this.renderCheckBoxFilters()}
            <hr className="hr-line" />
            <h1 className="text">Salary Range</h1>
            {this.renderSalaryFilters()}
          </div>
          <div className="jobs-container">
            <div className="search-container">
              <input
                type="search"
                value={searchInput}
                placeholder="Search"
                className="search-input"
                onChange={this.onChangeSearchInput}
              />
              <button
                type="button"
                className="search-button"
                onClick={this.onClickSearch}
                testid="searchButton"
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.renderJobs()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
