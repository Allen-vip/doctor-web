import axios from "axios";

let base = "";
let api_base = "http://localhost:10000/api/v2.0/admin";
export const API_NEW_VERSION = process.env.API_HOST + "/api/v2.0/admin";
export const API_HOST = process.env.API_HOST;

//export const requestLogin = params => { return axios.post(API_NEW_VERSION + '/login', params).then(res => res.data); };

export const getUserList = params => {
  return axios.get(API_NEW_VERSION + "/user/list", { params: params });
};

export const getUserListPage = params => {
  return axios.get(API_NEW_VERSION + "/user/listpage", { params: params });
};

export const removeUser = params => {
  return axios.get(API_NEW_VERSION + "/user/remove", { params: params });
};

export const batchRemoveUser = params => {
  return axios.get(API_NEW_VERSION + "/user/batchremove", { params: params });
};

export const editUser = params => {
  return axios.get(API_NEW_VERSION + "/user/edit", { params: params });
};

export const addUser = params => {
  return axios.get(API_NEW_VERSION + "/user/add", { params: params });
};

export const requestLogin = params => {
  return axios.post(API_NEW_VERSION + "/login", params);
};
export const getDeviceListPage = params => {
  return axios.get(API_NEW_VERSION + "/device/page", { params: params });
};
export const removeDevice = params => {
  return axios.delete(API_NEW_VERSION + "/device/del", { params: params });
};
export const batchRemoveDevice = params => {
  return axios.get(API_NEW_VERSION + "/device/batchdel", { params: params });
};
export const updateDevice = params => {
  return axios.put(API_NEW_VERSION + "/device/update", params);
};
export const addDevice = params => {
  return axios.post(API_NEW_VERSION + "/device/add", params);
};
export const getDeviceList = params => {
  return axios.get(API_NEW_VERSION + "/device/listall", { params: params });
};
export const apiGetBlacklistICCardPage = params => {
  return axios.get(API_NEW_VERSION + "/blacklisticcard/page", {
    params: params
  });
};
export const apiBatchRemoveBlICCard = params => {
  return axios.get(API_NEW_VERSION + "/blacklisticcard/batchdel", {
    params: params
  });
};
export const apiRemoveBlacklistICCard = params => {
  return axios.delete(API_NEW_VERSION + "/blacklisticcard/del", {
    params: params
  });
};
export const apiGetICCardList = params => {
  return axios.get(API_NEW_VERSION + "/iccard/listall", { params: params });
};
export const apiBatchAddICCardToBlacklist = params => {
  return axios.post(API_NEW_VERSION + "/blacklisticcard/batchadd", params);
};
export const apiGetBlacklistFacePage = params => {
  return axios.get(API_NEW_VERSION + "/blacklistface/page", { params: params });
};
export const apiBatchRemoveBlFace = params => {
  return axios.get(API_NEW_VERSION + "/blacklistface/batchdel", {
    params: params
  });
};
export const apiRemoveBlacklistFace = params => {
  return axios.delete(API_NEW_VERSION + "/blacklistface/del", {
    params: params
  });
};
export const apiGetFaceList = params => {
  return axios.get(API_NEW_VERSION + "/face/listall", { params: params });
};
export const apiBatchAddFaceToBlacklist = params => {
  return axios.post(API_NEW_VERSION + "/blacklistface/batchadd", params);
};

export const apiGetICCardPage = params => {
  return axios.get(API_NEW_VERSION + "/iccard/page", { params: params });
};
export const apiRemoveICCard = params => {
  return axios.delete(API_NEW_VERSION + "/iccard/del", { params: params });
};
export const apiBatchRemoveICCard = params => {
  return axios.get(API_NEW_VERSION + "/iccard/batchdel", { params: params });
};
export const apiUpdateICCard = params => {
  return axios.put(API_NEW_VERSION + "/iccard/update", params);
};
export const apiAddICCard = params => {
  return axios.post(API_NEW_VERSION + "/iccard/add", params);
};
export const apiGetFacePage = params => {
  return axios.get(API_NEW_VERSION + "/face/page", { params: params });
};
export const apiRemoveFace = params => {
  return axios.delete(API_NEW_VERSION + "/face/del", { params: params });
};
export const apiBatchRemoveFace = params => {
  return axios.get(API_NEW_VERSION + "/face/batchdel", { params: params });
};
export const apiUpdateFace = params => {
  return axios.put(API_NEW_VERSION + "/face/update", params);
};
export const apiAddFace = params => {
  return axios.post(API_NEW_VERSION + "/face/add", params);
};

