import React, { Component } from 'react';
import PropTypes from 'prop-types';
import pnp from 'sp-pnp-js';
import Moment from 'moment';
import { Spinner, SpinnerType } from 'office-ui-fabric-react/lib/Spinner';
import DirectLineClient from '../../bot/DirectLineClient';
import { GenerateGuid } from '../../utils/utils';

import Styles from './Home.scss';

export default class Home extends Component {
	constructor() {
		super();

		this.state = {
			data: [],
			headerContent: null,
			loading: true,
			token: '',
			conversation: {},
			postMessageResponse: {},
			activities: []
		};

		this.directLineClient = new DirectLineClient('07Zlc22-8Z4.cwA.8rA.o0zeaOPHOsmG6QwLCzFPrEp6ThIjFVgwA62yuujkl6g');
	}

	componentDidMount() {
		this.init();
	}

	init() {
		this.directLineClient.GetToken()
			.then(token => this.setState({ token, headerContent: token }, () => {
				this.directLineClient.CreateConversation(this.state.token)
					.then((conversation) => {
						this.setState({ conversation });

						return this.directLineClient.PostMessage(null, conversation.conversationId, {
							type: 'message',
							from: {
								id: conversation.conversationId
							},
							text: 'Hi'
						});
					}).then((postMessageResponse) => {
						console.log(postMessageResponse.body);
						this.setState({ postMessageResponse: postMessageResponse.body });
						this.pollMessages(this.state.conversation.conversationId);
					});
			}));
	}

	pollMessages(conversationId) {
		console.log(`Starting polling messages for ConversationId: ${conversationId}`);

		setTimeout(() => {
			this.directLineClient.GetMessages(null, conversationId)
				.then((getMessagesResponse) => {
					const activities = getMessagesResponse.activities;
					this.setState({ activities, loading: false });

					console.log(activities);
					return activities;
				});
		}, 3000);
	}

	render() {
		const {
			headerContent,
			loading,
			activities
		} = this.state;

		const mainContent = loading ?
			(
				<Spinner type={SpinnerType.large} label="Seriously, still loading..." />
			)
			:
			(
				<div className="ms-Grid">
					<div className={`${Styles.top_container} ms-Grid-row`}>
						<div className="container">
							<div className={`${Styles.header} ms-Grid-col ms-u-sm12`}>
								{headerContent}
							</div>
						</div>
					</div>
					<div className={`${Styles.content_container} ms-Grid-row`}>
						<div className="container">
							<div className="ms-Grid-col ms-u-sm12">
								{
									activities && activities.length > 0 && (
										activities.map(a => <div key={GenerateGuid()}>{`From: ${a.from.id} Message: ${a.text}`}</div>)
									)
								}
							</div>
						</div>
					</div>
				</div>
			);

		return (
			<div className={Styles.container}>
				{mainContent}
			</div>
		);
	}
}