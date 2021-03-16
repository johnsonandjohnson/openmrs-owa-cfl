import "./PagedTable.scss";
import { FormattedMessage } from "react-intl";
import arrowIcon from "../../img/arrow.png";
import { Pagination, PaginationItem, PaginationLink, Table } from "reactstrap";
import React from "react";
import _ from "lodash";
import { DEFAULT_PAGE_SIZE } from "../../redux/page.util";

export interface PagedTableProps {
  columns: string[];
  entities: object[];
  columnContent: any;
  hasNext: boolean;
  hasPrev: boolean;
  currentPage: number;
  switchPage: any;
  totalCount: number;
  pageSize?: number;
}

const switchPage = (callback, page, enabled) => (evt) => {
  if (enabled) {
    callback(page);
  }
};

const MAX_PAGES_SHOWN = 5;

const PagedTable = (props: PagedTableProps) => {
  const pageSize = props.pageSize || DEFAULT_PAGE_SIZE;
  const noPages = Math.ceil(props.totalCount / pageSize);
  const pageDelta = Math.floor((MAX_PAGES_SHOWN - 1) / 2);
  const startingPage =
    props.currentPage - pageDelta >= 0
      ? props.currentPage - pageDelta
      : props.currentPage;
  const endingPage =
    startingPage + MAX_PAGES_SHOWN > noPages
      ? noPages
      : startingPage + MAX_PAGES_SHOWN;
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
          <PaginationItem
            disabled={!props.hasPrev}
            onClick={switchPage(props.switchPage, 0, props.hasPrev)}
          >
            <PaginationLink first />
          </PaginationItem>
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
          {_.range(startingPage, endingPage).map((page) => (
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
          <PaginationItem
            disabled={!props.hasNext}
            onClick={switchPage(props.switchPage, noPages - 1, props.hasNext)}
          >
            <PaginationLink last />
          </PaginationItem>
        </Pagination>
      ) : null}
    </>
  );
};

export default PagedTable;
