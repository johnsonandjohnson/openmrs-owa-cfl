import './Table.scss';
import './InfiniteTable.scss';
import { FormattedMessage, useIntl } from 'react-intl';
import { Spinner, Table } from 'reactstrap';
import React from 'react';
import _ from 'lodash';
import InfiniteScroll from 'react-infinite-scroll-component';

export interface InfiniteTableProps {
  columns: string[];
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
            {_.map(props.columns, column => (
              <th>
                <FormattedMessage id={`columnNames.${column}`} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {_.map(props.entities, (entity, i) => (
            <tr key={i} onClick={() => handleRowClick(entity)}>
              {_.map(props.columns, column => (
                <td className={!!props.getRecordLink ? 'td-clickable' : undefined}>{props.columnContent(entity, column, intl)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </InfiniteScroll>
  );
};

export default InfiniteTable;
