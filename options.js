function list_add(key, value, onadd) {
    chrome.storage.local.get([key], function(result) {
        const items = result[key] ?? [];
        const index = items.indexOf(value);

        if (index < 0) {
            items.push(value);

            chrome.storage.local.set({[key]: items}, function () {
                onadd(items);
            });
        }
    });
}

function list_remove(key, value, onremove) {
    chrome.storage.local.get([key], function(result) {
        const items = result[key] ?? [];
        const index = items.indexOf(value);

        if (index > -1) {
            items.splice(index, 1);

            chrome.storage.local.set({[key]: items}, function () {
                onremove(items);
            });
        }
    });
}

function render_container(parent_el) {
    const container_el = document.createElement("div");
    container_el.className = "container";
    parent_el.append(container_el);

    return container_el;
}

function render_label(content, parent_el) {
    const label_el = document.createElement("div");
    label_el.className = "label";
    label_el.innerHTML = content;
    parent_el.append(label_el);

    return label_el;
}

function render_list(parent_el) {
    const list_el = document.createElement("ul");
    list_el.className = "list";
    parent_el.append(list_el);

    return list_el;
}

function render_item(parent_el) {
    const item_el = document.createElement("li");
    item_el.className = "item";
    parent_el.append(item_el);

    return item_el;
}

function render_input(parent_el) {
    const input_el = document.createElement("input");
    input_el.className = "input";
    input_el.type = "text";
    parent_el.append(input_el);

    return input_el;
}

function render_button(content, parent_el) {
    const button_el = document.createElement("button");
    button_el.className = "button";
    button_el.innerHTML = content;
    parent_el.append(button_el);

    return button_el;
}

function render_type_list_content(key, items, list_el) {
    if (items.length === 0) {
        list_el.innerHTML = "Empty";
    } else {
        list_el.innerHTML = "";

        for (const item of items) {
            render_type_item(key, item, list_el);
        }
    }
}

function render_type_item(key, value, parent_el) {
    const bl_item = render_item(parent_el);

    const value_el = document.createElement("span");
    value_el.className = "value";
    value_el.innerHTML = value;
    bl_item.append(value_el);

    const btn = render_button("DEL", bl_item);
    
    btn.onclick = function() {
        list_remove(key, value, function(items) {
            render_type_list_content(key, items, parent_el);
        });
    }

    return bl_item;
}

function render_type_list(key, label, parent_el) {
    const container = render_container(parent_el);
    container.classList.add("type_list_container");
    render_label(label, container);

    const list = render_list(container);

    chrome.storage.local.get([key], function(result) {
        const items = result[key] ?? [];

        render_type_list_content(key, items, list);
    });

    const input_container = render_container(container);
    input_container.classList.add("input_container");

    const input = render_input(input_container);
    input.placeholder = "URL"

    const button = render_button("ADD", input_container);

    button.onclick = function() {
        if (!input.value) {
            return;
        }

        list_add(key, input.value, function(items) {
            render_type_list_content(key, items, list);
        });

        input.value = "";
    }

    return container;
}

function render_redirect_url_container(parent_el) {
    const redirect_url_container = render_container(parent_el);
    redirect_url_container.classList.add("redirect_url_container");

    render_label("Redirect URL", redirect_url_container);

    const input_container = render_container(redirect_url_container);
    input_container.classList.add("input_container");

    const input = render_input(input_container);

    chrome.storage.local.get(["redirect_url"], function(result) {
        input.value = result.redirect_url ?? '';
    });

    const button = render_button("SET", input_container);

    button.onclick = function() {
        chrome.storage.local.set({"redirect_url": input.value});
    }
}

function render() {
    const root_el = document.querySelector("#root");

    render_redirect_url_container(root_el);
    render_type_list("blacklist", "Blacklist:", root_el);
    render_type_list("blacklist_exceptions", "Blacklist Exceptions:", root_el);
}

render();
