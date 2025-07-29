(function() {
    'use strict';

    const BUTTON_ID = 'youtube-speed-control-button';

    function createSpeedControl() {
        if (document.getElementById(BUTTON_ID)) {
            return;
        }

        const playerControls = document.querySelector('.ytp-right-controls');
        if (!playerControls) {
            return;
        }

        const videoElement = document.querySelector('video');
        if (!videoElement) {
            return;
        }

        const speedButton = document.createElement('button');
        speedButton.id = BUTTON_ID;
        speedButton.className = 'ytp-speed-button ytp-button';
        speedButton.title = 'Playback Speed';

        const speedContainer = document.createElement('div');
        speedContainer.className = 'ytp-speed-icon-container';
        
        // Add the speed icon SVG
        const speedIcon = document.createElement('div');
        speedIcon.className = 'ytp-menuitem-icon ytp-speed-icon';
        speedIcon.innerHTML = '<svg height="16" viewBox="0 0 24 24" width="16"><path d="M10,8v8l6-4L10,8L10,8z M6.3,5L5.7,4.2C7.2,3,9,2.2,11,2l0.1,1C9.3,3.2,7.7,3.9,6.3,5z M5,6.3L4.2,5.7C3,7.2,2.2,9,2,11 l1,.1C3.2,9.3,3.9,7.7,5,6.3z M5,17.7c-1.1-1.4-1.8-3.1-2-4.8L2,13c0.2,2,1,3.8,2.2,5.4L5,17.7z M11.1,21c-1.8-0.2-3.4-0.9-4.8-2 l-0.6,.8C7.2,21,9,21.8,11,22L11.1,21z M22,12c0-5.2-3.9-9.4-9-10l-0.1,1c4.6,.5,8.1,4.3,8.1,9s-3.5,8.5-8.1,9l0.1,1 C18.2,21.5,22,17.2,22,12z" fill="white"></path></svg>';
        
        const speedButtonLabel = document.createElement('span');
        speedButtonLabel.className = 'ytp-speed-label';
        speedButtonLabel.innerText = `${videoElement.playbackRate}x`;
        
        speedButton.appendChild(speedContainer);
        speedContainer.appendChild(speedIcon);
        speedContainer.appendChild(speedButtonLabel);

        playerControls.insertBefore(speedButton, playerControls.children[0]);

        speedButton.onclick = () => {
            // First timeout: Check and handle settings menu state
            setTimeout(() => {
                const settingsButton = document.querySelector('.ytp-settings-button');
                if (!settingsButton) return;

                const settingsPopup = document.querySelector('.ytp-popup.ytp-settings-menu');
                
                // If settings menu is already open, close it and exit
                if (settingsPopup && settingsPopup.style.display === 'block') {
                    settingsPopup.style.display = 'none';
                    settingsButton.setAttribute('aria-expanded', 'false');
                    return;
                }
                
                // Open settings menu
                settingsButton.click();
            }, 50);

            // Second timeout: Find and click speed option
            setTimeout(() => {
                const menuItems = document.querySelectorAll('.ytp-menuitem-label');
                let speedMenuItem = null;
                
                // Find the playback speed menu item
                for (const item of menuItems) {
                    if (item.innerText === 'Playback speed' || item.innerText === 'Velocidad de reproducción') {
                        speedMenuItem = item.parentElement;
                        break;
                    }
                }

                if (speedMenuItem) {
                    // Click the speed menu item to open speed options
                    speedMenuItem.click();
                    
                    // Ensure the settings popup stays open
                    const settingsPopup = document.querySelector('.ytp-popup.ytp-settings-menu');
                    const settingsButton = document.querySelector('.ytp-settings-button');
                    
                    if (settingsPopup && settingsButton) {
                        settingsPopup.style.display = 'block';
                        settingsButton.setAttribute('aria-expanded', 'true');
                    }
                } else {
                    // If speed menu item not found, close the settings panel
                    const settingsButton = document.querySelector('.ytp-settings-button');
                    const settingsPopup = document.querySelector('.ytp-popup.ytp-settings-menu');
                    
                    if (settingsButton) {
                        settingsButton.click();
                    }
                    if (settingsPopup) {
                        settingsPopup.style.display = 'none';
                        settingsButton?.setAttribute('aria-expanded', 'false');
                    }
                }
            }, 150);
        };

        videoElement.addEventListener('ratechange', () => {
            speedButtonLabel.innerText = `${videoElement.playbackRate}x`;
        });
    }

    const observer = new MutationObserver(() => {
        if (document.querySelector('.ytp-right-controls') && !document.getElementById(BUTTON_ID)) {
            createSpeedControl();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();