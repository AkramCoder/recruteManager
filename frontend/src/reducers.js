const initialState = {
    email: '',
    password: '',

    isLoading: false,
    isAuthenticated: false,
    user: null,
    error: null,
};

export function reducer(state = initialState, action) {
    switch (action.type) {
        case 'SIGN_UP':
        return {
            ...state,
            email: action.payload.email,
            password: action.payload.password,

        };
        default:
        return state;
    }
}

export const authReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'LOGIN_USER_REQUEST':
        return {
          ...state,
          isLoading: true,
          error: null,
        };
      case 'LOGIN_USER_SUCCESS':
        return {
          ...state,
          isLoading: false,
          isAuthenticated: true,
          user: action.payload,
          error: null,
        };
      case 'LOGIN_USER_FAILURE':
        return {
          ...state,
          isLoading: false,
          isAuthenticated: false,
          user: null,
          error: action.payload,
        };
      default:
        return state;
    }
  };

const managerState = {
  user: null,
  manager: null,
  address: null,
  error: null,
  loading: false,
};

export const managerReducer = (state = managerState, action) => {
  switch (action.type) {
    case 'SIGNUP_USER_REQUEST':
      return { ...state, loading: true };
    case 'SIGNUP_USER_SUCCESS':
      console.log('SIGNUP_USER_SUCCESS---->', state)
      return { ...state, user: action.payload, loading: false };
    case 'SIGNUP_USER_FAILURE':
      console.log(action.payload)
      return { ...state, error: action.payload, loading: false };
    case 'updateCustom_USER_REQUEST':
      return { ...state, loading: true };
    case 'updateCustom_USER_SUCCESS':
      console.log('updateCustom_USER_SUCCESS------>', state)
      return { ...state, user: action.payload, loading: false };
    case 'updateCustom_USER_FAILURE':
      console.log(action.payload)
      return { ...state, error: action.payload, loading: false };
    case 'CREATE_MANAGER_REQUEST':
      return { ...state, loading: true };
    case 'CREATE_MANAGER_SUCCESS':
      return { ...state, manager: action.payload, loading: false };
    case 'CREATE_MANAGER_FAILURE':
      return { ...state, error: action.payload, loading: false };
    case 'CREATE_ADDRESS_REQUEST':
      return { ...state, loading: true };
    case 'CREATE_ADDRESS_SUCCESS':
      return { ...state, address: action.payload, loading: false };
    case 'CREATE_ADDRESS_FAILURE':
      return { ...state, error: action.payload, loading: false };
    case 'CREATE_PERMISSION_REQUEST':
      return { ...state, loading: true };
    case 'CREATE_PERMISSION_SUCCESS':
      return { ...state, address: action.payload, loading: false };
    case 'CREATE_PERMISSION_FAILURE':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};
  
