import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Dropzone from './Dropzone';

jest.mock('react-intl', () => ({
  __esModule: true,
  FormattedMessage: () => <div id="FormattedMessage" />
}));

test('should render match snapshot', () => {
  const container = render(
    <Dropzone acceptedFileExt=".csv" instructionMessageId="vmpTranslations.dropzone.instruction" onFileAccepted={() => null} />
  );
  expect(container).toMatchSnapshot();
});

test('should reject file', async () => {
  const { container } = render(
    <Dropzone acceptedFileExt=".csv" instructionMessageId="vmpTranslations.dropzone.instruction" onFileAccepted={() => null} />
  );
  const input = container.querySelector('.dropzone input');
  const dropResult = container.querySelector('.drop-result');
  await waitFor(() => fireEvent.change(input, { target: { files: [new File([], 'test')] } }));
  const rejectedFileLabel = '<div class="d-inline rejected-file">';
  expect(dropResult).toContainHTML(rejectedFileLabel);
});

test('should accept file', async () => {
  const { container } = render(
    <Dropzone acceptedFileExt=".csv" instructionMessageId="vmpTranslations.dropzone.instruction" onFileAccepted={() => null} />
  );
  const input = container.querySelector('.dropzone input');
  const dropResult = container.querySelector('.drop-result');
  await waitFor(() => fireEvent.change(input, { target: { files: [new File([], 'test.csv')] } }));
  const acceptedFileLabel = '<div class="d-inline accepted-file">';
  expect(dropResult).toContainHTML(acceptedFileLabel);
});
