export const copyToClipboard = (text) => {
    if (navigator.clipboard && window.isSecureContext) {
        // If we are in a secure context, use the Clipboard API
        try {
        navigator.clipboard.writeText(text);
        alert('Example input copied to clipboard!');
        } catch (err) {
        alert('Unable to copy to clipboard', err);
        }
    } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
        document.execCommand('copy');
        alert('Example input copied to clipboard!');
        } catch (err) {
        alert('Unable to copy to clipboard', err);
        }
        document.body.removeChild(textArea);
    }
  };