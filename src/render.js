const list= document.getElementById('chat-list')

window.chat.onUpdateChat((value) => {
    const li = document.createElement('li');
    const elements = value.split(':');
    let accountData = elements[elements.length - 2].split('!')[0];

    const message = elements[elements.length - 1];
    let metadata = elements[0].split(';');
    metadata = Array.from(metadata, (x) => {
        return x.split('=');
    });
    console.log(metadata);
    let color = '#fffff'
    let badges = '';
    for (item of metadata) {
        if (item[0] == 'color') {
            color = item[1];
        }
        if (item[0] == 'badges') {
            badges = item[1];
        }
    }
    li.innerHTML = `<strong style="color: ${color}">${accountData}</strong>: ${message}`;
    list.appendChild(li);
    // console.log(list.scrollHeight);
    // list.scrollTo({top: list.scrollHeight, left: 0, behavior: 'smooth'});
    list.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
})