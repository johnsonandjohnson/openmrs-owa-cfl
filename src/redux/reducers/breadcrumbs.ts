/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

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
