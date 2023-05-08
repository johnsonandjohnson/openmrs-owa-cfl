/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

const UNKNOWN_AGE = "unknown";
const UNKNOWN_GENDER = "U";

// Vanilla JS overrides - both for core OpenMRS and OWAs
window.addEventListener('load', addCollapseToTheHeader);
// Override Patient Header both on load and on page change (OWAs)
window.addEventListener('load', () => {
  overridePatientHeader();
  watchElementMutations('.patient-header:not(.custom)', overridePatientHeader);
});

function addCollapseToTheHeader() {
  elementReady('.user-options').then(userOptions => {
    const collapse = window.document.getElementById('navbarSupportedContent');
    const header = document.getElementsByTagName('header');
    if (!collapse && header.length) {
      header[0].appendChild(
        ...htmlToElements(
          [
            '<nav class="navbar-dark toggler-icon-container">' +
              '<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation" onclick="document.getElementsByClassName(\'user-options\')[0].classList.toggle(\'show\')">' +
              '<span class="navbar-toggler-icon"></span>' +
              '</button>' +
              '</nav>'
          ].join('\n')
        )
      );
    }
  });
}

function isAgeAndGenderKnown(age, gender) {
  return age != UNKNOWN_AGE && gender != UNKNOWN_GENDER;
}

function isAgeUnknownAndGenderKnown(age, gender) {
  return age == UNKNOWN_AGE && gender != UNKNOWN_GENDER;
}

function isAgeKnownAndGenderUnknown(age, gender) {
  return age != UNKNOWN_AGE && gender == UNKNOWN_GENDER;
}

function getAgeAndGenderLabelText(age, gender) {
  if (isAgeAndGenderKnown(age, gender)) {
    return ' (' + age+ '/' + gender + ')';
  } else if (isAgeUnknownAndGenderKnown(age, gender)) {
    return ' (' + gender + ')';
  } else if (isAgeKnownAndGenderUnknown(age, gender)) {
    return ' (' + age + ')';
  } else return "";
}

