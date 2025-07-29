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

        playerControls.insertBefore(speedButton, playerControls.children[3]);

        speedButton.onclick = () => {
            const settingsButton = document.querySelector('.ytp-settings-button');
            if (!settingsButton) return;

            const settingsPopup = document.querySelector('.ytp-popup.ytp-settings-menu');

            if (settingsPopup && settingsPopup.style.display === 'block') {
                settingsPopup.style.display = 'none';
                settingsButton.setAttribute('aria-expanded', 'false');
                return;
            }
            
            settingsButton.click();

            setTimeout(() => {
                const menuItems = document.querySelectorAll('.ytp-menuitem-label');
                let speedMenuItem = null;
                for (const item of menuItems) {
                    if (item.innerText === 'Playback speed' || item.innerText === 'Velocidad de reproducción') {
                        speedMenuItem = item.parentElement;
                        break;
                    }
                }

                if (speedMenuItem) {
                    speedMenuItem.click();
                    const newSettingsPopup = document.querySelector('.ytp-popup.ytp-settings-menu');
                    if (newSettingsPopup) {
                        newSettingsPopup.style.display = 'block';
                        newSettingsPopup.style.width = '370px';
                        newSettingsPopup.style.height = '297px';
                        settingsButton.setAttribute('aria-expanded', 'true');
                    }
                } else {
                    // If the speed menu item wasn't found, close the settings panel
                    settingsButton.click();
                    if (settingsPopup) {
                        settingsPopup.style.display = 'none';
                        settingsButton.setAttribute('aria-expanded', 'false');
                    }
                }
            }, 50);
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