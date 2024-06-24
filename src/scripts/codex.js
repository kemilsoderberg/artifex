// Listen for click event on the "Codex" link using event delegation
$('body').on('click', '#codexLink', function(ev) {
    ev.preventDefault(); // Prevent default link behavior
  
    const codexContent = `
      <div id="codex-popup" class="fade-in-up">
        <div id="codex-popup-content">
          <h2>Codex</h2>
          <div class="tabs">
            <button class="tab-button active" data-tab="startpage" data-src="codex/startpage.html">Start Page</button>
            <button class="tab-button" data-tab="animals" data-src="codex/animals.html">Animals</button>
            <button class="tab-button" data-tab="sentients" data-src="codex/sentients.html">Sentients</button>
          </div>
          <div class="tab-content active" id="startpage">
            <iframe src="codex/startpage.html" class="content-iframe"></iframe>
          </div>
          <div class="tab-content" id="animals">
            <div class="left-pane">
              <div class="sub-tabs">
                <button class="sub-tab-button" data-subtab="cow" data-nested="cow-nested-tabs" data-src="codex/cow.html">Cow</button>
                <button class="sub-tab-button" data-subtab="pig" data-src="codex/pig.html">Pig</button>
              </div>
              <div class="nested-tabs" id="cow-nested-tabs" style="display: none;">
                <button class="nested-tab-button" data-nestedtab="brown-cow" data-src="codex/brown-cow.html">Brown Cow</button>
                <button class="nested-tab-button" data-nestedtab="white-cow" data-src="codex/white-cow.html">White Cow</button>
              </div>
            </div>
            <div class="right-pane">
              <div class="sub-tab-content" id="cow">
                <h3>Cow</h3>
                <iframe src="codex/cow.html" class="content-iframe"></iframe>
              </div>
              <div class="nested-tab-content" id="brown-cow">
                <h4>Brown Cow</h4>
                <iframe src="codex/brown-cow.html" class="content-iframe"></iframe>
              </div>
              <div class="nested-tab-content" id="white-cow">
                <h4>White Cow</h4>
                <iframe src="codex/white-cow.html" class="content-iframe"></iframe>
              </div>
              <div class="sub-tab-content" id="pig">
                <h3>Pig</h3>
                <iframe src="codex/pig.html" class="content-iframe"></iframe>
              </div>
            </div>
          </div>
          <div class="tab-content" id="sentients">
            <div class="left-pane">
              <div class="sub-tabs">
                <button class="sub-tab-button" data-subtab="human" data-nested="human-nested-tabs" data-src="codex/human.html">Humans</button>
                <button class="sub-tab-button" data-subtab="orc" data-src="codex/orc.html">Orcs</button>
              </div>
              <div class="nested-tabs" id="human-nested-tabs" style="display: none;">
                <button class="nested-tab-button" data-nestedtab="human-orc" data-src="codex/human-orc.html">Human-Orc</button>
                <button class="nested-tab-button" data-nestedtab="halfling" data-src="codex/halfling.html">Halfling</button>
              </div>
            </div>
            <div class="right-pane">
              <div class="sub-tab-content" id="human">
                <h3>Human</h3>
                <iframe src="codex/human.html" class="content-iframe"></iframe>
              </div>
              <div class="nested-tab-content" id="human-orc">
                <h4>Human-Orc</h4>
                <iframe src="codex/human-orc.html" class="content-iframe"></iframe>
              </div>
              <div class="nested-tab-content" id="halfling">
                <h4>Halfling</h4>
                <iframe src="codex/halfling.html" class="content-iframe"></iframe>
              </div>
              <div class="sub-tab-content" id="orc">
                <h3>Orcs</h3>
                <iframe src="codex/orc.html" class="content-iframe"></iframe>
              </div>
            </div>
          </div>
          <button id="close-codex-popup">Close</button>
        </div>
      </div>
    `;
  
    $('body').append(codexContent);
  
    // Ensure the start page is displayed
    $('#startpage').show();
  
    // Handle main tab switching
    $('.tab-button').on('click', function() {
      const tab = $(this).data('tab');
      const src = $(this).data('src');
      $('.tab-button').removeClass('active');
      $(this).addClass('active');
      $('.tab-content').removeClass('active').hide();
      $(`#${tab}`).addClass('active').show();
      $(`#${tab} .content-iframe`).attr('src', src);
      
      // Reset sub-tabs and nested-tabs when switching main tabs
      $('.sub-tab-button, .nested-tab-button').removeClass('active');
      $('.sub-tab-content, .nested-tab-content').hide();
      $('.nested-tabs').hide();
    });
  
    // Handle sub-tab switching
    $('.sub-tab-button').on('click', function() {
      const subtab = $(this).data('subtab');
      const nestedTabsId = $(this).data('nested');
      const src = $(this).data('src');
      $('.sub-tab-button').removeClass('active');
      $(this).addClass('active');
      $('.sub-tab-content').hide();
      $(`#${subtab}`).show();
      $(`#${subtab} .content-iframe`).attr('src', src);
      
      // Reset nested-tabs when switching sub-tabs
      $('.nested-tab-button').removeClass('active');
      $('.nested-tab-content').hide();
      
      // Show nested tabs if they exist for the selected sub-tab
      if (nestedTabsId) {
        $(`#${nestedTabsId}`).show();
      } else {
        $('.nested-tabs').hide();
      }
    });
  
    // Handle nested-tab switching
    $('.nested-tab-button').on('click', function() {
      const nestedtab = $(this).data('nestedtab');
      const src = $(this).data('src');
      $('.nested-tab-button').removeClass('active');
      $(this).addClass('active');
      $('.nested-tab-content').hide();
      $(`#${nestedtab}`).show();
      $(`#${nestedtab} .content-iframe`).attr('src', src);
      
      // Hide the iframe of the sub-tab content when a nested tab is opened
      $(this).closest('.sub-tab-content').find('.content-iframe').hide();
    });
  
    // Close the Codex popup with fade-out animation
    $('#close-codex-popup').on('click', function() {
      $('#codex-popup').removeClass('fade-in-up').addClass('fade-out-down');
      setTimeout(function() {
        $('#codex-popup').remove();
      }, 500);
    });
  });
  