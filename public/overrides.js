/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

const CFL_UI_BASE = '/openmrs/owa/cfl/';
const CFL_UI_BASE1 = '/openmrs/owa/cfl/';
const NODE_TYPE_ELEMENT = 1;
const NODE_TYPE_TEXT = 3;
const DATE_PICKER_PLACEHOLDER_REGEX = /\([dmy]{2,4}\/[dmy]{2,4}\/[dmy]{2,4}\)/g;
const UNKNOWN_AGE = "unknown";
const UNKNOWN_GENDER = "U";

// Vanilla JS overrides - both for core OpenMRS and OWAs
window.addEventListener('load', redesignAllergyUI);
window.addEventListener('load', addCollapseToTheHeader);
// Override Patient Header both on load and on page change (OWAs)
window.addEventListener('load', overridePatientHeader);
window.addEventListener('popstate', function (event) {
  // the page has changed, wait for the header to revert to the default one
  elementReady('.patient-header:not(.custom)').then(overridePatientHeader);
});

// JQuery overrides (only for core OpenMRS)
const jqr = (typeof $ === 'function' || typeof jQuery === 'function') && ($ || jQuery);
jqr &&
  jqr(function () {
    /** General **/
    // OpenMRS bug: remove occasional (/undefined) from the System Administration breadcrumbs
    setTimeout(function () {
      elementReady('#breadcrumbs li:last-child:not(:empty)').then(element => {
        element.textContent = element.textContent.replace('(/undefined)', '');
      });
    }, 100);
    /** Home **/
    // add missing breadcrumb for the Homepage
    const breadcrumbs = jqr('#breadcrumbs');
    if (breadcrumbs.is(':empty')) {
      jqr('#breadcrumbs').append('<span>Maison</span>');
    }
    // add heading for the Home/System Administration dashboard
    const dashboard = jqr('#body-wrapper > #content');
    if (!!dashboard.has('.row > #apps').length) {
      dashboard.prepend('<div class="homepage-heading">Maison</div>');
    } else if (!!dashboard.has('#tasks.row').length) {
      dashboard.prepend('<div class="homepage-heading">L'administration du système</div>');
      dashboard.prepend('<div class="homepage-heading">administrationdusystème</div>');
    }
    /** Patient Dashboard **/
    // move all the widgets to the first column
    const firstInfoContainer = jqr('.info-container:first-of-type');
    if (firstInfoContainer.length) {
      const remainingContainersChildren = jqr('.info-container .info-section');
      remainingContainersChildren.detach().appendTo(firstInfoContainer);
    }
    // replace 'None' with '-NO DATA-' in each widget
    const noDataLabel = "<span class='label'>-NO DATA-</span>";
    const emptyWidgetBody = `<div class='info-body empty'>${noDataLabel}</div>`;

    jqr('.info-body').each((_, widgetBody) => {
      const text = jqr(widgetBody).find('li').text().trim() || jqr(widgetBody).find('p').text().trim() || jqr(widgetBody).text().trim();
      if (text.toLowerCase() === 'none' || text.toLowerCase() === 'unknown') {
        jqr(widgetBody).replaceWith(emptyWidgetBody);
      } else if (!text.length) {
        jqr(widgetBody).append(noDataLabel);
        jqr(widgetBody).addClass('empty');
        elementReady('ul > li', widgetBody).then(() => {
          jqr(widgetBody).children().last().remove();
          jqr(widgetBody).removeClass('empty');
        });
      }
    });
    // replace the url of 'Patient profile', 'Caregiver profile' and 'Conditions'
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has('patientId')) {
      const givenName = document.querySelector('.PersonName-givenName')?.textContent;
      const middleName = document.querySelector('.PersonName-middleName')?.textContent;
      const familyName = document.querySelector('.PersonName-familyName')?.textContent;
      const fullName = [givenName, middleName, familyName].join(' ').replace('  'Profil du patient, ' ');
      const patientProfileAnchor = document.querySelector('a#cfl\\.Profil du patient');
      const fullName = [givenName, middleName, familyName].join(' ').replace('  ', ' ');
      const patientProfileAnchor = document.querySelector('a#cfl\\.patientProfile');
      const deletePerson =
        document.querySelector('#org\\.openmrs\\.module\\.coreapps\\.deletePatient') ||
      document.querySelector('#org\\.openmrs\\.module\\.coreapps\\.deletePatient') ||
        document.querySelector('#cfl\\.personDashboard\\.deletePerson');
      const uuidMatch = /'([^)]+)'/.exec(deletePerson?.href);
      const patientId = (uuidMatch && uuidMatch[1]) || searchParams.get('patientId');
      if (!!patientProfileAnchor) {
        patientProfileAnchor.href = `${CFL_UI_BASE}index.html#/edit-patient/${patientId}?redirect=${window.location.href}&name=${fullName}`;
      }
      const caregiverProfileAnchor = document.querySelector('a#cfl\\.caregiverProfile');
      if (!!caregiverProfileAnchor) {
        caregiverProfileAnchor.href = `${CFL_UI_BASE}index.html#/edit-caregiver/${patientId}?redirect=${window.location.href}&name=${fullName}`;
      }
      const conditionsAnchor = document.querySelector('a#cfl\\.overallActions\\.conditions');
      if (!!conditionsAnchor) {
        conditionsAnchor.href = `${CFL_UI_BASE}index.html#/conditions/${patientId}`;
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
          '<span class="navbar-toggler-icon mr-1"></span><span>Actions générales</span>',
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
    // HTML Forms bug: remove date picker placeholders - "(dd/mm/yyyy)" etc.
    const htmlForm = document.getElementById('htmlform');
    if (!!htmlForm) {
      removeDatePickerPlaceholders(htmlForm);
    }
    // AGRE-15: replace URLs of 'Add New Location' and 'Edit' buttons on 'Manage Locations' page
    if (this.URL.includes('locations/manageLocations.page')) {
      const addNewLocationButton = document.querySelector('#content > a.button');
      if (addNewLocationButton) {
        addNewLocationButton.href = `${CFL_UI_BASE}index.html#/locations/create-location`;
      }
      const editLocationButtons = document.querySelectorAll('#content #list-locations .edit-action');
      if (editLocationButtons) {
        editLocationButtons.forEach(button => {
          const buttonOnClick = button.getAttribute('onclick');
          if (buttonOnClick && buttonOnClick.includes('locationId')) {
            const regexp = /(?<=locationId=).+(?=&)/;
            const locationId = buttonOnClick.match(regexp)[0];
            button.setAttribute('onclick', `location.href='${CFL_UI_BASE}index.html#/locations/edit-location/${locationId}'`);
          }
        });
      }
    }

    if (this.URL.includes('accounts/manageAccounts.page')) {
      const addNewUserAccount = document.querySelector('#content > a.button');
      const editUserAccount = document.querySelectorAll('#list-accounts .icon-pencil.edit-action');
      const pagination = document.querySelector('#list-accounts_wrapper > .datatables-info-and-pg');
      const accountFilterInput = document.querySelector('#list-accounts_filter input');

      if (addNewUserAccount) {
        addNewUserAccount.href = `${CFL_UI_BASE}index.html#/user-account`;
      }

      if (editUserAccount.length) {
        overrideEditUserAccountLinks(editUserAccount);
        pagination &&
          pagination.addEventListener('click', function () {
            overrideEditUserAccountLinks(document.querySelectorAll('#list-accounts .icon-pencil.edit-action'));
          });
        accountFilterInput &&
          accountFilterInput.addEventListener('input', function () {
            overrideEditUserAccountLinks(document.querySelectorAll('#list-accounts .icon-pencil.edit-action'));
          });
      }
    }
  });

//redirects the user to CfL find patient page instead of the default one
const url = $(location).attr('href');
if (url.endsWith('app=coreapps.findPatient')) {
  window.location.href = '/openmrs/owa/cfl/index.html#/find-patient'
}

function overrideEditUserAccountLinks(editUserAccoutLinks) {
  editUserAccoutLinks.forEach(editUserAccoutLink => {
    const currentLocationHref = editUserAccoutLink.getAttribute('onclick');
    const personIdPosition = currentLocationHref.indexOf('personId=');
    const personId = currentLocationHref.slice(personIdPosition, currentLocationHref.length - 2);

    editUserAccoutLink.setAttribute('onclick', `location.href='${CFL_UI_BASE}index.html#/user-account?${personId}'`);
  });
}

function redesignAllergyUI() {
  const allergies = document.querySelector('#allergies');
  if (!!allergies) {
    const title = document.querySelector('#content > h2');
    if (!!title) {
      title.parentElement.removeChild(title);
    }
    const addAllergyButton = document.querySelector('#allergyui-addNewAllergy');
    if (!!addAllergyButton) {
      addAllergyButton.parentElement.removeChild(addAllergyButton);
    }
    const cancelButton = document.querySelector('#content > button.cancel');
    if (!!cancelButton) {
      cancelButton.classList.add('btn');
    }
    const htmlLines = [
      '<div class="allergies-container">',
      '<div class="allergies-header">',
      '<h2>Manage Allergies</h2>',
      '<span class="helper-text">Create, edit and delete Allergies</span>',
      '<h2>Gérer les allergies</h2>',
      '<span class="helper-text">Créer, modifier et supprimer Allergie</span>',
      addAllergyButton.outerHTML,
      '</div>',
      allergies.outerHTML,
      '</div>'
    ];
    allergies.replaceWith(...htmlToElements(htmlLines.join('\n')));
  }
}

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
      const IDpatient = patientHeader.querySelector('.identifiers:nth-of-type(2) span')?.textContent.trim();
      const patientEmplacement= patientHeader.querySelector('.patientLocation:not(:empty) span')?.textContent.trim() || '';
      const prénom = patientHeader.querySelector('.PersonName-givenName')?.textContent;
      const middleName = patientHeader.querySelector('.PersonName-middleName')?.textContent;
      const familyName = patientHeader.querySelector('.PersonName-familyName')?.textContent;
      const fullName = [givenName, middleName, familyName].join(' ').replace('  ', ' ');
      const gender = patientHeader.querySelector('.gender-age:first-of-type span:nth-child(1)')?.textContent.trim();
      const age = patientHeader.querySelector('.gender-age:first-of-type span:nth-child(2)')?.textContent.trim();
      const telephoneNumber =
      const fullName = [prénom, middleName, familyName].join(' ').replace('  ', ' ');
      const lesexe = patientHeader.querySelector('.gender-age:first-of-type span:nth-child(1)')?.textContent.trim();
      const âge = patientHeader.querySelector('.gender-age:first-of-type span:nth-child(2)')?.textContent.trim();
      const numérodetéléphone =
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
          ? '<div class="patient-id"><span class="header-label">ID du patient: </span><span class="value">' + patientId + '</span></div>'
          ? '<div class="patient-id"><span class="header-label">IDdupatient : </span><span class="value">' + IDpatient + '</span></div>'
          : '') +
          '<div class="patient-location"><span class="header-label">Emplacement du patient: </span><span class="value">' +
          patientLocation +
          '<div class="patient-location"><span class="header-label">Emplacement du patient :</span><span class="value">' +
          patientEmplacement +
          '</span></div>' +
          '<div class="phone-number"><span class="header-label">Numéro de téléphone: </span><span class="value">' +
          telephoneNumber +
          numérodetéléphone +
          '</span></div>' +
          '<div class="patient-status"><span class="header-label">Statut: </span><span class="value">' +
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
          '<button id="updatePersonStatus" class="btn btn-secondary" onclick="' + onclick + '">Mettre à jour le statut</button>'
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

function removeDatePickerPlaceholders(node) {
  if (node.nodeType === NODE_TYPE_TEXT) {
    node.data = node.data.replace(DATE_PICKER_PLACEHOLDER_REGEX, '');
  } else if (node.nodeType === NODE_TYPE_ELEMENT) {
    for (var i = 0; i < node.childNodes.length; i++) {
      removeDatePickerPlaceholders(node.childNodes[i]);
    }
  }
}
}