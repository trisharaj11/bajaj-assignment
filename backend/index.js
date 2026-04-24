const express=require("express");
const cors=require("cors");
const {processData}=require("./graphProcessor");

const app=express();
const PORT=process.env.PORT||3000;

app.use(cors());
app.use(express.json());

const USER_ID="rajtrisha1103";
const EMAIL_ID="tr4792@srmist.edu.in";
const COLLEGE_ROLL_NUMBER="RA2311003030080";

app.post("/bfhl",(req,res)=>{
  try{
    const body=req.body;
    const data=body.data;

    if(!Array.isArray(data)){
      return res.status(400).json({
        error:'"data" must be an array.'
      });
    }

    for(let item of data){
      if(typeof item!=="string"){
        return res.status(400).json({
          error:"All elements in data must be strings."
        });
      }
    }

    if(data.length>1000){
      return res.status(400).json({
        error:"Too many edges. Max allowed is 1000."
      });
    }

    const cleaned=[];
    for(let d of data){
      cleaned.push(d.trim());
    }

    const output=processData(cleaned);

    res.status(200).json({
      user_id:USER_ID,
      email_id:EMAIL_ID,
      college_roll_number:COLLEGE_ROLL_NUMBER,
      hierarchies:output.hierarchies,
      invalid_entries:output.invalid_entries,
      duplicate_edges:output.duplicate_edges,
      summary:output.summary
    });

  }catch(e){
    console.error("API error:",e.message);
    res.status(500).json({
      error:"Internal server error."
    });
  }
});

app.get("/",(req,res)=>{
  res.json({status:"BFHL API running"});
});

app.listen(PORT,()=>{
  console.log(`Server running at http://localhost:${PORT}`);
});