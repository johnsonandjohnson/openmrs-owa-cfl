import { IntlShape } from 'react-intl';

const Intl: IntlShape = {
  formatMessage: (message: { id: string }) => message.id,
  defaultFormats: null,
  defaultLocale: null,
  formatDate: jest.fn(),
  formatDateTimeRange: jest.fn(),
  formatDateToParts: jest.fn(),
  formatDisplayName: jest.fn(),
  formatList: jest.fn(),
  formatNumber: jest.fn(),
  formatNumberToParts: jest.fn(),
  formatPlural: jest.fn(),
  formatRelativeTime: jest.fn(),
  formatTime: jest.fn(),
  formatTimeToParts: jest.fn(),
  formats: null,
  formatters: null,
  locale: null,
  messages: null,
  onError: null
};

export default Intl;
