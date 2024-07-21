const listing=require("../models/listing.js");

const inputcontent=[
    "hariyana",
    "maharashtra","goa","dilhi","madhyapradesh",
    "karnataka","chattisgarh",
];
console.log(inputcontent)

const inputbox=document.getElementById("searchs");
const result=document.querySelector(".searccontent")

inputbox.onkeyup=function(){
    let result=[];
    let input=inputbox.value;
    if(input.length){
        result=inputcontent.filter((keyword)=>{
            keyword.toLowerCase().includes(input.toLowerCase());
        })
        console.log(result);
    }
}
