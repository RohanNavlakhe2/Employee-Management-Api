const mongoose = require('mongoose')

const employeeSchema = new mongoose.Schema({
    emp_name: {
        type: String,
        required: true,
        trim: true
    },
    emp_age: {
        type: Number,
        required: true,
        validate: (age) => {
            if (age < 1)
                throw new Error('invalid age')
        }
    },
    emp_address: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    emp_department: {
        type: String,
        required: true,
        trim: true,
    },
    emp_salary: {
        type: Number,
        required: true,
        validate(salary) {
            if (salary <= 0)
                throw new Error('Invalid Salary')
        }
    }
})

employeeSchema.methods.toJSON = function () {
    const employee = this.toObject()
    employee['emp_id'] = employee['_id']
    delete employee['_id']
    delete employee['__v']
    return employee

}

const Employee = mongoose.model('Employee', employeeSchema)

module.exports = Employee