let cnt=0;
const createTree= (arr, parentId= "") =>{
    const tree=[];
        arr.forEach(item => {
            if(item.parent_id === parentId){
                cnt++;
                const newItem= item;
                newItem.index= cnt
                const children= createTree(arr, item.id);
                if(children.length >0){
                    newItem.children= children;
                }
                tree.push(newItem); 
            }
        });
    return tree;
}
module.exports.create= (arr, parentId= "") =>{
    cnt=0;
    const tree= createTree(arr, parentId="");
    return tree;
}