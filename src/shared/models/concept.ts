export interface IConceptSetMember {
  display: string;
  uuid: string;
}
export interface IConcept {
  uuid: string;
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
