import React from "react";
import { Link, withRouter } from "react-router-dom";
import useBreadcrumbs from "use-react-router-breadcrumbs";
import "./Breadcrumbs.scss";
import { routeConfig } from "../Routes";
import { FormattedMessage } from "react-intl";
import { nameParam, redirectUrl } from "../../shared/util/url-util";

const Breadcrumbs = (props) => {
  const breadcrumbs = useBreadcrumbs(routeConfig);
  return (
    <div className="breadcrumbs">
      {breadcrumbs.map(({ match, key, breadcrumb }, i) => {
        const id =
          breadcrumb && breadcrumb["props"] && breadcrumb["props"].children;
        return (
          id.indexOf(".") >= 0 && (
            <span key={key}>
              {i === 0 ? (
                <a href={redirectUrl(props.location.search)}>
                  {nameParam(props.location.search) || (
                    <FormattedMessage id={"home.title"} />
                  )}
                </a>
              ) : (
                <Link to={match.url}>
                  <FormattedMessage id={id} />
                </Link>
              )}
              <span className="separator">
                {(breadcrumbs.length === 1 || breadcrumbs.length !== i + 1) &&
                  ">>"}
              </span>
            </span>
          )
        );
      })}
    </div>
  );
};

export default withRouter(Breadcrumbs);
