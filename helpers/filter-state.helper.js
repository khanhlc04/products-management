module.exports = (query) =>{
        const filterState = [
        {
            name: "Tất Cả",
            status: "",
            class: ""
        },
        {
            name: "Hoạt Động",
            status: "active",
            class: ""
        },
        {
            name: "Dừng Hoạt Động",
            status: "inactive",
            class: ""
        }
    ];

    if(query.status){
        const index = filterState.findIndex(item => item.status === query.status);
        filterState[index].class = "active";
    }
    else{
        filterState[0].class = "active";
    }

    return filterState;
}