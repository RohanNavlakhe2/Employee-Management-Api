const express = require('express')
const Employee = require('./models/employee')
const app = express()

//connect to db
require('./db/mongoose')

const port = process.env.PORT

//converts the incoming json text body in any req to json object
app.use(express.json())


app.post('/addEmployee',async (req,res) => {
    console.log('add employee body ',req.body)
    const newEmployee = Employee(req.body)
   try {
        await newEmployee.save()
       console.log(newEmployee)
       res.status(201).send({message:'Employee Created Successfully',data:newEmployee})
   }catch (e) {
      res.status(400).send({error:e.message})
   }
})


app.get('/getAllEmployees',async (req,res) => {
    const searchKeyword = req.query.search_keyword

    if(searchKeyword && searchKeyword.trim() !== ''){
        try {
            //if search_keyword is 'ga' then will return all the employess whose name contains 'ga'
            //and flag 'i' stands for case-insensitiveness
            const employees = await Employee.find({emp_name:new RegExp(`${searchKeyword}`,'i')})

            //if search_keyword is 'ga' then will return all the employess whose name starts with 'ga'
            //and flag 'i' stands for case-insensitiveness
            //const employees = await Employee.find({emp_name:new RegExp(`^${searchKeyword}`,'i')})

            //if search_keyword is 'ga' then will return all the employess whose name is exactly 'ga'
            //and it will be case-sensitive means it will not return employees with name 'Ga'
            //const employees = await Employee.find({emp_name:searchKeyword})

            return res.send(employees)
        }catch (e) {
            return res.status(404).send({error:'employees not found'})
        }

    }
    res.send(await Employee.find({}))

})

app.get('/getEmployee/:empId',async (req,res) => {
        try {
            const employee = await Employee.findById(req.params.empId)
            return res.send(employee)
        }catch (e) {
            return res.status(404).send({error:'employee not found'})
        }
})

app.patch('/updateEmployee/:empId',async (req,res) => {

    const updatableFields = ['emp_name','emp_age','emp_address','emp_department','emp_salary']
    const fieldsToUpdate = Object.keys(req.body)

    for(i=0;i<fieldsToUpdate.length;i++){
        if(!updatableFields.includes(fieldsToUpdate[i]))
            return res.status(400).send({error:'invalid fields'})
    }

    try {
        res.send(await Employee.findByIdAndUpdate(req.params.empId,req.body,{new:true,runValidators:true}))
    }catch (e) {
        if(e.name === 'CastError')
          return res.status(404).send({error:'employee not found'})

       return res.status(400).send({error:e.message})
    }

})

app.delete('/deleteEmployee/:empId',async (req,res) => {
    try {
        await Employee.findByIdAndDelete(req.params.empId)
        res.send({message:'Employee Deleted Successfully'})
    }catch (e) {
        return res.status(404).send({error:'employee not found'})
    }
})


app.listen(port,() => {
    console.log('server started')
})