import {
  checkInternetConnection,
  manageApiResponseCode,
} from '../Util/Utilities';
import config from '../config';
import modules from './index';
const showLog = false ;

const GetApiCall = async (
  url,
  header,
  showNoInternetMessage = true,
  manageApiResponse = true,
) => {
  const isInternet = await checkInternetConnection();

  if (!isInternet) {
    if (showNoInternetMessage) {
      modules.DropDownAlert.showAlert(
        'error',
        config.I18N.t('no_internet_title'),
        config.I18N.t('no_internet_msg'),
      );
    }
    return null;
  }
  const start = new Date();
  const rawResponse = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: !!config.Constant.USER_DATA.token
        ? `Bearer ${config.Constant.USER_DATA.token}`
        : '',
      AuthorizationUser: config.ApiEndpoint.AUTH_HEADER,
      'X-localization': config.Constant.isRTL ? 'ar' : 'en',
    },
  })
    .then(async(r) =>{
      showLog && console.log("RESPONSE-1--",new Date() - start, url)  
      return await r.json()})
    .catch((exc) => {
      showLog && console.log('Response exc: 1', exc, url);
      config.Constant.showLoader.hideLoader();
      modules.DropDownAlert.showAlert(
        'error',
        '',
        config.I18N.t('somethingWentWrong'),
      );
      return null;
    });
    showLog && console.log("RESPONSE-2--",new Date() - start, url)  
  if (!manageApiResponse) {
    showLog && console.log('rawResponse1-1',url, rawResponse);
    return null;
  } else if (rawResponse === null) {
    showLog && console.log('rawResponse2-2',url, rawResponse);
    return null;
  } else if (rawResponse.status_code === undefined) {
    showLog && console.log('rawResponse3-3',url, rawResponse);
    return rawResponse;
  } else if (
    rawResponse.status_code === 200 ||
    rawResponse.status_code === 101
  ) {
    showLog && console.log('rawResponse4-4',url, JSON.stringify(rawResponse));
    return rawResponse;
  } else {
    showLog && console.log('rawResponse5-5',url, rawResponse);
    console.log(url,"urlurlurlurl",rawResponse);
    manageApiResponseCode(rawResponse);
    return null;
  }
};

const PostApiCall = async (
  url,
  payLoad,
  header,
  showNoInternetMessage = true,
  manageApiResponse = true,
) => {
  const isInternet = await checkInternetConnection();
  if (!isInternet) {
    if (showNoInternetMessage) {
      modules.DropDownAlert.showAlert(
        'error',
        config.I18N.t('no_internet_title'),
        config.I18N.t('no_internet_msg'),
      );
    }
    return null;
  }

  if (!!payLoad && Object.keys(payLoad).length > 0) {

    showLog && console.log(config.Constant.USER_DATA, "token")
    const start = new Date();
    showLog && console.log("headers- ", {Authorization: config.Constant.USER_DATA != null
          ? `Bearer ${config.Constant.USER_DATA.token}`
          : '',
        AuthorizationUser: config.ApiEndpoint.AUTH_HEADER,
        'X-localization': config.Constant.isRTL ? 'ar' : 'en',})
    const rawResponse = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: config.Constant.USER_DATA != null
          ? `Bearer ${config.Constant.USER_DATA.token}`
          : '',
        AuthorizationUser: config.ApiEndpoint.AUTH_HEADER,
        'X-localization': config.Constant.isRTL ? 'ar' : 'en',
      },
      body: payLoad,
    })
      .then(async(response) =>{
        showLog && console.log("RESPONSE-1--",new Date() - start, url)  
        return await response.json()})
      .then((response) => {
        showLog && console.log('PostApiCall Response Json:', JSON.stringify(response));
        return response;
      })
      .catch((exc) => {
        showLog && console.log('Response exc: 2', exc, url);
        config.Constant.showLoader.hideLoader();
        modules.DropDownAlert.showAlert(
          'error',
          '',
          config.I18N.t('somethingWentWrong'),
        );
        return null;
      });
      showLog && console.log("RESPONSE-2--",new Date() - start, url, payLoad)  
    if (!manageApiResponse) {
      showLog && console.log('PostApiCall rawResponse1',url, rawResponse);
      return null;
    } else if (rawResponse === null) {
      showLog && console.log('PostApiCall rawResponse2',url, rawResponse);
      return rawResponse;
    } else if (rawResponse.status_code === undefined) {
      showLog && console.log('PostApiCall rawResponse3',url, rawResponse);
      return rawResponse;
    } else if (
      rawResponse?.status_code === 200 ||
      rawResponse?.status_code === 101
    ) {

      showLog && console.log('PostApiCall rawResponse4',url, JSON.stringify(rawResponse));
      return rawResponse;
    } else {

      showLog && console.log('PostApiCall rawResponse5',url, rawResponse);
      console.log(url,"urlurlurlurl",rawResponse);
      manageApiResponseCode(rawResponse);
    }
  } else {
    showLog && console.log(config.Constant.USER_DATA, "token")
    const start = new Date();

    const rawResponse = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: config.Constant.USER_DATA != null
          ? `Bearer ${config.Constant.USER_DATA.token}`
          : '',
        AuthorizationUser: config.ApiEndpoint.AUTH_HEADER,
        'X-localization': config.Constant.isRTL ? 'ar' : 'en',
      },
    })
      .then(async (r) =>{
        showLog && console.log("RESPONSE-1--",new Date() - start, url)  
        return await r.json()})
      .catch((exc) => {
        showLog && console.log('Response exc: 3', exc, url);
          modules.DropDownAlert.showAlert(
          'error',
          '',
          config.I18N.t('somethingWentWrong'),
        );
        return null;
      });
      showLog && console.log("RESPONSE-2--",new Date() - start, url)  
    if (!manageApiResponse) {
      return null;
    } else if (rawResponse === null) {
      return null;
    } else if (rawResponse.status_code === undefined) {
      return rawResponse;
    } else if (
      rawResponse.status_code === 200 ||
      rawResponse.status_code === 101
    ) {
      return rawResponse;
    } else {
      console.log(url,"urlurlurlurl",rawResponse);
      manageApiResponseCode(rawResponse);
      return null;
    }
  }
};

