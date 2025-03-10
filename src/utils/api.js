async function fetchData (path) {
  try {
    const baseUrl = 'http://localhost:5000'
    const url = `${baseUrl}/${path}`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    // Handle any errors that occurred during the fetch.
    // eslint-disable-next-line no-console
    console.error('Error fetching data:', error)
    throw error // Re-throw the error to be handled by the caller, if needed.
  }
}

const api = {
  getLoanPurposes () {
    return fetchData('loan-purposes')
  },
  getRequestedRepaymentPeriods () {
    return fetchData('requested-repayment-periods')
  },
  getRequestedTermMonths () {
    return fetchData('requested-term-months')
  },
}

export default api
