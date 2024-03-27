import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'

const upload = new FileUploadWithPreview.FileUploadWithPreview('upload-image', {
    multiple: true
});

const formSendData = document.querySelector(".chat .inner-form");
if(formSendData) {
    const inputContent = formSendData.querySelector("input[name='content']");
    formSendData.addEventListener("submit", (event) => {
        event.preventDefault();
        const content = inputContent.value;
        const images = upload.cachedFileArray || [];
        if(content || images.length > 0) {
            socket.emit("CLIENT_SEND_MESSAGE",{
                content: content,
                images: images
            });
            inputContent.value = "";
            socket.emit("CLIENT_SEND_TYPING", "hidden");
            upload.resetPreviewPanel();
        }
    });
}

socket.on("SERVER_SEND_MESSAGE", (data) => {
    const body = document.querySelector(".chat .inner-body");
    const elementListTyping = body.querySelector(".inner-list-typing");
    const myId = document.querySelector("[my-id]").getAttribute("my-id");

    const div = document.createElement("div");
    let htmlFullName ="";
    let htmlContent = "";
    let htmlImages = ""

    if(myId != data.userId){
        div.classList.add("inner-incoming")
        htmlFullName = `<div class="inner-name">${data.fullName}</div>`;
    }else{
        div.classList.add("inner-outgoing")
    }

    if(data.content){
        htmlContent = `<div class="inner-content">${data.content}</div>`;
    }

    if(data.images.length > 0){
        htmlImages += `<div class="inner-images">`;

        for(const image of data.images){
            htmlImages += `<img src="${image}">`;
        }

        htmlImages += `</div>;`
    }

    div.innerHTML =`
        ${htmlFullName}
        ${htmlContent}
        ${htmlImages}
    `

    body.insertBefore(div, elementListTyping);

    body.scrollTop = body.scrollHeight;

    const gallery = new Viewer(div);
})

const bodyChat = document.querySelector(".chat .inner-body");
if(bodyChat) {
    bodyChat.scrollTop = bodyChat.scrollHeight;
}

const buttonIcon = document.querySelector('.button-icon');
if(buttonIcon){
    const tooltip = document.querySelector('.tooltip')
    Popper.createPopper(buttonIcon, tooltip);

    buttonIcon.addEventListener('click', () => {
        tooltip.classList.toggle('shown');
    })

    const emojiPicker = document.querySelector("emoji-picker");
    if(emojiPicker){
        const inputChat = document.querySelector(".chat .inner-form input[name='content']")

        emojiPicker.addEventListener('emoji-click', event => {
            const icon = event.detail.unicode;
            inputChat.value = inputChat.value + icon;
        });

        var timeOut;

        inputChat.addEventListener("keyup", (event) => {
            if(event.key === "Enter"){
                socket.emit("CLIENT_SEND_TYPING", "hidden");
            } else {
                socket.emit("CLIENT_SEND_TYPING", "show");

                clearTimeout(timeOut);

                timeOut = setTimeout(() => {
                socket.emit("CLIENT_SEND_TYPING", "hidden");
                }, 3000);
            }
        })
    }
}

const elementListTyping = document.querySelector(".inner-list-typing");

socket.on("SERVER_RETURN_TYPING", (data) => {
    if(data.type == "show"){
        const existTyping = elementListTyping.querySelector(`.box-typing[user-id="${data.userId}"]`);

        if(!existTyping){
            const boxTyping = document.createElement("div");
            boxTyping.classList.add("box-typing");
            boxTyping.setAttribute("user-id", data.userId);
            boxTyping.innerHTML = `
                <div class="inner-name">${data.fullName}</div>
                <div class="inner-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            `;
    
            elementListTyping.appendChild(boxTyping);
        } 
    } else {
        const boxTypingRemove = elementListTyping.querySelector(`.box-typing[user-id="${data.userId}"]`);

        if(boxTypingRemove){
            elementListTyping.removeChild(boxTypingRemove);
        }
    }
})

if(bodyChat){
    const gallery = new Viewer(bodyChat);
}