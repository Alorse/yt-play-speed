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
        speedButton.className = 'ytp-button';
        speedButton.title = 'Playback Speed';
        
        const speedButtonLabel = document.createElement('span');
        speedButtonLabel.innerText = `${videoElement.playbackRate}x`;
        speedButton.appendChild(speedButtonLabel);

        playerControls.insertBefore(speedButton, playerControls.firstChild);

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
            if (settingsPopup) {
                settingsPopup.style.display = 'block'; // Force main settings menu to show
            }

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