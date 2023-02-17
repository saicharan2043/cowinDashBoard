// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'

import VaccinationByAge from '../VaccinationByAge'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationCoverage from '../VaccinationCoverage'
import './index.css'

const dispalystatus = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

class CowinDashboard extends Component {
  state = {userData: [], status: dispalystatus.loading}

  componentDidMount() {
    this.getUserData()
  }

  getUserData = async () => {
    this.setState({status: dispalystatus.loading})
    const url = 'https://apis.ccbp.in/covid-vaccination-data'
    const option = {
      method: 'GET',
    }
    const response = await fetch(url, option)
    if (response.ok === true) {
      const data = await response.json()
      const valueOfVaccineDate = data.last_7_days_vaccination.map(echValue => ({
        dose1: echValue.dose_1,
        dose2: echValue.dose_2,
        vaccineDate: echValue.vaccine_date,
      }))

      const updatedData = {
        last7DaysVaccineData: [...valueOfVaccineDate],
        GenderByVaccination: [...data.vaccination_by_gender],
        AgeByVaccination: [...data.vaccination_by_age],
      }
      this.setState({userData: updatedData, status: dispalystatus.success})
    } else {
      this.setState({status: dispalystatus.failure})
    }
  }

  renderFailuer = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="failure-text">Something went worng</h1>
    </div>
  )

  renderSuccess = () => {
    const {userData} = this.state
    const {
      last7DaysVaccineData,
      GenderByVaccination,
      AgeByVaccination,
    } = userData

    return (
      <>
        <VaccinationCoverage last7DaysVaccineData={last7DaysVaccineData} />
        <VaccinationByGender GenderByVaccination={GenderByVaccination} />
        <VaccinationByAge AgeByVaccination={AgeByVaccination} />
      </>
    )
  }

  loader = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  displayElement = () => {
    const {status} = this.state
    switch (status) {
      case dispalystatus.success:
        return this.renderSuccess()
      case dispalystatus.failure:
        return this.renderFailuer()
      case dispalystatus.loading:
        return this.loader()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="bg-color">
        <div className="log-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
            className="logo"
          />
          <h1 className="logo-text">Co-WIN</h1>
        </div>

        <h1 className="discription">CoWIN Vaccination in india</h1>
        {this.displayElement()}
      </div>
    )
  }
}

export default CowinDashboard
