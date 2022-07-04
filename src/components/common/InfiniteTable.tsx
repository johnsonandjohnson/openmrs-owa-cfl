/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import './Table.scss';
import './InfiniteTable.scss';
import { FormattedMessage, useIntl } from 'react-intl';
import { Spinner, Table } from 'reactstrap';
import React from 'react';
import _ from 'lodash';
import InfiniteScroll from 'react-infinite-scroll-component';
import { IColumnConfiguration } from '../../shared/models/columns-configuration';

export interface InfiniteTableProps {
  columns: string[] | IColumnConfiguration[];
  entities: object[];
  columnContent: any;
  hasNext: boolean;
  currentPage: number;
  switchPage: any;
  getRecordLink?: any;
}

const InfiniteTable = (props: InfiniteTableProps) => {
  const intl = useIntl();
  const handleRowClick = entity => {
    if (!!props.getRecordLink) {
      window.location.href = props.getRecordLink(entity);
    }
  };
  const isColumnObject = props.columns[0]?.constructor === Object;

  return (
    <InfiniteScroll
      dataLength={props.entities.length}
      next={() => props.switchPage(props.currentPage + 1)}
      hasMore={props.hasNext}
      loader={
        <div className="spinner">
          <Spinner />
        </div>
      }
    >
      <Table borderless striped responsive className="table">
        <thead>
          <tr>
            {_.map(props.columns, (column, i) => (
              <th key={i}>{isColumnObject ? column.label : <FormattedMessage id={`columnNames.${column}`} />}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {_.map(props.entities, (entity, i) => (
            <tr key={i} onClick={() => handleRowClick(entity)}>
              {_.map(props.columns, column => {
                const columnValue = isColumnObject ? column.value : column;

                return (
                  <td key={columnValue} className={!!props.getRecordLink ? 'td-clickable' : undefined}>
                    {props.columnContent(entity, columnValue, intl)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </Table>
    </InfiniteScroll>
  );
};

export default InfiniteTable;
