const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const Sequelize = require('sequelize');
const sequelize = new Sequelize('employees_demo', 'wondo', 'password', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const employees = sequelize.define('employees', {
    'emp_no': {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    'birth_date': Sequelize.DATE,
    'first_name': Sequelize.STRING,
    'last_name': Sequelize.STRING,
    'gender': Sequelize.ENUM('M', 'F'),
    'hire_date': Sequelize.DATE,
}, {
    freezeTableName: true,
});

app.get('/', (req, res) => {
    res.send('Welcome to my api')
});

app.get('/api/employees_demo', (req, res) => {
    employees.findAll().then(employees => {
        res.json(employees)
    })
});

app.put('/api/employees_demo', (req, res) => {
    const update = {
        emp_no: req.body.emp_no,
        birth_date: req.body.birth_date,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        gender: req.body.gender,
        hire_date: req.body.hire_date
    }
    employees.update(update, {
            where: {
                emp_no: req.body.emp_no
            }
        })
        .then(affectedRow => {
            return employees.findOne({
                emp_no: req.body.emp_no
            }, {
                returning: true,
                where: {}
            })
        })
        .then(DataRes => {
            res.json({
                "status": "success",
                "message": "participants change",
                "data": DataRes
            })
        })
})

app.delete('/api/employees_demo/:emp_no', (req, res) => {
    employees.destroy({
            where: {
                emp_no: req.params.emp_no
            }
        })
        .then(affectedRow => {
            if (affectedRow) {
                return {
                    "status": "success",
                    "message": "Participants deleted",
                    "data": null
                }
            }
            return {
                "status": "error",
                "message": "failed",
                "data": null
            }
        })
        .then(deleteData => {
            res.json(deleteData)
        })
})

app.listen(3000, () => console.log('App listen port 3000'));