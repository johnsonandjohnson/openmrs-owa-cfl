import { EMPTY_STRING } from './input';

export const REPORTS_UUID_LIST = 'cflui.reportsForDataVisualizationConfiguration.uuid.list';
export const REPORTS_CONFIGURATION = 'cflui.reportsDataVisualizationConfiguration';
export const RETURN_LOCATION = '/openmrs/adminui/metadata/configureMetadata.page';
export const CHART_TITLE_KEY = 'title';
export const CHART_TYPE_KEY = 'chartType';
export const CHART_X_AXIS_KEY = 'xAxis';
export const CHART_Y_AXIS_KEY = 'yAxis';
export const CHART_LEGEND_KEY = 'legend';
export const CHART_DESCRIPTION_KEY = 'description';
export const CHART_MARGIN_TOP_KEY = 'marginTop';
export const CHART_MARGIN_BOTTOM_KEY = 'marginBottom';
export const CHART_MARGIN_RIGHT_KEY = 'marginRight';
export const CHART_MARGIN_LEFT_KEY = 'marginLeft';
export const CHART_COLORS_KEY = 'colors';
export const CHART_TYPE_OPTIONS = [
  { label: 'Bar Chart', value: 'Bar Chart' },
  { label: 'Line Chart', value: 'Line Chart' }
];

export const DEFAULT_REPORT_CONFIGURATION = {
  uuid: EMPTY_STRING,
  name: EMPTY_STRING,
  [CHART_TITLE_KEY]: EMPTY_STRING,
  [CHART_TYPE_KEY]: EMPTY_STRING,
  [CHART_X_AXIS_KEY]: EMPTY_STRING,
  [CHART_Y_AXIS_KEY]: EMPTY_STRING,
  [CHART_LEGEND_KEY]: EMPTY_STRING,
  [CHART_DESCRIPTION_KEY]: EMPTY_STRING,
  [CHART_MARGIN_TOP_KEY]: 50,
  [CHART_MARGIN_BOTTOM_KEY]: 100,
  [CHART_MARGIN_RIGHT_KEY]: 30,
  [CHART_MARGIN_LEFT_KEY]: 60,
  [CHART_COLORS_KEY]: '#ea5545, #f46a9b, #ef9b20, #edbf33, #ede15b, #bdcf32, #87bc45, #27aeef, #b33dc6'
};
