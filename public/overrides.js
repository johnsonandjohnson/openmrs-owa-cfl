/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

// JQuery overrides (only for core OpenMRS)
const jqr = (typeof $ === 'function' || typeof jQuery === 'function') && ($ || jQuery);
jqr &&
  jqr(function () {
    // replace the url of 'Patient profile', 'Caregiver profile' and 'Conditions'
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has('patientId')) {
      const patientId = searchParams.get('patientId');

      const patientProfileAnchor = document.querySelector('a#cfl\\.patientProfile');
      if (!!patientProfileAnchor) {
        patientProfileAnchor.href = `${CFL_UI_BASE}index.html#/edit-patient/${patientId}?redirect=${window.location.href}`;
      }
      const caregiverProfileAnchor = document.querySelector('a#cfl\\.caregiverProfile');
      if (!!caregiverProfileAnchor) {
        caregiverProfileAnchor.href = `${CFL_UI_BASE}index.html#/edit-caregiver/${patientId}?redirect=${window.location.href}`;
      }
      const conditionsIcon = document.querySelector('.info-section.conditions i.edit-action');
      if (!!conditionsIcon) {
        conditionsIcon.setAttribute('onclick', `location.href = '${CFL_UI_BASE}index.html#/conditions/${patientId}'`);
      }
    }

    // Add hamburger menu for general actions (visible on smaller screens)
    const actionContainer = jqr('.action-container');
    if (actionContainer.length) {
      const actions = actionContainer.find('.action-section ul li');
      actionContainer.before(
        [
          '<div class="general-actions-toggle navbar-dark">',
          '<button class="navbar-toggler btn btn-secondary" type="button" data-toggle="collapse" data-target="#generalActions" aria-controls="generalActions" aria-expanded="false" aria-label="Toggle general actions">',
          '<span class="navbar-toggler-icon mr-1"></span><span>General Actions</span>',
          '</button>',
          '<div class="collapse navbar-collapse" id="generalActions">',
          actions
            .toArray()
            .map(action => '<div>' + action.innerHTML + '</div>')
            .join('\n'),
          '</div>',
          '</div>'
        ].join('\n')
      );
    }
  });

