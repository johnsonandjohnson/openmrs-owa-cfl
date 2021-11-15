export interface IConceptSetMember {
  display: string;
  uuid: string;
}
export interface IConcept {
  uuid: string;
  setMembers: IConceptSetMember[];
}
export interface IConceptState {
  loading: boolean;
  q: string;
  concepts: [];
  concept: IConcept[];
  errorMessage: string;
}
