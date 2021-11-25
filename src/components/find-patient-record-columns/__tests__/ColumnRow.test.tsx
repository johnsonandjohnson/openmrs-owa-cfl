import React from 'react';
import IntlShape from '../../../mocks/Intl';
import en from '../../../lang/en.json';
import flatten from 'flat';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ColumnRow, IColumnRowProps } from '../ColumnRow';
import { DEFAULT_COLUMNS, DEFAULT_COLUMN_CONFIGURATION, FIXED_COLUMNS } from '../../../shared/constants/columns-configuration';
import { IntlProvider } from 'react-intl';

const messages = flatten(en);

const props: IColumnRowProps = {
  intl: IntlShape,
  allPossibleColumns: DEFAULT_COLUMNS,
  column: { label: 'Age', value: 'age' },
  columnIdx: 2,
  columnsConfiguration: DEFAULT_COLUMNS,
  setColumnsConfiguration: jest.fn()
};

describe('<ColumnRow />', () => {
  describe('with default values', () => {
    beforeEach(() => {
      render(
        <IntlProvider locale="en" messages={messages}>
          <ColumnRow {...props} />
        </IntlProvider>
      );
    });

    it('should render move up button', () => {
      expect(screen.getByTestId('moveUpButton')).toBeInTheDocument();
    });

    it('should render move down button', () => {
      expect(screen.getByTestId('moveDownButton')).toBeInTheDocument();
    });

    it('should render remove item button', () => {
      expect(screen.getByTestId('removeItem')).toBeInTheDocument();
    });

    it('should not render add item button', () => {
      expect(screen.queryByTestId('addItem')).not.toBeInTheDocument();
    });

    it('should render select with proper label', () => {
      expect(screen.getByText(props.column.label)).toBeInTheDocument();
    });

    it('should remove column', () => {
      const expectedColumns = DEFAULT_COLUMNS.filter(column => column.value !== props.column.value);
      const removeButton = screen.getByTestId('removeItem');

      userEvent.click(removeButton);

      expect(props.setColumnsConfiguration).toBeCalledWith(expectedColumns);
    });

    it('should move up column position', () => {
      const moveUpButton = screen.getByTestId('moveUpButton');

      userEvent.click(moveUpButton);

      expect(props.columnIdx - 1).toBe(1);
    });

    it('should move down column position', () => {
      const moveUpButton = screen.getByTestId('moveDownButton');

      userEvent.click(moveUpButton);

      expect(props.columnIdx + 1).toBe(3);
    });
  });

  describe('with no value and only one column', () => {
    beforeEach(() => {
      render(
        <IntlProvider locale="en" messages={messages}>
          <ColumnRow
            {...{
              ...props,
              column: { label: '', value: '', isValid: false },
              columnIdx: 0,
              columnsConfiguration: [{ label: '', value: '' }]
            }}
          />
        </IntlProvider>
      );
    });

    it('should render error message', () => {
      expect(screen.getByTestId('fieldError')).toBeInTheDocument();
    });

    it('should render add item button', () => {
      expect(screen.getByTestId('addItem')).toBeInTheDocument();
    });
  });

  it('should add new column', () => {
    render(
      <IntlProvider locale="en" messages={messages}>
        <ColumnRow {...{ ...props, columnsConfiguration: FIXED_COLUMNS }} />
      </IntlProvider>
    );

    const expectedColumns = [...FIXED_COLUMNS, DEFAULT_COLUMN_CONFIGURATION];
    const addButton = screen.getByTestId('addItem');

    userEvent.click(addButton);

    expect(props.setColumnsConfiguration).toBeCalledWith(expectedColumns);
  });
});
