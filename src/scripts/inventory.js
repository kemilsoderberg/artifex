window.Item = class Item {
    constructor(id, name, type, attributes) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.attributes = attributes;
    }

    getDescription() {
        return `${this.name} (${this.type}): ${JSON.stringify(this.attributes)}`;
    }
};

$(document).on('click', '#inventoryLink', function(ev) {
    ev.preventDefault(); // Prevent default link behavior

    // Ensure the inventory is defined
    if (typeof State.variables.inventory === 'undefined') {
        console.error('Inventory is undefined');
        return;
    }

    // Generate inventory content
    let inventoryContent = '<ul>';
    for (let item of State.variables.inventory) {
        inventoryContent += `<li>${item.getDescription()}</li>`;
    }
    inventoryContent += '</ul>';

    const popupContent = `
      <div id="popup">
        <div id="popup-content">
          <h2>INVENTORY</h2>
          <div id="inventory" class="inventory">${inventoryContent}</div>
          <button id="close-popup">Close</button>
        </div>
      </div>
    `;

    $('body').append(popupContent);

    $('#close-popup').on('click', function() {
      $('#popup').remove();
    });
});
