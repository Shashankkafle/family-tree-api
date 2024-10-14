const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(
	process.cwd(),
	process.env.GOOGLE_CREDENTIALS_PATH
);

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
	try {
		const content = await fs.readFile(TOKEN_PATH);
		const credentials = JSON.parse(content);
		return google.auth.fromJSON(credentials);
	} catch (err) {
		return null;
	}
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
	const content = await fs.readFile(CREDENTIALS_PATH);
	const keys = JSON.parse(content);
	const key = keys.installed || keys.web;
	const payload = JSON.stringify({
		type: 'authorized_user',
		client_id: key.client_id,
		client_secret: key.client_secret,
		refresh_token: client.credentials.refresh_token,
	});
	await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
	let client = await loadSavedCredentialsIfExist();
	if (client) {
		return client;
	}
	client = await authenticate({
		scopes: SCOPES,
		keyfilePath: CREDENTIALS_PATH,
	});
	if (client.credentials) {
		await saveCredentials(client);
	}
	return client;
}
async function updateGoogleSheet(persondata) {
	try {
		console.log('creating sheets entry');
		const auth = await authorize();
		const sheets = google.sheets({
			version: 'v4',
			auth,
		});
		// To make sure the properties extracted are in the required order
		function extractProperties(obj, properties) {
			return properties.map((prop) =>
				obj[prop] !== undefined ? obj[prop] : ''
			);
		}
		//match this array with the columns in the sheet in which the data is stored
		const properties = [
			'id',
			'firstName',
			'lastName',
			'birthDate',
			'gender',
			'parentId',
			'partnerId',
			'isRoot',
		];
		const values = [extractProperties(persondata, properties)];
		await sheets.spreadsheets.values.append({
			spreadsheetId: process.env.GOOGLE_SHEET_ID,
			range: `A${persondata.id}:H${persondata.id}`,
			valueInputOption: 'RAW',
			insertDataOption: 'OVERWRITE',
			requestBody: {
				range: `A${persondata.id}:H${persondata.id}`,
				majorDimension: 'ROWS',
				values: values,
			},
		});
	} catch (error) {
		console.error('Error updating Google Sheet', error);
	}
}
module.exports = { updateGoogleSheet };
