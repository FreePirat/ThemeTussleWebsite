// Movelist Generator Script
class MovelistGenerator {
    constructor() {
        this.propertyColors = {
            'projectile': 'projectile',
            'Projectile': 'projectile',
            'special-cancel': 'special-cancel',
            'command-grab': 'command-grab',
            'Grab': 'command-grab',
            'combo-starter': 'combo-starter',
            'overhead': 'overhead',
            'hard-knockdown': 'hard-knockdown',
            'guard-break': 'guard-break',
            'super': 'super',
            'invincible': 'invincible',
            'cinematic': 'cinematic',
            'Mid': 'mid',
            'Low': 'low',
            'High': 'high',
            'Anti-Air': 'anti-air',
            'Launcher': 'launcher',
            'Aerial': 'aerial'
        };
    }

    async loadMoveData(jsonPath) {
        try {
            const response = await fetch(jsonPath);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error loading move data:', error);
            return null;
        }
    }

    generateMoveHTML(move) {
        const propertiesHTML = move.properties.map(prop => 
            `<span class="property ${this.propertyColors[prop] || prop}">${prop.replace('-', ' ')}</span>`
        ).join('');

        // Use the character name for the image path
        const character = this.characterName || 'Nina';

        return `
            <div class="move-entry">
                <div class="move-header">
                    <h3 class="move-name">${move.name}</h3>
                    <span class="move-input">${move.input}</span>
                </div>
                <div class="move-content">
                    <div class="move-image">
                        <img src="../../public/images/${character}${move.image}" alt="${move.name}" onerror="this.style.display='none'">
                    </div>
                    <div class="move-data">
                        <div class="move-stats">
                            <span class="stat"><strong>Damage:</strong> ${move.damage}</span>
                            <span class="stat"><strong>Startup:</strong> ${move.startup}f</span>
                            <span class="stat"><strong>Active:</strong> ${move.active}f</span>
                            <span class="stat"><strong>Recovery:</strong> ${move.recovery}f</span>
                            <span class="stat"><strong>On Block:</strong> ${move.onBlock}</span>
                        </div>
                        <p class="move-description">${move.description}</p>
                        <div class="move-properties">
                            ${propertiesHTML}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async generateMovelist(character, containerSelector) {
        const jsonPath = `../data/${character}-moves.json`;
        const moveData = await this.loadMoveData(jsonPath);
        
        if (!moveData) {
            console.error(`Failed to load move data for ${character}`);
            return;
        }

        const container = document.querySelector(containerSelector);
        if (!container) {
            console.error(`Container ${containerSelector} not found`);
            return;
        }

        // Handle both old format (object with moves array) and new format (direct array)
        const moves = Array.isArray(moveData) ? moveData : moveData.moves;
        const characterName = Array.isArray(moveData) ? character : moveData.characterName;
        this.characterName = characterName;
        
        // Generate HTML for all moves
        const moveListHTML = moves.map(move => this.generateMoveHTML(move)).join('');
        
        // Create the complete movelist structure
        const completeHTML = `
            <h2>Movelist</h2>
            <div class="movelist-grid">
                ${moveListHTML}
            </div>
        `;

        container.innerHTML = completeHTML;
        console.log(`Generated movelist for ${characterName} with ${moves.length} moves`);
    }
}

// Initialize and use the generator when the page loads
document.addEventListener('DOMContentLoaded', function() {
    const generator = new MovelistGenerator();
    
    // Auto-detect character from URL or page title
    const currentPage = window.location.pathname;
    let character = 'nina'; // default
    
    if (currentPage.includes('charlie')) character = 'charlie';
    else if (currentPage.includes('leo')) character = 'leo';
    else if (currentPage.includes('nina')) character = 'nina';
    else if (currentPage.includes('suzie')) character = 'suzie';
    
    // Generate the movelist
    generator.generateMovelist(character, '.character-movelist-bottom');
});

// Export for manual use if needed
window.MovelistGenerator = MovelistGenerator;