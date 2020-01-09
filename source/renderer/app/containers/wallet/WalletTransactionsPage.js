// @flow
import React, { Component } from 'react';
import { get } from 'lodash';
import { observer, inject } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import WalletTransactionsList from '../../components/wallet/transactions/WalletTransactionsList';
import WalletNoTransactions from '../../components/wallet/transactions/WalletNoTransactions';
import VerticalFlexContainer from '../../components/layout/VerticalFlexContainer';
import FilterDialogContainer from './dialogs/FilterDialogContainer';
import FilterDialog from '../../components/wallet/transactions/FilterDialog';
import type { InjectedProps } from '../../types/injectedPropsType';
import { formattedWalletAmount } from '../../utils/formatters';
import { isFilterApplied } from '../../utils/transaction';
import type { TransactionFilterOptionsStruct } from '../../stores/TransactionsStore';
import { WalletSyncStateStatuses } from '../../domains/Wallet';
import { getNetworkExplorerUrlByType } from '../../utils/network';

export const messages = defineMessages({
  noTransactions: {
    id: 'wallet.transactions.no.transactions',
    defaultMessage: '!!!No transactions',
    description: 'Message shown when wallet has no transactions yet.',
  },
  noTransactionsFound: {
    id: 'wallet.transactions.no.transactions.found',
    defaultMessage: '!!!No transactions found',
    description:
      'Message shown when wallet transaction search returns zero results.',
  },
});

type Props = InjectedProps;

@inject('stores', 'actions')
@observer
export default class WalletTransactionsPage extends Component<Props> {
  static contextTypes = {
    intl: intlShape.isRequired,
  };

  openFilterDialog = () => {
    const { dialogs } = this.props.actions;
    const { populatedFilterOptions } = this.props.stores.transactions;

    dialogs.open.trigger({ dialog: FilterDialog });
    dialogs.updateDataForActiveDialog.trigger({
      data: populatedFilterOptions,
    });
  };

  onFilter = (filterProps: TransactionFilterOptionsStruct) => {
    const {
      transactions: transactionActions,
      dialogs: dialogActions,
    } = this.props.actions;
    transactionActions.filterTransactions.trigger(filterProps);
    dialogActions.closeActiveDialog.trigger();
  };

  render() {
    const { intl } = this.context;
    const { actions, stores } = this.props;
    const { app, uiDialogs, wallets, profile } = stores;
    const {
      openExternalLink,
      environment: { network, rawNetwork },
    } = app;
    const activeWallet = wallets.active;
    const {
      filterOptions,
      searchRequest,
      hasAny,
      totalAvailable,
      allFiltered,
      recentFiltered,
      deletePendingTransaction,
      deleteTransactionRequest,
    } = stores.transactions;
    const { currentTimeFormat, currentDateFormat, currentLocale } = profile;

    // Guard against potential null values
    if (!filterOptions || !activeWallet) return null;

    let walletTransactions = null;
    const { searchLimit } = filterOptions;
    const wasFiltered = isFilterApplied(filterOptions);
    const noTransactionsLabel = intl.formatMessage(messages.noTransactions);
    const noTransactionsFoundLabel = intl.formatMessage(
      messages.noTransactionsFound
    );
    const hasMoreToLoad = () =>
      searchLimit !== null &&
      searchLimit !== undefined &&
      totalAvailable > searchLimit;

    const isRestoreActive =
      get(activeWallet, ['syncState', 'status']) ===
      WalletSyncStateStatuses.RESTORING;

    const getUrlByType = (type: 'tx' | 'address', param: string) =>
      getNetworkExplorerUrlByType(
        type,
        param,
        network,
        rawNetwork,
        currentLocale
      );

    // Straight away show recent filtered transactions if all filtered ones are not loaded yet
    const transactions =
      recentFiltered.length && !allFiltered.length
        ? recentFiltered
        : allFiltered;

    if (!hasAny) {
      walletTransactions = <WalletNoTransactions label={noTransactionsLabel} />;
    } else if (wasFiltered && !transactions.length) {
      walletTransactions = (
        <WalletNoTransactions
          onFilterButtonClick={this.openFilterDialog}
          label={noTransactionsFoundLabel}
        />
      );
    } else if (
      searchRequest.isExecutingFirstTime ||
      hasAny ||
      isRestoreActive
    ) {
      walletTransactions = (
        <WalletTransactionsList
          onFilterButtonClick={this.openFilterDialog}
          transactions={transactions}
          deletePendingTransaction={deletePendingTransaction}
          isLoadingTransactions={searchRequest.isExecutingFirstTime}
          isRestoreActive={isRestoreActive}
          hasMoreToLoad={hasMoreToLoad()}
          onLoadMore={actions.transactions.loadMoreTransactions.trigger}
          walletId={activeWallet.id}
          isDeletingTransaction={deleteTransactionRequest.isExecuting}
          formattedWalletAmount={formattedWalletAmount}
          onOpenExternalLink={openExternalLink}
          getUrlByType={getUrlByType}
          currentTimeFormat={currentTimeFormat}
          currentDateFormat={currentDateFormat}
          isRenderingAsVirtualList
        />
      );
    }

    return (
      <VerticalFlexContainer>
        {uiDialogs.isOpen(FilterDialog) && (
          <FilterDialogContainer onFilter={this.onFilter} />
        )}
        {walletTransactions}
      </VerticalFlexContainer>
    );
  }
}
