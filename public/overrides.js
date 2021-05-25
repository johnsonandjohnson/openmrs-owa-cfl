const CFL_UI_BASE = '/openmrs/owa/cfl-ui/';

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
      jqr('#breadcrumbs').append('<span>Home</span>');
    }
    // add heading for the Home/System Administration dashboard
    const dashboard = jqr('#body-wrapper > #content');
    if (!!dashboard.has('.row > #apps').length) {
      dashboard.prepend('<div class="homepage-heading">Home</div>');
    } else if (!!dashboard.has('#tasks.row').length) {
      dashboard.prepend('<div class="homepage-heading">System Administration</div>');
    }
    /** Patient Dashboard **/
    // move all the widgets to the first column
    const firstInfoContainer = jqr('.info-container:first-of-type');
    if (firstInfoContainer.length) {
      const remainingContainersChildren = jqr('.info-container .info-section');
      remainingContainersChildren.detach().appendTo(firstInfoContainer);
    }
    // replace 'None' with '-NO DATA-' in each widget
    jqr('.info-body').each(function (index) {
      const text = jqr(this).find('li').text().trim() || jqr(this).find('p').text().trim() || jqr(this).text().trim();
      if (text === 'None' || text === 'Unknown' || text.length === 0) {
        jqr(this).replaceWith("<div class='info-body empty'><span class='label'>-NO DATA-</span></div>");
      }
    });
    // replace the url of 'Patient profile', 'Caregiver profile' and 'Conditions'
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has('patientId')) {
      const givenName = document.querySelector('.PersonName-givenName')?.textContent;
      const middleName = document.querySelector('.PersonName-middleName')?.textContent;
      const familyName = document.querySelector('.PersonName-familyName')?.textContent;
      const fullName = [givenName, middleName, familyName].join(' ').replace('  ', ' ');
      const patientProfileAnchor = document.querySelector('a#cfl\\.patientProfile');
      const deletePerson =
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
      cancelButton.parentElement.removeChild(cancelButton);
    }
    const htmlLines = [
      '<div class="allergies-container">',
      '<div class="allergies-header">',
      '<h2>Manage Allergies</h2>',
      '<span class="helper-text">Create, edit and delete Allergies</span>',
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
      const ageAndGender = ' (' + age.split(' ')[0] + '/' + gender[0] + ')';
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
          '<button id="updatePersonStatus" class="btn btn-secondary" onclick="' + onclick + '">' + 'Update the status' + '</button>'
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
function elementReady(selector, notEmpty = false) {
  return new Promise((resolve, reject) => {
    let el = document.querySelector(selector);
    if (el && (!notEmpty || !!el.textContent)) {
      resolve(el);
    }
    new MutationObserver((mutationRecords, observer) => {
      // Query for elements matching the specified selector
      Array.from(document.querySelectorAll(selector)).forEach(element => {
        if (!notEmpty || !!element.textContent) {
          resolve(element);
          // Once we have resolved we don't need the observer anymore.
          observer.disconnect();
        }
      });
    }).observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  });
}
