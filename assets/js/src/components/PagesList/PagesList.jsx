import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Styles from './PagesList.scss';

export default class PagesList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			data: this.props.data
		};
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ data: nextProps.data });
	}

	render() {
		const self = this;
		const pages = self.state.data;
		const mainContent = pages && pages.length > 0 ? pages.map((item, i) =>
			(
				<div key={item.ID} className={Styles.item} style={{ fontSize: self.props.fontsize }}>
					{`${i + 1}. ${item.Title}`}
				</div>
			)
		) : null;

		return (
			<div className={Styles.container}>
				<p className={Styles.header}>
					{self.props.guid}
				</p>
				<p className={Styles.header}>
					{'Site pages:'}
				</p>
				<div className={Styles.content}>
					{mainContent}
				</div>
			</div>
		);
	}
}

PagesList.propTypes = {
	data: PropTypes.arrayOf(PropTypes.object).isRequired,
	fontsize: PropTypes.string.isRequired,
	guid: PropTypes.string.isRequired
};
