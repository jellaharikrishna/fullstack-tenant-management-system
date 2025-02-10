const express = require('express');

const sqlite3 = require('sqlite3');
const {open} = require('sqlite');

const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express()
app.use(express.json())

app.use(cors({
    origin: "http://localhost:3000", // Removed trailing slash
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true // Include credentials if required
}));
  

const dbPath = path.join(__dirname, "tenants.db")
let db = null

const initializeDBAndServer = async () => {
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        })

        await db.exec(`
            
            CREATE TABLE IF NOT EXISTS user (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR(250) NOT NULL,
                email TEXT,
                password TEXT
            );
            
            CREATE TABLE IF NOT EXISTS tenantsDetails(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                mobilenumber TEXT NOT NULL,
                monthlyrent TEXT NOT NULL,
                flatsize TEXT NOT NULL,
                location TEXT NOT NULL,
                user_id INTEGER NOT NULL,
                FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
            )

        `)
    
            
        app.listen(5000, () => {
            console.log("Server is running at port 5000...")
            
        })
        
    } catch (e) {
        console.log(`DB error: ${e.message}`)
        process.exit(1);
    }
}

initializeDBAndServer()

// middleware authentication
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers["authorization"]
    const jwtToken = authHeader && authHeader.split(' ')[1]

    if (jwtToken === undefined) {
        res.status(401).send({msg: "Invalid jwt token"})
    } else {
        jwt.verify(jwtToken, "nxtwave", async (error, payload) => {
            if (error) {
                res.status(401).send({msg: "Invalid jwt token"})
            } else {
                req.email = payload.email
                next()
            }
        })
    }
}
    
// register new user
app.post('/register', async (req, res) => {
    const {name, email, password} = req.body
    const getUser = `SELECT * FROM user WHERE email = ?`
    const dbUser = await db.get(getUser, [email])

    if (dbUser === undefined){
        const hashedPassword = await bcrypt.hash(password, 10)
        const createUser = `INSERT INTO user (name, email, password) VALUES (?, ?, ?)`
        const dbResponse =  await db.run(createUser, [name, email, hashedPassword])
        const newUserId = dbResponse.lastID
        res.send({msg: `New user created successfully with id: ${newUserId}`})
    } else {
        res.status(400).send({msg: 'User already exists'})
    }
})

// user login
app.post('/login', async (req, res) => {
    const {email, password} = req.body
    const getUser = `SELECT * FROM user WHERE email = ?`
    const dbUser = await db.get(getUser, [email])

    if (dbUser === undefined) {
        res.status(400).send({msg: "Invalid user"})
    } else {
        const isPasswordMatch = await bcrypt.compare(password, dbUser.password)
        if (isPasswordMatch) {
            const payload = {email: email}
            const jwtToken = jwt.sign(payload, "nxtwave")
            res.send({msg: "User login successfully", jwtToken})
        } else {
            res.status(400).send({msg: "Invalid password"})
        }
    }
})


// adding new tenant
app.post('/tenants', authenticateToken, async (req, res) => {
    try {
        const {email} = req
        const {name, mobilenumber, monthlyrent, flatsize, location} = req.body
        const getUserProfile = `SELECT id FROM user WHERE email = ?`
        const userProfile = await db.get(getUserProfile, [email])
        const {id} = userProfile

        if (mobilenumber.length === 10) {
            const newQuery = `INSERT INTO 
            tenantsDetails (name, mobilenumber, monthlyrent, flatsize, location, user_id)
            VALUES (?,?,?,?,?,?)`
            await db.run(newQuery, [name, mobilenumber, monthlyrent, flatsize, location, id])
            res.send({msg: 'New tenant added successfully'})
        } else {
            res.status(400).send({msg: `Mobile number should be ten digits`})
        }
    } catch (e) {
        res.status(500).send({msg: `${e.message}`})
    }
})

// tenants array
app.get("/tenants", authenticateToken, async(req,res)=>{
    try {
        const {email} = req
        const getUserProfile = `SELECT id FROM user WHERE email = ?`
        const userProfile = await db.get(getUserProfile, [email])
        const {id} = userProfile

        const getUserTenants = `SELECT * FROM tenantsDetails WHERE user_id = ? `
        const userTenantsArray = await db.all(getUserTenants, [id])
        res.send(userTenantsArray)
    } catch (e) {
        res.status(500).send({msg: `${e.message}`})
    }
})

