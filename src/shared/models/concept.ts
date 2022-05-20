/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

interface IConceptSetMemberName {
  display: string;
}

export interface IConceptSetMember {
  display: string;
  uuid: string;
  names?: IConceptSetMemberName[];
  setMembers?: IConceptSetMember[];
}
export interface IConcept {
  uuid: string;
  display: string;
  setMembers: IConceptSetMember[];
}

export interface IConceptItemLink {
  rel: string;
  uri: string;
}

export interface IConceptItem {
  display: string;
  concept: {
    uuid: string;
    display: string;
    links: IConceptItemLink[];
  };
  conceptName: {
    uuid: string;
    display: string;
    links: IConceptItemLink[];
  };
}

export interface IConceptState {
  loading: {
    concepts: boolean;
    concept: boolean;
  };
  query: string;
  concepts: IConceptItem[];
  concept: IConcept;
  errorMessage: string;
}
