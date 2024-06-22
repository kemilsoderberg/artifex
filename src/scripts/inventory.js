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

    const slots = ['head', 'left-hand', 'chest', 'right-hand', 'legs', 'feet', 'accessory1', 'accessory2', 'accessory3'];
    
    for (let slot of slots) {
        let item = State.variables.inventory.find(i => i.hasAttribute(slot));
        $(`.slot.${slot}`).html(item ? item.getDescription() : 'Empty');
    }

    let generalInventory = '';
    for (let item of State.variables.inventory) {
        if (!slots.some(slot => item.hasAttribute(slot))) {
            generalInventory += `<li>${item.getDescription()}</li>`;
        }
    }
    $('#general-inventory ul').html(generalInventory);

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
});
