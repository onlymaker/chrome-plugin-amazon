chrome.tabs.getSelected(null, function (selected) {
    tab = selected;
});

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('amazon-rating').onclick = function () {
        let time = new Date().getTime();
        let expireTime = Number(localStorage.getItem('asinExpireTime'));
        if (time < expireTime) {
            sendAmazonRatingCommand(localStorage.getItem('asinList'));
        } else {
            fetch('')
                .then(function (response) {
                    return response.text();
                })
                .then(function (text) {
                    time += 300000;
                    localStorage.setItem('asinExpireTime', time);
                    localStorage.setItem('asinList', text);
                    sendAmazonRatingCommand(text);
                });
        }
    }
});

function sendAmazonRatingCommand(asinList) {
    chrome.tabs.sendMessage(tab.id, {command: 'amazon-rating', text: asinList})
}