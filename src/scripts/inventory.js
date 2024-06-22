window.Item = class Item {
    constructor(id, name, type, attributes) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.attributes = attributes;
    }

    getDescription() {
        return `${this.name} (${this.type})`;
    }

    hasAttribute(attr) {
        if (Array.isArray(this.attributes)) {
            return this.attributes.includes(attr);
        } else if (typeof this.attributes === 'string') {
            return this.attributes === attr;
        } else if (typeof this.attributes === 'object' && this.attributes !== null) {
            return attr in this.attributes;
        }
        return false;
    }
};

$(document).on('click', '#inventoryLink', function(ev) {
    ev.preventDefault();

    if (typeof State.variables.inventory === 'undefined') {
        console.error('Inventory is undefined');
        return;
    }

    // Define the grid slots
    const slots = ['head', 'chest', 'hands', 'legs', 'feet', 'weapon', 'offhand', 'accessory'];
    
    // Generate inventory grid content
    let inventoryGrid = '';
    for (let slot of slots) {
        let item = State.variables.inventory.find(i => i.hasAttribute(slot));
        inventoryGrid += `
            <div class="slot ${slot}">
                <h3>${slot.charAt(0).toUpperCase() + slot.slice(1)}</h3>
                ${item ? item.getDescription() : 'Empty'}
            </div>
        `;
    }

    // Generate general inventory content for items without specific slots
    let generalInventory = '<h3>Other Items</h3><ul>';
    for (let item of State.variables.inventory) {
        if (!slots.some(slot => item.hasAttribute(slot))) {
            generalInventory += `<li>${item.getDescription()}</li>`;
        }
    }
    generalInventory += '</ul>';

    const popupContent = `
      <div id="popup">
        <div id="popup-content">
          <h2>INVENTORY</h2>
          <div id="inventory-grid" class="inventory-grid">${inventoryGrid}</div>
          <div id="general-inventory" class="general-inventory">${generalInventory}</div>
          <button id="close-popup">Close</button>
        </div>
      </div>
    `;

    $('body').append(popupContent);

    $('#close-popup').on('click', function() {
      $('#popup').remove();
    });
});
