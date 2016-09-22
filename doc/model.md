# Model
This section describes how to create the model


## Structure of the model

The model is a list of objects.

```json
{
	"Object name 1" :{
		"gum" : "bo"
	},
	"Object name 2" :{
		"..."
	}
}
```

## Structure of an object

```json
{
	"Gumbo" : {
		"description" : "any text",
		"extends" : "MyOtherObject",
		"main" : true,
		"attributes" : {

		}
	}
}
```
### Parameter explanation

* description

	This is just a description of this object.

* extends

	This defines that the object *Gumbo* is derived from the object *MyOtherObject*.

* main

	This indicates if this object is a *Main* object. It could be created directly.

* attributes

	This section contains all the attributes.

* references

	This section contains all the references. It is important to mentioned that the
	names of the attributes and references must be unique over both types.

## Structure of an attribute definition

```json
{
	"person" : {
		"attributes" :{
			"name" : {
				"type" : "string",
				"description" : " The name of the Person",
				"upper_bound": 1,
				"unique": false
			},
			"nicknames" : {
				"type" : "string",
				"description" : " The nick names of the Person",
				"upper_bound": -1,
				"unique": true
			},
			"address" : {
				"type" : "address",
				"description" : " The name of the Person",
				"opposite" : "residents",
				"upper_bound": 1,
				"lower_bound": 0,
				"unique": true,
				"containment": false
			},
			"friends" : {
				"type" : "person",
				"description" : " The friends of this Person",
				"upper_bound": -1,
				"lower_bound": 0,
				"unique": true,
				"containment": false
			}
		},
	}
}
```

* name

	The name attribute is an attribute of a basic type. The following types are supported:

	* string
	* number
	* date
	* boolean

* nicknames

	This attribute is of type *String* but with an "upper_bound" of -1 which means an infinite number.
	One person my have many nick names.

* address

	This attribute is a reference to an other object. In this case it could be specified if there is an opposite for a two way reference.

* friends

	A list of refrenced objects.

### Parameter explanation

* type

	Default("string")
	The type off this attribute. This could be one of the basic types or any other object defined in the model

* description

	The description of this attribute

* upper_bound

	Default("1")
	Allowed values are "1" to "n" and "-1". The value "-1" defines an infinite value. Defines how many objects could be referenced.
	Also works for basic types.

* lower_bound

	Default("0")
	Allowed values are "0" to "n". Defines the minimum value of objects.

* unique

	Default("false")
	Defines if the  stored objects or values needs to be unique.

* opposite

	Only used for references, will cause an error when used for basic types. The opposite reference for this object.

* containment

	Default("false")
	Only usable for object references. Defines if on object is contained in this object. One object could only be contained
	in one object at the same time. So this contained object will be assigned to an other attribute where contained is Also
	set to a true value, it will be removed from the previous object.

## Annotations

Annotations could be added to an obkect 

```json
{
	"person" : {		
		"annotations": {
			"xxy": {
				"root": true
			}
		},

		"attributes" :{
			"name" : {
				"annotations": {
					"xxy": {
						"max_length": 35
					}
				},
				"type" : "string",
				"description" : " The name of the Person",
				"upper_bound": 1,
				"unique": false
			},
		},
	}
}
```
