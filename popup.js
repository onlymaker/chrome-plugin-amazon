chrome.tabs.getSelected(null, function (selected) {
    tab = selected;
});

document.addEventListener('DOMContentLoaded', function (e) {
    document.querySelectorAll('.amazon-rating').forEach(function (e) {
        e.addEventListener('click', function () {
            let market = this.getAttribute('market') || 'ARUS';
            let time = new Date().getTime();
            let expireTime = Number(localStorage.getItem('asinExpireTime'));
            if (time < expireTime) {
                sendAmazonRatingCommand(market, localStorage.getItem('asinList'));
            } else {
                fetch('?market=' + market)
                    .then(function (response) {
                        return response.text();
                    })
                    .then(function (text) {
                        time += 300000;
                        localStorage.setItem('asinExpireTime', time);
                        localStorage.setItem('asinList', text);
                        sendAmazonRatingCommand(market, text);
                    });
            }
        })
    })
});

function sendAmazonRatingCommand(market, asinList) {
    chrome.tabs.sendMessage(tab.id, {command: 'amazon-rating', market: market, asinList: asinList})
}