import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { GetImgPath, GenerateGuid } from '../../utils/utils';

import Styles from './DialogFlowBot.scss';

const DialogFlowBot = (props) => {
	const {
		dialog,
		youSayValue,
		loading,
		botIsReplying,
		onYouSayKeyPress,
		onYouSayTextFieldChanged,
		dialogContentRef
	} = props;

	const dialogFlow = dialog && dialog.length > 0 ? dialog.map((message) => {
		if (message && message.type === 'user') {
			return (
				<div key={GenerateGuid()} className={Styles.user_container}>
					<div className={Styles.wrapper}>
						<div className={`${Styles.message}`}>
							{message.message}
						</div>
						<div className={Styles.image}>
							<img src={`https://outlook.office365.com/owa/service.svc/s/GetPersonaPhoto?email=${_spPageContextInfo.userEmail}&amp;UA=0&amp;size=HR64x64`} alt="User Image" />
						</div>
					</div>
					<div className={Styles.timestamp_container}>
						<div className={Styles.timestamp}>
							{Moment(message.timestamp).format('LT')}
						</div>
					</div>
				</div>
			);
		} else if (message && message.type === 'bot') {
			return (
				<div key={GenerateGuid()} className={Styles.bot_container}>
					<div className={Styles.wrapper}>
						<div className={Styles.image}>
							<img src={`${GetImgPath('spreactjsclient')}/bender.ico`} alt="Bot Image" />
						</div>
						<div className={`${Styles.message}`}>
							{message.message}
						</div>
					</div>
					<div className={Styles.timestamp_container}>
						<div className={Styles.timestamp}>
							{Moment(message.timestamp).format('LT')}
						</div>
					</div>
				</div>
			);
		}

		return null;
	}) : null;

	const mainContent = (
		<div className={`${Styles.content_wrapper} ms-Grid-row`}>
			<div className={`${Styles.header_content} ms-Grid-col ms-sm12`} >
				<div className={Styles.header_title}>
					DialogFlow ChatBot
				</div>
			</div>
			<div ref={dialogContentRef} className={`${Styles.dialog_content} ms-Grid-col ms-sm12`}>
				{dialogFlow}
			</div>
			<div className={`${Styles.footer_content} ms-Grid-col ms-sm12`} onKeyPress={onYouSayKeyPress}>
				<TextField
					placeholder="Type the message..."
					value={youSayValue}
					onChanged={onYouSayTextFieldChanged} />
			</div>
		</div>
	);

	return (
		<div className={`${Styles.container} container`}>
			{mainContent}
		</div>
	);
};

DialogFlowBot.propTypes = {
	dialog: PropTypes.arrayOf(PropTypes.any),
	youSayValue: PropTypes.string,
	loading: PropTypes.bool,
	botIsReplying: PropTypes.bool,
	onYouSayKeyPress: PropTypes.func,
	onYouSayTextFieldChanged: PropTypes.func,
	dialogContentRef: PropTypes.func
};

export default DialogFlowBot;