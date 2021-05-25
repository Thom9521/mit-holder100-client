import React, { useEffect, useState } from 'react';

import { Button } from 'reactstrap';

function InstallPWAButton() {
    const [installable, setInstallable] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState('');

    useEffect(() => {
        console.log(installable)
        window.addEventListener("beforeinstallprompt", (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
            // Update UI notify the user they can install the PWA
            setInstallable(true);

            console.log(`'beforeinstallprompt' event was fired.`);

        });

        window.addEventListener('appinstalled', () => {
            // Log install to analytics
            console.log('INSTALL: Success');
        });
        if (window.matchMedia('(display-mode: standalone)').matches) {
            console.log('installed?')
        }
    }, []);

    const handleInstallClick = (e) => {
        // Hide the app provided install promotion
        setInstallable(false);
        // Show the install prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }
        });
    };

    return (
        <li className="listItem">
            {installable &&
                <Button onClick={handleInstallClick}>
                    Installér App
                    </Button>
            }
        </li>
    );
}

export default InstallPWAButton;