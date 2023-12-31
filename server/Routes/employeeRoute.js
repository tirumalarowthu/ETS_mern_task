const express = require("express")
const Employee = require("../models/employee")
const employeeRoute = express.Router()

//create new employee
employeeRoute.post("/create/employee", async (req, res) => {
    const { f_Name, f_Email, f_Mobile, f_Designation, f_Gender, f_Course, f_Image } = req.body
    try {
        const isEmployeeExits = await Employee.findOne({ f_Email })

        if (!isEmployeeExits) {
            const data = await Employee.create(req.body)
            res.status(201).json({ msg: "A new employee has been created successfully.", EmployeeDetails: data })
        } else {
            res.status(409).json({ msg: "Employee already exists with the email." })
        }
    } catch (err) {
        res.status(500).send(err.message)
    }


})

//Get all employee details
employeeRoute.get("/allEmployees", async (req, res) => {
    try {
        const employeeList = await Employee.find({})
        if (employeeList.length > 0) {
            res.status(200).json({ employeeList })
        } else {
            res.status(200).json({ employeeList })
        }
    } catch (err) {
        console.log(err.message)
    }
})

//Get one employee details
employeeRoute.get("/employee/:id", async (req, res) => {
    try {
        const employeeDetails = await Employee.findById(req.params.id);
        if (!employeeDetails) {
            res.status(404).json({ msg: "Employee not found in records." });
            return;
        }
        res.status(200).json({ employeeDetails });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

//Edit employee details 
employeeRoute.patch("/edit/employee/:id", async (req, res) => {
    try {
        const employeeDetails = await Employee.findById(req.params.id);
        if (!employeeDetails) {
            res.status(404).json({ msg: "Employee not found in records." });
            return;
        }

        // Check if the updated email is unique 
        const existingEmployeeWithUpdatedEmail = await Employee.findOne({
            email: req.body.f_Email,
            _id: { $ne: req.params.id } 
        });

        if (existingEmployeeWithUpdatedEmail) {
            res.status(409).json({ msg: "Email already exists for another employee." });
            return;
        }

        // Update the employee's data
        const updatedData = await Employee.findByIdAndUpdate(
            { _id: req.params.id },
            req.body,
            { new: true }
        );

        if (updatedData) {
            res.json({ msg: `${updatedData.f_Name}'s details have been updated successfully.`, newData: updatedData });
        }
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

//delete Employee
employeeRoute.delete("/delete/employee/:id", async (req, res) => {
    try {
        const isEmployeeExits = await Employee.findById(req.params.id)
        if (isEmployeeExits) {
            await Employee.findByIdAndDelete(req.params.id)
            res.json({msg:"Employeed deleted successfully."})
        } else {
            res.status(404).json({msg:"Employee not exits."})
        }
    } catch (err) {   
        res.status(500).json({ msg: err.message })
    }


})

module.exports = employeeRoute