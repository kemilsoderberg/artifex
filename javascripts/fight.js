(function () {
    let target = null;
    let unitsData = [];
    let showUnitInfo = true;
    let moveCount = 0;

    function markIcon(id, event) {
        event.stopPropagation();
        clearUnitInfo();

        const buttons = document.querySelectorAll('.icon-button');
        buttons.forEach(button => button.classList.remove('marked'));

        const button = document.getElementById(id);
        button.classList.add('marked');

        target = id;
        console.log(`Target set to: ${target}`);

        const unitData = unitsData.find(unit => unit.id === id);
        if (unitData) {
            updateUnitInfo(unitData);
        }
    }

    function updateUnitInfo(unit) {
        const unitInfo = document.getElementById('unit-info');
        let basicInfo = `
            <h2>${unit.name}</h2>
            <img src="${unit.image}" alt="${unit.type}">
            <p><strong>Health:</strong> ${unit.health}</p>
            <p><strong>Armor:</strong> ${unit.armor}</p>
            <p><strong>Weapon:</strong> ${unit.weapon}</p>
        `;

        if (showUnitInfo) {
            basicInfo += `
                <br>
                <p><strong>Speed: </strong> ${unit.attributes.speed}</p>
                <p><strong>Strength: </strong> ${unit.attributes.strength}</p>
                <p><strong>Agility: </strong> ${unit.attributes.agility}</p>
                <p><strong>Constitution: </strong> ${unit.attributes.constitution}</p>
                <p><strong>Perception: </strong> ${unit.attributes.perception}</p>
                <p><strong>Precision: </strong> ${unit.attributes.precision}</p>
                <p><strong>Defense: </strong> ${unit.attributes.defense}</p>
                <p><strong>Luck: </strong> ${unit.attributes.luck}</p>
            `;
        }

        unitInfo.style.display = 'block';
        unitInfo.innerHTML = basicInfo;
    }

    function playerInfo() {
        const playerInfo = document.getElementById('player-info');
        const attributes = SugarCube.State.variables.attributes;

        let basicInfo = `
            <h2>${SugarCube.State.variables.first_name}</h2>
            <img src="${SugarCube.State.variables.profileImage}">
            <p><strong>Health:</strong> ${SugarCube.State.variables.health[SugarCube.State.variables.healthIndex]}</p>
            <br>
            <p><strong>Speed: </strong> ${attributes.speed}</p>
            <p><strong>Strength: </strong> ${attributes.strength}</p>
            <p><strong>Agility: </strong> ${attributes.agility}</p>
            <p><strong>Constitution: </strong> ${attributes.constitution}</p>
            <p><strong>Perception: </strong> ${attributes.perception}</p>
            <p><strong>Precision: </strong> ${attributes.precision}</p>
            <p><strong>Defense: </strong> ${attributes.defense}</p>
            <p><strong>Luck: </strong> ${attributes.luck}</p>
        `;

        playerInfo.style.display = 'block';
        playerInfo.innerHTML = basicInfo;
    }

    function clearUnitInfo() {
        const unitInfo = document.getElementById('unit-info');
        unitInfo.style.display = 'none';
        unitInfo.innerHTML = '';
    }

    function removeTarget() {
        const buttons = document.querySelectorAll('.icon-button');
        buttons.forEach(button => button.classList.remove('marked'));

        target = null;
        console.log('Target removed');
        clearUnitInfo();
    }

    function attack() {
        if (target) {
            console.log(`Attacking target: ${target}`);
            
            const targetElement = document.getElementById(target);
            if (targetElement) {
                targetElement.remove();
                removeTarget();
            } else {
                console.log('Target element not found.');
            }
        } else {
            console.log('No target selected.');
        }
    }
    
    document.addEventListener('click', function (event) {
        if (!event.target.classList.contains('icon-button') && !event.target.classList.contains('image-button') && moveCount === 0) {
            removeTarget();
        }
    });

    async function fetchJSONData() {
        try {
            const response = await fetch('units.json');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            return data.units;
        } catch (error) {
            console.error("Kunde inte hämta data:", error);
            return [];
        }
    }

    function applyEffects(attributes, effects) {
        for (const [key, value] of Object.entries(effects)) {
            if (attributes.hasOwnProperty(key)) {
                attributes[key] += value;
            }
        }
    }

    function generateRandomUnit(units, unitType) {
        const filteredUnits = units.filter(u => u.type === unitType);
        const unitTypeData = filteredUnits[Math.floor(Math.random() * filteredUnits.length)];
        const name = unitTypeData.namePool[Math.floor(Math.random() * unitTypeData.namePool.length)];
        const attributes = {};
        for (const attr in unitTypeData.attributes) {
            const min = unitTypeData.attributes[attr].min;
            const max = unitTypeData.attributes[attr].max;
            attributes[attr] = Math.floor(Math.random() * (max - min + 1)) + min;
        }
        const health = unitTypeData.health[Math.floor(Math.random() * (4 - 1 + 1)) + 1];

        const armor = unitTypeData.armor[Math.floor(Math.random() * unitTypeData.armor.length)];
        const weapon = unitTypeData.weapon[Math.floor(Math.random() * unitTypeData.weapon.length)];

        applyEffects(attributes, armor.effects);
        applyEffects(attributes, weapon.effects);

        return {
            type: unitTypeData.type,
            name,
            attributes,
            health,
            image: unitTypeData.image,
            armor: armor.type,
            weapon: weapon.type
        };
    }

    function getRandomPosition(occupiedPositions) {
        let position;
        do {
            const row = Math.floor(Math.random() * 9) + 1;
            const column = Math.floor(Math.random() * 5) + 6;
            position = `${row}-${column}`;
        } while (occupiedPositions.has(position));
        occupiedPositions.add(position);
        return position;
    }

    function hideLastVisibleAction() {
        const actions = document.querySelectorAll(".action");

        for (let i = 0; i < actions.length; i++) {
            if (actions[i].style.display !== "none") {
                actions[i].style.display = "none";
                break;
            }
        }
    }

    function showFirstHiddenAction() {
        const actions = document.querySelectorAll(".action");

        for (let i = 0; i < actions.length; i++) {
            if (actions[i].style.display === "none") {
                actions[i].style.display = "";
                break;
            }
        }
    }

    function showAllHiddenActions() {
        const actions = document.querySelectorAll(".action");

        for (let i = 0; i < actions.length; i++) {
            if (actions[i].style.display === "none") {
                actions[i].style.display = "";
            }
        }
    }

    function updateNumberOfActions() {
        document.documentElement.style.setProperty('--actionColumns', SugarCube.State.variables.actions);

        let numCols = parseInt(document.documentElement.style.getPropertyValue('--actionColumns'));
        for (let i = 1; i <= numCols; i++) {
            let actionDiv = document.createElement('div');
            actionDiv.classList.add('action');
            actionDiv.id = `a${i}`;
            actionDiv.innerHTML += `<p></p>`;
            actions.appendChild(actionDiv);
        }
    }

    async function placeUnits() {
        const units = await fetchJSONData();
        const gameBoard = document.getElementById('main-container');
        const unitTypes = {
            "goblin": Number(window.SugarCube.State.variables.enemyGoblins),
            "archer": Number(window.SugarCube.State.variables.enemyArchers)
        };
        const occupiedPositions = new Set();

        for (const [unitType, count] of Object.entries(unitTypes)) {
            for (let i = 0; i < count; i++) {
                const unit = generateRandomUnit(units, unitType);
                const position = getRandomPosition(occupiedPositions);
                const [row, column] = position.split('-').map(Number);

                const unitElement = document.createElement('button');
                unitElement.className = 'icon-button';
                unitElement.style.gridRowStart = row;
                unitElement.style.gridColumnStart = column;
                unitElement.style.backgroundImage = `url('${unit.image}')`;
                unitElement.onclick = (event) => markIcon(`${unitType}-${i}`, event);
                unitElement.id = `${unitType}-${i}`;

                gameBoard.appendChild(unitElement);

                unitsData.push({ ...unit, id: `${unitType}-${i}` });
            }
        }

        const playerToken = document.createElement('button');
        playerToken.id = 'player-token';
        playerToken.className = 'icon-button';
        playerToken.onclick = (event) => markIcon('player-token', event);
        playerToken.style.gridRowStart = 5;
        playerToken.style.gridColumnStart = 4;
        gameBoard.appendChild(playerToken);

        window.occupiedPositions = occupiedPositions;

        return occupiedPositions;
    }

    function moveTokenTo(row, col) {
        if (window.occupiedPositions.has(`${row}-${col}`)) {
            console.log("That position is occupied: " + row + "-" + col);
            return;
        }
    
        const playerToken = document.getElementById('player-token');
        playerToken.style.gridRowStart = row;
        playerToken.style.gridColumnStart = col;
        window.moveCount = 0;
    
        const cells = document.querySelectorAll('#main-container > div');
        cells.forEach(cell => {
            cell.style.border = "none";
        });
        hideLastVisibleAction();
    };
    

    document.getElementById('moveButton').addEventListener('click', () => {
        console.log("Move button clicked!");
        window.moveCount = 1;
    
        const cells = document.querySelectorAll('#main-container > div');
        cells.forEach(cell => {
            cell.style.border = "1px solid black";
        });
    });
    
    
    $(document).ready(function() {
        updateNumberOfActions();
        playerInfo();
        placeUnits().then(() => {
            const mainContainer = document.getElementById('main-container');

            for (let row = 1; row <= 9; row++) {
                for (let col = 1; col <= 10; col++) {
                    const cell = document.createElement('div');
                    cell.style.gridRowStart = row;
                    cell.style.gridColumnStart = col;
                    cell.dataset.row = row;
                    cell.dataset.col = col;
                    mainContainer.appendChild(cell);
                    cell.addEventListener('click', () => {
                        if (window.moveCount === 1) {
                            moveTokenTo(row, col);
                        }
                    });
                }
            }
        });
    }); 

    window.markIcon = markIcon;
    window.attack = attack;
})();
