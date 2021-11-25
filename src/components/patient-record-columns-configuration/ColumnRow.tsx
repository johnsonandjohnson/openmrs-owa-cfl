import React, { FormEvent, useCallback } from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import { injectIntl, IntlShape } from 'react-intl';
import { cloneDeep, differenceWith, isEqual } from 'lodash';
import { SelectWithPlaceholder } from '../common/form/withPlaceholder';
import { PlusMinusButtons } from '../common/form/PlusMinusButtons';
import { extractEventValue, selectDefaultTheme } from '../../shared/util/form-util';
import { IColumnConfiguration } from '../../shared/models/columns-configuration';
import { setColumnsConfiguration } from '../../redux/reducers/columns-configuration';
import { DEFAULT_COLUMN_CONFIGURATION } from '../../shared/constants/columns-configuration';
import { swapPositions } from '../../shared/util/array-util';
import ValidationError from '../common/form/ValidationError';

interface IStore {
  patientRecordColumnsConfiguration: {
    allPossibleColumns: IColumnConfiguration[];
    columnsConfiguration: IColumnConfiguration[];
  };
}

export interface IColumnRowProps extends StateProps, DispatchProps {
  intl: IntlShape;
  column: IColumnConfiguration;
  columnIdx: number;
}

export const ColumnRow = ({
  intl,
  allPossibleColumns,
  columnsConfiguration,
  column,
  columnIdx,
  setColumnsConfiguration
}: IColumnRowProps) => {
  const { formatMessage } = intl;
  const columnValue = column.value ? column : null;
  const getOptions = useCallback(() => differenceWith(allPossibleColumns, columnsConfiguration, isEqual), [
    allPossibleColumns,
    columnsConfiguration
  ]);

  const onSwapPositionsHandler = (offset: number) => {
    const clonedColumnsConfiguration = cloneDeep(columnsConfiguration);
    const swappedColumnsPosition = swapPositions(clonedColumnsConfiguration, columnIdx, offset);

    setColumnsConfiguration(swappedColumnsPosition);
  };

  const onChangeHandler = useCallback(
    (event: FormEvent) => {
      const clonedColumnsConfiguration = cloneDeep(columnsConfiguration);
      const extractedValue = extractEventValue(event);

      clonedColumnsConfiguration[columnIdx] = extractedValue;
      clonedColumnsConfiguration[columnIdx].isValid = true;

      setColumnsConfiguration(clonedColumnsConfiguration);
    },
    [columnIdx, columnsConfiguration, setColumnsConfiguration]
  );

  const addColumnHandler = useCallback(() => {
    const clonedColumnsConfiguration = cloneDeep(columnsConfiguration);

    clonedColumnsConfiguration.push(DEFAULT_COLUMN_CONFIGURATION);

    setColumnsConfiguration(clonedColumnsConfiguration);
  }, [columnsConfiguration, setColumnsConfiguration]);

  const removeColumnHandler = useCallback(() => {
    const clonedColumnsConfiguration = cloneDeep(columnsConfiguration);

    clonedColumnsConfiguration.splice(columnIdx, 1);

    if (!clonedColumnsConfiguration.length) {
      clonedColumnsConfiguration.push(DEFAULT_COLUMN_CONFIGURATION);
    }

    setColumnsConfiguration(clonedColumnsConfiguration);
  }, [columnIdx, columnsConfiguration, setColumnsConfiguration]);

  return (
    <>
      <div className="column-row inline-fields" data-testid="columnRow">
        <div className="d-flex flex-column order-icons">
          <span
            className={cx('glyphicon glyphicon-chevron-up', { disabled: !columnIdx })}
            title={formatMessage({ id: 'common.moveUp' })}
            aria-hidden="true"
            onClick={() => onSwapPositionsHandler(-1)}
            data-testid="moveUpButton"
          />
          <span
            className={cx('glyphicon glyphicon-chevron-down', { disabled: columnIdx === columnsConfiguration.length - 1 })}
            title={formatMessage({ id: 'common.moveDown' })}
            aria-hidden="true"
            onClick={() => onSwapPositionsHandler(1)}
            data-testid="moveDownButton"
          />
        </div>
        <SelectWithPlaceholder
          placeholder={formatMessage({ id: 'patientRecordColumnsConfiguration.columnName' })}
          showPlaceholder={!!columnValue}
          value={columnValue}
          onChange={onChangeHandler}
          options={getOptions()}
          wrapperClassName={cx({ invalid: !columnValue && !column.isValid })}
          classNamePrefix="default-select"
          theme={selectDefaultTheme}
          data-testid="columnSelect"
        />
        <PlusMinusButtons
          intl={intl}
          onPlusClick={addColumnHandler}
          onMinusClick={removeColumnHandler}
          isPlusButtonVisible={columnIdx === columnsConfiguration.length - 1}
        />
      </div>
      {!columnValue && !column.isValid && <ValidationError message={'patientRecordColumnsConfiguration.emptyColumnsConfiguration'} />}
    </>
  );
};

const mapStateToProps = ({ patientRecordColumnsConfiguration: { allPossibleColumns, columnsConfiguration } }: IStore) => ({
  allPossibleColumns,
  columnsConfiguration
});

const mapDispatchToProps = {
  setColumnsConfiguration
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ColumnRow));
