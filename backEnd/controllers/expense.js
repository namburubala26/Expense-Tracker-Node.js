const Expense = require('../models/expense')
const User = require('../models/userSignup')
const S3service = require('../services/s3')
const fileData = require('../models/fileExpense')

exports.addExpense = async (req,res)=>{
    try{
        const {price,desc,categ} = req.body
        const result =  await req.user.createExpense({price,desc,categ})
        res.status(201).json({allExpense:[result],message:'successful'})
    }
    catch(err){
        res.status(500).json({success:false,message:'unable to create expense table'})
    } 
}

exports.getExpense = async(req,res)=>{
    try{
        const id = req.user.id
        const ispremium = Number(req.user.ispremium)
        // console.log(req.user.ispremium,'consoling user')
        const expenseData = await Expense.findAll({where:{userId:id}})
        const userFiles = await fileData.findAll({where:{userId:id}})
        if(expenseData){
            return res.status(200).json({success:true,message:expenseData,premium:ispremium,hasFiles:userFiles})
        }
    }
    catch(err){
        res.status(404).json({success:false,message:err})
    }
}

exports.delData = async(req,res)=>{
    try{
        const user  = req.user.id
        const listId = req.params.id
        const expense = await Expense.destroy({where:{id:listId,userId:user}})
        console.log(expense)
        res.status(200).json({message:'successfully deleted'})       
    }
    catch(err){
        res.status(500).json({success:false,message:'unable to delete feilds'})
    }
}

exports.downloadExpense = async(req,res)=>{
    const userId = req.user.id
    try{
        const checkUserPremium = await User.findOne({where:{id:userId}})
        console.log(checkUserPremium.ispremium,'premium',typeof(checkUserPremium.ispremium))
        if(checkUserPremium.ispremium === '1'){
            const expenses = await Expense.findAll({where:{userId:userId}})
            const stringifiedExpenses = JSON.stringify(expenses)
            const fileName = `Expense${userId}/${new Date()}.txt`
            const fileURL = await S3service.uploadToS3(stringifiedExpenses,fileName)
            if(fileURL){
                await fileData.create({
                    URL:fileURL,
                    userId:userId
                })
            }
            const previousFiles = await fileData.findAll({where:{userId:userId}})
            console.log(previousFiles)
            return res.status(201).json({fileURL,success:true,userData:previousFiles})

        }else{
            throw new Error
        }
    }catch(err){
        return res.status(403).json({success:false,message:'Not a premium user(or) failed at S3',error:err})
    }        
}

exports.getExpensesPerPage = async(req,res)=>{
    
    try{
        console.log(req.query)
        let userId = req.user.id
        // if(req.query.expPerPage===0||'undefined'){
        //     req.query.expPerPage = 2
        //     console.log('done')
        // }
        const ispremium = Number(req.user.ispremium)
        let page = Number(req.query.page || 1)
        let expensesPerPage = Number(req.query.expPerPage)
        console.log(page,expensesPerPage)
        const offset = (page-1)*expensesPerPage
        const expneseInfo = await Expense.findAll({where:{userId:userId},offset: offset, limit: expensesPerPage})
        let totalExpenses = await Expense.count({where:{userId:userId}})
        const userFiles = await fileData.findAll({where:{userId:userId}})
        console.log(totalExpenses)
        let lastPage = Math.ceil(totalExpenses/expensesPerPage)
        return res.status(200).json({
            allExpense:expneseInfo,
            currentPage:page,
            hasNextPage:(expensesPerPage*page)<totalExpenses,
            nextPage:page+1,
            hasPreviousPage:page>1,
            previousPage:page-1,
            limit:expensesPerPage,
            lastPage:lastPage,
            ispremium:ispremium,
            hasFiles:userFiles
        })
    }
    catch(err){
        console.log(err,'error happend at expense per page')
    }
    
}