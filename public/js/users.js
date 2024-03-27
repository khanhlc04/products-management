const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]");

if(listBtnAddFriend.length > 0){
    listBtnAddFriend.forEach(btn => {
        btn.addEventListener("click", () => {
            btn.closest(".box-user").classList.add("add");

            const userId = btn.getAttribute("btn-add-friend");

            socket.emit("CLIENT_ADD_FRIEND", userId);
        });
    });
}

const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]");

if(listBtnCancelFriend.length > 0){
    listBtnCancelFriend.forEach(btn => {
        btn.addEventListener("click", () => {
            btn.closest(".box-user").classList.remove("add");

            const userId = btn.getAttribute("btn-cancel-friend");

            socket.emit("CLIENT_CANCEL_FRIEND", userId);
        })
    })
}

const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]");

if(listBtnRefuseFriend.length > 0) {
    listBtnRefuseFriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.add("refuse");

            const userId = button.getAttribute("btn-refuse-friend");

            socket.emit("CLIENT_REFUSE_FRIEND", userId);
        });
    });
}

const listBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]");

if(listBtnAcceptFriend.length > 0) {
  listBtnAcceptFriend.forEach(button => {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.add("accepted");

      const userId = button.getAttribute("btn-accept-friend");

      socket.emit("CLIENT_ACCEPT_FRIEND", userId);
    });
  });
}

socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", (data) => {
    const badgeUsersAccept = document.querySelector(`[badge-users-accept="${data.userId}"]`);
    if(badgeUsersAccept) {
        badgeUsersAccept.innerHTML = data.lengthAcceptFriends;
    }
});

socket.on("SERVER_RETURN_INFO_ACCEPT_FRIEND", (data) => {
    const dataUsersAccept = document.querySelector(`[data-users-accept="${data.userIdB}"]`);
    if(dataUsersAccept){
        const existBoxUser = dataUsersAccept.querySelector(`[user-id="${data.infoUserA._id}"]`)
        if(!existBoxUser){
            const newBoxUser = document.createElement("div");
            newBoxUser.classList.add("col-6");
            newBoxUser.setAttribute("user-id", data.infoUserA._id);

            newBoxUser.innerHTML = `
                <div class="box-user">
                    <div class="inner-avatar">
                        <img src="https://robohash.org/hicveldicta.png" alt="${data.infoUserA.fullName}" />
                    </div>
                    <div class="inner-info">
                        <div class="inner-name">
                            ${data.infoUserA.fullName}
                        </div>
                        <div class="inner-buttons">
                            <button
                                class="btn btn-sm btn-primary mr-1"
                                btn-accept-friend="${data.infoUserA._id}"
                            >
                                Chấp nhận
                            </button>
                            <button
                                class="btn btn-sm btn-secondary mr-1"
                                btn-refuse-friend="${data.infoUserA._id}"
                            >
                                Xóa
                            </button>
                            <button
                                class="btn btn-sm btn-secondary mr-1"
                                btn-deleted-friend=""
                                disabled=""
                            >
                                Đã xóa
                            </button>
                            <button
                                class="btn btn-sm btn-primary mr-1"
                                btn-accepted-friend=""
                                disabled=""
                            >
                                Đã chấp nhận
                            </button>
                        </div>
                    </div>
                </div>
            `;
            dataUsersAccept.appendChild(newBoxUser);

            const buttonRefuse = newBoxUser.querySelector("[btn-refuse-friend]");
            buttonRefuse.addEventListener("click", () => {
                buttonRefuse.closest(".box-user").classList.add("refuse");

                const userId = buttonRefuse.getAttribute("btn-refuse-friend");

                socket.emit("CLIENT_REFUSE_FRIEND", userId);
            });

            const buttonAccept = newBoxUser.querySelector("[btn-accept-friend]");
            buttonAccept.addEventListener("click", () => {
                buttonAccept.closest(".box-user").classList.add("accepted");

                const userId = buttonAccept.getAttribute("btn-accept-friend");

                socket.emit("CLIENT_ACCEPT_FRIEND", userId);
            });
        } else {
            const boxUser = existBoxUser.querySelector(".box-user");
            boxUser.classList.remove("refuse");
        }
    }

    const dataUsersNotFriend = document.querySelector(`[data-users-not-friend="${data.userIdB}"]`);
    if(dataUsersNotFriend){
        const boxUserDelete = dataUsersNotFriend.querySelector(`[user-id="${data.infoUserA._id}"]`);
        if(boxUserDelete){
            dataUsersNotFriend.removeChild(boxUserDelete);
        }
    }
})

socket.on("SERVER_RETURN_ID_CANCEL_FRIEND", (data) => {
    const dataUsersAccept = document.querySelector(`[data-users-accept="${data.userIdB}"]`);
    if(dataUsersAccept){
        const boxUserA = dataUsersAccept.querySelector(`[user-id = "${data.userIdA}"]`);
        if(boxUserA){
            dataUsersAccept.removeChild(boxUserA);
        }
    }
})

socket.on("SERVER_RETURN_ID_REFUSE_FRIEND", (data) => {
    const dataUsersNotFriend = document.querySelector(`[data-users-not-friend="${data.userIdA}"]`);
    if(dataUsersNotFriend){
        const boxUserB = dataUsersNotFriend.querySelector(`[user-id="${data.userIdB}"]`);
        if(boxUserB){
            const boxUser = boxUserB.querySelector(".box-user");
            boxUser.classList.remove("add");
        }
    }

    const dataUsersRequest= document.querySelector(`[data-users-request="${data.userIdA}"]`);
    if(dataUsersRequest){
        const boxUserDelete = dataUsersRequest.querySelector(`[user-id="${data.userIdB}"]`);
        if(boxUserDelete){
            dataUsersRequest.remove(boxUserDelete);
        }
    }
})

socket.on("SERVER_RETURN_ID_ACCEPT_FRIEND", (data) => {
    const dataUsersNotFriend = document.querySelector(`[data-users-not-friend="${data.userIdA}"]`);
    if(dataUsersNotFriend){
        const boxUserB = dataUsersNotFriend.querySelector(`[user-id="${data.userIdB}"]`);
        if(boxUserB){
            const boxUser = boxUserB.querySelector(".box-user");
            boxUser.classList.remove("add");
            boxUser.classList.add("accepted");
        }
    }

    const dataUsersRequest= document.querySelector(`[data-users-request="${data.userIdA}"]`);
    if(dataUsersRequest){
        const boxUserB = dataUsersRequest.querySelector(`[user-id="${data.userIdB}"]`);
        if(boxUserB){
            const boxUser = boxUserB.querySelector(".box-user");
            boxUser.classList.remove("add");
            boxUser.classList.add("accepted");
        }
    }
})