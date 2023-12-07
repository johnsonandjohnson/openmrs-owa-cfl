/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import { addLocaleData, IntlProvider} from 'react-intl';
import React, {PropsWithChildren, useEffect} from 'react';
import { connect } from 'react-redux';
import { getSession } from '../../redux/reducers/session';
import { getMessages } from '../../redux/reducers/translation-messages';
import LocalizationContext from '@openmrs/react-components/lib/components/localization/LocalizationContext';

interface IStore {
  session: any,
  translationMessages: any
}

const TranslationProvider = ({locale, translationMessages, getSession, getMessages, children}: PropsWithChildren<StateProps & DispatchProps>) => {

  useEffect(() => {
    getSession();
  }, []);

  useEffect(() => {
    if (locale) {
      getMessages(locale);
      addLocaleData(require(`react-intl/locale-data/${locale.split('_')[0]}`));
    }
  }, [locale]);

  return (
    <>
      {translationMessages && locale ? (
        <LocalizationContext.Provider value={{intlProviderAvailable: true}}>
          <IntlProvider locale={locale.replace('_', '-')} messages={translationMessages}>
            {children}
          </IntlProvider>
        </LocalizationContext.Provider>
      ) : 
      <></>}
    </>
  );
};

const mapStateToProps = (({session: { session }, translationMessages: { translationMessages }}: IStore) => ({
  locale: session ? session.locale : null,
  translationMessages: translationMessages
}));
type StateProps = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = { getSession, getMessages };
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TranslationProvider);
