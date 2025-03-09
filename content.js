function list_match(list, url) {
    return list.some(item => new RegExp(item).test(url));
}

chrome.storage.local.get(["blacklist", "blacklist_exceptions"], function (result) {
    const blacklist = result.blacklist ?? [];
    const blacklist_exceptions = result.blacklist_exceptions ?? [];
    const url = window.location.href;
    const redirect_url = "https://www.example.com/";

    blacklist_exceptions.push(redirect_url);

    if (list_match(blacklist, url) && !list_match(blacklist_exceptions, url)) {
        window.location.href = redirect_url;
    }
});
