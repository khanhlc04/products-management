const buttonStatus = document.querySelectorAll('[button-status]')
if(buttonStatus.length > 0){
    let url = new URL(window.location.href);

    buttonStatus.forEach(btn => {
        btn.addEventListener('click', () => {
            const status = btn.getAttribute("button-status");
            if(status) {
                url.searchParams.set("status", status);
              } else {
                url.searchParams.delete("status");
            }

            window.location.href = url.href;
        });
    });
}

const formSearch = document.querySelector("#form-search");
if(formSearch){
    let url = new URL(window.location.href);

    formSearch.addEventListener("submit", (event) => {
        event.preventDefault();

        const keyword = event.target.elements.keyword.value;
        if(keyword){
            url.searchParams.set("keyword", keyword);
        }else{
            url.searchParams.delete("keyword");
        }

        window.location.href = url.href;
    });
}

const buttonPaginations = document.querySelectorAll("[button-pagination]");
if(buttonPaginations.length > 0){
    let url = new URL(window.location.href);

    buttonPaginations.forEach(btn => {
        btn.addEventListener('click', () => {
            const page = btn.getAttribute("button-pagination");
            if(page){
                url.searchParams.set("page", page);
            }else{
                url.searchParams.delete("page");
            }
    
            window.location.href = url.href;
        })
    });
}

const buttonChangeStatus = document.querySelectorAll("[button-change-status]")
if(buttonChangeStatus.length > 0){
    const formChangeStatus = document.querySelector("[form-change-status]");
    const PATH = formChangeStatus.getAttribute("data-path");

    buttonChangeStatus.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute("data-id");
            const statusCurrent = btn.getAttribute("data-status");

            const statusChange = statusCurrent == "active" ? "inactive" : "active";

            const action = `${PATH}/${statusChange}/${id}?_method=PATCH`;
            
            formChangeStatus.action = action;

            formChangeStatus.submit();
        })
    });
}

const checkBoxMulti = document.querySelector("[checkbox-multi]");
if(checkBoxMulti){
    const inputCheckAll = checkBoxMulti .querySelector("input[name='checkall']");
    const inputsId = checkBoxMulti .querySelectorAll("input[name='id']");

    inputCheckAll.addEventListener('click', () => {
        if(inputCheckAll.checked){
            inputsId.forEach(input => {
                input.checked = true;
            });
        }else{
            inputsId.forEach(input => {
                input.checked = false;
            });
        }
    })

    inputsId.forEach(input => {
        input.addEventListener('click', () => {
            const countChecked = checkBoxMulti.querySelectorAll("input[name='id']:checked").length;
            if(countChecked == inputsId.length){
                inputCheckAll.checked = true;
            }
            else{
                inputCheckAll.checked = false;
            }
        })
    });
}

const formChangeMulti = document.querySelector("[form-change-multi]");
if(formChangeMulti){
    formChangeMulti.addEventListener('submit', (event) => {
        event.preventDefault();

        const type = event.target.elements.type.value;
        if(type == "delete-all"){
            const isConfirm = confirm("Bạn có chắc muốn xóa bản ghi này không?");
            if(!isConfirm){
                return;
            }
        }

        const inputChecked = checkBoxMulti.querySelectorAll("input[name='id']:checked");
        const inputIds = formChangeMulti.querySelector("input[name='ids']");
        const ids = [];
        
        if(inputChecked){
            inputChecked.forEach(input => {
                if(type == "change-position"){
                    const position = input.closest("tr").querySelector("input[name='position']").value;
                    ids.push(`${input.value}-${position}`);
                }
                else ids.push(input.value);
            });
        }
        else{
            alert("Vui lòng chọn ít nhất 1 bản ghi!");
        }

        inputIds.value = ids.join(', ');

        formChangeMulti.submit();
    });
}


const buttonsDelete = document.querySelectorAll("[button-delete]");
if(buttonsDelete.length > 0){
    const formDeleteItem = document.querySelector("[form-delete-item]");
    const PATH = formDeleteItem.getAttribute("data-path");
    buttonsDelete.forEach(btn => {
        btn.addEventListener('click', () => {
            const isConfirm = confirm("Bạn có chắc muốn xóa bản ghi này không?");
            if(!isConfirm){
                return
            }
            const id = btn.getAttribute("data-id");
            const action = `${PATH}/${id}?_method=PATCH`;
            
            formDeleteItem.action = action;
            formDeleteItem.submit();
        })
    });
}

const showAlert = document.querySelector("[show-alert]");
if(showAlert){
    const time = showAlert.getAttribute("data-time");
    setTimeout(() => {
        showAlert.classList.add("alert-hidden");
    },time);

    const closeAlert = showAlert.querySelector("[close-alert]");
    closeAlert.addEventListener("click", () => {
        showAlert.classList.add("alert-hidden");
    });
}

const uploadImage = document.querySelector('[upload-image]');
if(uploadImage){
    const uploadImageInput = uploadImage.querySelector('[upload-image-input]');
    const uploadImagePreview = uploadImage.querySelector('[upload-image-preview]');

    uploadImageInput.addEventListener("change", (event) => {
        const [file] = uploadImageInput.files;
        if(file){
            uploadImagePreview.src = URL.createObjectURL(file);
        }
    })
}

const sort = document.querySelector("[sort]");
if(sort){
    const url = new URL(window.location.href);
    
    const sortSelect = sort.querySelector("[sort-select]");
    sortSelect.addEventListener("change", (event) => {
        event.preventDefault();
        const [sortKey, sortValue] = sortSelect.value.split("-");

        url.searchParams.set("sortKey", sortKey);
        url.searchParams.set("sortValue", sortValue);

        window.location.href = url.href;
    })

    const sortClear = sort.querySelector("[sort-clear]");
    sortClear.addEventListener('click', () => {
        url.searchParams.delete("sortKey");
        url.searchParams.delete("sortValue");

        window.location.href = url.href;
    })

    const sortKey = url.searchParams.get("sortKey");
    const sortValue = url.searchParams.get("sortValue");
    const value = [];
    value.push(sortKey);
    value.push(sortValue);
    
    sortSelect.value = value.join("-");
}

const tablePermissions = document.querySelector("[table-permissions]");
if(tablePermissions){
    const buttonSubmit = document.querySelector("[button-submit]");
    const roles = [];

    buttonSubmit.addEventListener("click", () => {
        const rows = document.querySelectorAll("[data-name]");
        rows.forEach(row => {
            const inputs = row.querySelectorAll("input");
            const name = row.getAttribute("data-name");
            if(name =="id"){
                inputs.forEach(input => {
                    const id = input.value;
                    roles.push({
                        id: id,
                        permissions: []
                    });
                });
            } else {
                inputs.forEach((input, index) => {
                    if(input.checked)
                        roles[index].permissions.push(name);
                })
            }
        });

        const formChangePermissions = document.querySelector("[form-change-permissions]");
        if(formChangePermissions){
            const inputRoles = formChangePermissions.querySelector("input[name=roles]");
            inputRoles.value = JSON.stringify(roles);
            formChangePermissions.submit();
        }
    });
}

const divRecord = document.querySelector("[data-records]");
if(divRecord){
    const records = JSON.parse(divRecord.getAttribute("data-records"));
    records.forEach((record, index) => {
        const permissions = record.permissions;
        permissions.forEach(permission => {
            const row = tablePermissions.querySelector(`[data-name="${permission}"]`);
            const input = row.querySelectorAll("input")[index];
            input.checked=true;
        })
    })
}