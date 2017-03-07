/* External libraries */
import $ from 'jquery';
import React from 'react';
import SPOC from 'SPOCExt';

/* CSS styles */
import Styles from './PagesList.scss';

class PagesList extends React.Component {
	static propTypes = {
		listName: React.PropTypes.string.isRequired,
		fontsize: React.PropTypes.string,
		guid: React.PropTypes.string
	};

	constructor() {
		super();

		this.state = {
			data: []
		};

		this.site = new SPOC.SP.Site();
	}

	componentDidMount() {
		this.init(this.props.listName);
	}

	init(listName) {
		const self = this;		
		const settings = {
			select: 'Title'
		};

		self.site.ListItems(listName).query(settings).then((data) => {
			self.setState({ data });
		},
		(error) => {
			console.log(error);
		});
	}

	render() {
		const self = this;
		const pages = self.state.data;
		const mainContent = pages && pages.length > 0 ? pages.map((item, i) => 
			<div key={i} className={Styles.item} style={{ fontSize: self.props.fontsize }}>
				{`${i + 1}. ${item.Title}`}
			</div>
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

export default PagesList;