export const apiGetUserList = params => {
  return axios.get(API_NEW_VERSION + "/users/listall", { params: params });
};
export const apiGetUserPage = params => {
  return axios.get(API_NEW_VERSION + "/users/page", { params: params });
};
export const apiRemoveUser = params => {
  return axios.delete(API_NEW_VERSION + "/users/del", { params: params });
};
export const apiBatchRemoveUser = params => {
  return axios.get(API_NEW_VERSION + "/users/batchdel", { params: params });
};
export const apiUpdateUser = params => {
  return axios.put(API_NEW_VERSION + "/users/update", params);
};
export const apiAddUser = params => {
  return axios.post(API_NEW_VERSION + "/users/add", params);
};
export const apiAddConfig = params => {
  return axios.post(API_NEW_VERSION + "/config/update", params);
};
export const apiAddConfigQuery = params => {
  return axios.post(API_NEW_VERSION + "/config/query", params);
};
export const gateEvents = params => {
  return axios.post(API_NEW_VERSION + "/gateevent/getByUserAliaId", params);
};
export const getByAgeRange = params => {
  return axios.post(API_NEW_VERSION + "/users/getByAgeRange", params);
};
export const apiGenUserId = params => {
  return axios.get(API_NEW_VERSION + "/users/genuserid", { params: params });
};

export const apiGetGateEventList = params => {
  return axios.get(API_NEW_VERSION + "/gateevent/listall", { params: params });
};
export const apiGetGateEventPage = params => {
  return axios.get(API_NEW_VERSION + "/gateevent/page", { params: params });
};

export const apiGetDevcfgByDevId = params => {
  return axios.get(API_NEW_VERSION + "/devcfg/getbydevid", { params: params });
};
export const apiUpdateDevcfg = params => {
  return axios.put(API_NEW_VERSION + "/devcfg/update", params);
};

export const apiGetLongConnState = params => {
  return axios.get(API_NEW_VERSION + "/busi/long_conn_state", {
    params: params
  });
};
export const apiGetPtuidList = params => {
  return axios.get(API_NEW_VERSION + "/busi/get_ptuid_list", {
    params: params
  });
};
export const apiGetPtuidCandidateList = params => {
  return axios.get(API_NEW_VERSION + "/busi/get_ptuid_candidate_list", {
    params: params
  });
};
export const apiAssignAppKey = params => {
  return axios.get(API_NEW_VERSION + "/busi/assign_key", { params: params });
};

export const apiGetAccountList = params => {
  return axios.get(API_NEW_VERSION + "/account/listall", { params: params });
};
export const apiGetAccountPage = params => {
  return axios.get(API_NEW_VERSION + "/account/page", { params: params });
};
export const apiRemoveAccount = params => {
  return axios.delete(API_NEW_VERSION + "/account/del", { params: params });
};
export const apiBatchRemoveAccount = params => {
  return axios.get(API_NEW_VERSION + "/account/batchdel", { params: params });
};
export const apiUpdateAccount = params => {
  return axios.put(API_NEW_VERSION + "/account/update", params);
};
export const apiAddAccount = params => {
  return axios.post(API_NEW_VERSION + "/account/add", params);
};
export const apiAccountUpdatePasswd = params => {
  return axios.put(API_NEW_VERSION + "/account/updatepasswd", params);
};

export const apiGetAccountPtuidList = params => {
  return axios.get(API_NEW_VERSION + "/device_assign/listallbyaccountid", {
    params: params
  });
};
export const apiGetAccountPtuidCandidateList = params => {
  return axios.get(
    API_NEW_VERSION + "/device_assign/get_ptuid_candidate_list",
    { params: params }
  );
};
export const apiDeviceAssignBatchDel = params => {
  return axios.get(API_NEW_VERSION + "/device_assign/batchdel", {
    params: params
  });
};
export const apiDeviceAssignBatchAdd = params => {
  return axios.get(API_NEW_VERSION + "/device_assign/batchadd", {
    params: params
  });
};

export const apiTestAesDecrypt = params => {
  return axios.get(API_NEW_VERSION + "/aes/decrypt", { params: params });
};
