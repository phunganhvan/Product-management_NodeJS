
//PERMISSIONS

const tablePermissions = document.querySelector("[table-permissions]");
if(tablePermissions){
    const updateBtn= document.querySelector("[button-submit]")
    // console.log(updateBtn)
    updateBtn.addEventListener("click", ()=>{
        let permissions=[]
        const rows= tablePermissions.querySelectorAll("[data-name]")

        rows.forEach(row =>{
            const name= row.getAttribute("data-name");
            const inputs= row.querySelectorAll("input");
            if(name=="id"){
                inputs.forEach(input =>{
                    const id= input.value;
                    permissions.push({
                        id: id,
                        permissions:[]
                    });
                })
            }
            else{
                inputs.forEach((input, index) =>{
                    const checked= input.checked;

                    if(checked){
                        permissions[index].permissions.push(name)
                    }
                })
            }
            
        })
        console.log(permissions)
        if(permissions.length>0){
            const formChangePermissions = document.querySelector("#form-change-permission")
            const inputPermissions= formChangePermissions.querySelector("input[name='permissions']")
            inputPermissions.value= JSON.stringify(permissions)
            formChangePermissions.submit();
        }
    })
}


//END


//filt permission
const dataPermission = document.querySelector("[data-permission]")
if(dataPermission){
    const records= JSON.parse(dataPermission.getAttribute("data-permission"))
    const tablePer= document.querySelector("[table-permissions]")
    records.forEach((record, index) =>{
        const permissions= record.permission;
        permissions.forEach(permission =>{
            const row= tablePer.querySelector(`[data-name="${permission}"]`)
            const input= row.querySelectorAll("input")[index];
            input.checked= true;
        })
    });
}