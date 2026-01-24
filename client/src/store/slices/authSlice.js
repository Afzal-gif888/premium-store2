// Legacy authSlice retained for reference but no longer used.
// The application now uses Firebase Auth (AuthContext) as the single source
// of truth for authentication. Remove this file once you're confident there
// are no remaining imports.

const initialState = {
  isAuthenticated: false,
  user: null,
};

export default function authReducer(state = initialState, action) {
  // No-op reducer to avoid runtime errors if accidentally imported.
  return state;
}
