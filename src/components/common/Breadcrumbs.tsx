import React from "react";
import { Link, withRouter } from "react-router-dom";
import useBreadcrumbs from "use-react-router-breadcrumbs";
import "./Breadcrumbs.scss";
import { routeConfig } from "../Routes";
import { FormattedMessage } from "react-intl";
import { nameParam, redirectUrl } from "../../shared/util/url-util";
import { ROOT_URL } from "../../shared/constants/openmrs";

const separator = (showArrows = true) => (
  <span className="separator">{showArrows && ">>"}</span>
);

const Breadcrumbs = (props) => {
  const breadcrumbs = useBreadcrumbs(routeConfig);
  const url = redirectUrl(props.location.search);
  const name = nameParam(props.location.search);
  return (
    <div className="breadcrumbs">
      {breadcrumbs.map(({ match, key, breadcrumb }, i) => {
        const id =
          breadcrumb && breadcrumb["props"] && breadcrumb["props"].children;
        const isFirstBreadcrumb = i === 0;
        const isLastBreadcrumb = breadcrumbs.length === i + 1;
        return (
          id.indexOf(".") >= 0 && (
            <span key={key}>
              {isFirstBreadcrumb ? (
                <a href={ROOT_URL}>{<FormattedMessage id={"home.title"} />}</a>
              ) : isLastBreadcrumb ? (
                <>
                  {url && name && (
                    <>
                      <a href={url}>{name}</a>
                      {separator()}
                    </>
                  )}
                  <a href={window.location.href}>
                    <FormattedMessage id={id} />
                  </a>
                </>
              ) : (
                <>
                  <Link to={match.url}>
                    <FormattedMessage id={id} />
                  </Link>
                </>
              )}
              {separator(breadcrumbs.length === 1 || !isLastBreadcrumb)}
            </span>
          )
        );
      })}
    </div>
  );
};

export default withRouter(Breadcrumbs);
