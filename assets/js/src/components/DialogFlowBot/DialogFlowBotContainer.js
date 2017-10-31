import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';
import DialogFlowClient from '../../bot/DialogFlowClient';

import DialogFlowBot from './DialogFlowBot';

export default class DialogFlowBotContainer extends Component {
	constructor() {
		super();

		this.state = {
			dialog: [{
				type: 'bot',
				timestamp: Moment(),
				message: `Hi ${_spPageContextInfo.userDisplayName}, how can I help you today?`
			}],
			youSayValue: '',
			loading: true,
			botIsReplying: false
		};

		this.dialogFlowClient = new DialogFlowClient('f4971524f5b64376829b7684f95213fb');

		this.handleYouSayTextFieldChanged = this.handleYouSayTextFieldChanged.bind(this);
		this.handleYouSayKeyPress = this.handleYouSayKeyPress.bind(this);
	}

	handleYouSayTextFieldChanged(value) {
		this.setState({ youSayValue: value });
	}

	handleYouSayKeyPress(e) {
		if (e.which === 13) {
			e.preventDefault();

			if (this.state.youSayValue) {
				const youSaid = this.state.youSayValue;

				this.setState({
					dialog: this.state.dialog.concat([{
						type: 'user',
						timestamp: Moment(),
						message: youSaid
					}]),
					botIsReplying: true,
					youSayValue: ''
				}, () => {
					this.dialogFlowClient.PostMessage(youSaid)
						.then((body) => {
							this.setState({
								dialog: this.state.dialog.concat([{
									type: 'bot',
									timestamp: Moment(),
									message: body.result.fulfillment.speech
								}]),
								botIsReplying: false
							});
						});
				});
			}
		}
	}

	componentDidUpdate() {
		const dialogContentElement = this.dialogContent;
		dialogContentElement.scrollTop = dialogContentElement.scrollHeight;
	}

	render() {
		const {
			dialog,
			youSayValue,
			loading,
			botIsReplying
		} = this.state;

		return (
			<DialogFlowBot
				dialog={dialog}
				youSayValue={youSayValue}
				loading={loading}
				botIsReplying={botIsReplying}
				onYouSayKeyPress={this.handleYouSayKeyPress}
				onYouSayTextFieldChanged={this.handleYouSayTextFieldChanged}
				dialogContentRef={e => this.dialogContent = e} />
		);
	}
}