const PostApiCall2 = async (
  url,
  payLoad,
  header,
  showNoInternetMessage = true,
  manageApiResponse = true,
) => {
  console.log(url,"PostApiCall2PostApiCall2");
  const isInternet = await checkInternetConnection();
  if (!isInternet) {
    if (showNoInternetMessage) {
      modules.DropDownAlert.showAlert(
        'error',
        config.I18N.t('no_internet_title'),
        config.I18N.t('no_internet_msg'),
      );
    }
    return null;
  }

  if (!!payLoad && Object.keys(payLoad).length > 0) {

    showLog && console.log(config.Constant.USER_DATA, "token")
    const start = new Date();

    const rawResponse = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: config.Constant.USER_DATA != null
          ? `Bearer ${config.Constant.USER_DATA.token}`
          : '',
        AuthorizationUser: config.ApiEndpoint.AUTH_HEADER,
        'X-localization': config.Constant.isRTL ? 'ar' : 'en',
        'Accept': 'application/json', 
        'Content-Type': 'application/json',
      }
    })
      .then(async (response) =>{
        showLog &&  console.log("RESPONSE-1--",new Date() - start, url)  
        return await response.json()})
      .then((response) => {
        showLog && console.log('PostApiCall Response Json:', JSON.stringify(response));
        return response;
      })
      .catch((exc) => {
        showLog && console.log('Response exc: 2', exc, url);
        config.Constant.showLoader.hideLoader();
        modules.DropDownAlert.showAlert(
          'error',
          '',
          config.I18N.t('somethingWentWrong'),
        );
        return null;
      });
      showLog && console.log("RESPONSE-2--",new Date() - start, url)  
    if (!manageApiResponse) {
      showLog && console.log('PostApiCall rawResponse1',url, rawResponse);
      return null;
    } else if (rawResponse === null) {
      showLog && console.log('PostApiCall rawResponse2',url, rawResponse);
      return rawResponse;
    } else if (rawResponse.status_code === undefined) {
      showLog && console.log('PostApiCall rawResponse3',url, rawResponse);
      return rawResponse;
    } else if (
      rawResponse?.status_code === 200 ||
      rawResponse?.status_code === 101
    ) {

      showLog && console.log('PostApiCall rawResponse4',url, JSON.stringify(rawResponse));
      return rawResponse;
    } else {

      showLog && console.log('PostApiCall rawResponse5',url, rawResponse);
      console.log(url,"urlurlurlurl",rawResponse);
      manageApiResponseCode(rawResponse);
    }
  } else {
    showLog && console.log(config.Constant.USER_DATA, "token")
    const start = new Date();

    const rawResponse = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: config.Constant.USER_DATA != null
          ? `Bearer ${config.Constant.USER_DATA.token}`
          : '',
        AuthorizationUser: config.ApiEndpoint.AUTH_HEADER,
        'X-localization': config.Constant.isRTL ? 'ar' : 'en',
      },
    })
      .then(async (r) =>{
        showLog && console.log("RESPONSE-1--",new Date() - start, url)  
        return await r.json()})
      .catch((exc) => {
        showLog && console.log('Response exc: 3', exc, url);
          modules.DropDownAlert.showAlert(
          'error',
          '',
          config.I18N.t('somethingWentWrong'),
        );
        return null;
      });
      showLog && console.log("RESPONSE-2--",new Date() - start, url)  
    if (!manageApiResponse) {
      return null;
    } else if (rawResponse === null) {
      return null;
    } else if (rawResponse.status_code === undefined) {
      return rawResponse;
    } else if (
      rawResponse.status_code === 200 ||
      rawResponse.status_code === 101
    ) {
      return rawResponse;
    } else {
      console.log(url,"urlurlurlurl",rawResponse);
      manageApiResponseCode(rawResponse);
      return null;
    }
  }
};

export default {
  GetApiCall,
  PostApiCall,
  PostApiCall2
};
