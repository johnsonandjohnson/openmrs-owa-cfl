interface IConceptSetMemberName {
  display: string;
}

export interface IConceptSetMember {
  display: string;
  uuid: string;
  names: Array<IConceptSetMemberName>;
  setMembers: Array<IConceptSetMember>;
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
