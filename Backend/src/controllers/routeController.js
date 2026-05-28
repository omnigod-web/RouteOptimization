import { planFuelStops } from "../services/routePlanner.js";

export const planRoute =async (req ,res)=>{
    const start= req.body.start?.trim();
    const end = req.body.end?.trim()
    if(!start){
        return res.status(400).json({error:"Wrong input for start"})
    }
    if(!end){
        return res.status(400).json({error:"Wrong input for end"})
    }
    if(start.toLowerCase()===end.toLowerCase()){
        return res.status(400).json({error:"same input for start and end"})
    }
    try {
        const result = await planFuelStops(start , end);  //Business logic in planFuelStop---> open Defination to Explore
         res.status(200).json(result)
    } catch (err) {
        const statusCode = err.message.includes('cities not found') ? 400 : 500

        res.status(statusCode).json({
            message:"Could not plan this route",
            error: err.message
        })
    }
    
}
