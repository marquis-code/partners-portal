export function extractErrorMessage (error: any, apiType = null, defaultMessage = 'An error occurred!') {
  if (!apiType) {
    return error.response && error.response.data && error.response.data.message
      ? error.response.data.message
      : defaultMessage || error.toString()
  }
}
