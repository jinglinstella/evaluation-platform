'use client';

import { useMemo, useEffect, useReducer, useCallback } from 'react';

import axiosInstance, { endpoints, axiosInstance2 } from 'src/utils/axios';

import { AuthContext } from './auth-context';
import { setSession, isValidToken } from './utils';
import { AuthUserType, ActionMapType, AuthStateType } from '../../types';

import sha1 from 'sha1'
import { useRouter, useSearchParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

// NOTE:
// We only build demo at basic level.
// Customer will need to do some extra handling yourself if you want to extend the logic and other features...

// ----------------------------------------------------------------------

enum Types {
  INITIAL = 'INITIAL',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  LOGOUT = 'LOGOUT',
}

type Payload = {
  [Types.INITIAL]: {
    user: AuthUserType;
  };
  [Types.LOGIN]: {
    user: AuthUserType;
  };
  [Types.REGISTER]: {
    user: AuthUserType;
  };
  [Types.LOGOUT]: undefined;
};

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];

// ----------------------------------------------------------------------

const initialState: AuthStateType = {
  user: null,
  loading: true,
};


const reducer = (state: AuthStateType, action: ActionsType) => {
  if (action.type === Types.INITIAL) {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGIN) {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === Types.REGISTER) {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGOUT) {
    return {
      ...state,
      user: null,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

const STORAGE_KEY = 'accessToken';

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const router = useRouter();

  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem(STORAGE_KEY);

      if (accessToken) {
        const res = await axiosInstance.post(endpoints.auth.login, undefined, {
          headers: { token: accessToken }
        })
        
        const user = res.data.user_data;
        
        dispatch({
          type: Types.INITIAL,
          payload: {
            user: {
              ...user,
              accessToken,
            },
          },
        });
      } else {
        dispatch({
          type: Types.INITIAL,
          payload: {
            user: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: Types.INITIAL,
        payload: {
          user: null,
        },
      });
    }
  }, [router]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN - use to generate token, we need to send token to backend again to login
  const login = useCallback(async (email: string, password: string) => {
    const password_hash = sha1(email + password)
    const data = {
      email,
      password_hash
    };

    const res = await axiosInstance.post(endpoints.auth.login, data);
    const { token: accessToken, is_initial_login } = res.data;
    
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("email", email)

    // dispatch({
    //   type: Types.LOGIN,
    //   payload: {
    //     user: {
    //       accessToken,
    //     },
    //   },
    // });
    return is_initial_login as boolean
  }, []);

  // REGISTER
  const register = useCallback(
    async (email: string, password: string, name: string) => {
      const password_hash = sha1(email + password)
      
      const res = await axiosInstance.post(`/accounts/signup?name=${name}&email=${email}&password_hash=${password_hash}`);
      const { accessToken } = res.data;
      const user = { name: name }

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("email", email)

      dispatch({
        type: Types.REGISTER,
        payload: {
          user: {
            ...user,
            accessToken,
          },
        },
      });
    },
    []
  );

  // LOGOUT
  const logout = useCallback(async () => {
    setSession(null);
    dispatch({
      type: Types.LOGOUT,
    });
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'jwt',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      //
      login,
      register,
      logout,
    }),
    [login, logout, register, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
