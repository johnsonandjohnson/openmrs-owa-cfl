import axios from 'axios';
import { ONE, ZERO } from '../../shared/constants/input';
import { DEFAULT_DELIMITER } from '../../shared/constants/address-data';
import { FAILURE, REQUEST, SUCCESS } from '../action-type.util';
import { DEFAULT_PAGE_SIZE } from '../page.util';

export const ACTION_TYPES = {
  GET_ADDRESS_DATA: 'addressData/GET_ADDRESS_DATA',
  GET_ADDRESS_DATA_PAGE: 'addressData/GET_ADDRESS_DATA_PAGE',
  POST_ADDRESS_DATA: 'addressData/POST_ADDRESS_DATA'
};

const initialState = {
  addressData: [],
  currentPage: ONE,
  hasNextPage: false,
  totalCount: ZERO,
  loadingAddressData: false,
  downloadableAddressData: [],
  errorMessage: null,
  addressDataUploading: false,
  invalidAddressData: [],
  numberOfTotalRecords: 0,
  numberOfInvalidRecords: 0
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.GET_ADDRESS_DATA):
    case REQUEST(ACTION_TYPES.GET_ADDRESS_DATA_PAGE):
      return {
        ...state,
        loadingAddressData: true
      };
    case FAILURE(ACTION_TYPES.GET_ADDRESS_DATA):
    case FAILURE(ACTION_TYPES.GET_ADDRESS_DATA_PAGE):
      return {
        ...state
      };
    case SUCCESS(ACTION_TYPES.GET_ADDRESS_DATA):
      return {
        ...state,
        loadingAddressData: false,
        downloadableAddressData: !!action.payload.data.content ? action.payload.data.content.map(content => content.content) : []
      };
    case SUCCESS(ACTION_TYPES.GET_ADDRESS_DATA_PAGE):
      const data = !!action.payload.data.content ? action.payload.data.content.map(content => content.content) : [];
      const currentPage = action.payload.data.pageNumber;
      return {
        ...state,
        addressData: currentPage === ONE ? data : [...state.addressData, ...data],
        hasNextPage: action.payload.data.nextPage,
        currentPage,
        totalCount: action.payload.data.totalCount,
        loadingAddressData: false
      };
    case REQUEST(ACTION_TYPES.POST_ADDRESS_DATA):
      return {
        ...state,
        addressData: [],
        currentPage: ONE,
        hasNextPage: false,
        totalCount: ZERO,
        loadingAddressData: true,
        addressDataUploaded: false,
        addressDataUploading: true
      };
    case FAILURE(ACTION_TYPES.POST_ADDRESS_DATA):
      return {
        ...state,
        errorMessage: action.payload.response.data
      };
    case SUCCESS(ACTION_TYPES.POST_ADDRESS_DATA):
      const { invalidRecords, numberOfInvalidRecords, numberOfTotalRecords } = action.payload.data;
      const invalidAddressData = invalidRecords.map(invalidRecord => invalidRecord.split(','));
      return {
        ...state,
        addressDataUploaded: true,
        loadingAddressData: false,
        errorMessage: null,
        addressDataUploading: false,
        invalidAddressData,
        numberOfInvalidRecords,
        numberOfTotalRecords
      };

    default:
      return state;
  }
};

export const getAddressDataPage = (page: number = ZERO, size: number = DEFAULT_PAGE_SIZE) => {
  const requestUrl = '/openmrs/ws/cfl/address-data';
  return {
    type: ACTION_TYPES.GET_ADDRESS_DATA_PAGE,
    payload: axios.get(requestUrl, {
      params: {
        page: page + 1,
        rows: size
      }
    })
  };
};

export const getAddressData = () => {
  const requestUrl = '/openmrs/ws/cfl/address-data';
  return {
    type: ACTION_TYPES.GET_ADDRESS_DATA,
    payload: axios.get(requestUrl)
  };
};

export const postAddressData = (file: File, isOverwriteAddressData: boolean) => {
  const requestUrl = '/openmrs/ws/cfl/address-data/upload';
  const formData = new FormData();
  formData.append('file', file);
  formData.append('delimeter', DEFAULT_DELIMITER);
  formData.append('userGeneratedIdDelimiter', 'false');
  formData.append('overwrite', `${isOverwriteAddressData}`);
  return {
    type: ACTION_TYPES.POST_ADDRESS_DATA,
    payload: axios.post(requestUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  };
};

export default reducer;
