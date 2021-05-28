import React from 'react';

import { DropdownItem } from 'reactstrap';

function InstallPWAButton(props) {
  const { deferredPrompt } = props;

  const handleInstallClick = (e) => {
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
    <DropdownItem className="pb-2 pt-2" onClick={handleInstallClick}>
      Installér App
    </DropdownItem>
  );
}

export default InstallPWAButton;
