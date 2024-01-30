/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

const HOME_PAGE_PATH = '/openmrs/cfl/home.page';
const REDIRECT_TO_HOME_PAGE_DELAY_TIME_IN_MS = 1000;

window.addEventListener('load', () => {
  disableReloadPageEvent();
  handleLocationChange();
  watchElementMutations('.change-location', handleLocationChange);
});

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

/*
  Disables reload page event defined in coreapps module.
  This event was triggered on some pages(e.g. patient dashboard) 
  after every change location from top header.
*/
function disableReloadPageEvent() {
  if (typeof jQuery !== 'undefined') {
    jqr(document).off('sessionLocationChanged');
  }
}

function handleLocationChange() {
  handleLocationChangeInOWAPages();
  handleLocationChangeInOpenMRSPages();
}

function handleLocationChangeInOWAPages() {
  const changeLocationElement = document.querySelector('.change-location');
  if (changeLocationElement) {
    changeLocationElement.addEventListener('click', function(event) {
      const clickedElement = event.target;
      const clickedElementName = clickedElement.tagName.toLowerCase();
      if (clickedElementName === 'li') {
        const originalLocation = this.querySelector('a #selected-location')?.textContent?.trim();
        const updatedLocation = clickedElement.textContent?.trim();
        redirectToHomePageIfRequired(originalLocation, updatedLocation);
      }
    });
  }
}

function handleLocationChangeInOpenMRSPages() {
  const changeLocationElement = document.querySelector('#session-location .select');
  if (changeLocationElement) {
    changeLocationElement.addEventListener('click', function(event) {
      const clickedElement = event.target;
      const clickedLiElement = clickedElement.closest('li');
      if (clickedLiElement) {
        const originalLocation = this.querySelector('.select li.selected')?.textContent?.trim();
        const updatedLocation = clickedElement.textContent?.trim();
        redirectToHomePageIfRequired(originalLocation, updatedLocation);
      }
    });
  }
}

function redirectToHomePageIfRequired(originalLocation, updatedLocation) {
  if (originalLocation !== updatedLocation && updatedLocation !== '') {
    setTimeout(() => {
      window.location.href = HOME_PAGE_PATH;
    }, REDIRECT_TO_HOME_PAGE_DELAY_TIME_IN_MS);
  }
}

/**
 * Observes changes to DOM starting from {@code parentElement} and its children, then calls {@code callback} on all elements
 * fitting {@code selector} once a change is detected.
 *
 * @param selector
 * @param callback
 * @param parentElement
 */
function watchElementMutations(selector, callback, parentElement = document) {
  new MutationObserver((mutationRecords, observer) => {
    // Query for elements matching the specified selector
    Array.from(parentElement.querySelectorAll(selector)).forEach(element => {
      if (!!element.textContent) {
        callback(element);
      }
    });
  }).observe(parentElement === document ? document.documentElement : parentElement, {
    childList: true,
    subtree: true
  });
}