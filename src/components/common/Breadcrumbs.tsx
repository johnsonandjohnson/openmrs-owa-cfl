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
import { RouteComponentProps, withRouter } from 'react-router-dom';
import withBreadcrumbs from 'react-router-breadcrumbs-hoc';
import './Breadcrumbs.scss';
import { FormattedMessage } from 'react-intl';
import { nameParamVal, redirectUrl } from '../../shared/util/url-util';
import { ROOT_URL } from '../../shared/constants/openmrs';
import { connect } from 'react-redux';
import { routeConfig } from '../../shared/constants/routes';
import { IBreadcrumb } from '../../shared/models/breadcrumb';

const separator = (showArrows = true) => <span className="separator">{showArrows && '>>'}</span>;

export interface IBreadcrumbsProps extends StateProps, DispatchProps, RouteComponentProps {
  breadcrumbs: any[];
}

class Breadcrumbs extends React.Component<IBreadcrumbsProps> {
  routeBreadcrumbs = () => {
    const breadcrumbs = this.props.breadcrumbs;
    return breadcrumbs
      .map(({ match, key, breadcrumb }, i) => {
        const id = breadcrumb && breadcrumb['props'] && breadcrumb['props'].children;
        const breadcrumbDef = { labelId: id, order: i, url: `#${match.url}` } as IBreadcrumb;
        if (i === 0) {
          breadcrumbDef.url = ROOT_URL;
        }
        if (id.indexOf('.') !== -1) {
          return breadcrumbDef;
        }
        return null;
      })
      .filter(breadcrumb => !!breadcrumb);
  };

  render() {
    let breadcrumbs = this.routeBreadcrumbs();
    const urlParam = redirectUrl(this.props.location.search);
    const nameParam = nameParamVal(this.props.location.search);
    if (urlParam && nameParam) {
      breadcrumbs.push({
        url: urlParam,
        label: nameParam,
        order: 1
      });
    }
    breadcrumbs = breadcrumbs.concat(this.props.additionalBreadcrumbs).sort((b1, b2) => b1.order - b2.order);
    return (
      <div className="breadcrumbs">
        {breadcrumbs.map(({ url, labelId, label }, i) => (
          <>
            {i === breadcrumbs.length - 1 ? (
              <span>{label || <FormattedMessage id={labelId} />}</span>
            ) : (
              <a href={url}>{label || <FormattedMessage id={labelId} />}</a>
            )}
            {separator(i !== breadcrumbs.length - 1)}
          </>
        ))}
      </div>
    );
  }
}

const mapStateToProps = ({ breadcrumbs }) => ({
  additionalBreadcrumbs: breadcrumbs.additionalBreadcrumbs
});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(withBreadcrumbs(routeConfig)(withRouter(Breadcrumbs)));
