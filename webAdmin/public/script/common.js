//formPost('/products', { id:id, productId: 1}, method='post');

// function formPost(path, params, method='post') {
//     const form = document.createElement('form');
//     form.method = method;
//     form.action = path;
    

//     for(const key in params){
//         if(params.hasOwnProperty(key)){
//             const hiddenField = document.createElement('input');
//             hiddenField.type = 'hidden';
//             hiddenField.name = key;
//             hiddenField.value = params[key];
    
//             form.appendChild(hiddenField);
//         }
//     }
//     document.body.appendChild(form);
//     form.submit();
// }


// function updateSpecies(id){
//     console.log('updateSpecies ? newSpecies ', id);
//     //const name = prompt("Update species")
//     // console.log('new temp...: ',name);
//     formPost('/products', { id:id , productId: 1 }, method='post');

// }