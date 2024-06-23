// Initialize inventory if not already defined
if (typeof State.variables.inventory === 'undefined') {
    State.variables.inventory = [];
}

// Define the Item class
window.Item = class Item {
    constructor(id, name, slot, attributes, image) {
        this.id = id;
        this.name = name;
        this.slot = slot;
        this.attributes = attributes;
        this.image = image;
        this.equipped = false;
    }

    getDescription() {
        return `${this.name}\n${this.attributes.map(attr => `• ${attr}`).join('\n')}`;
    }

    getAttributes() {
        return this.attributes.join(', ');
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
        if (this.slot === 'consumable') {
            // Implement the effect of using the consumable here
            console.log(`Used ${this.name}`);
            return true; // Return true if the item was successfully used
        }
        return false; // Return false if the item couldn't be used
    }
};

// Function to add an item to the inventory
window.addItemToInventory = function(id, name, slot, attributes, image) {
    const newItem = new Item(id, name, slot, attributes, image);
    State.variables.inventory.push(newItem);
};

// Function to update the inventory display
window.updateInventoryDisplay = function() {
    const slots = ['head', 'left-hand', 'chest', 'right-hand', 'legs', 'feet', 'accessory1', 'accessory2', 'accessory3'];
    
    for (let slot of slots) {
        let item = State.variables.inventory.find(i => i.slot === slot && i.equipped);
        let slotContent = item 
            ? `<div class="equipped-item" title="${item.getDescription()}">
                <img src="${item.image}" alt="${item.name}">
                <button class="unequip-btn" data-id="${item.id}">Unequip</button>
               </div>`
            : 'Empty';
        $(`.slot.${slot}`).html(slotContent);
    }

    let generalInventory = '<ul>';
    for (let item of State.variables.inventory) {
        if (!item.equipped) {
            let actionButton = item.slot === 'consumable' 
                ? `<button class="use-btn" data-id="${item.id}">Use</button>`
                : `<button class="equip-btn" data-id="${item.id}">Equip</button>`;
            generalInventory += `<li title="${item.getDescription()}">
                                    <img src="${item.image}" alt="${item.name}"> 
                                    ${item.name} 
                                    ${actionButton}
                                 </li>`;
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
        if (item.slot.startsWith('accessory')) {
            const accessorySlots = ['accessory1', 'accessory2', 'accessory3'];
            let slotToEquip = accessorySlots.find(slot => {
                return !State.variables.inventory.some(i => i.slot === slot && i.equipped);
            });
            if (slotToEquip) {
                item.slot = slotToEquip; // Update the item's slot to the first empty slot
            }
        } else {
            // Unequip any item in the same slot
            let slotToEquip = item.slot;
            State.variables.inventory.forEach(i => {
                if (i.slot === slotToEquip && i.equipped) {
                    i.unequip();
                }
            });
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

$(document).ready(function() {
    // Create a tooltip element
    $('body').append('<div class="dynamic-tooltip"></div>');
    const $tooltip = $('.dynamic-tooltip');

    // Function to show tooltip
    function showTooltip(event, content) {
        $tooltip.text(content).show();
        positionTooltip(event);
    }

    // Function to hide tooltip
    function hideTooltip() {
        $tooltip.hide();
    }

    // Function to position tooltip
    function positionTooltip(event) {
        const tooltipWidth = $tooltip.outerWidth();
        const tooltipHeight = $tooltip.outerHeight();
        let top = event.clientY - tooltipHeight - 10; // 10px above cursor
        let left = event.clientX - (tooltipWidth / 2); // Centered on cursor

        // Adjust if tooltip would go off-screen
        if (top < 0) top = event.clientY + 10; // Below cursor if it would go above viewport
        if (left < 0) left = 0;
        if (left + tooltipWidth > $(window).width()) left = $(window).width() - tooltipWidth;

        $tooltip.css({
            top: top + 'px',
            left: left + 'px'
        });
    }

    // Event listeners for general inventory items
    $(document).on('mouseenter', '.general-inventory [title]', function(event) {
        const content = $(this).attr('title');
        showTooltip(event, content);
    }).on('mouseleave', '.general-inventory [title]', function() {
        hideTooltip();
    }).on('mousemove', '.general-inventory [title]', function(event) {
        positionTooltip(event);
    });

    // Event listeners for inventory grid items
    $(document).on('mouseenter', '.inventory-grid [title]', function(event) {
        const content = $(this).attr('title');
        showTooltip(event, content);
    }).on('mouseleave', '.inventory-grid [title]', function() {
        hideTooltip();
    }).on('mousemove', '.inventory-grid [title]', function(event) {
        positionTooltip(event);
    });

    // Hide tooltip on button click
    $(document).on('click', '.equip-btn, .unequip-btn, .use-btn', function() {
        hideTooltip();
    });
});
