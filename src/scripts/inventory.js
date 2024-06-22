// Initialize inventory if not already defined
if (typeof State.variables.inventory === 'undefined') {
    State.variables.inventory = [];
}

// Define the Item class
window.Item = class Item {
    constructor(id, name, type, attributes) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.attributes = attributes;
        this.equipped = false;
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

    equip() {
        this.equipped = true;
    }

    unequip() {
        this.equipped = false;
    }

    use() {
        if (this.type === 'Consumable') {
            // Implement the effect of using the consumable here
            console.log(`Used ${this.name}`);
            return true; // Return true if the item was successfully used
        }
        return false; // Return false if the item couldn't be used
    }
};

// Function to add an item to the inventory
window.addItemToInventory = function(id, name, type, attributes) {
    const newItem = new Item(id, name, type, attributes);
    State.variables.inventory.push(newItem);
};

// Function to update the inventory display
window.updateInventoryDisplay = function() {
    const slots = ['head', 'left-hand', 'chest', 'right-hand', 'legs', 'feet', 'accessory1', 'accessory2', 'accessory3'];
    
    for (let slot of slots) {
        let item = State.variables.inventory.find(i => i.hasAttribute(slot) && i.equipped);
        let slotContent = item 
            ? `<div class="equipped-item">${item.getDescription()} <button class="unequip-btn" data-id="${item.id}">Unequip</button></div>`
            : 'Empty';
        $(`.slot.${slot}`).html(slotContent);
    }

    let generalInventory = '<ul>';
    for (let item of State.variables.inventory) {
        if (!item.equipped) {
            let actionButton = item.type === 'Consumable' 
                ? `<button class="use-btn" data-id="${item.id}">Use</button>`
                : `<button class="equip-btn" data-id="${item.id}">Equip</button>`;
            generalInventory += `<li>${item.getDescription()} ${actionButton}</li>`;
        }
    }
    generalInventory += '</ul>';
    $('#general-inventory').html(generalInventory);
};

// Inventory popup code
$(document).on('click', '#inventoryLink', function(ev) {
    ev.preventDefault();

    if (typeof State.variables.inventory === 'undefined') {
        console.error('Inventory is undefined');
        return;
    }

    if ($('#popup').length === 0) {
        const popupContent = `
        <div id="popup">
          <div id="popup-content">
              <h2>INVENTORY</h2>
              <div id="inventory-grid" class="inventory-grid">
                  <div class="slot head">Head</div>
                  <div class="slot left-hand">Left Hand</div>
                  <div class="slot chest">Chest</div>
                  <div class="slot right-hand">Right Hand</div>
                  <div class="slot legs">Legs</div>
                  <div class="slot feet">Feet</div>
                  <div class="slot accessory1">Accessory</div>
                  <div class="slot accessory2">Accessory</div>
                  <div class="slot accessory3">Accessory</div>
              </div>
              <div id="general-inventory" class="general-inventory">
                  <h3>Other Items</h3>
                  <ul></ul>
              </div>
              <button id="close-popup">Close</button>
          </div>
        </div>`;
        $('body').append(popupContent);

        $('#close-popup').on('click', function() {
            $('#popup').remove();
        });
    }

    updateInventoryDisplay();
});

// Equip item event
$(document).on('click', '.equip-btn', function() {
    let itemId = $(this).data('id');
    let item = State.variables.inventory.find(i => i.id === itemId);
    if (item) {
        // Check if the item is an accessory and find the first empty accessory slot
        if (item.hasAttribute('accessory')) {
            const accessorySlots = ['accessory1', 'accessory2', 'accessory3'];
            let slotToEquip = accessorySlots.find(slot => {
                return !State.variables.inventory.some(i => i.hasAttribute(slot) && i.equipped);
            });
            if (slotToEquip) {
                item.attributes = [slotToEquip]; // Update the item's attributes to the first empty slot
            }
        } else {
            // Unequip any item in the same slot
            let slotToEquip = item.attributes.find(attr => ['head', 'left-hand', 'chest', 'right-hand', 'legs', 'feet'].includes(attr));
            if (slotToEquip) {
                State.variables.inventory.forEach(i => {
                    if (i.hasAttribute(slotToEquip) && i.equipped) {
                        i.unequip();
                    }
                });
            }
        }
        item.equip();
        // Refresh the inventory display
        updateInventoryDisplay();
    }
});

// Unequip item event
$(document).on('click', '.unequip-btn', function() {
    let itemId = $(this).data('id');
    let item = State.variables.inventory.find(i => i.id === itemId);
    if (item) {
        item.unequip();
        // Refresh the inventory display
        updateInventoryDisplay();
    }
});

// Use item event
$(document).on('click', '.use-btn', function() {
    let itemId = $(this).data('id');
    let item = State.variables.inventory.find(i => i.id === itemId);
    if (item && item.use()) {
        // Remove the item from inventory if it was successfully used
        State.variables.inventory = State.variables.inventory.filter(i => i.id !== itemId);
        // Refresh the inventory display
        updateInventoryDisplay();
    }
});

// Rehydrate inventory items on load
$(document).on(':passagerender', function() {
    if (Array.isArray(State.variables.inventory)) {
        State.variables.inventory = State.variables.inventory.map(itemData => {
            return Object.assign(new Item(), itemData);
        });
    }
});
