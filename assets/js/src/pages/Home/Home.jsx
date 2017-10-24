import $ from 'jquery';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import pnp from 'sp-pnp-js';
import { Spinner, SpinnerType } from 'office-ui-fabric-react/lib/Spinner';
import { Slider } from 'office-ui-fabric-react/lib/Slider';
import DirectLineClient from '../../bot/DirectLineClient';
import { GenerateGuid } from '../../utils/utils';
import { PAGESLIST } from '../../utils/settings';
import PagesList from '../../components/PagesList/PagesList';

import Styles from './Home.scss';

export default class Home extends Component {
	constructor() {
		super();

		this.state = {
			data: [],
			headerContent: null,
			fontsize: 14,
			loading: true,
			token: '',
			conversation: {}
		};
	}

	componentDidMount() {
		const self = this;

		setTimeout(() => {
			self.init();
		}, 3000);
	}

	init() {
		const directLineClient = new DirectLineClient('2K0kn2Mt6A0.cwA.rck.VC-2uwp8C5ImsJNQ-I8pCE5qIHdvpnhpEeY64SferUk');

		directLineClient.GetToken()
			.then(token => this.setState({ token, headerContent: token }, () => {
				directLineClient.CreateConversation(this.state.token)
					.then((conversation) => {
						this.setState({ conversation }, () => {
							directLineClient.PostMessage(conversation.token, conversation.conversationId, {
								type: 'message',
								from: {
									id: _spPageContextInfo.userLoginName
								},
								text: 'Hello world!'
							}).then((result) => {
								this.setState({ loading: false }, () => {
									console.log(result);
								});
							});
						});
					});
			}));

		// $.ajax({
		// 	url: 'https://sp-nodejs-restapi-azure.azurewebsites.net/api',
		// 	type: 'GET',
		// 	dataType: 'json',
		// 	success: (data) => {
		// 		console.log(data);
		// 	}
		// });

		// pnp.sp.web.lists
		// 	.getByTitle(self.props.listName).items
		// 	.select('ID, Title')
		// 	.get()
		// 	.then((data) => {
		// 		this.setState({ data, loading: false });
		// 	});
	}

	render() {
		const mainContent = this.state.loading ?
			(
				<Spinner type={SpinnerType.large} label="Seriously, still loading..." />
			)
			:
			(
				<div className="ms-Grid">
					<div className={`${Styles.top_container} ms-Grid-row`}>
						<div className="container">
							<div className={`${Styles.header} ms-Grid-col ms-u-sm12`}>
								{this.state.headerContent}
							</div>
						</div>
					</div>
					<div className={`${Styles.content_container} ms-Grid-row`}>
						<div className="container">
							<div className="ms-Grid-col ms-u-sm12">
								<PagesList
									data={this.state.data}
									guid={GenerateGuid()}
									fontsize={this.state.fontsize.toString()} />
							</div>
						</div>
					</div>
					<div className={`${Styles.bottom_container} ms-Grid-row`}>
						<div className="container">
							<div className="ms-Grid-col ms-u-sm12">
								<Slider
									label="Font size:"
									min={8}
									max={64}
									step={2}
									defaultValue={14}
									showValue
									onChange={fontsize => this.setState({ fontsize })} />
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

Home.propTypes = {
	listName: PropTypes.string
};

Home.defaultProps = {
	listName: PAGESLIST
};