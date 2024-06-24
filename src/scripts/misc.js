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

    // Navigate to the next passage
    Engine.play('Crash');
});
