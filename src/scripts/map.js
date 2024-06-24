// Listen for click event on the "Map" link using event delegation
$('body').on('click', '#mapLink', function(ev) {
    ev.preventDefault(); // Prevent default link behavior
  
    const mapContent = `
      <div id="map-popup" class="fade-in-up">
        <div id="map-popup-content">
          <h2>Map</h2>
          <canvas id="mapCanvas"></canvas>
          <button id="close-map-popup">Close</button>
        </div>
      </div>
    `;
  
    $('body').append(mapContent);
  
    const canvas = document.getElementById('mapCanvas');
    const ctx = canvas.getContext('2d');
    const mapImage = new Image();
    mapImage.src = 'images/map-background.webp';
  
    let isDragging = false;
    let startX, startY;
    let offsetX = 0, offsetY = 0;
    let scale = 10; // Default zoom level
    let isRedrawing = false;
  
    mapImage.onload = function() {
      canvas.width = mapImage.width;
      canvas.height = mapImage.height;
      applyInitialZoom();
      requestRedraw();
    };
  
    canvas.addEventListener('mousedown', startDragging);
    canvas.addEventListener('mousemove', drag);
    canvas.addEventListener('mouseup', stopDragging);
    canvas.addEventListener('mouseleave', stopDragging);
    canvas.addEventListener('wheel', zoom);
  
    function startDragging(e) {
      isDragging = true;
      startX = e.clientX - offsetX;
      startY = e.clientY - offsetY;
    }
  
    function drag(e) {
      if (!isDragging) return;
      offsetX = e.clientX - startX;
      offsetY = e.clientY - startY;
      requestRedraw();
    }
  
    function stopDragging() {
      isDragging = false;
    }
  
    function zoom(e) {
      e.preventDefault();
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      scale *= zoomFactor;
      requestRedraw();
    }
  
    function requestRedraw() {
      if (!isRedrawing) {
        isRedrawing = true;
        requestAnimationFrame(redrawMap);
      }
    }
  
    function applyInitialZoom() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.scale(scale, scale);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);
      drawMapImage();
      ctx.restore();
    }
  
    function redrawMap() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.scale(scale, scale);
      ctx.translate(-canvas.width / 2 + offsetX, -canvas.height / 2 + offsetY);
      drawMapImage();
      ctx.restore();
      drawPlayer();
      isRedrawing = false;
    }
  
    function drawMapImage() {
      const aspectRatio = mapImage.width / mapImage.height;
      let drawWidth, drawHeight;
  
      if (canvas.width / canvas.height > aspectRatio) {
        drawWidth = canvas.width;
        drawHeight = canvas.width / aspectRatio;
      } else {
        drawWidth = canvas.height * aspectRatio;
        drawHeight = canvas.height;
      }
  
      const drawX = (canvas.width - drawWidth) / 2;
      const drawY = (canvas.height - drawHeight) / 2;
  
      ctx.drawImage(mapImage, drawX, drawY, drawWidth, drawHeight);
    }
  
    function drawPlayer() {
      const playerX = State.variables.playerX; // Read player X position from Twine variable
      const playerY = State.variables.playerY; // Read player Y position from Twine variable
      const playerImage = new Image();
      playerImage.src = 'images/player-icon.png';
      playerImage.onload = function() {
        const playerPosX = (playerX / 100) * mapImage.width;
        const playerPosY = (playerY / 100) * mapImage.height;
        const playerSize = 50 / scale; // Adjust player size based on the scale
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.scale(scale, scale);
        ctx.translate(-canvas.width / 2 + offsetX, -canvas.height / 2 + offsetY);
        ctx.drawImage(playerImage, playerPosX - playerSize / 2, playerPosY - playerSize / 2, playerSize, playerSize);
        ctx.restore();
      };
    }
  
    // Close the map popup with fade-out animation
    $('#close-map-popup').on('click', function() {
      $('#map-popup').removeClass('fade-in-up').addClass('fade-out-down');
      setTimeout(function() {
        $('#map-popup').remove();
      }, 500);
    });
  });
  