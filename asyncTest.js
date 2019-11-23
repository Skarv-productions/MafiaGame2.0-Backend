
// const getSomeThing = async() => {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             console.log("getSomeThing timeout");
//             return resolve();
//         },500)    
//     })
// }


console.log("Sync 1");

// const asyncFuncOne = async() => {
//     await getSomeThing();
//     console.log("AsyncOne");
// }

setTimeout(() => {
    console.log("Settimeout 1");
}, 1000);

console.log("Sync 2");

// asyncFuncOne();