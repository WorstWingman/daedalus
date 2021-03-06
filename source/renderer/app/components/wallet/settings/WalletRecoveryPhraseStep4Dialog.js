// @flow
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import SVGInline from 'react-svg-inline';
import classnames from 'classnames';
import { defineMessages, intlShape } from 'react-intl';
import DialogCloseButton from '../../widgets/DialogCloseButton';
import Dialog from '../../widgets/Dialog';
import styles from './WalletRecoveryPhraseStepDialogs.scss';
import externalLinkIcon from '../../../assets/images/link-ic.inline.svg';

export const messages = defineMessages({
  recoveryPhraseStep4Title: {
    id: 'wallet.settings.recoveryPhraseStep4Title',
    defaultMessage: '!!!verification failure',
    description: 'Label for the recoveryPhraseStep4Title on wallet settings.',
  },
  recoveryPhraseStep4Paragraph1: {
    id: 'wallet.settings.recoveryPhraseStep4Paragraph1',
    defaultMessage:
      '!!!The wallet recovery phrase you have entered does not match the recovery phrase of this wallet. Make sure you have entered the wallet recovery phrase which was written down during the wallet creation process for this wallet and make sure the words are in the correct order.',
    description:
      'Label for the recoveryPhraseStep4Paragraph1 on wallet settings.',
  },
  recoveryPhraseStep4Paragraph2: {
    id: 'wallet.settings.recoveryPhraseStep4Paragraph2',
    defaultMessage:
      '!!!If you are unable to verify your wallet recovery phrase, you should create a new wallet and move all of the funds from this wallet to the new wallet. If you do this, make sure you keep the wallet recovery phrase for the new wallet safe and secure.',
    description:
      'Label for the recoveryPhraseStep4Paragraph2 on wallet settings.',
  },
  recoveryPhraseStep4Button: {
    id: 'wallet.settings.recoveryPhraseStep4Button',
    defaultMessage: '!!!Verify recovery phrase again',
    description: 'Label for the recoveryPhraseStep4Button on wallet settings.',
  },
  recoveryPhraseStep4SupportTitle: {
    id: 'wallet.settings.recoveryPhraseStep4SupportTitle',
    defaultMessage: '!!!Read support portal article',
    description:
      'Label for the recoveryPhraseStep4SupportTitle on wallet settings.',
  },
  recoveryPhraseStep4SupportUrl: {
    id: 'wallet.settings.recoveryPhraseStep4SupportUrl',
    defaultMessage:
      '!!!https://iohk.zendesk.com/hc/en-us/articles/360035341914',
    description:
      'Label for the recoveryPhraseStep4SupportUrl on wallet settings.',
  },
});

type Props = {
  onClose: Function,
  onVerifyAgain: Function,
  openExternalLink: Function,
};

@observer
export default class WalletRecoveryPhraseStep1 extends Component<Props> {
  static contextTypes = {
    intl: intlShape.isRequired,
  };
  render() {
    const { intl } = this.context;
    const { onClose, onVerifyAgain, openExternalLink } = this.props;

    const actions = [
      {
        label: intl.formatMessage(messages.recoveryPhraseStep4Button),
        onClick: onVerifyAgain,
        className: 'attention',
      },
    ];

    const dialogStyles = classnames([
      styles.dialog,
      styles.dialog4,
      'verification-unsuccessful',
    ]);

    return (
      <Dialog
        className={dialogStyles}
        title={intl.formatMessage(messages.recoveryPhraseStep4Title)}
        actions={actions}
        closeOnOverlayClick
        onClose={onClose}
        closeButton={<DialogCloseButton />}
      >
        <p>{intl.formatMessage(messages.recoveryPhraseStep4Paragraph1)}</p>
        <p>{intl.formatMessage(messages.recoveryPhraseStep4Paragraph2)}</p>
        <div className={styles.supportPortalContainer}>
          <span
            role="presentation"
            onClick={(event: MouseEvent) =>
              openExternalLink(
                intl.formatMessage(messages.recoveryPhraseStep4SupportUrl),
                event
              )
            }
            className={styles.supportPortalLink}
          >
            {intl.formatMessage(messages.recoveryPhraseStep4SupportTitle)}
            <SVGInline
              svg={externalLinkIcon}
              className={styles.externalLinkIcon}
            />
          </span>
        </div>
      </Dialog>
    );
  }
}
