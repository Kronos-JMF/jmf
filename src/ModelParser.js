/* jslint node: true, esnext: true */
'use strict';

import Logger from './Logger';

/**
 * The base Model parser
 * Parses the model and calls eventhandler
 * @class
 */
export default class ModelParser {

  constructor(opts) {
    if (!opts) {
      // eslint-disable-next-line no-param-reassign
      opts = {};
    }

    if (opts.logger) {
      this.logger = opts.logger;
    } else {
      this.logger = new Logger();
    }

    this.event_handler = [];

    if (opts.event_handler) {
      this.event_handler = opts.event_handler;
    }
  }


  /**
   * Print the errors found while parsing. The Errors where collected by the eventhandler
   * @public
   */
  printErrors() {
    this.event_handler.forEach(handler => {
      if(! handler.isvalid()){
        this.logger.error('---------------------------------------');
        this.logger.error(`Print errors for EventHandler : '${handler.constructor.name}'`);
        this.logger.error('---------------------------------------');
        handler.printErrors();
      }
    });
  }


  /**
   * Parses the model file. For each element all the handler are called.
   * @public
   * @param {object} model - The loaded model json
   */
  parse(model) {

    if (model === undefined) {
      throw new Error(`There is no model defined`);
    }

    if (typeof model !== 'object') {
      throw new Error(`The given model is not typeof 'object'`);
    }

    // ---------------------------------
    // Called for each existing object
    // ---------------------------------
    Object.keys(model).forEach(objectName => {
      this.event_handler.forEach(handler => {
        handler.initObject(objectName, model[objectName]);
      });
    });

    // ---------------------------------
    // Called for each attribute of an object
    // ---------------------------------
    Object.keys(model).forEach(objectName => {
      const modelObject = model[objectName];

      if (modelObject.attributes) {
        Object.keys(modelObject.attributes).forEach(attributeName => {
          let attrConfig = modelObject.attributes[attributeName];

          if (typeof (attrConfig) === 'string') {
            attrConfig = {
              type: attrConfig
            };
          }

          this.event_handler.forEach(handler => {
            handler.handleAttribute(objectName, attributeName, attrConfig);
          });
        });
      }
    });


    // ---------------------------------
    // Called for each reference of an object
    // ---------------------------------
    Object.keys(model).forEach(objectName => {
      const modelObject = model[objectName];

      if (modelObject.references) {
        Object.keys(modelObject.references).forEach(referenceName => {
          let refConfig = modelObject.references[referenceName];

          if (typeof (refConfig) === 'string') {
            refConfig = {
              target: refConfig
            };
          }

          this.event_handler.forEach(handler => {
            handler.handleReference(objectName, referenceName, refConfig);
          });
        });
      }
    });

    // ---------------------------------
    // Validate the object after creation
    // ---------------------------------
    Object.keys(model).forEach(objectName => {
      this.event_handler.forEach(handler => {
        handler.validateObject(objectName, model[objectName]);
      });
    });

  }
}
