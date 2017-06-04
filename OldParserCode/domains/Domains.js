/**
 * Created by Eli on 04-Apr-17.
 */


/**
 * Constructor for a Domain
 *
 * Takes a settings object and returns a new Domain
 * settings must have a name (settings.name) (this is a human-readable name of the domain, e.g. REALS)
 * settings may also have a list of operators (settings.operators)
 * */
function Domain (settings) {

    // copy over the fields from the settings object
    this.name = settings.name; // name of the domain
    if (!this.name) throw "Domain must have a name"; // Ensure that the domain has a name
    this.operators = [] | settings.operators; // operators of the domain

    // add this domain to the static map of domains
    domains[settings.name] = this;
}
module.exports = Domain; // Export this function so we have access to it from other files


/**
 * Getter function that gets a domain based on its name
 * */
module.exports.getDomain = function(name) {
    return domains[name];
};

/**
 * Static map of all known domains
 * */
var domains = [];