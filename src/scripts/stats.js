// Initialize character attributes
if (typeof State.variables.attributes === 'undefined') {
    State.variables.attributes = {
        speed: 0,
        strength: 0,
        agility: 0,
        constitution: 0,
        perception: 0,
        precision: 0,
        defense: 0
    };
}

// Function to update character attributes
window.updateAttributes = function() {
    // Reset attributes
    let baseAttributes = {
        speed: 0,
        strength: 0,
        agility: 0,
        constitution: 0,
        perception: 0,
        precision: 0,
        defense: 0
    };

    // Calculate bonuses from equipped items
    State.variables.inventory.forEach(item => {
        if (item.equipped) {
            for (let attr in item.attributes) {
                if (baseAttributes.hasOwnProperty(attr)) {
                    baseAttributes[attr] += item.attributes[attr];
                }
            }
        }
    });

    // Update state attributes
    State.variables.attributes = baseAttributes;

    // Update displayed attributes
    for (let attr in baseAttributes) {
        $(`#attr-${attr}`).text(baseAttributes[attr]);
    }
};
