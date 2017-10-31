import request from 'request';
import Q from 'q';
import { GenerateGuid } from '../utils/utils';

export default class DialogFlowClient {
	constructor(token, baseUrl, apiVersion) {
		this.baseUrl = baseUrl || 'https://api.dialogflow.com/v1';
		this.apiVersion = apiVersion || '20150910';
		this.token = token;
		this.sessionId = GenerateGuid();
	}

	PostMessage(query) {
		const defer = Q.defer();

		console.log(this.sessionId);

		request({
			method: 'POST',
			uri: `${this.baseUrl}/query?v=${this.apiVersion}`,
			headers: {
				Authorization: `Bearer ${this.token}`,
				'Content-Type': 'application/json'
			},
			json: true,
			body: {
				query,
				lang: 'en',
				sessionId: this.sessionId
			}
		},
		(err, response, responseBody) => {
			if (err) {
				return defer.reject({
					rc: 1,
					error: err
				});
			}

			if (response.statusCode === 204 || response.statusCode === 200) {
				console.log(`PostMessage: ${JSON.stringify(response)}`);

				return defer.resolve(responseBody);
			}

			return defer.reject({
				rc: 2,
				error: 'Wrong status code returned by DialogFlow API in PostMessage'
			});
		});

		return defer.promise;
	}
}