function overridePatientHeader() {
  const patientHeader = document.querySelector('.patient-header:not(.custom)');
  // re-design Patient header
  if (!!patientHeader) {
    // wait for demographics to load
    elementReady('.demographics').then(async demographics => {
      const personStatus = document.querySelector('.person-status');
      if (!!personStatus) {
        // wait for the status to load if it's present
        await elementReady('.person-status:not(:empty)');
      }
      const patientId = patientHeader.querySelector('.identifiers:nth-of-type(2) span')?.textContent.trim();
      const patientLocation = patientHeader.querySelector('.patientLocation:not(:empty) span')?.textContent.trim() || '';
      const givenName = patientHeader.querySelector('.PersonName-givenName')?.textContent;
      const middleName = patientHeader.querySelector('.PersonName-middleName')?.textContent;
      const familyName = patientHeader.querySelector('.PersonName-familyName')?.textContent;
      const fullName = [givenName, middleName, familyName].join(' ').replace('  ', ' ');
      const gender = patientHeader.querySelector('.gender-age:first-of-type span:nth-child(1)')?.textContent.trim();
      const age = patientHeader.querySelector('.gender-age:first-of-type span:nth-child(2)')?.textContent.trim();
      const telephoneNumber =
        patientHeader.querySelector('.gender-age:nth-of-type(2) span:nth-child(2)')?.textContent.trim() ||
        patientHeader.querySelector('.telephone span:nth-child(2)')?.textContent.trim() ||
        '';
      let personStatusDialog = patientHeader.querySelector('#person-status-update-dialog');
      personStatusDialog = personStatusDialog?.parentElement.removeChild(personStatusDialog);
      // construct a new header
      let ageAndGender = getAgeAndGenderLabelText(age.split(' ')[0], gender[0]);
      // extract the status out of status: <status>
      const status = personStatus?.textContent.split(':');
      if (status.length) {
        personStatus.textContent = status[1]?.trim();
      }

      var htmlLines = [
        '<div class="patient-header custom">',
        '<div class="patient-data"><h1>' + fullName + ageAndGender + '</h1>',
        (!!patientId
          ? '<div class="patient-id"><span class="header-label">Patient ID: </span><span class="value">' + patientId + '</span></div>'
          : '') +
          '<div class="patient-location"><span class="header-label">Patient Location: </span><span class="value">' +
          patientLocation +
          '</span></div>' +
          '<div class="phone-number"><span class="header-label">Phone number: </span><span class="value">' +
          telephoneNumber +
          '</span></div>' +
          '<div class="patient-status"><span class="header-label">Status: </span><span class="value">' +
          personStatus?.textContent +
          '</span></div>' +
          '</div>' +
          '<div class="header-buttons">'
      ];
      // add buttons on the right side of patient header
      const note = document.querySelector('.note.warning');
      if (!!note) {
        const link = note.querySelector('a');
        if (!!link) {
          const href = link.href;
          htmlLines = htmlLines.concat([
            '<button class="btn btn-secondary" onclick="location.href=\'' + href + '\'">',
            link.textContent.replace('See the', ''),
            '</button>'
          ]);
        }
        note.parentElement.removeChild(note);
      }
      const deletePatient = document.querySelector('#org\\.openmrs\\.module\\.coreapps\\.deletePatient');
      if (!!deletePatient) {
        const href = deletePatient.href;
        htmlLines = htmlLines.concat(['<button class="btn btn-secondary" onclick="' + href + '">', deletePatient.textContent, '</button>']);
        deletePatient.parentElement.removeChild(deletePatient);
      }
      const deleteCaregiver = document.querySelector('#cfl\\.personDashboard\\.deletePerson');
      if (!!deleteCaregiver) {
        const href = deleteCaregiver.href;
        htmlLines = htmlLines.concat([
          '<button class="btn btn-secondary" onclick="' + href + '">',
          deleteCaregiver.textContent,
          '</button>'
        ]);
        deleteCaregiver.parentElement.removeChild(deleteCaregiver);
      }
      if (!!personStatus) {
        const onclick = personStatus.getAttribute('onclick') || "document.querySelector('.person-status').click()";
        htmlLines = htmlLines.concat([
          personStatusDialog?.outerHTML,
          '<button id="updatePersonStatus" class="btn btn-secondary" onclick="' + onclick + '">Update the status</button>'
        ]);
        personStatus.style.display = 'none';
        (document.querySelector('.body-wrapper') || document.querySelector('.content'))?.prepend(personStatus);
      }
      htmlLines.push('</div></div>');
      const updatedHeader = htmlToElements(htmlLines.join('\n'));
      const patientHeaderContainer = document.querySelector('.patient-header-container');
      if (!!patientHeaderContainer) {
        patientHeaderContainer.replaceWith(...updatedHeader);
      } else {
        patientHeader.replaceWith(...updatedHeader);
      }
      // add (age/gender) to the breadcrumb
      elementReady('#breadcrumbs li:last-child:not(:empty)').then(element => {
        element.textContent = element.textContent.replace(fullName, fullName + ageAndGender);
      });
    });
  }
}

/**
 * @return {NodeList}
 * @param htmlString
 */
function htmlToElements(htmlString) {
  var template = document.createElement('template');
  template.innerHTML = htmlString;
  return template.content.childNodes;
}

// MIT Licensed
// Author: jwilson8767

/**
 * Waits for an element satisfying selector to exist, then resolves promise with the element.
 * Useful for resolving race conditions.
 *
 * @param selector
 * @param parentElement
 * @param notEmpty
 * @returns {Promise}
 */
function elementReady(selector, parentElement = document, notEmpty = false) {
  return new Promise((resolve, reject) => {
    let el = parentElement.querySelector(selector);
    if (el && (!notEmpty || !!el.textContent)) {
      resolve(el);
    }
    new MutationObserver((mutationRecords, observer) => {
      // Query for elements matching the specified selector
      Array.from(parentElement.querySelectorAll(selector)).forEach(element => {
        if (!notEmpty || !!element.textContent) {
          resolve(element);
          // Once we have resolved we don't need the observer anymore.
          observer.disconnect();
        }
      });
    }).observe(parentElement === document ? document.documentElement : parentElement, {
      childList: true,
      subtree: true
    });
  });
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

