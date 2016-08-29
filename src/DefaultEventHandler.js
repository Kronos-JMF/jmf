/* jslint node: true, esnext: true */
'use strict';

/**
 * This class provides a default event handler.
 * Other handler may extend this class and overwrite the needed
 * methods
 */

const ATTRIBUTE_VALID_TYPES = {
  string: 'Just a string',
  date: 'A date time representation',
  boolean: 'A boolean value',
  number: 'Any valid number'
};

// define default attributes
const DEFAULT_ATTRIBUTES = {
  __id_unique: {
    type: 'number',
    in_content_hash: false,
    in_key_hash: false,
    nullable: false
  },
  __id_hash: {
    type: 'string',
    in_content_hash: false,
    in_key_hash: false,
    nullable: false
  },
  __content_hash: {
    type: 'string',
    in_content_hash: false,
    in_key_hash: false,
    nullable: false
  }
};

// defines default settings for an attribute
const ATTRIBUTE_DEFINITION_DEFAULTS = {
  in_content_hash: {
    description: 'Defines that this attribute is part of the content hash',
    type: 'boolean',
    value: true
  },
  in_key_hash: {
    description: 'Defines that this attribute is part of the attributes identifying an object',
    type: 'boolean',
    value: false
  },
  nullable: {
    description: 'Defines if the value may be null or is mandatory',
    type: 'boolean',
    value: true
  }
};



/**
 * The Base Event Handler
 */
export class DefaultEventHandler {

