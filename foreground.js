chrome.runtime.onMessage.addListener(
    function (data, sender, sendResponse) {
        console.log(data, 'from', sender);
        switch (data.command) {
            case 'amazon-rating':
                let i = 0;
                let candidate = data.text.split(',');
                let search = location.search.substr(1);
                if (search.startsWith('asin')) {
                    search = search.substr(5);
                    for (i = 0; i < candidate.length; i++) {
                        if (search === candidate[i]) {
                            break;
                        }
                    }
                    if (i < candidate.length) i++;
                }
                if (i === candidate.length) {
                    alert('ASIN to the end');
                } else {
                    location.href = 'https://www.amazon.com/gp/customer-reviews/widgets/average-customer-review/popover?asin=' + candidate[i];
                }
                break;
            default:
                sendResponse({data: 'unsupported command: ' + data.command});
        }
    }
);

window.onload = function () {
    if (/\.amazon\./.test(location.host) && /^\?asin=/.test(location.search)) {
        let reg = /(?<number>\d+\.?\d*)/;
        let count = document.querySelector(".totalRatingCount").innerText;
        let stars = document.querySelectorAll("td");
        let data = {
            count: reg.exec(count).groups.number,
            star5: reg.exec(stars[2].innerText).groups.number,
            star4: reg.exec(stars[5].innerText).groups.number,
            star3: reg.exec(stars[8].innerText).groups.number,
            star2: reg.exec(stars[11].innerText).groups.number,
            star1: reg.exec(stars[14].innerText).groups.number,
        };
        fetch('', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: Object.keys(data)
                .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(data[k]))
                .join('&'),
        })
            .finally(function () {
                alert(JSON.stringify(data));
            })
    }
};
