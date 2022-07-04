/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Dropzone from './Dropzone';

jest.mock('react-intl', () => ({
  __esModule: true,
  FormattedMessage: () => <div id="FormattedMessage" />
}));

test('should render match snapshot', () => {
  const container = render(
    <Dropzone acceptedFileExt=".csv" instructionMessageId="addressData.dropzone.instruction" onFileAccepted={() => null} />
  );
  expect(container).toMatchSnapshot();
});

test('should reject file', async () => {
  const { container } = render(
    <Dropzone acceptedFileExt=".csv" instructionMessageId="addressData.dropzone.instruction" onFileAccepted={() => null} />
  );
  const input = container.querySelector('.dropzone input');
  const dropResult = container.querySelector('.drop-result');
  await waitFor(() => fireEvent.change(input, { target: { files: [new File([], 'test')] } }));
  const rejectedFileLabel = '<div class="d-inline rejected-file">';
  expect(dropResult).toContainHTML(rejectedFileLabel);
});

test('should accept file', async () => {
  const { container } = render(
    <Dropzone acceptedFileExt=".csv" instructionMessageId="addressData.dropzone.instruction" onFileAccepted={() => null} />
  );
  const input = container.querySelector('.dropzone input');
  const dropResult = container.querySelector('.drop-result');
  await waitFor(() => fireEvent.change(input, { target: { files: [new File([], 'test.csv')] } }));
  const acceptedFileLabel = '<div class="d-inline accepted-file">';
  expect(dropResult).toContainHTML(acceptedFileLabel);
});
