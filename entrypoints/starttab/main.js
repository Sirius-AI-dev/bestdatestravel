document.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash.substring(1); // Get hash parameter without the '#'
    const telegramBotLink = document.getElementById('telegramBotLink');
    const whatsappBotLink = document.getElementById('whatsappBotLink');
    const hashParameterInput = document.getElementById('hashParameterInput');
    const copyButton = document.getElementById('copyButton');
    const copyFeedback = document.getElementById('copyFeedback');

    if (hash) {
        // Construct and set the Telegram bot link with the hash parameter
        telegramBotLink.href = `https://t.me/bestdatestravel_bot?start=uc${hash}`;
        whatsappBotLink.href = `https://wa.me/381611730271?text=uc${hash}`;
        
        // Populate the non-editable input text field with the hash parameter
        hashParameterInput.value = hash;
    } else {
        // Fallback for when no hash parameter is provided (e.g., direct page access)
        telegramBotLink.href = 'https://t.me/bestdatestravel_bot';
        whatsappBotLink.href = `https://wa.me/381611730271`;
        
        hashParameterInput.value = 'No ID found';
        hashParameterInput.style.color = 'var(--secondary-text-color)'; // Use a subtle color for this message
    }

    // Add event listener for the copy button
    copyButton.addEventListener('click', () => {
        const textToCopy = hashParameterInput.value;
        
        // Use the modern Clipboard API (recommended for security and better user experience)
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    copyFeedback.textContent = 'Copied to clipboard!';
                    copyFeedback.style.color = 'green';
                    copyFeedback.classList.add('show');
                    setTimeout(() => {
                        copyFeedback.classList.remove('show');
                    }, 2000); // Hide message after 2 seconds
                })
                .catch(err => {
                    console.error('Failed to copy text: ', err);
                    copyFeedback.textContent = 'Failed to copy.';
                    copyFeedback.style.color = 'red';
                    copyFeedback.classList.add('show');
                    setTimeout(() => {
                        copyFeedback.classList.remove('show');
                    }, 2000);
                });
        } else {
            // Fallback for older browsers (document.execCommand is deprecated but still widely supported)
            // Note: This method might have limitations or require specific user interactions in some browsers.
            hashParameterInput.select();
            try {
                document.execCommand('copy');
                copyFeedback.textContent = 'Copied to clipboard!';
                copyFeedback.style.color = 'green';
                copyFeedback.classList.add('show');
                setTimeout(() => {
                    copyFeedback.classList.remove('show');
                }, 2000);
            } catch (err) {
                console.error('Fallback: Oops, unable to copy', err);
                copyFeedback.textContent = 'Failed to copy. Please copy manually.';
                copyFeedback.style.color = 'red';
                copyFeedback.classList.add('show');
                setTimeout(() => {
                    copyFeedback.classList.remove('show');
                }, 2000);
            }
        }
    });
});
