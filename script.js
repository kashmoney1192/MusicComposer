class MusicSightReading {
    constructor() {
        this.currentLevel = 1;
        this.currentSettings = {};
        
        this.initializeApp();
    }

    initializeApp() {
        this.setupEventListeners();
        this.setupFeatureNavigation();
    }

    setupEventListeners() {
        document.querySelectorAll('.level-card').forEach(card => {
            card.addEventListener('click', (e) => {
                this.selectLevel(parseInt(e.currentTarget.dataset.level));
            });
        });

        document.getElementById('generateMusic').addEventListener('click', () => {
            this.generateSheetMusic();
        });

        document.getElementById('newSheet').addEventListener('click', () => {
            this.generateSheetMusic();
        });

        document.getElementById('backToLevels').addEventListener('click', () => {
            this.showLevelSelection();
        });
    }

    setupFeatureNavigation() {
        const sightReadingBtn = document.getElementById('sightReadingBtn');
        const composerBtn = document.getElementById('composerBtn');
        const levelSelection = document.getElementById('levelSelection');
        const customizationPanel = document.getElementById('customizationPanel');
        const musicDisplay = document.getElementById('musicDisplay');
        const composerInterface = document.getElementById('composerInterface');
        const launchComposer = document.getElementById('launchComposer');
        const backToSightReading = document.getElementById('backToSightReading');

        // Sight Reading button
        sightReadingBtn.addEventListener('click', () => {
            sightReadingBtn.classList.add('active');
            composerBtn.classList.remove('active');
            
            // Show sight reading interface
            levelSelection.style.display = 'block';
            customizationPanel.style.display = 'none';
            musicDisplay.style.display = 'none';
            composerInterface.style.display = 'none';
        });

        // Composer button
        composerBtn.addEventListener('click', () => {
            composerBtn.classList.add('active');
            sightReadingBtn.classList.remove('active');
            
            // Show composer interface
            levelSelection.style.display = 'none';
            customizationPanel.style.display = 'none';
            musicDisplay.style.display = 'none';
            composerInterface.style.display = 'block';
            
            // Initialize composer preview
            this.initializeComposerPreview();
        });

        // Launch full composer app
        launchComposer.addEventListener('click', () => {
            // For now, show an enhanced inline composer until the React app is built
            this.showInlineComposer();
        });

        // Back to sight reading
        backToSightReading.addEventListener('click', () => {
            sightReadingBtn.click(); // Trigger sight reading view
        });
    }

    initializeComposerPreview() {
        const preview = document.getElementById('composerPreview');
        
        // Simple SVG staff preview
        const staffSvg = `
            <svg width="400" height="150" xmlns="http://www.w3.org/2000/svg">
                <!-- Staff lines -->
                <line x1="40" y1="30" x2="360" y2="30" stroke="#000" stroke-width="1"/>
                <line x1="40" y1="45" x2="360" y2="45" stroke="#000" stroke-width="1"/>
                <line x1="40" y1="60" x2="360" y2="60" stroke="#000" stroke-width="1"/>
                <line x1="40" y1="75" x2="360" y2="75" stroke="#000" stroke-width="1"/>
                <line x1="40" y1="90" x2="360" y2="90" stroke="#000" stroke-width="1"/>
                
                <!-- Treble clef -->
                <text x="50" y="75" font-family="Times, serif" font-size="40" fill="#000">𝄞</text>
                
                <!-- Sample notes -->
                <ellipse cx="120" cy="60" rx="6" ry="4" fill="#000" transform="rotate(-20 120 60)"/>
                <line x1="126" y1="60" x2="126" y2="25" stroke="#000" stroke-width="1"/>
                
                <ellipse cx="160" cy="75" rx="6" ry="4" fill="#000" transform="rotate(-20 160 75)"/>
                <line x1="154" y1="75" x2="154" y2="110" stroke="#000" stroke-width="1"/>
                
                <ellipse cx="200" cy="45" rx="6" ry="4" fill="#000" transform="rotate(-20 200 45)"/>
                <line x1="206" y1="45" x2="206" y2="10" stroke="#000" stroke-width="1"/>
                
                <ellipse cx="240" cy="60" rx="6" ry="4" fill="white" stroke="#000" stroke-width="1" transform="rotate(-20 240 60)"/>
                <line x1="246" y1="60" x2="246" y2="25" stroke="#000" stroke-width="1"/>
                
                <!-- Measure lines -->
                <line x1="280" y1="20" x2="280" y2="100" stroke="#000" stroke-width="1"/>
                <line x1="360" y1="20" x2="360" y2="100" stroke="#000" stroke-width="2"/>
                
                <text x="200" y="125" font-family="sans-serif" font-size="12" fill="#666" text-anchor="middle">Interactive Composer Coming Soon!</text>
            </svg>
        `;
        
        preview.innerHTML = staffSvg;
    }

    showInlineComposer() {
        // Hide the composer notice and show an advanced interactive composer
        const composerInterface = document.getElementById('composerInterface');
        
        const composerHtml = `
            <div class="composer-header">
                <h2>🎼 Advanced Music Composer Pro</h2>
                <p>Professional music notation editor with real-time playback • Full keyboard shortcuts • MIDI support</p>
            </div>
            
            <!-- Advanced Toolbar -->
            <div class="composer-toolbar-advanced">
                <div class="toolbar-section">
                    <h4>📝 Note Tools</h4>
                    <div class="tool-row">
                        <div class="tool-group">
                            <label>Duration:</label>
                            <select id="noteDuration" class="composer-select">
                                <option value="w">Whole ○</option>
                                <option value="h">Half ♪</option>
                                <option value="q" selected>Quarter ♩</option>
                                <option value="8">Eighth ♫</option>
                                <option value="16">Sixteenth ♬</option>
                                <option value="32">Thirty-second</option>
                            </select>
                        </div>
                        
                        <div class="tool-group">
                            <label>Accidental:</label>
                            <select id="accidental" class="composer-select">
                                <option value="">Natural</option>
                                <option value="#">Sharp ♯</option>
                                <option value="b">Flat ♭</option>
                                <option value="n">Natural ♮</option>
                            </select>
                        </div>
                        
                        <div class="tool-group">
                            <label>Articulation:</label>
                            <select id="articulation" class="composer-select">
                                <option value="">None</option>
                                <option value="staccato">Staccato</option>
                                <option value="accent">Accent</option>
                                <option value="tenuto">Tenuto</option>
                                <option value="marcato">Marcato</option>
                            </select>
                        </div>
                        
                        <button id="toggleDot" class="tool-btn toggle-btn">• Dot</button>
                        <button id="toggleTie" class="tool-btn toggle-btn">⌒ Tie</button>
                    </div>
                </div>
                
                <div class="toolbar-section">
                    <h4>🎹 Playback & MIDI</h4>
                    <div class="tool-row">
                        <button id="playComposition" class="tool-btn play-btn">▶ Play</button>
                        <button id="stopComposition" class="tool-btn stop-btn">⏹ Stop</button>
                        <button id="pauseComposition" class="tool-btn pause-btn">⏸ Pause</button>
                        
                        <div class="tool-group">
                            <label>Tempo:</label>
                            <input type="range" id="tempoSlider" min="60" max="200" value="120" class="tempo-slider">
                            <span id="tempoDisplay">120 BPM</span>
                        </div>
                        
                        <button id="connectMIDI" class="tool-btn midi-btn">🎹 Connect MIDI</button>
                        <span id="midiStatus" class="midi-status">MIDI: Disconnected</span>
                    </div>
                </div>
                
                <div class="toolbar-section">
                    <h4>🎵 Advanced Features</h4>
                    <div class="tool-row">
                        <button id="addBeaming" class="tool-btn">⟣ Auto Beam</button>
                        <button id="addSlur" class="tool-btn">⌢ Add Slur</button>
                        <button id="addDynamic" class="tool-btn">𝑓 Dynamics</button>
                        
                        <div class="tool-group">
                            <label>Key Signature:</label>
                            <select id="keySignature" class="composer-select">
                                <option value="C">C Major</option>
                                <option value="G">G Major (1♯)</option>
                                <option value="D">D Major (2♯)</option>
                                <option value="A">A Major (3♯)</option>
                                <option value="F">F Major (1♭)</option>
                                <option value="Bb">B♭ Major (2♭)</option>
                                <option value="Eb">E♭ Major (3♭)</option>
                            </select>
                        </div>
                        
                        <div class="tool-group">
                            <label>Time Sig:</label>
                            <select id="timeSignature" class="composer-select">
                                <option value="4/4" selected>4/4</option>
                                <option value="3/4">3/4</option>
                                <option value="2/4">2/4</option>
                                <option value="6/8">6/8</option>
                                <option value="12/8">12/8</option>
                                <option value="5/4">5/4</option>
                                <option value="7/8">7/8</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div class="toolbar-section">
                    <h4>💾 File Operations</h4>
                    <div class="tool-row">
                        <button id="clearComposition" class="tool-btn danger-btn">🗑 Clear All</button>
                        <button id="undoAction" class="tool-btn">↶ Undo</button>
                        <button id="redoAction" class="tool-btn">↷ Redo</button>
                        <button id="saveComposition" class="tool-btn save-btn">💾 Save</button>
                        <button id="loadComposition" class="tool-btn">📂 Load</button>
                        <button id="exportComposition" class="tool-btn export-btn">📤 Export</button>
                        <button id="printComposition" class="tool-btn">🖨 Print</button>
                    </div>
                </div>
            </div>
            
            <!-- Piano Grand Staff -->
            <div class="composer-staff-container">
                <div class="staff-controls">
                    <button id="toggleStaff" class="staff-toggle-btn active" data-staff="treble">Treble Staff</button>
                    <button id="toggleBothStaves" class="staff-toggle-btn">Grand Staff (Piano)</button>
                </div>
                <div id="interactiveStaff" class="interactive-staff grand-staff"></div>
            </div>
            
            <!-- Keyboard Shortcuts Panel -->
            <div class="keyboard-shortcuts" id="keyboardShortcuts">
                <h4>⌨️ Keyboard Shortcuts</h4>
                <div class="shortcuts-grid">
                    <div class="shortcut"><kbd>1-7</kbd> Place notes (C-B)</div>
                    <div class="shortcut"><kbd>Q/H/W/E/S</kbd> Note durations</div>
                    <div class="shortcut"><kbd>↑/↓</kbd> Change pitch</div>
                    <div class="shortcut"><kbd>Space</kbd> Play/Pause</div>
                    <div class="shortcut"><kbd>Delete</kbd> Remove note</div>
                    <div class="shortcut"><kbd>T</kbd> Add tie</div>
                    <div class="shortcut"><kbd>.</kbd> Add dot</div>
                    <div class="shortcut"><kbd>Ctrl+Z</kbd> Undo</div>
                    <div class="shortcut"><kbd>Ctrl+S</kbd> Save</div>
                    <div class="shortcut"><kbd>Shift+Click</kbd> Select multiple</div>
                </div>
                <button id="toggleShortcuts" class="toggle-shortcuts">Hide Shortcuts</button>
            </div>
            
            <!-- Advanced Info Panel -->
            <div class="composer-info-advanced">
                <div class="info-grid">
                    <div class="info-card">
                        <h4>📊 Composition Stats</h4>
                        <div class="stats-row">
                            <span>Notes: <strong id="noteCount">0</strong></span>
                            <span>Measures: <strong id="measureCount">1</strong></span>
                            <span>Duration: <strong id="totalDuration">0:00</strong></span>
                        </div>
                    </div>
                    
                    <div class="info-card">
                        <h4>🎼 Current Settings</h4>
                        <div class="settings-row">
                            <span>Key: <strong id="currentKey">C Major</strong></span>
                            <span>Time: <strong id="currentTime">4/4</strong></span>
                            <span>Tempo: <strong id="currentTempo">120 BPM</strong></span>
                        </div>
                    </div>
                    
                    <div class="info-card">
                        <h4>🎯 Selection</h4>
                        <div id="selectionInfo">
                            <span>No notes selected</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="composer-actions-advanced">
                <button id="backToSightReading" class="control-btn secondary">← Back to Sight Reading</button>
                <button id="shareComposition" class="tool-btn share-btn">🔗 Share</button>
                <button id="collaborateBtn" class="tool-btn collab-btn">👥 Collaborate</button>
                <button id="fullscreenComposer" class="tool-btn">⛶ Fullscreen</button>
            </div>
        `;
        
        composerInterface.innerHTML = composerHtml;
        
        // Initialize the interactive composer
        this.initializeInteractiveComposer();
        
        // Re-bind the back button
        document.getElementById('backToSightReading').addEventListener('click', () => {
            document.getElementById('sightReadingBtn').click();
        });
    }

    initializeInteractiveComposer() {
        // Advanced composer state
        this.composerNotes = [];
        this.selectedNotes = [];
        this.composerHistory = [];
        this.historyIndex = -1;
        this.isPlaying = false;
        this.playbackPosition = 0;
        this.audioContext = null;
        this.midiAccess = null;
        
        // Current tool settings
        this.currentNoteDuration = 'q';
        this.currentAccidental = '';
        this.currentArticulation = '';
        this.currentKey = 'C';
        this.currentTimeSignature = '4/4';
        this.currentTempo = 120;
        this.dotted = false;
        this.tied = false;
        this.currentStaff = 'treble';
        this.showBothStaves = false;
        
        // Initialize audio context
        this.initializeAudioContext();
        
        // Setup MIDI
        this.initializeMIDI();
        
        // Render staff and setup listeners
        this.renderAdvancedStaff();
        this.setupAdvancedEventListeners();
        this.setupKeyboardShortcuts();
        
        // Save initial state
        this.saveToHistory('Initial state');
    }

    // Audio Context for real-time playback
    initializeAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log('🎵 Audio context initialized');
        } catch (error) {
            console.warn('Audio context not available:', error);
        }
    }

    // MIDI Input Support
    async initializeMIDI() {
        if (navigator.requestMIDIAccess) {
            try {
                this.midiAccess = await navigator.requestMIDIAccess();
                console.log('🎹 MIDI access granted');
                
                // Setup MIDI inputs
                for (let input of this.midiAccess.inputs.values()) {
                    input.onmidimessage = (message) => this.handleMIDIMessage(message);
                }
                
                document.getElementById('midiStatus').textContent = 'MIDI: Connected';
                document.getElementById('midiStatus').className = 'midi-status connected';
            } catch (error) {
                console.warn('MIDI access failed:', error);
                document.getElementById('midiStatus').textContent = 'MIDI: Not Available';
            }
        } else {
            document.getElementById('midiStatus').textContent = 'MIDI: Not Supported';
        }
    }

    handleMIDIMessage(message) {
        const [command, note, velocity] = message.data;
        
        // Note on (144-159) or note off (128-143)
        if ((command >= 144 && command <= 159 && velocity > 0) || 
            (command >= 128 && command <= 143)) {
            
            const isNoteOn = command >= 144 && command <= 159 && velocity > 0;
            
            if (isNoteOn) {
                // Convert MIDI note to pitch notation
                const pitch = this.midiNoteToPitch(note);
                this.placeMIDINote(pitch);
            }
        }
    }

    midiNoteToPitch(midiNote) {
        const noteNames = ['c', 'd♭', 'd', 'e♭', 'e', 'f', 'g♭', 'g', 'a♭', 'a', 'b♭', 'b'];
        const octave = Math.floor(midiNote / 12) - 1;
        const noteIndex = midiNote % 12;
        
        return noteNames[noteIndex].replace('♭', 'b') + '/' + octave;
    }

    placeMIDINote(pitch) {
        // Place note at current cursor position or next available position
        const x = this.getNextNotePosition();
        const y = this.getPitchY(pitch, this.currentStaff);
        const measure = this.getCurrentMeasure(x);
        const beat = this.getCurrentBeat(x, measure);
        
        this.placeNote(x, y, pitch, measure, beat);
    }

    // Keyboard Shortcuts
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Prevent default for composer shortcuts
            if (document.getElementById('interactiveStaff')) {
                this.handleKeyboardShortcut(e);
            }
        });
    }

    handleKeyboardShortcut(e) {
        // Note duration shortcuts
        switch(e.key.toLowerCase()) {
            case 'w': this.setNoteDuration('w'); e.preventDefault(); break;
            case 'h': this.setNoteDuration('h'); e.preventDefault(); break;
            case 'q': this.setNoteDuration('q'); e.preventDefault(); break;
            case 'e': this.setNoteDuration('8'); e.preventDefault(); break;
            case 's': this.setNoteDuration('16'); e.preventDefault(); break;
            
            // Note placement (C-B)
            case '1': this.placeNoteByNumber(0); e.preventDefault(); break; // C
            case '2': this.placeNoteByNumber(1); e.preventDefault(); break; // D
            case '3': this.placeNoteByNumber(2); e.preventDefault(); break; // E
            case '4': this.placeNoteByNumber(3); e.preventDefault(); break; // F
            case '5': this.placeNoteByNumber(4); e.preventDefault(); break; // G
            case '6': this.placeNoteByNumber(5); e.preventDefault(); break; // A
            case '7': this.placeNoteByNumber(6); e.preventDefault(); break; // B
            
            // Special functions
            case ' ': this.togglePlayback(); e.preventDefault(); break;
            case 't': this.toggleTie(); e.preventDefault(); break;
            case '.': this.toggleDot(); e.preventDefault(); break;
            case 'Delete': case 'Backspace': this.deleteSelectedNotes(); e.preventDefault(); break;
            
            // Undo/Redo
            case 'z': 
                if (e.ctrlKey || e.metaKey) {
                    if (e.shiftKey) {
                        this.redo();
                    } else {
                        this.undo();
                    }
                    e.preventDefault();
                }
                break;
                
            // Save
            case 's':
                if (e.ctrlKey || e.metaKey) {
                    this.saveComposition();
                    e.preventDefault();
                }
                break;
        }
        
        // Arrow keys for pitch adjustment
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            this.adjustSelectedNotesPitch(e.key === 'ArrowUp' ? 1 : -1);
            e.preventDefault();
        }
    }

    setNoteDuration(duration) {
        this.currentNoteDuration = duration;
        document.getElementById('noteDuration').value = duration;
        this.updateSelectedNotesDuration(duration);
    }

    placeNoteByNumber(noteIndex) {
        const noteNames = ['c', 'd', 'e', 'f', 'g', 'a', 'b'];
        const pitch = noteNames[noteIndex] + '/4'; // Default to 4th octave
        
        const x = this.getNextNotePosition();
        const y = this.getPitchY(pitch, this.currentStaff);
        const measure = this.getCurrentMeasure(x);
        const beat = this.getCurrentBeat(x, measure);
        
        this.placeNote(x, y, pitch, measure, beat);
    }

    // History system for undo/redo
    saveToHistory(action) {
        // Remove any future history if we're not at the end
        this.composerHistory = this.composerHistory.slice(0, this.historyIndex + 1);
        
        // Add new state
        this.composerHistory.push({
            notes: JSON.parse(JSON.stringify(this.composerNotes)),
            action: action,
            timestamp: Date.now()
        });
        
        this.historyIndex = this.composerHistory.length - 1;
        
        // Limit history size
        if (this.composerHistory.length > 50) {
            this.composerHistory.shift();
            this.historyIndex--;
        }
        
        this.updateUndoRedoButtons();
    }

    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.composerNotes = JSON.parse(JSON.stringify(this.composerHistory[this.historyIndex].notes));
            this.updateComposerDisplay();
            this.updateUndoRedoButtons();
        }
    }

    redo() {
        if (this.historyIndex < this.composerHistory.length - 1) {
            this.historyIndex++;
            this.composerNotes = JSON.parse(JSON.stringify(this.composerHistory[this.historyIndex].notes));
            this.updateComposerDisplay();
            this.updateUndoRedoButtons();
        }
    }

    updateUndoRedoButtons() {
        const undoBtn = document.getElementById('undoAction');
        const redoBtn = document.getElementById('redoAction');
        
        if (undoBtn) undoBtn.disabled = this.historyIndex <= 0;
        if (redoBtn) redoBtn.disabled = this.historyIndex >= this.composerHistory.length - 1;
    }

    renderInteractiveStaff() {
        const staffContainer = document.getElementById('interactiveStaff');
        
        const staffSvg = `
            <svg width="800" height="200" xmlns="http://www.w3.org/2000/svg" class="composer-svg">
                <!-- Staff lines -->
                <line x1="100" y1="40" x2="750" y2="40" stroke="#000" stroke-width="1" class="staff-line"/>
                <line x1="100" y1="55" x2="750" y2="55" stroke="#000" stroke-width="1" class="staff-line"/>
                <line x1="100" y1="70" x2="750" y2="70" stroke="#000" stroke-width="1" class="staff-line"/>
                <line x1="100" y1="85" x2="750" y2="85" stroke="#000" stroke-width="1" class="staff-line"/>
                <line x1="100" y1="100" x2="750" y2="100" stroke="#000" stroke-width="1" class="staff-line"/>
                
                <!-- Treble clef -->
                <text x="110" y="85" font-family="Times, serif" font-size="36" fill="#000">𝄞</text>
                
                <!-- Time signature -->
                <text x="150" y="65" font-family="serif" font-size="16" fill="#000">4</text>
                <text x="150" y="85" font-family="serif" font-size="16" fill="#000">4</text>
                
                <!-- Measure lines -->
                <line x1="200" y1="30" x2="200" y2="110" stroke="#000" stroke-width="1"/>
                <line x1="400" y1="30" x2="400" y2="110" stroke="#000" stroke-width="1"/>
                <line x1="600" y1="30" x2="600" y2="110" stroke="#000" stroke-width="1"/>
                <line x1="750" y1="30" x2="750" y2="110" stroke="#000" stroke-width="2"/>
                
                <!-- Interactive areas (invisible click zones) -->
                <g id="clickableAreas">
                    ${this.generateClickableAreas()}
                </g>
                
                <!-- Notes container -->
                <g id="notesContainer">
                    ${this.renderComposerNotes()}
                </g>
                
                <!-- Hover indicator -->
                <circle id="hoverIndicator" cx="0" cy="0" r="4" fill="rgba(59, 130, 246, 0.5)" style="display: none"/>
            </svg>
        `;
        
        staffContainer.innerHTML = staffSvg;
        
        // Add click event listeners to the clickable areas
        this.setupStaffClickHandlers();
    }

    generateClickableAreas() {
        const areas = [];
        const notePositions = [25, 32, 40, 47, 55, 62, 70, 77, 85, 92, 100, 107, 115]; // Staff positions
        
        for (let measure = 1; measure <= 3; measure++) {
            const measureStart = 200 + (measure - 1) * 200;
            const measureEnd = measureStart + 200;
            
            for (let beat = 0; beat < 4; beat++) {
                const x = measureStart + 25 + (beat * 40);
                
                notePositions.forEach((y, index) => {
                    const pitch = this.getPitchFromPosition(index);
                    areas.push(`
                        <rect x="${x - 10}" y="${y - 5}" width="20" height="10" 
                              fill="transparent" 
                              class="clickable-area" 
                              data-x="${x}" 
                              data-y="${y}" 
                              data-pitch="${pitch}"
                              data-measure="${measure}"
                              data-beat="${beat + 1}"/>
                    `);
                });
            }
        }
        
        return areas.join('');
    }

    getPitchFromPosition(index) {
        const pitches = ['c/6', 'b/5', 'a/5', 'g/5', 'f/5', 'e/5', 'd/5', 'c/5', 'b/4', 'a/4', 'g/4', 'f/4', 'e/4'];
        return pitches[index] || 'c/5';
    }

    setupStaffClickHandlers() {
        const clickableAreas = document.querySelectorAll('.clickable-area');
        const hoverIndicator = document.getElementById('hoverIndicator');
        
        clickableAreas.forEach(area => {
            // Hover effect
            area.addEventListener('mouseenter', (e) => {
                const x = parseInt(e.target.dataset.x);
                const y = parseInt(e.target.dataset.y);
                hoverIndicator.setAttribute('cx', x);
                hoverIndicator.setAttribute('cy', y);
                hoverIndicator.style.display = 'block';
            });
            
            area.addEventListener('mouseleave', () => {
                hoverIndicator.style.display = 'none';
            });
            
            // Click to place note
            area.addEventListener('click', (e) => {
                const x = parseInt(e.target.dataset.x);
                const y = parseInt(e.target.dataset.y);
                const pitch = e.target.dataset.pitch;
                const measure = parseInt(e.target.dataset.measure);
                const beat = parseInt(e.target.dataset.beat);
                
                this.placeNote(x, y, pitch, measure, beat);
            });
            
            // Right-click to delete note
            area.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                const x = parseInt(e.target.dataset.x);
                const y = parseInt(e.target.dataset.y);
                this.deleteNoteAt(x, y);
            });
        });
    }

    placeNote(x, y, pitch, measure, beat) {
        // Check if note already exists at this position
        const existingIndex = this.composerNotes.findIndex(note => 
            note.x === x && note.y === y
        );
        
        if (existingIndex !== -1) {
            // Replace existing note
            this.composerNotes[existingIndex] = {
                x, y, pitch, measure, beat,
                duration: this.currentNoteDuration,
                accidental: this.currentAccidental,
                id: Date.now()
            };
        } else {
            // Add new note
            this.composerNotes.push({
                x, y, pitch, measure, beat,
                duration: this.currentNoteDuration,
                accidental: this.currentAccidental,
                id: Date.now()
            });
        }
        
        this.updateComposerDisplay();
    }

    deleteNoteAt(x, y) {
        this.composerNotes = this.composerNotes.filter(note => 
            !(note.x === x && note.y === y)
        );
        this.updateComposerDisplay();
    }

    renderComposerNotes() {
        return this.composerNotes.map(note => {
            const noteHtml = this.renderSingleComposerNote(note);
            return noteHtml;
        }).join('');
    }

    renderSingleComposerNote(note) {
        let noteElement = '';
        
        // Note head
        if (note.duration === 'w') {
            noteElement += `<ellipse cx="${note.x}" cy="${note.y}" rx="7" ry="5" fill="white" stroke="#000" stroke-width="1.5" transform="rotate(-20 ${note.x} ${note.y})"/>`;
        } else if (note.duration === 'h') {
            noteElement += `<ellipse cx="${note.x}" cy="${note.y}" rx="7" ry="5" fill="white" stroke="#000" stroke-width="1.2" transform="rotate(-20 ${note.x} ${note.y})"/>`;
        } else {
            noteElement += `<ellipse cx="${note.x}" cy="${note.y}" rx="7" ry="5" fill="#000" transform="rotate(-20 ${note.x} ${note.y})"/>`;
        }
        
        // Note stem (if not whole note)
        if (note.duration !== 'w') {
            const stemHeight = 30;
            if (note.y <= 70) { // Notes above middle line - stem down
                const stemX = note.x + 6;
                noteElement += `<line x1="${stemX}" y1="${note.y + 1}" x2="${stemX}" y2="${note.y + stemHeight}" stroke="#000" stroke-width="1"/>`;
                
                // Add flags for eighth and sixteenth notes
                if (note.duration === '8') {
                    noteElement += `<path d="M${stemX} ${note.y + stemHeight} Q${stemX + 8} ${note.y + stemHeight - 5} ${stemX + 6} ${note.y + stemHeight - 12}" fill="#000"/>`;
                } else if (note.duration === '16') {
                    noteElement += `<path d="M${stemX} ${note.y + stemHeight} Q${stemX + 8} ${note.y + stemHeight - 5} ${stemX + 6} ${note.y + stemHeight - 12}" fill="#000"/>`;
                    noteElement += `<path d="M${stemX} ${note.y + stemHeight - 6} Q${stemX + 8} ${note.y + stemHeight - 11} ${stemX + 6} ${note.y + stemHeight - 18}" fill="#000"/>`;
                }
            } else { // Notes below middle line - stem up
                const stemX = note.x - 6;
                noteElement += `<line x1="${stemX}" y1="${note.y - 1}" x2="${stemX}" y2="${note.y - stemHeight}" stroke="#000" stroke-width="1"/>`;
                
                // Add flags for eighth and sixteenth notes
                if (note.duration === '8') {
                    noteElement += `<path d="M${stemX} ${note.y - stemHeight} Q${stemX + 8} ${note.y - stemHeight + 5} ${stemX + 6} ${note.y - stemHeight + 12}" fill="#000"/>`;
                } else if (note.duration === '16') {
                    noteElement += `<path d="M${stemX} ${note.y - stemHeight} Q${stemX + 8} ${note.y - stemHeight + 5} ${stemX + 6} ${note.y - stemHeight + 12}" fill="#000"/>`;
                    noteElement += `<path d="M${stemX} ${note.y - stemHeight + 6} Q${stemX + 8} ${note.y - stemHeight + 11} ${stemX + 6} ${note.y - stemHeight + 18}" fill="#000"/>`;
                }
            }
        }
        
        // Accidentals
        if (note.accidental) {
            if (note.accidental === '#') {
                noteElement += `<g transform="translate(${note.x - 15}, ${note.y})">
                    <path d="M-2,-6 L-2,6 M2,-6 L2,6 M-3,-2 L3,-1 M-3,2 L3,1" stroke="#000" stroke-width="0.8" stroke-linecap="round"/>
                </g>`;
            } else if (note.accidental === 'b') {
                noteElement += `<g transform="translate(${note.x - 15}, ${note.y})">
                    <path d="M0,-6 L0,6 M0,-1 Q3,-3 3,0 Q3,3 0,1" stroke="#000" stroke-width="0.8" fill="#000"/>
                </g>`;
            }
        }
        
        return noteElement;
    }

    setupComposerEventListeners() {
        // Note duration selector
        document.getElementById('noteDuration').addEventListener('change', (e) => {
            this.currentNoteDuration = e.target.value;
        });
        
        // Accidental selector
        document.getElementById('accidental').addEventListener('change', (e) => {
            this.currentAccidental = e.target.value;
        });
        
        // Clear composition
        document.getElementById('clearComposition').addEventListener('click', () => {
            this.composerNotes = [];
            this.updateComposerDisplay();
        });
        
        // Play composition (placeholder)
        document.getElementById('playComposition').addEventListener('click', () => {
            this.playComposition();
        });
        
        // Export composition
        document.getElementById('exportComposition').addEventListener('click', () => {
            this.exportComposition();
        });
        
        // Save composition (placeholder)
        document.getElementById('saveComposition').addEventListener('click', () => {
            this.saveComposition();
        });
    }

    updateComposerDisplay() {
        const notesContainer = document.getElementById('notesContainer');
        if (notesContainer) {
            notesContainer.innerHTML = this.renderComposerNotes();
        }
        
        // Update info
        document.getElementById('noteCount').textContent = this.composerNotes.length;
        
        const maxMeasure = Math.max(1, ...this.composerNotes.map(note => note.measure));
        document.getElementById('measureCount').textContent = maxMeasure;
    }

    playComposition() {
        if (this.composerNotes.length === 0) {
            alert('No notes to play! Click on the staff to add some notes first.');
            return;
        }
        
        alert(`🎵 Playing ${this.composerNotes.length} notes...\n\n(Audio playback feature coming soon! For now, you can export as MIDI to hear your composition.)`);
    }

    exportComposition() {
        if (this.composerNotes.length === 0) {
            alert('No notes to export! Add some notes first.');
            return;
        }
        
        const composition = {
            title: 'My Composition',
            notes: this.composerNotes,
            created: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(composition, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = 'composition.json';
        link.click();
        
        alert('Composition exported as JSON! In the full app, you can export as PDF, MIDI, and MusicXML.');
    }

    saveComposition() {
        if (this.composerNotes.length === 0) {
            alert('No notes to save! Add some notes first.');
            return;
        }
        
        const title = prompt('Enter a title for your composition:', 'My Composition');
        if (title) {
            // Save to localStorage for demo purposes
            const composition = {
                title,
                notes: this.composerNotes,
                created: new Date().toISOString()
            };
            
            localStorage.setItem(`composition_${Date.now()}`, JSON.stringify(composition));
            alert(`✅ Composition "${title}" saved locally!\n\nIn the full app, compositions are saved to the cloud with user accounts.`);
        }
    }

    selectLevel(level) {
        this.currentLevel = level;
        this.setupCustomizationForLevel(level);
        document.getElementById('levelSelection').style.display = 'none';
        document.getElementById('customizationPanel').style.display = 'block';
    }

    setupCustomizationForLevel(level) {
        const sharpsCheckbox = document.getElementById('includeSharps');
        const flatsCheckbox = document.getElementById('includeFlats');
        const keySelect = document.getElementById('keySignature');
        const timeSelect = document.getElementById('timeSignature');

        if (level >= 4) {
            sharpsCheckbox.checked = true;
            flatsCheckbox.checked = true;
        } else {
            sharpsCheckbox.checked = false;
            flatsCheckbox.checked = false;
        }

        if (level >= 6) {
            keySelect.value = 'random';
            timeSelect.value = 'random';
        }
    }

    generateSheetMusic() {
        this.collectSettings();
        this.renderMusic();
        document.getElementById('customizationPanel').style.display = 'none';
        document.getElementById('musicDisplay').style.display = 'block';
        this.updateCurrentSettings();
    }

    collectSettings() {
        this.currentSettings = {
            level: this.currentLevel,
            keySignature: document.getElementById('keySignature').value,
            timeSignature: document.getElementById('timeSignature').value,
            includeNaturals: document.getElementById('includeNaturals').checked,
            includeSharps: document.getElementById('includeSharps').checked,
            includeFlats: document.getElementById('includeFlats').checked
        };

        if (this.currentSettings.keySignature === 'random') {
            const keys = ['C', 'G', 'D', 'A', 'E', 'F', 'Bb', 'Eb', 'Ab'];
            this.currentSettings.keySignature = keys[Math.floor(Math.random() * keys.length)];
        }

        if (this.currentSettings.timeSignature === 'random') {
            const times = ['4/4', '3/4', '2/4', '6/8'];
            this.currentSettings.timeSignature = times[Math.floor(Math.random() * times.length)];
        }
    }

    renderMusic() {
        const outputDiv = document.getElementById('vexflowOutput');
        outputDiv.innerHTML = '';

        // Create custom sheet music using SVG
        this.renderCustomSheetMusic();
    }

    renderCustomSheetMusic() {
        const outputDiv = document.getElementById('vexflowOutput');
        
        // Generate longer songs based on level
        const songLength = this.getSongLength();
        const trebleNotes = this.generateExtendedNotes('treble', songLength);
        const bassNotes = this.generateExtendedNotes('bass', songLength);
        
        // Calculate required width for longer songs
        const svgWidth = Math.max(1200, 160 + (songLength * 45));
        
        const svg = `
            <svg width="${svgWidth}" height="500" xmlns="http://www.w3.org/2000/svg" style="background: #fff;">
                <!-- Treble Staff Lines -->
                <g id="treble-staff">
                    ${this.renderStaffLines(50, 60, svgWidth - 100)}
                    
                    <!-- Simple Treble Clef -->
                    <text x="70" y="105" font-family="Times, serif" font-size="48" font-weight="bold" fill="#000">𝄞</text>
                    
                    <!-- Key signature -->
                    ${this.renderKeySignature('treble', 100, 90)}
                    
                    <!-- Time signature -->
                    <text x="140" y="85" font-family="serif" font-size="20" fill="#000">${this.currentSettings.timeSignature.split('/')[0]}</text>
                    <text x="140" y="110" font-family="serif" font-size="20" fill="#000">${this.currentSettings.timeSignature.split('/')[1]}</text>
                    
                    <!-- Notes -->
                    ${this.renderAdvancedNotesOnStaff(trebleNotes, 'treble', 180)}
                    
                    <!-- Measure lines -->
                    ${this.renderMeasureLines(trebleNotes, 180, 45, 135)}
                </g>
                
                <!-- Bass Staff Lines -->
                <g id="bass-staff">
                    ${this.renderStaffLines(50, 220, svgWidth - 100)}
                    
                    <!-- Simple Bass Clef -->
                    <text x="70" y="250" font-family="Times, serif" font-size="32" font-weight="bold" fill="#000">𝄢</text>
                    
                    <!-- Key signature -->
                    ${this.renderKeySignature('bass', 100, 250)}
                    
                    <!-- Time signature -->
                    <text x="140" y="245" font-family="serif" font-size="20" fill="#000">${this.currentSettings.timeSignature.split('/')[0]}</text>
                    <text x="140" y="270" font-family="serif" font-size="20" fill="#000">${this.currentSettings.timeSignature.split('/')[1]}</text>
                    
                    <!-- Notes -->
                    ${this.renderAdvancedNotesOnStaff(bassNotes, 'bass', 180)}
                    
                    <!-- Measure lines -->
                    ${this.renderMeasureLines(bassNotes, 180, 205, 295)}
                </g>
                
                <!-- Dynamic markings -->
                ${this.renderDynamics(trebleNotes, 180)}
                
                <!-- Start and end bar lines -->
                <line x1="50" y1="45" x2="50" y2="135" stroke="#000" stroke-width="3"/>
                <line x1="${svgWidth - 50}" y1="45" x2="${svgWidth - 50}" y2="135" stroke="#000" stroke-width="3"/>
                <line x1="50" y1="205" x2="50" y2="295" stroke="#000" stroke-width="3"/>
                <line x1="${svgWidth - 50}" y1="205" x2="${svgWidth - 50}" y2="295" stroke="#000" stroke-width="3"/>
            </svg>
        `;
        
        outputDiv.innerHTML = svg;
    }

    getSongLength() {
        const level = this.currentLevel;
        const baseLengths = {
            1: 8,   // 2 measures
            2: 12,  // 3 measures  
            3: 16,  // 4 measures
            4: 20,  // 5 measures
            5: 24,  // 6 measures
            6: 28,  // 7 measures
            7: 32,  // 8 measures
            8: 40,  // 10 measures
            9: 48,  // 12 measures
            10: 56, // 14 measures
            11: 64, // 16 measures
            12: 80  // 20 measures - ultimate challenge
        };
        return baseLengths[level] || 16;
    }

    generateExtendedNotes(clef, length) {
        const level = this.currentLevel;
        const notes = [];
        const songId = Date.now() + Math.random();
        
        if (level <= 2) {
            return this.generateExtendedBeginnerMelody(clef, length, songId);
        } else if (level <= 4) {
            return this.generateExtendedIntermediateMelody(clef, length, songId);
        } else if (level <= 6) {
            return this.generateExtendedAdvancedMelody(clef, length, songId);
        } else if (level <= 8) {
            return this.generateProfessionalMelody(clef, length, songId);
        } else if (level <= 10) {
            return this.generateVirtuosoMelody(clef, length, songId);
        } else {
            return this.generateLegendaryMelody(clef, length, songId);
        }
    }

    generateExtendedBeginnerMelody(clef, length, seed) {
        const notes = [];
        const scale = this.getScaleForClef(clef, 1);
        let lastNoteIndex = Math.floor(Math.random() * scale.length);
        
        for (let i = 0; i < length; i++) {
            if (Math.random() < 0.15) { // 15% chance of rest
                notes.push({
                    type: 'rest',
                    duration: Math.random() < 0.7 ? 'q' : '8',
                    position: i
                });
            } else {
                const movement = Math.random() < 0.7 ? 
                    (Math.random() < 0.5 ? -1 : 1) : 
                    (Math.random() < 0.5 ? -2 : 2);
                
                lastNoteIndex = Math.max(0, Math.min(scale.length - 1, lastNoteIndex + movement));
                
                const noteData = {
                    type: 'note',
                    pitch: scale[lastNoteIndex],
                    duration: this.getProgressiveDuration(1, i),
                    accidental: '',
                    articulation: Math.random() < 0.1 ? 'staccato' : '',
                    position: i
                };
                
                notes.push(noteData);
            }
        }
        
        return notes;
    }

    generateExtendedIntermediateMelody(clef, length, seed) {
        const notes = [];
        const scale = this.getScaleForClef(clef, 3);
        const patterns = this.getMelodicPatterns();
        let currentPattern = patterns[Math.floor(Math.random() * patterns.length)];
        let baseNoteIndex = Math.floor(Math.random() * (scale.length - 4));
        
        for (let i = 0; i < length; i++) {
            if (Math.random() < 0.2) { // 20% chance of rest
                notes.push({
                    type: 'rest',
                    duration: this.getRandomRestDuration(3),
                    position: i
                });
            } else {
                const patternIndex = i % currentPattern.length;
                const noteIndex = Math.max(0, Math.min(scale.length - 1, 
                    baseNoteIndex + currentPattern[patternIndex]));
                
                const noteData = {
                    type: 'note',
                    pitch: scale[noteIndex],
                    duration: this.getProgressiveDuration(3, i),
                    accidental: this.generateSmartAccidental(scale[noteIndex], 3),
                    articulation: this.getRandomArticulation(3),
                    dotted: Math.random() < 0.1,
                    position: i
                };
                
                notes.push(noteData);
                
                // Change pattern occasionally for variety
                if (i > 0 && i % 8 === 0) {
                    currentPattern = patterns[Math.floor(Math.random() * patterns.length)];
                    baseNoteIndex += Math.random() < 0.5 ? 2 : -2;
                    baseNoteIndex = Math.max(0, Math.min(scale.length - 4, baseNoteIndex));
                }
            }
        }
        
        return notes;
    }

    generateExtendedAdvancedMelody(clef, length, seed) {
        const notes = [];
        const scale = this.getScaleForClef(clef, 6);
        const sequences = this.getAdvancedSequences();
        let currentSequence = sequences[Math.floor(Math.random() * sequences.length)];
        let currentPosition = Math.floor(Math.random() * (scale.length - 6));
        
        for (let i = 0; i < length; i++) {
            if (Math.random() < 0.25) { // 25% chance of rest on advanced levels
                notes.push({
                    type: 'rest',
                    duration: this.getAdvancedRestDuration(),
                    position: i
                });
            } else {
                const sequenceStep = currentSequence[i % currentSequence.length];
                currentPosition = Math.max(0, Math.min(scale.length - 1, 
                    currentPosition + sequenceStep));
                
                const noteData = {
                    type: 'note',
                    pitch: scale[currentPosition],
                    duration: this.getAdvancedDuration(6, i),
                    accidental: this.generateAdvancedAccidental(scale[currentPosition], 6),
                    articulation: this.getAdvancedArticulation(),
                    dotted: Math.random() < 0.2,
                    tied: Math.random() < 0.1,
                    position: i
                };
                
                notes.push(noteData);
                
                // Advanced: Change sequence more frequently for complexity
                if (i > 0 && i % 6 === 0) {
                    currentSequence = sequences[Math.floor(Math.random() * sequences.length)];
                }
            }
        }
        
        return notes;
    }

    generateProfessionalMelody(clef, length, seed) {
        const notes = [];
        const scale = this.getExtendedScaleForClef(clef, 8);
        const sequences = this.getProfessionalSequences();
        let currentSequence = sequences[Math.floor(Math.random() * sequences.length)];
        let currentPosition = Math.floor(Math.random() * (scale.length - 8));
        
        for (let i = 0; i < length; i++) {
            if (Math.random() < 0.3) { // 30% chance of rest
                notes.push({
                    type: 'rest',
                    duration: this.getProfessionalRestDuration(),
                    position: i
                });
            } else {
                const sequenceStep = currentSequence[i % currentSequence.length];
                currentPosition = Math.max(0, Math.min(scale.length - 1, 
                    currentPosition + sequenceStep));
                
                const noteData = {
                    type: 'note',
                    pitch: scale[currentPosition],
                    duration: this.getProfessionalDuration(i),
                    accidental: this.generateProfessionalAccidental(scale[currentPosition]),
                    articulation: this.getProfessionalArticulation(),
                    dotted: Math.random() < 0.3,
                    tied: Math.random() < 0.15,
                    position: i
                };
                
                notes.push(noteData);
                
                if (i > 0 && i % 4 === 0) {
                    currentSequence = sequences[Math.floor(Math.random() * sequences.length)];
                }
            }
        }
        
        return notes;
    }

    generateVirtuosoMelody(clef, length, seed) {
        const notes = [];
        const scale = this.getExtendedScaleForClef(clef, 10);
        const sequences = this.getVirtuosoSequences();
        let currentSequence = sequences[Math.floor(Math.random() * sequences.length)];
        let currentPosition = Math.floor(Math.random() * (scale.length - 10));
        
        for (let i = 0; i < length; i++) {
            if (Math.random() < 0.35) { // 35% chance of rest
                notes.push({
                    type: 'rest',
                    duration: this.getVirtuosoRestDuration(),
                    position: i
                });
            } else {
                const sequenceStep = currentSequence[i % currentSequence.length];
                currentPosition = Math.max(0, Math.min(scale.length - 1, 
                    currentPosition + sequenceStep));
                
                const noteData = {
                    type: 'note',
                    pitch: scale[currentPosition],
                    duration: this.getVirtuosoDuration(i),
                    accidental: this.generateVirtuosoAccidental(scale[currentPosition]),
                    articulation: this.getVirtuosoArticulation(),
                    dotted: Math.random() < 0.4,
                    tied: Math.random() < 0.2,
                    position: i
                };
                
                notes.push(noteData);
                
                if (i > 0 && i % 3 === 0) {
                    currentSequence = sequences[Math.floor(Math.random() * sequences.length)];
                }
            }
        }
        
        return notes;
    }

    generateLegendaryMelody(clef, length, seed) {
        const notes = [];
        const scale = this.getExtendedScaleForClef(clef, 12);
        const sequences = this.getLegendarySequences();
        let currentSequence = sequences[Math.floor(Math.random() * sequences.length)];
        let currentPosition = Math.floor(Math.random() * (scale.length - 12));
        
        for (let i = 0; i < length; i++) {
            if (Math.random() < 0.4) { // 40% chance of rest
                notes.push({
                    type: 'rest',
                    duration: this.getLegendaryRestDuration(),
                    position: i
                });
            } else {
                const sequenceStep = currentSequence[i % currentSequence.length];
                currentPosition = Math.max(0, Math.min(scale.length - 1, 
                    currentPosition + sequenceStep));
                
                const noteData = {
                    type: 'note',
                    pitch: scale[currentPosition],
                    duration: this.getLegendaryDuration(i),
                    accidental: this.generateLegendaryAccidental(scale[currentPosition]),
                    articulation: this.getLegendaryArticulation(),
                    dotted: Math.random() < 0.5,
                    tied: Math.random() < 0.25,
                    position: i
                };
                
                notes.push(noteData);
                
                // Change sequence frequently for maximum complexity
                if (i > 0 && i % 2 === 0) {
                    currentSequence = sequences[Math.floor(Math.random() * sequences.length)];
                }
            }
        }
        
        return notes;
    }

    generateCustomNotes(clef) {
        // Legacy method for backward compatibility
        return this.generateExtendedNotes(clef, 8);
    }

    generateBeginnerMelody(clef, seed) {
        const notes = [];
        const scale = this.getScaleForClef(clef, 1);
        let lastNoteIndex = Math.floor(Math.random() * scale.length);
        
        for (let i = 0; i < 8; i++) {
            // Create melodic movement (step-wise motion for beginners)
            const movement = Math.random() < 0.6 ? 
                (Math.random() < 0.5 ? -1 : 1) : // Step up or down
                (Math.random() < 0.5 ? -2 : 2);  // Small jump
            
            lastNoteIndex = Math.max(0, Math.min(scale.length - 1, lastNoteIndex + movement));
            
            const noteData = {
                pitch: scale[lastNoteIndex],
                duration: this.getRandomDuration(1, i),
                accidental: ''
            };
            
            notes.push(noteData);
        }
        
        return notes;
    }

    generateIntermediateMelody(clef, seed) {
        const notes = [];
        const scale = this.getScaleForClef(clef, 3);
        const patterns = this.getMelodicPatterns();
        const selectedPattern = patterns[Math.floor(Math.random() * patterns.length)];
        
        let baseNoteIndex = Math.floor(Math.random() * (scale.length - 4));
        
        for (let i = 0; i < 8; i++) {
            const patternIndex = i % selectedPattern.length;
            const noteIndex = Math.max(0, Math.min(scale.length - 1, 
                baseNoteIndex + selectedPattern[patternIndex]));
            
            const noteData = {
                pitch: scale[noteIndex],
                duration: this.getRandomDuration(3, i),
                accidental: this.generateSmartAccidental(scale[noteIndex], 3)
            };
            
            notes.push(noteData);
            
            // Occasionally change the base note for variety
            if (Math.random() < 0.3) {
                baseNoteIndex += Math.random() < 0.5 ? 1 : -1;
                baseNoteIndex = Math.max(0, Math.min(scale.length - 4, baseNoteIndex));
            }
        }
        
        return notes;
    }

    generateAdvancedMelody(clef, seed) {
        const notes = [];
        const scale = this.getScaleForClef(clef, 6);
        const sequences = this.getAdvancedSequences();
        const selectedSequence = sequences[Math.floor(Math.random() * sequences.length)];
        
        let currentPosition = Math.floor(Math.random() * (scale.length - 6));
        
        for (let i = 0; i < 8; i++) {
            const sequenceStep = selectedSequence[i % selectedSequence.length];
            currentPosition = Math.max(0, Math.min(scale.length - 1, 
                currentPosition + sequenceStep));
            
            const noteData = {
                pitch: scale[currentPosition],
                duration: this.getAdvancedDuration(6, i),
                accidental: this.generateAdvancedAccidental(scale[currentPosition], 6)
            };
            
            notes.push(noteData);
        }
        
        return notes;
    }

    renderNotesOnStaff(notes, clef, startX) {
        let notesHtml = '';
        const noteSpacing = 70;
        
        notes.forEach((note, index) => {
            const x = startX + (index * noteSpacing);
            const y = this.getNoteY(note.pitch, clef);
            
            // Note head - all notes face the same direction with identical size
            notesHtml += `<ellipse cx="${x}" cy="${y}" rx="7" ry="5" fill="#000" transform="rotate(-20 ${x} ${y})"/>`;
            
            // Note stem
            if (y <= (clef === 'treble' ? 90 : 230)) {
                // Stem down
                notesHtml += `<line x1="${x + 6}" y1="${y}" x2="${x + 6}" y2="${y + 25}" stroke="#000" stroke-width="1"/>`;
            } else {
                // Stem up
                notesHtml += `<line x1="${x - 6}" y1="${y}" x2="${x - 6}" y2="${y - 25}" stroke="#000" stroke-width="1"/>`;
            }
            
            // Ledger lines if needed
            const ledgerLines = this.getLedgerLines(note.pitch, clef, x);
            notesHtml += ledgerLines;
            
            // Accidentals
            if (note.accidental) {
                if (note.accidental === '#') {
                    notesHtml += `<g transform="translate(${x - 15}, ${y + 3})">
                        <path d="M-2,-6 L-2,6 M2,-6 L2,6 M-3,-2 L3,-1 M-3,2 L3,1" stroke="#000" stroke-width="0.8" stroke-linecap="round"/>
                    </g>`;
                } else if (note.accidental === 'b') {
                    notesHtml += `<g transform="translate(${x - 15}, ${y + 3})">
                        <path d="M0,-6 L0,6 M0,-1 Q3,-3 3,0 Q3,3 0,1" stroke="#000" stroke-width="0.8" fill="#000"/>
                    </g>`;
                }
            }
        });
        
        return notesHtml;
    }

    getNoteY(pitch, clef) {
        // Updated positions for proper 12px spacing
        const notePositions = {
            treble: {
                'c/6': 36, 'd/6': 42, 'e/5': 48, 'f/5': 54, 'g/5': 60, 'a/5': 66, 'b/5': 72, 'c/5': 78, 'd/5': 84, 'e/4': 90, 'f/4': 96, 'g/4': 102, 'a/4': 108, 'b/4': 114, 'c/4': 120, 'd/4': 126, 'e/3': 132, 'f/3': 138, 'g/3': 144, 'a/3': 150, 'b/3': 156, 'c/3': 162, 'd/3': 168
            },
            bass: {
                'a/3': 196, 'g/3': 202, 'f/3': 208, 'e/3': 214, 'd/3': 220, 'c/3': 226, 'b/2': 232, 'a/2': 238, 'g/2': 244, 'f/2': 250, 'e/2': 256, 'd/2': 262, 'c/2': 268, 'b/1': 274, 'a/1': 280, 'g/1': 286, 'f/1': 292, 'e/1': 298, 'd/1': 304, 'c/1': 310, 'b/0': 316, 'a/0': 322, 'g/0': 328
            }
        };
        
        return notePositions[clef][pitch] || (clef === 'treble' ? 102 : 244);
    }

    getLedgerLines(pitch, clef, x) {
        let lines = '';
        
        if (clef === 'treble') {
            if (pitch === 'c/5') {
                lines += `<line x1="${x - 10}" y1="45" x2="${x + 10}" y2="45" stroke="#000" stroke-width="1"/>`;
            }
            if (pitch === 'a/3' || pitch === 'g/3') {
                lines += `<line x1="${x - 10}" y1="135" x2="${x + 10}" y2="135" stroke="#000" stroke-width="1"/>`;
            }
        } else {
            if (pitch === 'a/3') {
                lines += `<line x1="${x - 10}" y1="185" x2="${x + 10}" y2="185" stroke="#000" stroke-width="1"/>`;
            }
            if (pitch === 'c/2') {
                lines += `<line x1="${x - 10}" y1="275" x2="${x + 10}" y2="275" stroke="#000" stroke-width="1"/>`;
            }
        }
        
        return lines;
    }



    calculateNoteCount() {
        return 8; // Simple fixed count for now
    }

    generateRandomNoteData(clef, level) {
        const pitch = this.generateRandomPitch(clef, level);
        const duration = this.generateRandomDuration(level);
        const accidental = this.generateAccidental(level);
        
        return {
            pitch: pitch,
            duration: duration,
            accidental: accidental
        };
    }


    generateRandomPitch(clef, level) {
        let pitches;
        
        if (clef === 'treble') {
            if (level <= 2) {
                pitches = ['C/4', 'D/4', 'E/4', 'F/4', 'G/4', 'A/4', 'B/4', 'C/5'];
            } else if (level <= 4) {
                pitches = ['A/3', 'B/3', 'C/4', 'D/4', 'E/4', 'F/4', 'G/4', 'A/4', 'B/4', 'C/5', 'D/5', 'E/5'];
            } else {
                pitches = ['G/3', 'A/3', 'B/3', 'C/4', 'D/4', 'E/4', 'F/4', 'G/4', 'A/4', 'B/4', 'C/5', 'D/5', 'E/5', 'F/5', 'G/5'];
            }
        } else {
            if (level <= 2) {
                pitches = ['C/2', 'D/2', 'E/2', 'F/2', 'G/2', 'A/2', 'B/2', 'C/3'];
            } else if (level <= 4) {
                pitches = ['A/1', 'B/1', 'C/2', 'D/2', 'E/2', 'F/2', 'G/2', 'A/2', 'B/2', 'C/3', 'D/3', 'E/3'];
            } else {
                pitches = ['F/1', 'G/1', 'A/1', 'B/1', 'C/2', 'D/2', 'E/2', 'F/2', 'G/2', 'A/2', 'B/2', 'C/3', 'D/3', 'E/3', 'F/3'];
            }
        }
        
        return pitches[Math.floor(Math.random() * pitches.length)];
    }

    generateRandomDuration(level) {
        let durations;
        
        if (level <= 1) {
            durations = ['w', 'h'];
        } else if (level <= 2) {
            durations = ['h', 'q'];
        } else if (level <= 3) {
            durations = ['q', '8'];
        } else if (level <= 5) {
            durations = ['q', '8', 'h'];
        } else if (level <= 6) {
            durations = ['16', '8', 'q'];
        } else {
            durations = ['16', '8', 'q', 'h'];
        }
        
        return durations[Math.floor(Math.random() * durations.length)];
    }

    generateAccidental(level) {
        if (level < 4) return '';
        
        const { includeSharps, includeFlats, includeNaturals } = this.currentSettings;
        const accidentals = [];
        
        if (includeNaturals) accidentals.push('');
        if (includeSharps && Math.random() < 0.3) accidentals.push('#');
        if (includeFlats && Math.random() < 0.3) accidentals.push('b');
        
        if (accidentals.length === 0) return '';
        
        const randomAccidental = accidentals[Math.floor(Math.random() * accidentals.length)];
        return randomAccidental === '' ? '' : randomAccidental;
    }

    updateCurrentSettings() {
        const settingsText = `Level ${this.currentSettings.level} | Key: ${this.currentSettings.keySignature} | Time: ${this.currentSettings.timeSignature}`;
        document.getElementById('currentSettings').textContent = settingsText;
    }

    getBeatsPerMeasure() {
        const timeSignature = this.currentSettings.timeSignature;
        const beats = {
            '4/4': 4,
            '3/4': 3,
            '2/4': 2,
            '6/8': 6
        };
        return beats[timeSignature] || 4;
    }

    getBeatValue() {
        const timeSignature = this.currentSettings.timeSignature;
        if (timeSignature === '6/8') {
            return 8;
        }
        return 4;
    }


    renderFallbackMusic() {
        const outputDiv = document.getElementById('vexflowOutput');
        outputDiv.innerHTML = `
            <div style="text-align: center; padding: 50px; background: #f9f9f9; border-radius: 10px; margin: 20px 0;">
                <h3 style="color: #333; margin-bottom: 20px;">🎼 Music Sheet (Level ${this.currentLevel})</h3>
                <div style="font-family: monospace; font-size: 18px; line-height: 2; color: #666;">
                    <div style="margin-bottom: 15px;">
                        <strong>Treble Clef:</strong> ${this.generateTextNotes('treble')}
                    </div>
                    <div>
                        <strong>Bass Clef:</strong> ${this.generateTextNotes('bass')}
                    </div>
                </div>
                <p style="margin-top: 20px; color: #888; font-size: 14px;">
                    Time Signature: ${this.currentSettings.timeSignature} | Key: ${this.currentSettings.keySignature}
                </p>
            </div>
        `;
    }

    generateTextNotes(clef) {
        const notes = [];
        for (let i = 0; i < 4; i++) {
            const noteData = this.generateRandomNoteData(clef, this.currentLevel);
            notes.push(`${noteData.pitch.toUpperCase()}${noteData.accidental}`);
        }
        return notes.join(' - ');
    }

    getScaleForClef(clef, level) {
        if (clef === 'treble') {
            if (level <= 2) {
                return ['c/4', 'd/4', 'e/4', 'f/4', 'g/4', 'a/4', 'b/4', 'c/5'];
            } else if (level <= 4) {
                return ['a/3', 'b/3', 'c/4', 'd/4', 'e/4', 'f/4', 'g/4', 'a/4', 'b/4', 'c/5', 'd/5', 'e/5'];
            } else {
                return ['g/3', 'a/3', 'b/3', 'c/4', 'd/4', 'e/4', 'f/4', 'g/4', 'a/4', 'b/4', 'c/5', 'd/5', 'e/5', 'f/5', 'g/5'];
            }
        } else {
            if (level <= 2) {
                return ['c/2', 'd/2', 'e/2', 'f/2', 'g/2', 'a/2', 'b/2', 'c/3'];
            } else if (level <= 4) {
                return ['a/1', 'b/1', 'c/2', 'd/2', 'e/2', 'f/2', 'g/2', 'a/2', 'b/2', 'c/3', 'd/3', 'e/3'];
            } else {
                return ['f/1', 'g/1', 'a/1', 'b/1', 'c/2', 'd/2', 'e/2', 'f/2', 'g/2', 'a/2', 'b/2', 'c/3', 'd/3', 'e/3', 'f/3'];
            }
        }
    }

    getMelodicPatterns() {
        return [
            [0, 1, 2, 1],           // Scale up and back
            [0, -1, -2, -1],        // Scale down and back
            [0, 2, 1, 3],           // Arpeggiated pattern
            [0, 1, -1, 2],          // Wave pattern
            [0, 3, 2, 1],           // Descending sequence
            [0, -2, 1, -1],         // Interval jumps
            [0, 1, 3, 2],           // Mixed intervals
            [0, 2, -1, 1],          // Complex movement
        ];
    }

    getAdvancedSequences() {
        return [
            [0, 2, 4, 3, 1, 5, 2, 6],      // Complex ascending
            [0, -3, 2, -1, 4, -2, 3, 1],   // Advanced intervals
            [0, 4, -2, 3, -1, 5, -3, 2],   // Large jumps
            [0, 1, -2, 3, -4, 5, -1, 2],   // Chromatic elements
            [0, 3, 1, 4, 2, 5, 0, 6],      // Arpeggiated complex
            [0, -1, 3, -2, 4, -3, 5, 1],   // Alternating pattern
        ];
    }

    getRandomDuration(level, position) {
        const rhythmPatterns = {
            1: ['q', 'h', 'q', 'q'],        // Simple quarters and halves
            2: ['q', 'q', 'h', 'q'],        // Basic rhythm
            3: ['q', '8', '8', 'q'],        // Add eighth notes
            4: ['8', '8', 'q', '8'],        // More eighths
            5: ['16', '16', '8', 'q'],      // Add sixteenths
            6: ['16', '8', '16', 'q'],      // Complex rhythms
        };
        
        const pattern = rhythmPatterns[Math.min(level, 6)];
        return pattern[position % pattern.length];
    }

    getAdvancedDuration(level, position) {
        const complexPatterns = [
            ['16', '16', '8', 'q', '16', '8', '16', 'q'],
            ['8', '16', '16', '8', 'q', '16', '16', '8'],
            ['q', '8', '16', '16', '8', 'q', '16', '8'],
            ['16', 'q', '16', '8', '16', '16', 'q', '8'],
        ];
        
        const selectedPattern = complexPatterns[Math.floor(Math.random() * complexPatterns.length)];
        return selectedPattern[position % selectedPattern.length];
    }

    generateSmartAccidental(pitch, level) {
        if (level < 4) return '';
        
        const { includeSharps, includeFlats } = this.currentSettings;
        
        // 20% chance of accidental on intermediate levels
        if (Math.random() < 0.2) {
            const accidentals = [];
            if (includeSharps) accidentals.push('#');
            if (includeFlats) accidentals.push('b');
            
            if (accidentals.length > 0) {
                return accidentals[Math.floor(Math.random() * accidentals.length)];
            }
        }
        
        return '';
    }

    generateAdvancedAccidental(pitch, level) {
        if (level < 6) return this.generateSmartAccidental(pitch, level);
        
        const { includeSharps, includeFlats } = this.currentSettings;
        
        // 40% chance of accidental on advanced levels
        if (Math.random() < 0.4) {
            const accidentals = [];
            if (includeSharps) accidentals.push('#');
            if (includeFlats) accidentals.push('b');
            
            if (accidentals.length > 0) {
                return accidentals[Math.floor(Math.random() * accidentals.length)];
            }
        }
        
        return '';
    }

    renderStaffLines(x, y, width) {
        let lines = '';
        const lineSpacing = 12; // Standard staff line spacing
        for (let i = 0; i < 5; i++) {
            lines += `<line x1="${x}" y1="${y + (i * lineSpacing)}" x2="${x + width}" y2="${y + (i * lineSpacing)}" stroke="#000" stroke-width="0.8"/>`;
        }
        return lines;
    }

    renderKeySignature(clef, x, y) {
        const key = this.currentSettings.keySignature;
        const keySignatures = {
            'G': { sharps: ['f'], flats: [] },
            'D': { sharps: ['f', 'c'], flats: [] },
            'A': { sharps: ['f', 'c', 'g'], flats: [] },
            'E': { sharps: ['f', 'c', 'g', 'd'], flats: [] },
            'F': { sharps: [], flats: ['b'] },
            'Bb': { sharps: [], flats: ['b', 'e'] },
            'Eb': { sharps: [], flats: ['b', 'e', 'a'] },
            'Ab': { sharps: [], flats: ['b', 'e', 'a', 'd'] },
        };

        if (key === 'C') return '';

        const signature = keySignatures[key];
        let markup = '';
        let offset = 0;

        if (signature) {
            if (signature.sharps.length > 0) {
                signature.sharps.forEach((note, index) => {
                    markup += `<g transform="translate(${x + offset}, ${y})">
                        <path d="M-2,-8 L-2,8 M2,-8 L2,8 M-4,-3 L4,-1 M-4,3 L4,1" stroke="#000" stroke-width="1" stroke-linecap="round"/>
                    </g>`;
                    offset += 12;
                });
            }
            if (signature.flats.length > 0) {
                signature.flats.forEach((note, index) => {
                    markup += `<g transform="translate(${x + offset}, ${y})">
                        <path d="M0,-8 L0,8 M0,-2 Q4,-4 4,0 Q4,4 0,2" stroke="#000" stroke-width="1" fill="#000"/>
                    </g>`;
                    offset += 12;
                });
            }
        }

        return markup;
    }

    renderAdvancedNotesOnStaff(notes, clef, startX) {
        let notesHtml = '';
        const beatsPerMeasure = this.getBeatsPerMeasure();
        const measureWidth = 280; // Fixed measure width
        const beatWidth = measureWidth / beatsPerMeasure; // Width per beat
        let totalBeats = 0; // Use total beats instead of resetting
        
        for (let i = 0; i < notes.length; i++) {
            const note = notes[i];
            const beatValue = this.getDurationBeats(note.duration || 'q');
            
            // Calculate position based on total accumulated beats
            const noteX = startX + (totalBeats * beatWidth);
            
            if (note.type === 'rest') {
                notesHtml += this.renderRest(note, noteX, clef);
            } else {
                notesHtml += this.renderAdvancedNote(note, noteX, clef, i, notes);
            }
            
            // Add the duration to total beats (don't reset)
            totalBeats += beatValue;
        }
        
        return notesHtml;
    }

    renderAdvancedNote(note, x, clef, index, allNotes) {
        let html = '';
        const y = this.getNoteY(note.pitch, clef);
        
        // Authentic note head - ALL notes face exactly the same direction
        const standardRotation = "rotate(-20 ${x} ${y})";
        if (note.duration === 'w') {
            // Whole note - hollow oval with thick border, same size as others
            html += `<ellipse cx="${x}" cy="${y}" rx="7" ry="5" fill="white" stroke="#000" stroke-width="1.5" transform="${standardRotation}"/>`;
        } else if (note.duration === 'h') {
            // Half note - hollow oval with stem, same size as others
            html += `<ellipse cx="${x}" cy="${y}" rx="7" ry="5" fill="white" stroke="#000" stroke-width="1.2" transform="${standardRotation}"/>`;
        } else {
            // Quarter note and shorter - filled oval, same size as others
            html += `<ellipse cx="${x}" cy="${y}" rx="7" ry="5" fill="#000" transform="${standardRotation}"/>`;
        }
        
        // Dotted note - positioned properly to the right
        if (note.dotted) {
            html += `<circle cx="${x + 18}" cy="${y}" r="1.5" fill="#000"/>`;
        }
        
        // Professional note stem positioning
        if (note.duration !== 'w') {
            const stemHeight = 35; // Standard stem height
            const middleLine = clef === 'treble' ? 102 : 244; // Updated for new spacing
            
            if (y <= middleLine) {
                // Stem down (for notes above middle line) - right side of note
                const stemX = x + 6;
                html += `<line x1="${stemX}" y1="${y + 1}" x2="${stemX}" y2="${y + stemHeight}" stroke="#000" stroke-width="1"/>`;
                
                // Flags for eighth notes and shorter
                if (['8', '16', '32'].includes(note.duration)) {
                    html += this.renderFlag(stemX, y + stemHeight, note.duration, 'down');
                }
            } else {
                // Stem up (for notes below middle line) - left side of note
                const stemX = x - 6;
                html += `<line x1="${stemX}" y1="${y - 1}" x2="${stemX}" y2="${y - stemHeight}" stroke="#000" stroke-width="1"/>`;
                
                // Flags for eighth notes and shorter
                if (['8', '16', '32'].includes(note.duration)) {
                    html += this.renderFlag(stemX, y - stemHeight, note.duration, 'up');
                }
            }
        }
        
        // Beaming for consecutive eighth notes
        html += this.renderBeaming(note, x, y, index, allNotes, clef);
        
        // Ledger lines if needed
        html += this.getLedgerLines(note.pitch, clef, x);
        
        // Professional accidental symbols
        if (note.accidental) {
            if (note.accidental === '#') {
                // Authentic sharp symbol - properly proportioned
                html += `<g transform="translate(${x - 15}, ${y})">
                    <line x1="1" y1="-10" x2="1" y2="10" stroke="#000" stroke-width="1"/>
                    <line x1="4" y1="-8" x2="4" y2="12" stroke="#000" stroke-width="1"/>
                    <line x1="-1" y1="-3" x2="6" y2="-5" stroke="#000" stroke-width="1.5"/>
                    <line x1="-1" y1="3" x2="6" y2="1" stroke="#000" stroke-width="1.5"/>
                </g>`;
            } else if (note.accidental === 'b') {
                // Authentic flat symbol - curved and elegant
                html += `<g transform="translate(${x - 12}, ${y})">
                    <line x1="0" y1="-15" x2="0" y2="8" stroke="#000" stroke-width="1.2"/>
                    <path d="M0,-2 Q6,-4 8,0 Q8,6 4,8 Q0,6 0,2 Z" fill="#000"/>
                </g>`;
            } else if (note.accidental === 'n') {
                // Natural symbol - two vertical lines with slanted connectors
                html += `<g transform="translate(${x - 10}, ${y})">
                    <line x1="0" y1="-8" x2="0" y2="6" stroke="#000" stroke-width="1"/>
                    <line x1="4" y1="-6" x2="4" y2="8" stroke="#000" stroke-width="1"/>
                    <line x1="0" y1="-2" x2="4" y2="-4" stroke="#000" stroke-width="1.5"/>
                    <line x1="0" y1="2" x2="4" y2="0" stroke="#000" stroke-width="1.5"/>
                </g>`;
            }
        }
        
        // Articulation marks
        if (note.articulation) {
            html += this.renderArticulation(note.articulation, x, y);
        }
        
        // Ties
        if (note.tied && index < allNotes.length - 1) {
            html += this.renderTie(x, y, x + this.getNoteSpacing(note.duration), y);
        }
        
        return html;
    }

    renderRest(rest, x, clef) {
        const baseY = clef === 'treble' ? 102 : 244; // Updated for new spacing
        let html = '';
        
        switch (rest.duration) {
            case 'w': // Whole rest - thick rectangle hanging from 4th line
                html = `<rect x="${x - 6}" y="${baseY - 6}" width="12" height="6" fill="#000" rx="1"/>`;
                break;
            case 'h': // Half rest - thick rectangle sitting on 3rd line  
                html = `<rect x="${x - 6}" y="${baseY}" width="12" height="6" fill="#000" rx="1"/>`;
                break;
            case 'q': // Quarter rest - simple SVG shape
                html = `<g transform="translate(${x}, ${baseY})">
                    <path d="M-3,-12 Q0,-15 3,-12 Q6,-9 3,-6 Q0,-3 -3,-6 Q-6,-9 -3,-12 M-1,-3 Q2,-6 5,-3 Q8,0 5,3 Q2,6 -1,3 Q-4,0 -1,-3 M1,6 Q4,3 7,6 Q10,9 7,12 Q4,15 1,12 Q-2,9 1,6" fill="#000"/>
                </g>`;
                break;
            case '8': // Eighth rest - simple flag shape
                html = `<g transform="translate(${x}, ${baseY})">
                    <circle cx="0" cy="0" r="3" fill="#000"/>
                    <path d="M3,-3 Q8,-5 10,0 Q8,5 3,3" fill="#000"/>
                </g>`;
                break;
            case '16': // Sixteenth rest - double flag
                html = `<g transform="translate(${x}, ${baseY})">
                    <circle cx="0" cy="-3" r="2.5" fill="#000"/>
                    <circle cx="0" cy="3" r="2.5" fill="#000"/>
                    <path d="M2.5,-6 Q7,-8 9,-3 Q7,2 2.5,0" fill="#000"/>
                    <path d="M2.5,0 Q7,-2 9,3 Q7,8 2.5,6" fill="#000"/>
                </g>`;
                break;
            case '32': // Thirty-second rest - triple flag
                html = `<g transform="translate(${x}, ${baseY})">
                    <circle cx="0" cy="-6" r="2" fill="#000"/>
                    <circle cx="0" cy="0" r="2" fill="#000"/>
                    <circle cx="0" cy="6" r="2" fill="#000"/>
                    <path d="M2,-9 Q6,-11 8,-6 Q6,-1 2,-3" fill="#000"/>
                    <path d="M2,-3 Q6,-5 8,0 Q6,5 2,3" fill="#000"/>
                    <path d="M2,3 Q6,1 8,6 Q6,11 2,9" fill="#000"/>
                </g>`;
                break;
            default:
                html = `<path d="M${x-1} ${baseY-18} Q${x+2} ${baseY-16} ${x+1} ${baseY-12} Q${x-1} ${baseY-8} ${x+3} ${baseY-6} Q${x+6} ${baseY-4} ${x+4} ${baseY} Q${x+2} ${baseY+4} ${x+5} ${baseY+6} Q${x+8} ${baseY+8} ${x+6} ${baseY+12} Q${x+4} ${baseY+16} ${x+2} ${baseY+18}" stroke="#000" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
        }
        
        return html;
    }

    renderFlag(x, y, duration, direction) {
        const flagCount = duration === '8' ? 1 : duration === '16' ? 2 : 3;
        let html = '';
        
        for (let i = 0; i < flagCount; i++) {
            if (direction === 'down') {
                // Authentic downward flag - curves to the right and down
                const flagY = y - (i * 6);
                const flagPath = `M ${x} ${flagY} Q ${x + 12} ${flagY - 2} ${x + 14} ${flagY + 8} Q ${x + 12} ${flagY + 12} ${x + 6} ${flagY + 10} Q ${x + 2} ${flagY + 8} ${x} ${flagY + 2}`;
                html += `<path d="${flagPath}" fill="#000"/>`;
            } else {
                // Authentic upward flag - curves to the right and up
                const flagY = y + (i * 6);
                const flagPath = `M ${x} ${flagY} Q ${x - 12} ${flagY + 2} ${x - 14} ${flagY - 8} Q ${x - 12} ${flagY - 12} ${x - 6} ${flagY - 10} Q ${x - 2} ${flagY - 8} ${x} ${flagY - 2}`;
                html += `<path d="${flagPath}" fill="#000"/>`;
            }
        }
        
        return html;
    }

    renderBeaming(note, x, y, index, allNotes, clef) {
        // Improved beaming for consecutive eighth notes
        if (note.duration === '8' && index < allNotes.length - 1) {
            const nextNote = allNotes[index + 1];
            if (nextNote && nextNote.duration === '8' && nextNote.type === 'note') {
                const nextX = x + this.getNoteSpacing(note.duration);
                const nextY = this.getNoteY(nextNote.pitch, clef);
                const middleLine = clef === 'treble' ? 90 : 245;
                
                // Determine beam direction based on average note position
                const avgY = (y + nextY) / 2;
                const beamOffset = avgY <= middleLine ? 25 : -25; // Below notes for high notes, above for low notes
                
                const beam1Y = y + beamOffset;
                const beam2Y = nextY + beamOffset;
                
                return `<line x1="${x}" y1="${beam1Y}" x2="${nextX}" y2="${beam2Y}" stroke="#000" stroke-width="3"/>`;
            }
        }
        return '';
    }

    renderArticulation(articulation, x, y) {
        switch (articulation) {
            case 'staccato':
                return `<circle cx="${x}" cy="${y + 12}" r="1" fill="#000"/>`;
            case 'accent':
                return `<path d="M${x-4} ${y-10} L${x} ${y-6} L${x+4} ${y-10}" stroke="#000" stroke-width="1.5" fill="none"/>`;
            case 'tenuto':
                return `<line x1="${x - 6}" y1="${y + 12}" x2="${x + 6}" y2="${y + 12}" stroke="#000" stroke-width="1.5"/>`;
            default:
                return '';
        }
    }

    renderTie(x1, y1, x2, y2) {
        const midX = (x1 + x2) / 2;
        const midY = Math.min(y1, y2) - 8;
        return `<path d="M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}" stroke="#000" stroke-width="1" fill="none"/>`;
    }

    renderMeasureLines(notes, startX, topY, bottomY) {
        let html = '';
        const beatsPerMeasure = this.getBeatsPerMeasure();
        const measureWidth = 280; // Same as in renderAdvancedNotesOnStaff
        let beatsInMeasure = 0;
        let measureCount = 0;
        
        // Calculate total beats needed
        let totalBeats = 0;
        for (const note of notes) {
            totalBeats += this.getDurationBeats(note.duration || 'q');
        }
        
        // Draw measure lines at exact beat positions
        let currentBeat = 0;
        for (const note of notes) {
            const beatValue = this.getDurationBeats(note.duration || 'q');
            currentBeat += beatValue;
            
            // Draw measure line when we complete a measure
            if (currentBeat >= beatsPerMeasure * (measureCount + 1)) {
                const measureX = startX + (measureCount + 1) * measureWidth;
                html += `<line x1="${measureX}" y1="${topY}" x2="${measureX}" y2="${bottomY}" stroke="#000" stroke-width="1"/>`;
                measureCount++;
            }
        }
        
        return html;
    }

    renderDynamics(notes, startX) {
        const dynamics = ['p', 'mp', 'mf', 'f', 'ff'];
        let html = '';
        
        // Add dynamics every 8-12 notes
        for (let i = 0; i < notes.length; i += Math.floor(Math.random() * 5) + 8) {
            if (this.currentLevel >= 4) {
                const dynamic = dynamics[Math.floor(Math.random() * dynamics.length)];
                const x = startX + (i * 45);
                html += `<text x="${x}" y="350" font-family="serif" font-size="14" font-style="italic" fill="#000">${dynamic}</text>`;
            }
        }
        
        return html;
    }

    getNoteSpacing(duration) {
        const spacings = {
            'w': 180,
            'h': 90,
            'q': 45,
            '8': 30,
            '16': 20,
            '32': 15
        };
        return spacings[duration] || 45;
    }

    getDurationBeats(duration) {
        const beats = {
            'w': 4,
            'h': 2,
            'q': 1,
            '8': 0.5,
            '16': 0.25,
            '32': 0.125
        };
        return beats[duration] || 1;
    }

    getProgressiveDuration(level, position) {
        const patterns = {
            1: ['q', 'h', 'q', 'h'],
            2: ['q', 'q', 'h', 'q'],
            3: ['q', '8', '8', 'q'],
            4: ['8', '8', 'q', '8', '8'],
            5: ['16', '8', 'q', '16', '8'],
            6: ['16', '16', '8', 'q', '16'],
            7: ['32', '16', '8', 'q', '16', '8'],
            8: ['32', '16', '32', '8', 'q', '16']
        };
        
        const pattern = patterns[Math.min(level, 8)];
        return pattern[position % pattern.length];
    }

    getRandomRestDuration(level) {
        const restDurations = level <= 2 ? ['q', 'h'] : 
                            level <= 4 ? ['q', '8', 'h'] :
                            ['q', '8', '16', 'h'];
        return restDurations[Math.floor(Math.random() * restDurations.length)];
    }

    getAdvancedRestDuration() {
        const durations = ['32', '16', '8', 'q', 'h'];
        return durations[Math.floor(Math.random() * durations.length)];
    }

    getRandomArticulation(level) {
        if (level < 3) return '';
        const articulations = ['', '', '', 'staccato', 'accent', 'tenuto']; // More empty strings for lower probability
        return articulations[Math.floor(Math.random() * articulations.length)];
    }

    getAdvancedArticulation() {
        const articulations = ['', '', 'staccato', 'accent', 'tenuto', 'staccato', 'accent'];
        return articulations[Math.floor(Math.random() * articulations.length)];
    }

    // Extended scales for higher levels
    getExtendedScaleForClef(clef, level) {
        if (clef === 'treble') {
            if (level <= 8) {
                return ['f/3', 'g/3', 'a/3', 'b/3', 'c/4', 'd/4', 'e/4', 'f/4', 'g/4', 'a/4', 'b/4', 'c/5', 'd/5', 'e/5', 'f/5', 'g/5', 'a/5'];
            } else if (level <= 10) {
                return ['d/3', 'e/3', 'f/3', 'g/3', 'a/3', 'b/3', 'c/4', 'd/4', 'e/4', 'f/4', 'g/4', 'a/4', 'b/4', 'c/5', 'd/5', 'e/5', 'f/5', 'g/5', 'a/5', 'b/5', 'c/6'];
            } else {
                return ['c/3', 'd/3', 'e/3', 'f/3', 'g/3', 'a/3', 'b/3', 'c/4', 'd/4', 'e/4', 'f/4', 'g/4', 'a/4', 'b/4', 'c/5', 'd/5', 'e/5', 'f/5', 'g/5', 'a/5', 'b/5', 'c/6', 'd/6'];
            }
        } else {
            if (level <= 8) {
                return ['c/1', 'd/1', 'e/1', 'f/1', 'g/1', 'a/1', 'b/1', 'c/2', 'd/2', 'e/2', 'f/2', 'g/2', 'a/2', 'b/2', 'c/3', 'd/3', 'e/3', 'f/3', 'g/3'];
            } else if (level <= 10) {
                return ['a/0', 'b/0', 'c/1', 'd/1', 'e/1', 'f/1', 'g/1', 'a/1', 'b/1', 'c/2', 'd/2', 'e/2', 'f/2', 'g/2', 'a/2', 'b/2', 'c/3', 'd/3', 'e/3', 'f/3', 'g/3', 'a/3'];
            } else {
                return ['g/0', 'a/0', 'b/0', 'c/1', 'd/1', 'e/1', 'f/1', 'g/1', 'a/1', 'b/1', 'c/2', 'd/2', 'e/2', 'f/2', 'g/2', 'a/2', 'b/2', 'c/3', 'd/3', 'e/3', 'f/3', 'g/3', 'a/3', 'b/3'];
            }
        }
    }

    // Professional level sequences
    getProfessionalSequences() {
        return [
            [0, 3, -2, 5, -1, 4, -3, 6, -2, 1],      // Complex leaps
            [0, -4, 2, -3, 5, -1, 3, -5, 4, -2],     // Irregular intervals
            [0, 6, -3, 4, -2, 7, -4, 1, -1, 5],      // Wide range motion
            [0, 2, -5, 3, -1, 6, -4, 2, -3, 4],      // Mixed patterns
            [0, -2, 4, -6, 3, -1, 5, -3, 2, -4],     // Chromatic elements
        ];
    }

    // Virtuoso level sequences
    getVirtuosoSequences() {
        return [
            [0, 7, -5, 6, -3, 8, -4, 5, -6, 3, -2, 7],        // Extreme intervals
            [0, -6, 4, -7, 2, -5, 8, -3, 6, -4, 1, -8],       // Complex chromatic
            [0, 5, -8, 3, -2, 9, -6, 4, -1, 7, -5, 2],        // Advanced patterns
            [0, -3, 6, -9, 4, -1, 7, -5, 2, -8, 6, -2],       // Professional leaps
            [0, 8, -6, 4, -7, 2, -3, 9, -5, 1, -4, 6],        // Virtuoso complexity
        ];
    }

    // Legendary level sequences
    getLegendarySequences() {
        return [
            [0, 9, -7, 6, -8, 4, -5, 10, -6, 3, -9, 7, -2, 8],     // Ultimate complexity
            [0, -8, 5, -6, 9, -4, 7, -10, 3, -5, 8, -2, 6, -9],    // Extreme range
            [0, 6, -10, 4, -7, 9, -3, 5, -8, 2, -6, 10, -4, 7],    // Master level
            [0, -5, 8, -9, 3, -6, 10, -4, 7, -8, 1, -7, 9, -3],    // Legendary patterns
            [0, 10, -6, 5, -9, 7, -2, 8, -10, 4, -3, 9, -7, 6],    // Ultimate challenge
        ];
    }

    // Professional duration patterns
    getProfessionalDuration(position) {
        const patterns = ['32', '16', '16', '8', 'q', '16', '8', '16', '32', 'q'];
        return patterns[position % patterns.length];
    }

    getProfessionalRestDuration() {
        return ['32', '16', '8', 'q'][Math.floor(Math.random() * 4)];
    }

    getProfessionalArticulation() {
        const articulations = ['', 'staccato', 'accent', 'tenuto', 'staccato', 'accent'];
        return articulations[Math.floor(Math.random() * articulations.length)];
    }

    generateProfessionalAccidental(pitch) {
        const { includeSharps, includeFlats } = this.currentSettings;
        if (Math.random() < 0.5) {
            const accidentals = [];
            if (includeSharps) accidentals.push('#');
            if (includeFlats) accidentals.push('b');
            if (accidentals.length > 0) {
                return accidentals[Math.floor(Math.random() * accidentals.length)];
            }
        }
        return '';
    }

    // Virtuoso level methods
    getVirtuosoDuration(position) {
        const patterns = ['32', '32', '16', '8', '16', '32', 'q', '16', '32', '8'];
        return patterns[position % patterns.length];
    }

    getVirtuosoRestDuration() {
        return ['32', '16', '8'][Math.floor(Math.random() * 3)];
    }

    getVirtuosoArticulation() {
        const articulations = ['staccato', 'accent', 'tenuto', 'staccato', 'accent', 'tenuto'];
        return articulations[Math.floor(Math.random() * articulations.length)];
    }

    generateVirtuosoAccidental(pitch) {
        const { includeSharps, includeFlats } = this.currentSettings;
        if (Math.random() < 0.6) {
            const accidentals = [];
            if (includeSharps) accidentals.push('#');
            if (includeFlats) accidentals.push('b');
            if (accidentals.length > 0) {
                return accidentals[Math.floor(Math.random() * accidentals.length)];
            }
        }
        return '';
    }

    // Legendary level methods
    getLegendaryDuration(position) {
        const patterns = ['32', '32', '16', '32', '16', '8', '32', '16', 'q', '32'];
        return patterns[position % patterns.length];
    }

    getLegendaryRestDuration() {
        return ['32', '16'][Math.floor(Math.random() * 2)];
    }

    getLegendaryArticulation() {
        const articulations = ['staccato', 'accent', 'tenuto'];
        return articulations[Math.floor(Math.random() * articulations.length)];
    }

    generateLegendaryAccidental(pitch) {
        const { includeSharps, includeFlats } = this.currentSettings;
        if (Math.random() < 0.7) {
            const accidentals = [];
            if (includeSharps) accidentals.push('#');
            if (includeFlats) accidentals.push('b');
            if (accidentals.length > 0) {
                return accidentals[Math.floor(Math.random() * accidentals.length)];
            }
        }
        return '';
    }

    showLevelSelection() {
        document.getElementById('musicDisplay').style.display = 'none';
        document.getElementById('customizationPanel').style.display = 'none';
        document.getElementById('levelSelection').style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MusicSightReading();
});