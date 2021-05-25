import { IBreadcrumb } from '../../shared/models/breadcrumb';

export const ACTION_TYPES = {
  ADD_BREADCRUMBS: 'breadcrumbs/ADD',
  RESET_BREADCRUMBS: 'breadcrumbs/RESET'
};

const initialState = {
  additionalBreadcrumbs: [] as IBreadcrumb[]
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPES.ADD_BREADCRUMBS:
      return {
        ...state,
        additionalBreadcrumbs: state.additionalBreadcrumbs.concat(action.meta.breadcrumbs)
      };
    case ACTION_TYPES.RESET_BREADCRUMBS:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

// actions
export const addBreadcrumbs = (breadcrumbs: IBreadcrumb[]) => ({
  type: ACTION_TYPES.ADD_BREADCRUMBS,
  meta: {
    breadcrumbs
  }
});

export const resetBreadcrumbs = () => ({
  type: ACTION_TYPES.RESET_BREADCRUMBS
});

export default reducer;
