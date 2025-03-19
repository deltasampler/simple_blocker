function list_match(list, url) {
    return list.some(item => new RegExp(item).test(url));
}

function check_block() {
    chrome.storage.local.get(["redirect_url", "blacklist", "blacklist_exceptions"], function (result) {
        const redirect_url = result.redirect_url ?? "https://www.google.com/";
        const blacklist = result.blacklist ?? [];
        const blacklist_exceptions = result.blacklist_exceptions ?? [];
        const url = window.location.href;

        blacklist_exceptions.push(redirect_url);

        if (list_match(blacklist, url) && !list_match(blacklist_exceptions, url)) {
            window.location.href = redirect_url;
        }
    });
}

check_block();

let path = window.location.href;

setInterval(function() {
    if (path !== window.location.href) {
        check_block();
    }

    path = window.location.href;
}, 100);
