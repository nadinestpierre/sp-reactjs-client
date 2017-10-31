import React, { Component } from 'react';
import PropTypes from 'prop-types';
import pnp from 'sp-pnp-js';
import DirectLineClient from '../../bot/DirectLineClient';

import Styles from './Home.scss';

export default class Home extends Component {
	constructor() {
		super();

		this.state = {
			intervalId: null,
			youSayValue: '',
			data: [],
			loading: true,
			botIsReplying: false,
			token: '',
			conversation: {},
			postMessageResponse: {},
			activities: []
		};

		this.directLineClient = new DirectLineClient('07Zlc22-8Z4.cwA.8rA.o0zeaOPHOsmG6QwLCzFPrEp6ThIjFVgwA62yuujkl6g');

		this.handleYouSayTextFieldChanged = this.handleYouSayTextFieldChanged.bind(this);
		this.handleYouSayKeyPress = this.handleYouSayKeyPress.bind(this);
	}

	componentDidMount() {
		this.init();
	}

	init() {
		this.directLineClient.GetToken()
			.then(token => this.setState({ token, headerContent: token }, () => {
				this.directLineClient.CreateConversation(this.state.token)
					.then((conversation) => {
						this.setState({ conversation, loading: false });
					});
			}));

		this.setState({ loading: false });
	}

	putMessage(conversationId, text) {
		this.directLineClient.PostMessage(null, conversationId, {
			type: 'message',
			from: {
				id: _spPageContextInfo.userDisplayName
			},
			text
		}).then((postMessageResponse) => {
			console.log(postMessageResponse.body);
			this.setState({ postMessageResponse: postMessageResponse.body });

			this.pollMessages(conversationId);
		});
	}

	pollMessages(conversationId) {
		console.log(`Starting polling messages for ConversationId: ${conversationId}`);

		if (this.state.intervalId) {
			clearInterval(this.state.intervalId);
		}

		const intervalId = setInterval(() => {
			this.directLineClient.GetMessages(null, conversationId)
				.then((getMessagesResponse) => {
					const activities = getMessagesResponse.activities;
					this.setState({ activities, botIsReplying: false });

					console.log(activities);
					return activities;
				});
		}, 2000);

		this.setState({ intervalId });
	}

	handleYouSayTextFieldChanged(value) {
		this.setState({ youSayValue: value });
	}

	handleYouSayKeyPress(e) {
		if (e.which === 13) {
			e.preventDefault();

			const {
				conversation,
				youSayValue
			} = this.state;

			if (youSayValue) {
				const youSaid = youSayValue;

				this.setState({ botIsReplying: true, youSayValue: '' }, () => {
					this.putMessage(conversation.conversationId, youSaid);
				});
			}
		}
	}

	render() {
		const {
			activities,
			youSayValue,
			loading,
			botIsReplying
		} = this.state;

		return (
			<Home 
				activities={activities}
				youSayValue={youSayValue}
				loading={loading}
				botIsReplying={botIsReplying}
				onYouSayKeyPress={this.handleYouSayKeyPress}
				onYouSayTextFieldChanged={this.handleYouSayTextFieldChanged} />
		);
	}
}