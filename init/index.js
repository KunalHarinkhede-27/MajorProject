const mongoose=require("mongoose");
const initdata=require("./data.js");
const listing=require("../models/listing.js");

main()
.then(()=>{
    console.log("connection successfull");
})
.catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');
}

const initdb=async ()=>{
    await listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj,owner:"65eaba4d82088ccfbd06189e"}));
    await listing.insertMany(initdata.data);
    console.log("data is initialised.");
}

initdb();