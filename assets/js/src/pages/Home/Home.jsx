import React, { Component } from 'react';
import PropTypes from 'prop-types';
import pnp from 'sp-pnp-js';
import Moment from 'moment';
import { Spinner, SpinnerType } from 'office-ui-fabric-react/lib/Spinner';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import DirectLineClient from '../../bot/DirectLineClient';
import { GenerateGuid } from '../../utils/utils';

import Styles from './Home.scss';

export default class Home extends Component {
	constructor() {
		super();

		this.state = {
			intervalId: null,
			youSayValue: '',
			data: [],
			headerContent: null,
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

		// setTimeout(() => {
		// 	this.directLineClient.GetMessages(null, conversationId)
		// 		.then((getMessagesResponse) => {
		// 			const activities = getMessagesResponse.activities;
		// 			this.setState({ activities, botIsReplying: false });

		// 			console.log(activities);
		// 			return activities;
		// 		});
		// }, 3000);

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
			headerContent,
			loading,
			activities,
			youSayValue,
			botIsReplying
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
								<div className={Styles.header_title}>
									This is Sharepoint ChatBot. Try to speak about hotels...
								</div>
							</div>
						</div>
					</div>
					<div className={`${Styles.content_container} ms-Grid-row`}>
						<div className="container">
							<div className="ms-Grid-col ms-u-sm12">
								{
									botIsReplying ?
										(
											<Spinner type={SpinnerType.large} label="SPChatBot is typing..." />
										)
										:
										(
											activities && activities.length > 0 && (
												activities.map((activity) => {
													if (activity.attachments && activity.attachments.length > 0) {
														return (
															activity.attachments.map((attachment) => {
																if (attachment && attachment.content.title && attachment.content.subtitle && attachment.content.images) {
																	return (
																		<div key={GenerateGuid()}>
																			<div>
																				{attachment.content.title}
																			</div>
																			<div>
																				{attachment.content.subtitle}
																			</div>
																			<div>
																				{
																					attachment.content.images && attachment.content.images.length > 0 ?
																						(
																							attachment.content.images.map((image) => {
																								if (image && image.url) {
																									return (
																										<div key={GenerateGuid()}>
																											<img src={image.url} alt="image" />
																										</div>
																									);
																								}

																								return null;
																							})
																						) : null
																				}
																			</div>
																		</div>
																	);
																}

																return null;
															})
														);
													}

													return (
														<div key={GenerateGuid()}>{`${activity.from.id}: ${activity.text}`}</div>
													);
												})
											)
										)
								}
							</div>
							<div className="ms-Grid-col ms-u-sm12" onKeyPress={this.handleYouSayKeyPress}>
								<TextField label="You are saying..." value={youSayValue} onChanged={this.handleYouSayTextFieldChanged} />
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