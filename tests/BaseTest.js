/* jslint node: true, esnext: true */
'use strict';

import path from 'path';
import assert from 'assert';
import fs from 'fs';

import {ModelParser} from '../lib/ModelParser';


const metaModelFile = path.join(__dirname, '../tests/fixtures/demo_model.json');


export class EventHandler {
	constructor() {
		this.events = {};
		this.events.init = {};
		this.events.attribute = {};
		this.events.reference = {};
	}

	initObject(objectName, config) {
		this.events.init[objectName] = 1;
	}

	handleAttribute(objectName, attributeName, attrConfig) {
		if (this.events.attribute[objectName] === undefined) {
			this.events.attribute[objectName] = {};
		}
		this.events.attribute[objectName][attributeName] = 1;
	}

	handleReference(objectName, referenceName, refConfig) {
		if (this.events.reference[objectName] === undefined) {
			this.events.reference[objectName] = {};
		}
		this.events.reference[objectName][referenceName] = 1;
	}

	validateObject(objectName, config) {}

}

describe('Common Tests', () => {
	it("Test that the events arrived", () => {

		const res = {
			"attribute": {
				"account": {
					"account_id": 1,
					"creation_date": 1,
					"description": 1,
					"name": 1
				},
				"application": {
					"app_id": 1,
					"creation_date": 1,
					"description": 1,
					"name": 1
				},
				"entitlement": {
					"description": 1,
					"name": 1
				},
				"identity": {
					"date_of_birth": 1,
					"email": 1,
					"first_name": 1,
					"identity_id": 1,
					"last_name": 1
				}
			},
			"init": {
				"account": 1,
				"application": 1,
				"entitlement": 1,
				"identity": 1
			},
			"reference": {
				"application": {
					"entitlements": 1
				}
			}
		};

		const modeParser = new ModelParser();
		const eventHandler = new EventHandler();
		modeParser.event_handler.push(eventHandler);

		// load the model file
		const metaModelFile = path.join(__dirname, '../tests/fixtures/demo_model.json');
		const metaModelContent = fs.readFileSync(metaModelFile);

		const metaModel = JSON.parse(metaModelContent);
		modeParser.parse(metaModel);

		const events = eventHandler.events;

		assert.deepEqual(events, res);
	});

});
