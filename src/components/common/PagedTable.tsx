import "./PagedTable.scss";
import { FormattedMessage } from "react-intl";
import arrowIcon from "../../img/arrow.png";
import { Pagination, PaginationItem, PaginationLink, Table } from "reactstrap";
import React from "react";
import _ from "lodash";

export interface PagedTableProps {
  columns: string[];
  entities: object[];
  columnContent: any;
  hasNext: boolean;
  hasPrev: boolean;
  currentPage: number;
  switchPage: any;
}

const switchPage = (callback, page, enabled) => (evt) => {
  if (enabled) {
    callback(page);
  }
};

const MAX_PAGES_SHOWN = 5;

const PagedTable = (props: PagedTableProps) => {
  return (
    <>
      <Table borderless striped responsive className="paged-table">
        <thead>
          <tr>
            {_.map(props.columns, (column) => (
              <th>
                <FormattedMessage id={`columnNames.${column}`} />
              </th>
            ))}
            <th />
          </tr>
        </thead>
        <tbody>
          {_.map(props.entities, (entity, i) => (
            <tr key={i}>
              {_.map(props.columns, (column) => (
                <td>{props.columnContent(entity, column)}</td>
              ))}
              <td>
                <img src={arrowIcon} alt="details" className="details-icon" />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {props.currentPage !== 0 || props.hasNext ? (
        <Pagination size="sm" className="pagination">
          {props.currentPage > MAX_PAGES_SHOWN && (
            <PaginationItem
              disabled={!props.hasPrev}
              onClick={switchPage(props.switchPage, 0, props.hasPrev)}
            >
              <PaginationLink first />
            </PaginationItem>
          )}
          <PaginationItem
            disabled={!props.hasPrev}
            onClick={switchPage(
              props.switchPage,
              props.currentPage - 1,
              props.hasPrev
            )}
          >
            <PaginationLink previous />
          </PaginationItem>
          {_.range(props.currentPage + 1)
            .slice(-MAX_PAGES_SHOWN)
            .map((page) => (
              <PaginationItem
                disabled={props.currentPage === page}
                onClick={switchPage(
                  props.switchPage,
                  page,
                  props.currentPage !== page
                )}
              >
                <PaginationLink>{page + 1}</PaginationLink>
              </PaginationItem>
            ))}
          <PaginationItem
            disabled={!props.hasNext}
            onClick={switchPage(
              props.switchPage,
              props.currentPage + 1,
              props.hasNext
            )}
          >
            <PaginationLink next />
          </PaginationItem>
        </Pagination>
      ) : null}
    </>
  );
};

export default PagedTable;
