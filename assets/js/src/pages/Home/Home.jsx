import React from 'react';
import PropTypes from 'prop-types';
import { Spinner, SpinnerType } from 'office-ui-fabric-react/lib/Spinner';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import DialogFlowBotContainer from '../../components/DialogFlowBot/DialogFlowBotContainer';

import Styles from './Home.scss';

const Home = (props) => {
	const {
		activities,
		youSayValue,
		loading,
		botIsReplying,
		onYouSayKeyPress,
		onYouSayTextFieldChanged
	} = props;

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
							<div className={Styles.header_title} />
						</div>
					</div>
				</div>
				{/* <div className={`${Styles.content_container} ms-Grid-row`}>
					<div className="container">
						<div className={`${Styles.content_wrapper} ms-Grid-row`}>
							<div className={`${Styles.header_content} ms-Grid-col ms-u-sm12`}>
								<div className={Styles.header_title}>
									Sharepoint ChatBot
								</div>
							</div>
							<div className={`${Styles.dialog_content} ms-Grid-col ms-u-sm12`} />
							<div className={`${Styles.footer_content} ms-Grid-col ms-u-sm12`} onKeyPress={onYouSayKeyPress}>
								<TextField 
									placeholder="Type the message..." 
									value={youSayValue} 
									onChanged={onYouSayTextFieldChanged} />
							</div>
						</div>
					</div>
				</div> */}
				<div className={`${Styles.content_container} ms-Grid-row`}>
					<DialogFlowBotContainer />
				</div>
			</div>
		);

	return (
		<div className={Styles.container}>
			{mainContent}
		</div>
	);
};

Home.propTypes = {
	activities: PropTypes.arrayOf(PropTypes.any),
	youSayValue: PropTypes.string,
	loading: PropTypes.bool,
	botIsReplying: PropTypes.bool,
	onYouSayKeyPress: PropTypes.func,
	onYouSayTextFieldChanged: PropTypes.func
};

export default Home;