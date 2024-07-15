// Listen for the file input change event
$('body').on('change', '#profile-image', function(ev) {
    const file = ev.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            State.variables.profileImage = e.target.result;
            $('#profile-preview').attr('src', e.target.result).show();
        };
        reader.readAsDataURL(file);
    }
});

// Listen for click event on the "Submit" button
$('body').on('click', 'button:contains("Submit")', function(ev) {
    ev.preventDefault(); // Prevent default button behavior

    // Set other variables as needed
    State.variables.first_name = $('input[name="first_name"]').val();
    State.variables.last_name = $('input[name="last_name"]').val();
    State.variables.pnS = $('input[name="pnS"]').val();
    State.variables.pnO = $('input[name="pnO"]').val();
    State.variables.formal = $('input[name="formal"]').val();
    State.variables.aux = $('input[name="aux"]:checked').val();
});

// Listen for click event on the "Debug" link using event delegation
$('body').on('click', '#debugLink', function(ev) {
    ev.preventDefault(); // Prevent default link behavior
  
    const popupContent = `
      <div id="popup">
        <div id="popup-content">
          <h2>Debug Menu</h2>
          <button id="add-helmet">Add Helmet</button>
          <button id="heal">Heal</button>
          <button id="hurt">Hurt</button>
          <button id="close-popup">Close</button>
        </div>
      </div>
    `;
  
    $('body').append(popupContent);
  
    // Add event listeners for the debug buttons
    $('#add-helmet').on('click', function() {
        // Create the helmet item
        const helmet = new Item(1, "Helmet", "head", {perception: -2, defense: 2}, "images/items/helmet.png");
        State.variables.inventory.push(helmet);
        equipItem(1);
        updateAttributes();
        alert('Helmet added and equipped.');
    });
  
    $('#heal').on('click', function() {
        State.variables.healthIndex = Math.clamp(State.variables.healthIndex + 1, 0, 5);
        updateAttributes();
        alert('Healed.');
    });
  
    $('#hurt').on('click', function() {
        State.variables.healthIndex = Math.clamp(State.variables.healthIndex - 1, 0, 5);
        updateAttributes();
        alert('Hurt.');
    });
  
    $('#close-popup').on('click', function() {
        $('#popup').remove();
    });
});

// Define the rollList macro
Macro.add('rollList', {
    handler: function () {
        const choices = this.args[0]; // Number of choices
        const options = this.args.slice(1); // List of options

        if (choices > options.length) {
            return this.error('Not enough options provided for the number of choices.');
        }

        // Shuffle the options array
        const shuffledOptions = options.sort(() => 0.5 - Math.random());

        // Select the first 'choices' number of options
        const selectedOptions = shuffledOptions.slice(0, choices);

        // Generate the HTML for the roll list
        let html = '<ul>';
        selectedOptions.forEach(option => {
            html += `<li><a href="javascript:void(0);" class="roll-option">${option}</a></li>`;
        });
        html += '</ul>';

        // Output the HTML
        $(this.output).wiki(html);

        // Add click event listeners to the options
        $('.roll-option').on('click', function () {
            const selectedOption = $(this).text();
            alert(`You selected: ${selectedOption}`);
            // Perform any additional actions based on the selected option
        });
    }
});
