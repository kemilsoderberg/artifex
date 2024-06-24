// Listen for click event on the "Character" link using event delegation
$('body').on('click', '#characterLink', function(ev) {
  ev.preventDefault(); // Prevent default link behavior

  let first_name = State.variables.first_name;
  let last_name = State.variables.last_name;
  let formal = State.variables.formal;
  let pnS = State.variables.pnS;
  let pnO = State.variables.pnO;
  let health = State.variables.health;
  let healthIndex = State.variables.healthIndex;

  const popupContent = `
    <div id="popup">
      <div id="popup-content">
        <div class="profile-container">
          <div class="profile-background">
            <img src="${State.variables.profileImage}" alt="Profile" class="profile-image">
          </div>
        </div>
        <h2>Character Information</h2>
        <p>${State.variables.formal} ${State.variables.first_name} ${State.variables.last_name}</p>
        <p>${State.variables.pnS}/${State.variables.pnO}</p>
        <div id="attributes">
          <h3>Character Attributes</h3>
          <p class="health-status">Health: ${health[healthIndex]}</p>
          <div class="attributes-grid">
            <div class="attribute-item">Speed: <span id="attr-speed">0</span></div>
            <div class="attribute-item">Strength: <span id="attr-strength">0</span></div>
            <div class="attribute-item">Agility: <span id="attr-agility">0</span></div>
            <div class="attribute-item">Constitution: <span id="attr-constitution">0</span></div>
            <div class="attribute-item">Perception: <span id="attr-perception">0</span></div>
            <div class="attribute-item">Precision: <span id="attr-precision">0</span></div>
            <div class="attribute-item">Defense: <span id="attr-defense">0</span></div>
            <div class="attribute-item">Luck: <span id="attr-luck">0</span></div>
          </div>
        </div>        
        <button id="close-popup">Close</button>
      </div>
    </div>
  `;

  $('body').append(popupContent);

  // Update the attributes in the popup
  updateAttributes();

  $('#close-popup').on('click', function() {
    $('#popup').remove();
  });
});
