import request from 'request';
import Q from 'q';

export default class DirectLineClient {
	constructor(secret, baseUrl) {
		this.baseUrl = baseUrl || 'https://directline.botframework.com/v3/directline';
		this.secret = secret;
	}

	GetToken() {
		const defer = Q.defer();

		request({
			method: 'POST',
			uri: `${this.baseUrl}/tokens/generate`,
			headers: {
				Authorization: `Bearer ${this.secret}`
			}
		},
		(err, response, body) => {
			if (err) {
				return defer.reject({
					rc: 1,
					error: err
				});
			}

			if (response.statusCode === 200) {
				console.log(`GetToken: ${JSON.stringify(response)}`);

				return defer.resolve(JSON.parse(body).token);
			}

			return defer.reject({
				rc: 2,
				error: 'Wrong status code returned by directline api in getToken'
			});
		});

		return defer.promise;
	}

	CreateConversation(token) {
		const defer = Q.defer();

		request({
			method: 'POST',
			uri: `${this.baseUrl}/conversations`,
			headers: {
				Authorization: `Bearer ${token || this.secret}`,
				Accept: 'application/json'
			}
		}, 
		(err, response, responseBody) => {
			if (err) {
				return defer.reject({
					rc: 1,
					error: err
				});
			}

			if (response.statusCode === 200 || response.statusCode === 201) {
				console.log(`CreateConversation: ${JSON.stringify(response)}`);

				return defer.resolve(JSON.parse(responseBody));
			} 

			return defer.reject({
				rc: 2,
				error: 'Wrong status code returned by directline api in createConversation'
			});
		});

		return defer.promise;
	}

	PostMessage(token, conversationId, body) {
		const defer = Q.defer();

		request({
			method: 'POST',
			uri: `${this.baseUrl}/conversations/${conversationId}/activities`,
			headers: {
				Authorization: `Bearer ${token || this.secret}`,
				'Content-Type': 'application/json'
			},
			json: true,
			body
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

				return defer.resolve(response);
			} 

			return defer.reject({
				rc: 2,
				error: 'Wrong status code returned by directline api in postMessage'
			});
		});
	
		return defer.promise;
	}

	GetMessages(token, conversationId, watermark) {
		const defer = Q.defer();

		request({
			method: 'GET',
			uri: `${this.baseUrl}/conversations/${conversationId}/activities/${watermark ? `?watermark=${watermark}` : ''}`,
			headers: {
				Authorization: `Bearer ${token || this.secret}`,
				Accept: 'application/json'
			}
		}, 
		(err, response, responseBody) => {
			if (err) {
				return defer.reject({
					rc: 1,
					error: err
				});
			}

			if (response.statusCode === 200) {
				return defer.resolve(JSON.parse(responseBody));
			} 

			return defer.reject({
				rc: 2,
				error: 'Wrong status code'
			});
		});
	
		return defer.promise;
	}
}