/* eslint import/no-unresolved: 0 */
/* eslint import/no-extraneous-dependencies: 0 */

/* Global Styles */
import 'css/screen.scss';

/* Global Components */
import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import ES6Promise from 'es6-promise';
import AppComponentsList from './AppConfig';

function ready(fn) {
	if (document.readyState !== 'loading') {
		ExecuteOrDelayUntilScriptLoaded(fn, 'sp.js');
	} else {
		document.addEventListener('DOMContentLoaded', fn);
	}
}

/* Application Entry Point */
ready(() => {
	ES6Promise.polyfill();

	Array.prototype.forEach.call(document.querySelectorAll('.app-component-render'), 
		(component) => {
			const AppComponentId = component.getAttribute('id').toLowerCase();
			const AppComponent = AppComponentsList[AppComponentId];

			if (AppComponent) {
				ReactDOM.render(
					<AppComponent />,
					document.getElementById(AppComponentId)
				);
			}
		}
	);
});
