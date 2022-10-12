export function extractErrorMessage (error: any, apiType = null, defaultMessage = 'An error occurred!') {
  if (!apiType) {
    return error.response && error.response.data && error.response.data.message
      ? error.response.data.message
      : defaultMessage || error.toString()
  }
}

export const hasRecaptchaKey = function () {
  return process.env.VUE_APP_RECAPTCHA_ENABLED === 'true' && !!process.env.VUE_APP_RECAPTCHA_SITE_KEY;
}
