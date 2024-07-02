// Initialize character attributes
if (typeof State.variables.attributes === 'undefined') {
    State.variables.attributes = {
        speed: 0,
        strength: 0,
        agility: 0,
        constitution: 0,
        perception: 0,
        precision: 0,
        defense: 0,
        luck: 0
    };
}

// Initialize base attributes (without equipment bonuses)
if (typeof State.variables.baseAttributes === 'undefined') {
    State.variables.baseAttributes = Object.assign({}, State.variables.attributes);
}

// Function to update character attributes
window.updateAttributes = function() {
    // Start with base attributes
    let calculatedAttributes = Object.assign({}, State.variables.baseAttributes);

    // Calculate bonuses from equipped items
    State.variables.inventory.forEach(item => {
        if (item.equipped) {
            for (let attr in item.attributes) {
                if (calculatedAttributes.hasOwnProperty(attr)) {
                    calculatedAttributes[attr] += item.attributes[attr];
                }
            }
        }
    });

    // Update state attributes
    State.variables.attributes = calculatedAttributes;

    // Update displayed attributes
    for (let attr in calculatedAttributes) {
        $(`#attr-${attr}`).text(calculatedAttributes[attr]);
    }
};

window.changeAttribute = function(attr, value) {
    if (State.variables.baseAttributes.hasOwnProperty(attr)) {
        State.variables.baseAttributes[attr] += value;
        updateAttributes(); // Recalculate attributes including equipment bonuses
    }
};
