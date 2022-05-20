/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import { IntlShape } from 'react-intl';

const Intl: IntlShape = {
  formatMessage: (message: { id: string }) => message.id,
  defaultFormats: null,
  defaultLocale: null,
  formatDate: jest.fn(),
  formatDateTimeRange: jest.fn(),
  formatDateToParts: jest.fn(),
  formatDisplayName: jest.fn(),
  formatList: jest.fn(),
  formatNumber: jest.fn(),
  formatNumberToParts: jest.fn(),
  formatPlural: jest.fn(),
  formatRelativeTime: jest.fn(),
  formatTime: jest.fn(),
  formatTimeToParts: jest.fn(),
  formats: null,
  formatters: null,
  locale: null,
  messages: null,
  onError: null
};

export default Intl;