// tenant object
app.get("/tenants/:tenantId", authenticateToken, async(req,res)=>{
    try {
        const {tenantId} = req.params
        const getUserTenant = `SELECT * FROM tenantsDetails WHERE id = '${tenantId}' `
        const userTenantObject = await db.get(getUserTenant)
        res.send(userTenantObject)
    } catch (e) {
        res.status(500).send({msg: `${e.message}`})
    }
})

// update tenant object
app.put("/tenants/:tenantId", authenticateToken, async(req,res)=>{
    try {
        const {tenantId} = req.params
        const {name, mobilenumber, monthlyrent, flatsize, location} = req.body

        const getUserTenant = `SELECT id FROM tenantsDetails WHERE id = '${tenantId}' `
        const userTenantObject = await db.get(getUserTenant)

        if (userTenantObject === undefined) {
            res.status(400).send({msg: `Tenant details with id: ${tenantId} Not Found`})
        } else {
            if (mobilenumber.length === 10) {
                const updateTenant = `UPDATE tenantsDetails 
                SET name = '${name}',
                    mobilenumber = '${mobilenumber}',
                    monthlyrent = '${monthlyrent}',
                    flatsize = '${flatsize}',
                    location = '${location}'
                WHERE id = '${tenantId}'`
                await db.run(updateTenant)
                res.send({msg: "Updated tenant details"})
            } else {
                res.status(400).send({msg: `Mobile number should be ten digits`})
            }
        }
    
    } catch (e) {
        res.status(500).send({msg: `${e.message}`})
    }
})

// delete tenant object
app.delete("/tenants/:tenantId", authenticateToken, async(req,res)=>{
    try {
        const {tenantId} = req.params
        const getUserTenant = `SELECT id FROM tenantsDetails WHERE id = '${tenantId}' `
        const userTenantObject = await db.get(getUserTenant)

        if (userTenantObject === undefined) {
            res.status(400).send({msg: `Tenant details with id: ${tenantId} Not Found`})
        } else {
            const deleteTenant = `DELETE FROM tenantsDetails WHERE id = '${tenantId}'`
            await db.run(deleteTenant)
            res.send({msg: 'Deleted tenant details'})
        }
    } catch (e) {
        res.status(500).send({msg: `${e.message}`})
    }
})


// user profile
app.get('/profile', authenticateToken, async (req, res) => {
    try {
        const {email} = req
        const getUserProfile = `SELECT * FROM user WHERE email = ?`
        const userProfile = await db.get(getUserProfile, [email])
        res.send(userProfile)
    } catch (e) {
        res.status(500).send({msg:`User profile not found: ${e.message}`})
    }
})


// user profile changePassword 
app.put("/profile", authenticateToken, async (req,res) => {
    try {
        const {email} = req
        const {currentPassword, newPassword} = req.body
        const getUserProfile = `SELECT * FROM user WHERE email = ?`
        const userProfile = await db.get(getUserProfile, [email])

        const matchCurrentPassword = await bcrypt.compare(currentPassword, userProfile.password)
        const newHashedPassword = await bcrypt.hash(newPassword,10)

        if (matchCurrentPassword === true){
            const updatePassword = `UPDATE user SET password ='${newHashedPassword}' WHERE email = ?`
            await db.run(updatePassword, [email])
            res.send({msg: 'New password updated successfully'});
        }else{
            res.status(400).send({msg: "Invalid current password"})
        }
    } catch (e) {
        res.status(500).send({msg:`User profile not found: ${e.message}`})
    }
})


// DELETE user profile
app.delete("/profile/:id", authenticateToken, async (req, res) => {
    try {
        const {email} = req
        const {id} = req.params
        const deleteUser = `DELETE FROM user WHERE email = ?`
        const userTenantsDetailsDeleted = `DELETE FROM tenantsDetails WHERE user_id = ?`
        await db.run(userTenantsDetailsDeleted, [id])
        await db.run(deleteUser, [email])
        res.send({msg: "User deleted successfully"})
    } catch (e) {
        res.status(500).send({msg:`User profile not found: ${e.message}`})
    }
})