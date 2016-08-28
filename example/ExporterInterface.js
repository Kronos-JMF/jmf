"use strict";

/**
 * This class defines the interface of a model exporter
 * It is only to show the needed methods. This class has no functionality.
 */

class ExporterInterface {

	constructor(opts) {
		if (!opts) {
			opts = {};
		}

		if(opts.annotation !== undefined){
			this.annotation = opts.annotation;
		}
	}


	/**
	 * Writes the model as defined by this exporter.
	 * The model has the format as created by the appropriate event handler
	 * @public
	 * @param {object} model - The model to be exported
	 */
	write(model){
		console.log("Export the model");
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

}


module.exports.InterfaceExporter = InterfaceExporter;
