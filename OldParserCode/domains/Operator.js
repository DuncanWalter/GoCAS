/**
 * Created by Eli on 04-Apr-17.
 */

/**
 * Constructor for an Operator
 *
 * Takes a settings object and returns a new Operator
 * settings must have a name (string for lookup, e.g. "+")
 * settings must have an array of strings of names of input domains (settings.parameterTypes)
 * settings must have a name of an output domain (settings.returnType)
 *
 * */
function Operator (settings) {

    // copy over the fields from the settings object
    this.name = settings.name; // name of the operator
    if (!this.name) throw "Operator must have name"; // ensure the operator has a name

    this.parameterTypes = settings.parameterTypes; // input domains for the operator (array of strings of domain names)
    if (!this.parameterTypes) throw "Operator must have parameterTypes"; // ensure the operator has parameterTypes
    if (typeof this.parameterTypes !== typeof []) throw "parameterTypes of Operator must be an array"; // ensure the parameterTypes is an array
    // ensure each element of parameterTypes is a string
    this.parameterTypes.forEach( function (domain) {
        if (typeof domain !== typeof "") throw "Elements of parameterTypes of Operator must be strings";
    });

    this.returnType = settings.returnType; // output domain for the operator
    if (!this.returnType) throw "Operator must have a returnType"; // ensure the operator has a returnType
    if (typeof this.returnType !== typeof "") throw "returnType of Operator must be a string"; // ensure the returnType is a string
}
modules.exports = Operator;