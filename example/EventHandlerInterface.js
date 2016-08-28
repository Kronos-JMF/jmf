/* jslint node: true, esnext: true */
"use strict";

 /**
  * This class defines the interface of an event handler
  * It is only to show the needed methods. This class has no functionality.
  */

export class EventHandlerInterface {
	constructor(opts) {
		if (!opts) {
			opts = {};
		}

		if(opts.annotation !== undefined){
			this.annotation = opts.annotation;
		}

		// the model created by this handler
		this.model = {};

		// stores all the errors created while parsing
		this.errors = {};
	}


	/**
	 * initializes a new object
	 * @public
	 * @param {string} objectName - The name of the object to be created
	 * @param {object} config - The complete configuration of this object
	 */
	initObject(objectName, config) {
		console.log(`Init Object ${objectName}`);
	}

	/**
	 * Handles the creation of an attribute for an object
	 * @public
	 * @param {string} objectName - The name of the object to be created
	 * @param {string} attributeName - The name of the attribute to be created for this object
	 * @param {object} attrConfig - The configuration of this attribute
	 */
	handleAttribute(objectName, attributeName, attrConfig) {
		console.log(`Handle attribute '${objectName}'->'${attributeName}'`);
	}

	/**
	 * Handles the creation of a reference for an object
	 * @public
	 * @param {string} objectName - The name of the object to be created
	 * @param {string} referenceName - The name of the reference to be created for this object
	 * @param {object} refConfig - The configuration of this reference
	 */
	handleReference(objectName, referenceName, refConfig) {
		console.log(`Handle reference '${objectName}'->'${referenceName}'`);
	}

	/**
	 * After the model is parsed, this method validates the objects created
	 * @public
	 * @param {string} objectName - The name of the object to be created
	 * @param {object} config - The configuration of this reference
	 */
	validateObject(objectName, config) {
		console.log(`Handle reference '${objectName}'->'${referenceName}'`);
	}


	/**
	 * Hadles an error created while parsing the model
	 * @protected
	 * @param {string} objectName - The name of the object to be created
	 * @param {string} type - The type of the object. For example 'attribute'.
	 * @param {string} name - The name of the part in the object. For example 'email' while working on an attribute
	 */
	handleError(objectName, type, name, message) {
		if (!objectName) {
			objectName = '__UNKNOWN_OBJECTS__';
		}

		if (!this.errors[objectName]) {
			this.errors[objectName] = {};
		}

		if (!this.errors[objectName][type]) {
			this.errors[objectName][type] = {};
		}

		if (!this.errors[objectName][type][name]) {
			this.errors[objectName][type][name] = [];
		}

		this.errors[objectName][type][name].push(message);
	}

	/**
	 * print all detected errors
	 * @public
	 */
	printErrors() {
		console.log(JSON.stringify(this.errors, null, 2));
	}

	/**
	 * returns the converted model as string
	 * @public
	 * @returns {string} The new created data as string
	 */
	getConfig(spacer){
		return JSON.stringify(this.model, null, spacer);
	}

	/**
	 * Returns the created model
	 * @public
	 * @returns {object} The created model
	 */
	getModel(){
		return this.model;
	}

	/**
	* Returns the name used for the annotations
	* @public
	* @returns {string} The name
	 */
	getAnnotationName(){
		if(this.annotation === undefined){
			throw new Error("No annotation name defined");
		}
	}

	/**
	 * Returns the status of parsing the model
	 * @public
	 * @returns {boolean} True if there where no errors detected
	 */
	isValid() {
		if (Object.keys(this.errors).length > 0) {
			return false;
		} else {
			return true;
		}
	}
}
