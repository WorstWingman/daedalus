// @flow
/* eslint-disable jsx-a11y/label-has-associated-control, jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import moment from 'moment';
import BigNumber from 'bignumber.js';
import { defineMessages, intlShape } from 'react-intl';
import ReactToolboxMobxForm from '../../../utils/ReactToolboxMobxForm';
import type { DateRangeType } from '../../../stores/TransactionsStore';
import { DateRangeTypes } from '../../../stores/TransactionsStore';
import TinyCheckbox from '../../widgets/forms/TinyCheckbox';
import TinySelect from '../../widgets/forms/TinySelect';
import TinyInput from '../../widgets/forms/TinyInput';
import TinyButton from '../../widgets/forms/TinyButton';
import DialogCloseButton from '../../widgets/DialogCloseButton';
import Dialog from '../../widgets/Dialog';
import globalMessages from '../../../i18n/global-messages';
import styles from './FilterDialog.scss';

const messages = defineMessages({
  filterBy: {
    id: 'wallet.transaction.filter.filterBy',
    defaultMessage: '!!!Filter by',
    description: 'Title of filter panel.',
  },
  reset: {
    id: 'wallet.transaction.filter.reset',
    defaultMessage: '!!!reset',
    description: 'Reset link text on filter panel.',
  },
  type: {
    id: 'wallet.transaction.filter.type',
    defaultMessage: '!!!Type',
    description: 'Filter Type.',
  },
  incoming: {
    id: 'wallet.transaction.filter.incoming',
    defaultMessage: '!!!Incoming',
    description: 'Incoming filter type.',
  },
  outgoing: {
    id: 'wallet.transaction.filter.outgoing',
    defaultMessage: '!!!Outgoing',
    description: 'Outgoing filter type.',
  },
  dateRange: {
    id: 'wallet.transaction.filter.dateRange',
    defaultMessage: '!!!Date range',
    description: 'Date range of filter.',
  },
  thisWeek: {
    id: 'wallet.transaction.filter.thisWeek',
    defaultMessage: '!!!This week',
    description: 'This week date range of filter.',
  },
  thisMonth: {
    id: 'wallet.transaction.filter.thisMonth',
    defaultMessage: '!!!This month',
    description: 'This month date range of filter.',
  },
  thisYear: {
    id: 'wallet.transaction.filter.thisYear',
    defaultMessage: '!!!This year',
    description: 'This year date range of filter.',
  },
  customDateRange: {
    id: 'wallet.transaction.filter.customDateRange',
    defaultMessage: '!!!Custom date range',
    description: 'Custom date range of filter.',
  },
  amountRange: {
    id: 'wallet.transaction.filter.amountRange',
    defaultMessage: '!!!Amount range',
    description: 'Amount range of filter.',
  },
  amountUnit: {
    id: 'global.unit.ada',
    defaultMessage: '!!!ADA',
    description: 'Amount unit.',
  },
  filter: {
    id: 'wallet.transaction.filter.filter',
    defaultMessage: '!!!Filter',
    description: 'Filter button label.',
  },
});

const calculateDateRange = (
  dateRange: string,
  customDateRange: { customFromDate: string, customToDate: string }
) => {
  const { customFromDate, customToDate } = customDateRange;
  let fromDate = null;
  let toDate = null;

  if (dateRange === DateRangeTypes.ALL) {
    fromDate = '';
    toDate = '';
  } else if (dateRange === DateRangeTypes.CUSTOM_DATE_RANGE) {
    fromDate = customFromDate;
    toDate = customToDate;
  } else {
    if (dateRange === DateRangeTypes.THIS_WEEK) {
      fromDate = moment().startOf('week');
    } else if (dateRange === DateRangeTypes.THIS_MONTH) {
      fromDate = moment().startOf('month');
    } else if (dateRange === DateRangeTypes.THIS_YEAR) {
      fromDate = moment().startOf('year');
    } else {
      fromDate = moment();
    }
    fromDate = fromDate.format('YYYY-MM-DD');
    toDate = moment().format('YYYY-MM-DD');
  }

  return { fromDate, toDate };
};

type Props = {
  dateRange?: DateRangeType,
  fromDate?: string,
  toDate?: string,
  fromAmount?: number,
  toAmount?: number,
  incomingChecked?: boolean,
  outgoingChecked?: boolean,
  onFilter: Function,
  onClose: Function,
};

@observer
export default class FilterDialog extends Component<Props> {
  static contextTypes = {
    intl: intlShape.isRequired,
  };

  dateRangeOptions = [
    {
      label: this.context.intl.formatMessage(globalMessages.all),
      value: DateRangeTypes.ALL,
    },
    {
      label: this.context.intl.formatMessage(messages.thisWeek),
      value: DateRangeTypes.THIS_WEEK,
    },
    {
      label: this.context.intl.formatMessage(messages.thisMonth),
      value: DateRangeTypes.THIS_MONTH,
    },
    {
      label: this.context.intl.formatMessage(messages.thisYear),
      value: DateRangeTypes.THIS_YEAR,
    },
    {
      label: this.context.intl.formatMessage(messages.customDateRange),
      value: DateRangeTypes.CUSTOM_DATE_RANGE,
    },
  ];

  form = new ReactToolboxMobxForm({
    fields: {
      incomingChecked: {
        type: 'checkbox',
        label: this.context.intl.formatMessage(messages.incoming),
        value: this.props.incomingChecked,
      },
      outgoingChecked: {
        type: 'checkbox',
        label: this.context.intl.formatMessage(messages.outgoing),
        value: this.props.outgoingChecked,
      },
      dateRange: {
        label: this.context.intl.formatMessage(messages.dateRange),
        value: this.props.dateRange,
      },
      customFromDate: {
        type: 'date',
        label: '',
        value: this.props.fromDate,
      },
      customToDate: {
        type: 'date',
        label: '',
        value: this.props.toDate,
      },
      fromAmount: {
        type: 'number',
        label: '',
        value: this.props.fromAmount,
      },
      toAmount: {
        type: 'number',
        label: '',
        value: this.props.toAmount,
      },
    },
  });

  resetForm = () => {
    this.form.select('dateRange').set(DateRangeTypes.ALL);
    this.form.select('fromAmount').set(0);
    this.form.select('toAmount').set(0);
    this.form.select('incomingChecked').set(true);
    this.form.select('outgoingChecked').set(true);
  };

  handleSubmit = () =>
    this.form.submit({
      onSuccess: form => {
        const { onFilter } = this.props;
        const {
          dateRange,
          customFromDate,
          customToDate,
          ...rest
        } = form.values();
        const dateRangePayload = calculateDateRange(dateRange, {
          customFromDate,
          customToDate,
        });

        onFilter({
          ...rest,
          ...dateRangePayload,
          dateRange,
          fromAmount: Number(rest.fromAmount),
          toAmount: Number(rest.toAmount),
        });
      },
      onError: () => null,
    });

  renderTypeField = () => {
    const { form } = this;
    const { intl } = this.context;
    const incomingCheckboxField = form.$('incomingChecked');
    const outgoingCheckboxField = form.$('outgoingChecked');

    return (
      <div className={styles.type}>
        <div className={styles.header}>
          <label>{intl.formatMessage(messages.type)}</label>
        </div>
        <div className={styles.body}>
          <div className={styles.typeCheckbox}>
            <TinyCheckbox {...incomingCheckboxField.bind()} />
          </div>
          <div className={styles.typeCheckbox}>
            <TinyCheckbox {...outgoingCheckboxField.bind()} />
          </div>
        </div>
      </div>
    );
  };

  renderDateRangeField = () => {
    const dateRangeField = this.form.$('dateRange');

    return (
      <div className={styles.dateRange}>
        <TinySelect
          {...dateRangeField.bind()}
          options={this.dateRangeOptions}
        />
      </div>
    );
  };

  renderCustomDateRangeField = () => {
    const { form } = this;
    const { intl } = this.context;
    const customFromDateField = form.$('customFromDate');
    const customToDateField = form.$('customToDate');
    const { customFromDate, customToDate } = form.values();
    const customFromDateInnerValue = customFromDate ? (
      moment(customFromDate).format('MM.DD.YYYY')
    ) : (
      <span className="undefined">mm.dd.yyyy</span>
    );
    const customToDateInnerValue = customToDate ? (
      moment(customToDate).format('MM.DD.YYYY')
    ) : (
      <span className="undefined">mm.dd.yyyy</span>
    );

    return (
      <div className={styles.customDateRange}>
        <div className={styles.header}>
          <label>{intl.formatMessage(messages.customDateRange)}</label>
          <DialogCloseButton
            onClose={() => form.select('dateRange').set(DateRangeTypes.ALL)}
          />
        </div>
        <div className={styles.body}>
          <div className={styles.dateRangeInput}>
            <TinyInput
              type="date"
              {...customFromDateField.bind()}
              useReadMode
              innerLabelPrefix={intl.formatMessage(globalMessages.rangeFrom)}
              innerValue={customFromDateInnerValue}
            />
          </div>
          <div className={styles.dateRangeInput}>
            <TinyInput
              type="date"
              {...customToDateField.bind()}
              useReadMode
              innerLabelPrefix={intl.formatMessage(globalMessages.rangeTo)}
              innerValue={customToDateInnerValue}
            />
          </div>
        </div>
      </div>
    );
  };

  renderAmountRangeField = () => {
    const { form } = this;
    const { intl } = this.context;
    const fromAmountField = form.$('fromAmount');
    const toAmountField = form.$('toAmount');
    const { fromAmount, toAmount } = form.values();
    const fromAmountInnerValue = Number(fromAmount) ? (
      new BigNumber(fromAmount).toFormat()
    ) : (
      <span className="undefined">0</span>
    );
    const toAmountInnerValue = Number(toAmount) ? (
      new BigNumber(toAmount).toFormat()
    ) : (
      <span className="undefined">0</span>
    );

    return (
      <div className={styles.amountRange}>
        <div className={styles.header}>
          <label>{intl.formatMessage(messages.amountRange)}</label>
        </div>
        <div className={styles.body}>
          <div className={styles.amountRangeInput}>
            <TinyInput
              type="number"
              {...fromAmountField.bind()}
              useReadMode
              innerLabelPrefix={intl.formatMessage(globalMessages.rangeFrom)}
              innerLabelSuffix={intl.formatMessage(messages.amountUnit)}
              innerValue={fromAmountInnerValue}
            />
          </div>
          <div className={styles.amountRangeInput}>
            <TinyInput
              type="number"
              {...toAmountField.bind()}
              useReadMode
              innerLabelPrefix={intl.formatMessage(globalMessages.rangeTo)}
              innerLabelSuffix={intl.formatMessage(messages.amountUnit)}
              innerValue={toAmountInnerValue}
            />
          </div>
        </div>
      </div>
    );
  };

  renderActionButton = () => {
    const { intl } = this.context;

    return (
      <div className={styles.action}>
        <TinyButton
          label={intl.formatMessage(messages.filter)}
          loading={false}
          onClick={this.handleSubmit}
        />
      </div>
    );
  };

  render() {
    const { intl } = this.context;
    const { onClose } = this.props;
    const { dateRange } = this.form.values();
    const isCustomDateRangeSelected =
      dateRange === DateRangeTypes.CUSTOM_DATE_RANGE;

    return (
      <Dialog
        closeOnOverlayClick
        className={styles.component}
        onClose={onClose}
      >
        <div className={styles.title}>
          <h4 className={styles.titleText}>
            {intl.formatMessage(messages.filterBy)}
          </h4>
          <button className={styles.titleLink} onClick={this.resetForm}>
            {intl.formatMessage(messages.reset)}
          </button>
        </div>
        <div className={styles.content}>
          {this.renderTypeField()}
          {!isCustomDateRangeSelected && this.renderDateRangeField()}
          {isCustomDateRangeSelected && this.renderCustomDateRangeField()}
          {this.renderAmountRangeField()}
          {this.renderActionButton()}
        </div>
      </Dialog>
    );
  }
}
