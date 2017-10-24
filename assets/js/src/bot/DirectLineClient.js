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
		(err, response, body) => {
			if (err) {
				return defer.reject({
					rc: 1,
					error: err
				});
			}

			if (response.statusCode === 200 || response.statusCode === 201) {
				console.log(`Got response: ${JSON.stringify(response)}`);

				return defer.resolve(JSON.parse(body));
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
		(err, response) => {
			if (err) {
				return defer.reject({
					rc: 1,
					error: err
				});
			} 

			if (response.statusCode === 204 || response.statusCode === 200) {
				return defer.resolve();
			} 

			return defer.reject({
				rc: 2,
				error: 'Wrong status code returned by directline api in postMessage'
			});
		});
	
		return defer.promise;
	}
}