  constructor(opts) {
    if (!opts) {
      // eslint-disable-next-line no-param-reassign
      opts = {};
    }

    // you could define your own logger in th config
    if (opts.logger) {
      this.logger = opts.logger;
    } else {
      // eslint-disable-next-line no-param-reassign
      throw new Error("No logger defined in constructor of 'EventHandler'");
    }

    // get the annotation name
    if (opts.annotation !== undefined) {
      this.annotation = opts.annotation;
    }

    // define you own valid attributes
    if (opts.attribute_valid_types) {
      this.attribute_valid_types = opts.attribute_valid_types;
    } else {
      this.attribute_valid_types = ATTRIBUTE_VALID_TYPES;
    }

    // define you own default values for attributes
    if (opts.attribute_definition_defaults) {
      this.attribute_definition_defaults = opts.attribute_definition_defaults;
    } else {
      this.attribute_definition_defaults = ATTRIBUTE_DEFINITION_DEFAULTS;
    }

    // define you own default attributes
    if (opts.default_attributes) {
      this.default_attributes = opts.default_attributes;
    } else {
      this.default_attributes = DEFAULT_ATTRIBUTES;
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
    if (!objectName) {
      this.handleError(objectName, 'initObject', '-', 'No Object Name defined');
    }

    if (!config) {
      this.handleError(objectName, 'initObject', '-', 'No object config defined');
    } else {
      this.logger.debug(`Init Object ${objectName}`);

      this.createDefaultAttributes(objectName, config);
    }
  }

  /**
   * Handles the creation of an attribute for an object
   * @public
   * @param {string} objectName - The name of the object to be created
   * @param {string} attributeName - The name of the attribute to be created for this object
   * @param {object} attrConfig - The configuration of this attribute
   */
  handleAttribute(objectName, attributeName, attrConfig) {
    if (!objectName) {
      this.handleError(objectName, 'handleAttribute', '-', 'No Object Name defined');
    }
    if (!attributeName) {
      this.handleError(objectName, 'handleAttribute', '-', 'No attribute Name defined');
    }
    if (!attrConfig) {
      this.handleError(objectName, 'attribute', attributeName, 'No attribute config defined');
    }

    if (objectName && attributeName && attrConfig) {
      this.logger.debug(`Handle attribute '${objectName}'->'${attributeName}'`);
      this.attributeValidateType(objectName, attributeName, attrConfig);
      this.attributeSetDefaults(objectName, attributeName, attrConfig);
    }
  }

  /**
   * Handles the creation of a reference for an object
   * @public
   * @param {string} objectName - The name of the object to be created
   * @param {string} referenceName - The name of the reference to be created for this object
   * @param {object} refConfig - The configuration of this reference
   */
  handleReference(objectName, referenceName, refConfig) {
    if (!objectName) {
      this.handleError(objectName, 'handleReference', '-', 'No Object Name defined');
    }
    if (!referenceName) {
      this.handleError(objectName, 'handleReference', '-', 'No reference Name defined');
    }
    if (!refConfig) {
      this.handleError(objectName, 'reference', referenceName, 'No reference config defined');
    }

    if (objectName && referenceName && refConfig) {
      this.logger.debug(`Handle reference '${objectName}'->'${referenceName}'`);
    }
  }

  /**
   * Validates the object after the attributes and references are created
   * @public
   * @param {string} objectName - The name of the object to be created
   * @param {object} config - The complete configuration of this object
   */
  validateObject(objectName, config) {
    // check that each object has a minimum of one attribute which is an key_field
    let hasKeyField = false;
    Object.keys(config.attributes).forEach(attributeName => {
      if (config.attributes[attributeName].in_key_hash) {
        hasKeyField = true;
      }
    });

    if (!hasKeyField) {
      // eslint-disable-next-line quotes
      this.handleError(objectName, 'object', '-', `The object has not attribute which has 'in_key_hash' set to 'true'`);
    }
  }

  /**
   * Validate the type of an attribte
   * @protected
   * @param {string} objectName - The name of the object to be created
   * @param {string} attributeName - The name of the attribute to be created for this object
   * @param {object} attrConfig - The configuration of this attribute
   */
  attributeValidateType(objectName, attributeName, attrConfig) {
    if (!attrConfig.type) {
      attrConfig.type = 'string';
    } else if (this.attribute_valid_types[attrConfig.type] === undefined) {
      this.handleError(objectName, 'attribute', attributeName, `The given type '${attrConfig.type}' is not valid`);
    }
  }

  /**
   * Creates the default aatributes for an object
   * @protected
   * @param {string} objectName - The name of the object to be created
   * @param {object} config - The complete configuration of this object
   */
  createDefaultAttributes(objectName, config) {
    // add the default attributes
    Object.keys(this.default_attributes).forEach(attrName => {
      if (config.attributes[attrName] !== undefined) {
        this.handleError(objectName, 'attribute', attrName, `The object has an attribute '${attrName}' which collides with an default attribute`);
      } else {
        config.attributes[attrName] = this.default_attributes[attrName];
      }

    });
  }

  /**
   * Set default values for an attribute
   * @protected
   * @param {string} objectName - The name of the object to be created
   * @param {string} attributeName - The name of the attribute to be created for this object
   * @param {object} attrConfig - The configuration of this attribute
   */
  attributeSetDefaults(objectName, attributeName, attrConfig) {
    Object.keys(this.attribute_definition_defaults).forEach(key => {
      const def = this.attribute_definition_defaults[key];
      if (attrConfig[key] === undefined) {
        attrConfig[key] = def.value;
      } else if (def.type === 'boolean') {
        if (typeof (attrConfig[key]) !== 'boolean') {
          // error
          this.handleError(objectName, 'attribute', attributeName, `The config element '${key}' must be of type 'boolean'`);
        }
      } else if (def.type === 'string') {
        if (typeof (attrConfig[key]) !== 'string') {
          // error
          this.handleError(objectName, 'attribute', attributeName, `The config element '${key}' must be of type 'string'`);
        }
      } else if (def.type === 'number') {
        if (typeof (attrConfig[key]) !== 'number') {
          // error
          this.handleError(objectName, 'attribute', attributeName, `The config element '${key}' must be of type 'number'`);
        }
      }
    });
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
      // eslint-disable-next-line no-param-reassign
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
    if (!this.isValid()) {
      const errorPrint = [];

      Object.keys(this.errors).forEach(objectName => {
        errorPrint.push(objectName);

        Object.keys(this.errors[objectName]).forEach(type => {
          errorPrint.push('\t' + type);

          Object.keys(this.errors[objectName][type]).forEach(name => {
            errorPrint.push('\t\t' + name);

            this.errors[objectName][type][name].forEach(message => {
              errorPrint.push('\t\t\t' + message);
            });

          });
        });
      });

      this.logger.error('The following errors where detected:' + errorPrint.join('\n'));
    }
  }

  /**
   * returns the converted model as string
   * @public
   * @returns {string} The new created data as string
   */
  getConfig(spacer) {
    return JSON.stringify(this.model, null, spacer);
  }

  /**
   * Returns the created model
   * @public
   * @returns {object} The created model
   */
  getModel() {
    return this.model;
  }

  /**
   * Returns the name used for the annotations
   * @public
   * @returns {string} The name
   */
  getAnnotationName() {
    if (this.annotation === undefined) {
      throw new Error('No annotation name defined');
    }
    return this.annotation;
  }

  /**
   * Returns the status of parsing the model
   * @public
   * @returns {boolean} True if there where no errors detected
   */
  isValid() {
    if (Object.keys(this.errors).length > 0) {
      return false;
    }
    return true;
  }
}
