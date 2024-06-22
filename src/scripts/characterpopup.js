// Listen for click event on the "Character" link using event delegation
// <p>The current time is: ${time[timeIndex]}</p>
$('body').on('click', '#characterLink', function(ev) {
  ev.preventDefault(); // Prevent default link behavior

  let first_name = State.variables.first_name;
  let last_name = State.variables.last_name;
  let formal = State.variables.formal;
  let pnS = State.variables.pnS;
  let pnO = State.variables.pnO;

  const popupContent = `
    <div id="popup">
      <div id="popup-content">
        <img src="images/profile.jpeg" style="max-width: 250px;">
        <h2>Character Information</h2>
        <p>${formal} ${first_name} ${last_name}</p>
        <p>${pnS}/${pnO}</p>
        <button id="close-popup">OK</button>
      </div>
    </div>
  `;

  $('body').append(popupContent);

  $('#close-popup').on('click', function() {
    $('#popup').remove();
  });
});
