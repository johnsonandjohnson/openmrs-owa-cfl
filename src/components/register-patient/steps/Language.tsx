import React from "react";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { FormGroup } from "reactstrap";
import { IPatient } from "../../../shared/models/patient";
import _ from "lodash";
import {
  getSetting,
  PERSON_LANGUAGES_SETTING,
  PERSON_LANGUAGES_SETTING_DEFAULT,
} from "../../../redux/reducers/setttings";

export interface ILanguageProps extends StateProps, DispatchProps {
  intl: any;
  patient: IPatient;
  onPatientChange: any;
  stepButtons: any;
  renderField: any;
}

const fields = [
  {
    name: "personLanguage",
    required: false,
    type: "select",
  },
];

export interface ILanguageState {
  invalidFields: any[];
}

class Language extends React.Component<ILanguageProps, ILanguageState> {
  state = { invalidFields: [] };

  componentDidMount() {}

  validate = () => {
    const invalidFields = _.filter(
      fields,
      (field) => field.required && !this.props.patient[field.name]
    );
    this.setState({
      invalidFields,
    });
    return invalidFields.length === 0;
  };

  render() {
    const { intl } = this.props;
    const languageOptions = (
      <>
        <option value="" disabled selected hidden>{`${intl.formatMessage({
          id: "registerPatient.fields.personLanguage",
        })}`}</option>
        {this.props.languages.split(",").map((language) => (
          <option value={language}>{language}</option>
        ))}
      </>
    );
    return (
      <>
        <div className="step-fields">
          <div className="step-title">
            <h2>
              <FormattedMessage id={"registerPatient.steps.language.title"} />
            </h2>
            <p>
              <FormattedMessage
                id={"registerPatient.steps.language.subtitle"}
              />
            </p>
          </div>
          <FormGroup className="d-flex flex-row flex-wrap flex-md-nowrap">
            {_.map(fields, (field) =>
              this.props.renderField(
                field,
                this.state.invalidFields,
                field.name === "personLanguage" ? languageOptions : null
              )
            )}
          </FormGroup>
        </div>
        {this.props.stepButtons(this.validate)}
      </>
    );
  }
}

const mapStateToProps = ({ settings }) => ({
  languages:
    (getSetting(settings.settings, PERSON_LANGUAGES_SETTING) &&
      getSetting(settings.settings, PERSON_LANGUAGES_SETTING).value) ||
    PERSON_LANGUAGES_SETTING_DEFAULT,
});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(Language));
