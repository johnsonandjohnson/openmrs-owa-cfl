/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import { CONFIGURE_METADTA_PAGE_URL, SYSTEM_ADMINISTRATION_PAGE_URL } from "./openmrs"; 

export const CONFIGURE_METADATA_BREADCRUMB_ELEMENT = {
  labelId: 'adminui.app.configureMetadata.label',
  url: CONFIGURE_METADTA_PAGE_URL,
  order: 0
};

export const SYSTEM_ADMINISTRATION_BREADCRUMB_ELEMENT = {
  labelId: 'coreapps.app.systemAdministration.label',
  url: SYSTEM_ADMINISTRATION_PAGE_URL,
  order: 0
};