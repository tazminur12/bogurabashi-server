require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const multer = require('multer');

const app = express();
const port = process.env.PORT || 3000;

// ✅ CORS Setup for React Frontend (withCredentials)
app.use(cors({
    origin: ['http://localhost:5173', 'https://bogurabashi.netlify.app', 'https://bogurabashi.com'], // Development
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer instance to parse multipart/form-data with fields only (no files)
const upload = multer();

// ✅ MongoDB URI (Environment Variables used)
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@tanimweb.1iucvax.mongodb.net/?retryWrites=true&w=majority&appName=TanimWeb`;

// ✅ MongoDB client setup
const client = new MongoClient(uri, {
    serverApi: ServerApiVersion.v1,
    tls: true,
    tlsAllowInvalidCertificates: true // 🔐 Only for development
});

// ✅ JWT Verification Middleware
function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).send({ error: 'Unauthorized: No token' });

    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).send({ error: 'Forbidden: Invalid token' });
        req.decoded = decoded;
        next();
    });
}

async function run() {
    try {
        // await client.connect();
        // console.log("✅ MongoDB Connected");
        //All Collections
        const db = client.db("bogurabashi");
        const donorsCollection = db.collection("donors");
        const hospitalsCollection = db.collection("hospitals");
        const doctorCollection = db.collection('doctors');
        const ambulanceCollection = db.collection("ambulances");
        const fireStationCollection = db.collection("fire-stations");
        const policeStationCollection = db.collection('policestations');
        const lawyerCollection = db.collection("lawyers");
        const stationsCollection = db.collection('stations');
        const journalistCollection = db.collection('journalists');
        const destinationCollection = db.collection("destinations");
        const busCollection = db.collection('buses');
        const courierCollection = db.collection("couriers");
        const educationCollection = db.collection("educations");
        const electricityCollection = db.collection("electricities");
        const internetCollection = db.collection("internetProviders");
        const newsCollection = db.collection("news");
        const noticesCollection = db.collection("notices");
        const eshebaCollection = db.collection("esheba");
        const unionsCollection = db.collection("unions");
        const waterOfficesCollection = db.collection("waterOffices");
        const municipalityCollection = db.collection("municipalities");
        const restaurantsCollection = db.collection("restaurants");
        const eventsCollection = db.collection("events");
        const rentCarsCollection = db.collection("rent_cars");
        const blogCollection = db.collection("blogs");
        const famousCollection = db.collection("famous");
        const contactsCollection = db.collection("contacts");
        const adsCollection = db.collection('ads');
        const contentCreatorsCollection = db.collection('content-creators');
        const slidersCollection = db.collection('sliders');
        const partnersCollection = db.collection('partners');
        const disasterReportsCollection = db.collection('disaster-reports');

        // ✅ Root Endpoint
        app.get("/", (req, res) => {
            res.send("🚀 Server is running and connected to MongoDB");
        });

        // ✅ Generate JWT Token
        app.post("/login", (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "2h" });
            res.send({ token });
        });

        // ✅ Server: GET /donors with pagination
        app.get("/donors", async (req, res) => {
            try {
                const donors = await donorsCollection.find().toArray();
                res.send({
                    totalDonors: donors.length,
                    data: donors,
                });
            } catch (err) {
                console.error(err);
                res.status(500).json({ error: "Failed to fetch donors" });
            }
        });



        // ✅ Add a new donor
        app.post("/donors", async (req, res) => {
            const newDonor = req.body;
            try {
                const result = await donorsCollection.insertOne(newDonor);
                res.send(result);
            } catch (err) {
                res.status(500).send({ error: "❌ Failed to add donor" });
            }
        });

        // ✅ Delete donor by ID
        app.delete("/donors/:id", async (req, res) => {
            const id = req.params.id;
            try {
                const result = await donorsCollection.deleteOne({ _id: new ObjectId(id) });
                res.send(result);
            } catch (err) {
                res.status(500).send({ error: "❌ Failed to delete donor" });
            }
        });

        app.get("/hospitals", async (req, res) => {
            try {
                const hospitals = await hospitalsCollection.find().toArray();
                res.send(hospitals); // ✅ সরাসরি অ্যারে পাঠাও
            } catch (error) {
                console.error("Failed to get hospitals:", error);
                res.status(500).send({ error: "Failed to get hospitals" });
            }
        });


        // Get hospital by ID (optional)
        app.get("/hospitals/:id", async (req, res) => {
            try {
                const id = req.params.id;
                const hospital = await hospitalsCollection.findOne({ _id: new ObjectId(id) });
                if (!hospital) return res.status(404).send({ error: "Hospital not found" });
                res.send(hospital);
            } catch (error) {
                console.error("Failed to get hospital:", error);
                res.status(500).send({ error: "Failed to get hospital" });
            }
        });

        // Add new hospital
        app.post("/hospitals", async (req, res) => {
            try {
                const hospitalData = req.body;
                // Validate data here if needed
                const result = await hospitalsCollection.insertOne(hospitalData);
                res.send(result);
            } catch (error) {
                console.error("Failed to add hospital:", error);
                res.status(500).send({ error: "Failed to add hospital" });
            }
        });

        // Update hospital by ID
        app.put("/hospitals/:id", async (req, res) => {
            try {
                const id = req.params.id;
                const updatedData = req.body;
                const result = await hospitalsCollection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: updatedData }
                );
                res.send(result);
            } catch (error) {
                console.error("Failed to update hospital:", error);
                res.status(500).send({ error: "Failed to update hospital" });
            }
        });

        // Delete hospital by ID
        app.delete("/hospitals/:id", async (req, res) => {
            try {
                const id = req.params.id;
                const result = await hospitalsCollection.deleteOne({ _id: new ObjectId(id) });
                res.send(result);
            } catch (error) {
                console.error("Failed to delete hospital:", error);
                res.status(500).send({ error: "Failed to delete hospital" });
            }
        });

        // Get all doctors
        app.get('/api/doctors', async (req, res) => {
            const doctors = await doctorCollection.find().toArray();
            res.send(doctors);
        });

        // Add a new doctor
        app.post('/api/doctors', async (req, res) => {
            const newDoctor = req.body;
            const result = await doctorCollection.insertOne(newDoctor);
            res.send(result);
        });

        // Delete a doctor
        app.delete('/api/doctors/:id', async (req, res) => {
            const id = req.params.id;
            const result = await doctorCollection.deleteOne({ _id: new ObjectId(id) });
            res.send(result);
        });

        // Get single doctor for edit (optional)
        app.get('/api/doctors/:id', async (req, res) => {
            const id = req.params.id;
            const doctor = await doctorCollection.findOne({ _id: new ObjectId(id) });
            res.send(doctor);
        });

        // Update doctor
        app.put('/api/doctors/:id', async (req, res) => {
            const id = req.params.id;
            const updatedData = req.body;
            const result = await doctorCollection.updateOne(
                { _id: new ObjectId(id) },
                { $set: updatedData }
            );
            res.send(result);
        });

        // Get all ambulances
        app.get("/ambulances", async (req, res) => {
            const ambulances = await ambulanceCollection.find({}).toArray();
            res.send(ambulances);
        });
        // Get ambulance by id
        app.get("/ambulances/:id", async (req, res) => {
            try {
                const id = req.params.id;
                const ambulance = await ambulanceCollection.findOne({ _id: new ObjectId(id) });
                if (!ambulance) {
                    return res.status(404).send({ message: "অ্যাম্বুলেন্স পাওয়া যায়নি" });
                }
                res.send(ambulance);
            } catch (error) {
                res.status(500).send({ message: "ডাটা আনার সময় সমস্যা হয়েছে", error });
            }
        });
        // Add new ambulance
        app.post("/ambulances", async (req, res) => {
            try {
                const newAmbulance = req.body;
                const result = await ambulanceCollection.insertOne(newAmbulance);
                res.send(result); // insertedId থাকবে
            } catch (error) {
                res.status(500).send({ message: "অ্যাম্বুলেন্স যোগ করতে সমস্যা হয়েছে", error });
            }
        });

        // Delete ambulance by id
        app.delete("/ambulances/:id", async (req, res) => {
            const id = req.params.id;
            const result = await ambulanceCollection.deleteOne({ _id: new ObjectId(id) });
            res.send(result);
        });

        // Edit ambulance by id
        app.put("/ambulances/:id", async (req, res) => {
            const id = req.params.id;
            const updatedData = req.body; // ধরছি frontend থেকে সম্পূর্ণ বা আংশিক ডাটা আসবে

            try {
                const result = await ambulanceCollection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: updatedData }
                );

                if (result.matchedCount === 0) {
                    return res.status(404).send({ message: "অ্যাম্বুলেন্স পাওয়া যায়নি" });
                }

                res.send({ message: "সফলভাবে আপডেট হয়েছে", result });
            } catch (error) {
                res.status(500).send({ message: "আপডেট করতে সমস্যা হয়েছে", error });
            }
        });

        //get All data
        app.get('/fire-stations', async (req, res) => {
            try {
                const stations = await fireStationCollection.find().toArray();
                res.json(stations); // JSON রেসপন্স নিশ্চিত করুন
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });

        // POST: নতুন ফায়ার স্টেশন যোগ করুন
        app.post('/fire-stations', async (req, res) => {
            try {
                const newStation = req.body;
                const result = await fireStationCollection.insertOne(newStation);
                res.status(201).json({ insertedId: result.insertedId });
            } catch (error) {
                console.error('Error adding fire station:', error);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });

        // PUT: আইডি অনুসারে ফায়ার স্টেশন আপডেট করুন
        app.put('/fire-stations/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const updatedData = req.body;

                const result = await fireStationCollection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: updatedData }
                );

                if (result.matchedCount === 0) {
                    return res.status(404).json({ message: 'Fire station not found' });
                }

                res.json({ message: 'Updated successfully' });
            } catch (error) {
                console.error('Error updating fire station:', error);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });
        // GET: একটি নির্দিষ্ট ফায়ার স্টেশনের তথ্য আনুন (আইডি অনুসারে)
        app.get('/fire-stations/:id', async (req, res) => {
            try {
                const id = req.params.id;

                if (!ObjectId.isValid(id)) {
                    return res.status(400).json({ message: 'Invalid ID format' });
                }

                const fireStation = await fireStationCollection.findOne({ _id: new ObjectId(id) });

                if (!fireStation) {
                    return res.status(404).json({ message: 'Fire station not found' });
                }

                res.status(200).json(fireStation);
            } catch (error) {
                console.error('Error fetching fire station by ID:', error);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });



        // DELETE: আইডি অনুসারে ফায়ার স্টেশন মুছে ফেলুন
        app.delete('/fire-stations/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const result = await fireStationCollection.deleteOne({ _id: new ObjectId(id) });

                if (result.deletedCount === 0) {
                    return res.status(404).json({ message: 'Fire station not found' });
                }

                res.json({ message: 'Deleted successfully' });
            } catch (error) {
                console.error('Error deleting fire station:', error);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });
        // Get all police stations
        app.get('/policestations', async (req, res) => {
            try {
                const stations = await policeStationCollection.find({}).toArray();
                res.status(200).json(stations);
            } catch (error) {
                console.error("Error fetching stations:", error);
                res.status(500).json({ message: 'Server error fetching stations' });
            }
        });

        // Get a single police station by ID
        app.get('/policestations/:id', async (req, res) => {
            const { id } = req.params;

            if (!ObjectId.isValid(id)) {
                return res.status(400).json({ message: 'Invalid station ID' });
            }

            try {
                const station = await policeStationCollection.findOne({ _id: new ObjectId(id) });

                if (!station) {
                    return res.status(404).json({ message: 'Station not found' });
                }

                res.status(200).json(station);
            } catch (error) {
                console.error("Error fetching station by ID:", error);
                res.status(500).json({ message: 'Server error fetching station' });
            }
        });

        // Add a new police station
        app.post('/policestations', async (req, res) => {
            const { name, address, officer, contact, services, image } = req.body;
        
            if (!name || !address || !officer) {
                return res.status(400).json({ message: 'Name, address, and officer are required' });
            }
        
            try {
                const newStation = {
                    name,
                    address,
                    officer,
                    contact: contact || '',
                    services: Array.isArray(services) ? services : [],
                    image: image || ''
                };
                const result = await policeStationCollection.insertOne(newStation);
                res.status(201).json({ insertedId: result.insertedId });
            } catch (error) {
                console.error("Error adding station:", error);
                res.status(500).json({ message: 'Server error adding station' });
            }
        });
        
        // Update police station by ID
        app.put('/policestations/:id', async (req, res) => {
            const { id } = req.params;
          
            if (!ObjectId.isValid(id)) {
              return res.status(400).json({ message: 'Invalid station ID' });
            }
          
            // প্রয়োজনীয় ফিল্ড গুলো নিন, ফ্রন্টএন্ড থেকে আসা ফিল্ডগুলোর সাথে মিল রেখে
            const {
              name,
              address,
              officer,
              contact,
              services,
              image
            } = req.body;
          
            // খুবই বেসিক ভ্যালিডেশন (আপনার প্রয়োজন অনুসারে বাড়াতে পারেন)
            if (!name || !address || !officer) {
              return res.status(400).json({ message: 'Name, address, and officer are required' });
            }
          
            // আপডেট করার জন্য নতুন অবজেক্ট তৈরি
            const updatedStation = {
              name,
              address,
              officer,
              contact: contact || '',
              services: Array.isArray(services) ? services : [],
              image: image || ''
            };
          
            try {
              const result = await policeStationCollection.updateOne(
                { _id: new ObjectId(id) },
                { $set: updatedStation }
              );
          
              if (result.matchedCount === 0) {
                return res.status(404).json({ message: 'Station not found' });
              }
          
              res.status(200).json({ message: 'Station updated successfully' });
            } catch (error) {
              console.error("Error updating station:", error);
              res.status(500).json({ message: 'Server error updating station' });
            }
          });
          
        // Delete police station by ID
        app.delete('/policestations/:id', async (req, res) => {
            const { id } = req.params;

            if (!ObjectId.isValid(id)) {
                return res.status(400).json({ message: 'Invalid station ID' });
            }

            try {
                const result = await policeStationCollection.deleteOne({ _id: new ObjectId(id) });

                if (result.deletedCount === 0) {
                    return res.status(404).json({ message: 'Station not found' });
                }

                res.status(200).json({ message: 'Station deleted successfully' });
            } catch (error) {
                console.error("Error deleting station:", error);
                res.status(500).json({ message: 'Server error deleting station' });
            }
        });

        // Get all lawyers
        app.get("/lawyers", async (req, res) => {
            try {
                const lawyers = await lawyerCollection.find({}).toArray();
                res.json(lawyers);
            } catch (error) {
                res.status(500).json({ message: "Internal server error" });
            }
        });
        // Get a single lawyer by ID
        app.get("/lawyers/:id", async (req, res) => {
            const id = req.params.id;

            try {
                const lawyer = await lawyerCollection.findOne({ _id: new ObjectId(id) });

                if (!lawyer) {
                    return res.status(404).json({ message: "Lawyer not found" });
                }

                res.json(lawyer);
            } catch (error) {
                console.error("Error fetching lawyer:", error);
                res.status(500).json({ message: "Internal server error" });
            }
        });
        // Add a new lawyer
        app.post("/lawyers", async (req, res) => {
            try {
                const newLawyer = req.body;

                // Optionally ensure default approved: false
                newLawyer.approved = false;

                const result = await lawyerCollection.insertOne(newLawyer);
                res.status(201).json({ insertedId: result.insertedId });
            } catch (error) {
                console.error("Error adding lawyer:", error);
                res.status(500).json({ message: "Failed to add lawyer" });
            }
        });
        // Edit a lawyer by ID
        app.put("/lawyers/:id", async (req, res) => {
            const id = req.params.id;
            const updateData = req.body;

            try {
                const result = await lawyerCollection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: updateData }
                );

                if (result.modifiedCount === 1) {
                    res.json({ message: "Lawyer updated successfully", success: true });
                } else {
                    res.status(404).json({ message: "Lawyer not found or no changes" });
                }
            } catch (error) {
                console.error("Error updating lawyer:", error);
                res.status(400).json({ message: "Invalid request" });
            }
        });


        // Delete lawyer by ID
        app.delete("/lawyers/:id", async (req, res) => {
            const id = req.params.id;
            try {
                const result = await lawyerCollection.deleteOne({ _id: new ObjectId(id) });
                if (result.deletedCount === 1) {
                    res.json({ deletedCount: 1 });
                } else {
                    res.status(404).json({ message: "Lawyer not found" });
                }
            } catch (error) {
                res.status(400).json({ message: "Invalid ID" });
            }
        });

        // Update (approve) lawyer
        app.patch("/lawyers/:id", async (req, res) => {
            const id = req.params.id;
            const updateData = req.body; // e.g., { approved: true }

            try {
                const result = await lawyerCollection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: updateData }
                );

                if (result.modifiedCount === 1) {
                    res.json({ modifiedCount: 1, success: true });
                } else {
                    res.status(404).json({ message: "Lawyer not found or no changes made" });
                }
            } catch (error) {
                res.status(400).json({ message: "Invalid ID" });
            }
        });


        // GET all stations
        app.get('/stations', async (req, res) => {
            try {
                const stations = await stationsCollection.find({}).toArray();
                res.status(200).json(stations);
            } catch (err) {
                console.error('Error fetching stations:', err);
                res.status(500).json({ message: 'Server error while fetching stations' });
            }
        });

        app.get('/stations/:id', async (req, res) => {
            const id = req.params.id;

            try {
                const station = await stationsCollection.findOne({ _id: new ObjectId(id) });

                if (!station) {
                    return res.status(404).json({ message: 'স্টেশন খুঁজে পাওয়া যায়নি' });
                }

                res.status(200).json(station);
            } catch (err) {
                console.error('Error fetching station:', err);
                res.status(500).json({ message: 'স্টেশনের তথ্য আনতে সমস্যা হয়েছে' });
            }
        });

        // POST new station
        app.post('/stations', async (req, res) => {
            try {
                const stationData = req.body;
                const result = await stationsCollection.insertOne(stationData);
                res.status(201).json({ ...stationData, _id: result.insertedId });
            } catch (err) {
                console.error('Error creating station:', err);
                res.status(400).json({ message: err.message });
            }
        });

        app.put('/stations/:id', async (req, res) => {
            const stationId = req.params.id;
            const updateData = req.body;
          
            try {
              let filter;
          
              // ✅ Check if ID is valid ObjectId
              if (ObjectId.isValid(stationId)) {
                filter = { _id: new ObjectId(stationId) };
              } else {
                // fallback: maybe you're using custom string ID field
                filter = { id: stationId };
              }
          
              if (updateData._id) delete updateData._id; // don't allow _id update
          
              const result = await stationsCollection.findOneAndUpdate(
                filter,
                { $set: updateData },
                { returnDocument: 'after' }
              );
          
              if (!result.value) {
                return res.status(404).json({ message: 'স্টেশন খুঁজে পাওয়া যায়নি' });
              }
          
              res.status(200).json(result.value);
            } catch (err) {
              console.error('Error updating station:', err);
              res.status(400).json({ message: err.message });
            }
          });
          
          
          

        // DELETE station by id
        app.delete('/stations/:id', async (req, res) => {
            try {
                const stationId = req.params.id;
                const { ObjectId } = require('mongodb');

                const result = await stationsCollection.deleteOne({ _id: new ObjectId(stationId) });

                if (result.deletedCount === 0) {
                    return res.status(404).json({ message: 'Station not found' });
                }

                res.json({ message: 'Station deleted successfully' });
            } catch (err) {
                console.error('Error deleting station:', err);
                res.status(400).json({ message: err.message });
            }
        });
        // ১. GET all journalists
        app.get('/journalists', async (req, res) => {
            try {
                const journalists = await journalistCollection.find().toArray();
                res.json(journalists);
            } catch (error) {
                console.error('Error fetching journalists:', error);
                res.status(500).json({ message: 'সাংবাদিকদের তথ্য আনতে সমস্যা হয়েছে' });
            }
        });
        // Get a single journalist by ID
        app.get('/journalists/:id', async (req, res) => {
            const id = req.params.id;

            try {
                const journalist = await journalistCollection.findOne({ _id: new ObjectId(id) });

                if (!journalist) {
                    return res.status(404).json({ message: 'সাংবাদিক খুঁজে পাওয়া যায়নি' });
                }

                res.json(journalist);
            } catch (error) {
                console.error('Error fetching journalist:', error);
                res.status(500).json({ message: 'সাংবাদিকের তথ্য আনতে সমস্যা হয়েছে' });
            }
        });


        // ২. POST create new journalist
        app.post('/journalists', async (req, res) => {
            try {
                const newJournalist = req.body;
                const result = await journalistCollection.insertOne(newJournalist);
                res.status(201).json({ insertedId: result.insertedId });
            } catch (error) {
                console.error('Error adding journalist:', error);
                res.status(500).json({ message: 'সাংবাদিক যোগ করতে সমস্যা হয়েছে' });
            }
        });

        // ৩. PUT update journalist by id
        app.put('/journalists/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const updatedData = req.body;
                const result = await journalistCollection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: updatedData }
                );
                if (result.matchedCount === 0) {
                    return res.status(404).json({ message: 'সাংবাদিক পাওয়া যায়নি' });
                }
                res.json({ message: 'সাংবাদিকের তথ্য সফলভাবে আপডেট হয়েছে' });
            } catch (error) {
                console.error('Error updating journalist:', error);
                res.status(500).json({ message: 'সাংবাদিকের তথ্য আপডেট করতে সমস্যা হয়েছে' });
            }
        });

        // ৪. DELETE journalist by id
        app.delete('/journalists/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const result = await journalistCollection.deleteOne({ _id: new ObjectId(id) });
                if (result.deletedCount === 0) {
                    return res.status(404).json({ message: 'সাংবাদিক পাওয়া যায়নি' });
                }
                res.json({ message: 'সাংবাদিক সফলভাবে মুছে ফেলা হয়েছে' });
            } catch (error) {
                console.error('Error deleting journalist:', error);
                res.status(500).json({ message: 'সাংবাদিক মুছে ফেলা সম্ভব হয়নি' });
            }
        });

        // ✅ 1. Get All Destinations (Bogura only)
        app.get('/destinations', async (req, res) => {
            const destinations = await destinationCollection.find({ district: "bogura" }).toArray();
            res.send(destinations);
        });

        // ✅ 2. Get Destination Details by ID
        app.get('/destinations/:id', async (req, res) => {
            const id = req.params.id;
            try {
                const destination = await destinationCollection.findOne({ _id: new ObjectId(id) });
                if (!destination) {
                    return res.status(404).send({ message: "Destination not found" });
                }
                res.send(destination);
            } catch (err) {
                res.status(400).send({ message: "Invalid ID format" });
            }
        });

        // ✅ 3. Add New Destination
        app.post('/destinations', async (req, res) => {
            const newDestination = req.body;
            if (!newDestination.name || !newDestination.location || !newDestination.category || !newDestination.district) {
                return res.status(400).send({ message: "Missing required fields" });
            }
            const result = await destinationCollection.insertOne(newDestination);
            res.send(result);
        });

        // ✅ 4. Update Destination by ID
        app.put('/destinations/:id', async (req, res) => {
            try {
              const id = req.params.id;
          
              if (!ObjectId.isValid(id)) {
                return res.status(400).json({ message: 'Invalid destination id' });
              }
          
              const payload = req.body || {};
          
              // অনুমোদিত ফিল্ডগুলো
              const allowedFields = [
                'name',
                'location',
                'category',
                'image',
                'mapLink',
                'district',
                'stayInfo',
                'travelInfo',
                'description',
              ];
          
              // হালকা স্যানিটাইজ/ট্রিম সহ whitelist সেট বানানো
              const setDoc = {};
              for (const key of allowedFields) {
                if (payload[key] !== undefined) {
                  const value = payload[key];
                  setDoc[key] =
                    typeof value === 'string' ? value.trim() : value;
                }
              }
          
              // কিছুই আপডেট করার নেই
              if (Object.keys(setDoc).length === 0) {
                return res.status(400).json({ message: 'No valid fields to update' });
              }
          
              // ঐচ্ছিক: mapLink বেসিক ভ্যালিডেশন
              if (setDoc.mapLink && !/^https?:\/\//i.test(setDoc.mapLink)) {
                return res.status(400).json({ message: 'mapLink must start with http/https' });
              }
          
              const filter = { _id: new ObjectId(id) };
              const updateDoc = { $set: setDoc };
          
              const result = await destinationCollection.updateOne(filter, updateDoc);
          
              return res.status(200).json({
                matchedCount: result.matchedCount,
                modifiedCount: result.modifiedCount,
                acknowledged: result.acknowledged,
              });
            } catch (err) {
              console.error('Update destination error:', err);
              return res.status(500).json({ message: 'Internal Server Error' });
            }
          });

        // ✅ 5. Delete Destination by ID
        app.delete('/destinations/:id', async (req, res) => {
            const id = req.params.id;
            const result = await destinationCollection.deleteOne({ _id: new ObjectId(id) });
            res.send(result);
        });

        // ✅ GET all buses
        app.get('/buses', async (req, res) => {
            const result = await busCollection.find().toArray();
            res.send(result);
        });
        app.get('/buses/:id', async (req, res) => {
            const id = req.params.id;

            try {
                const bus = await busCollection.findOne({ _id: new ObjectId(id) });

                if (!bus) {
                    return res.status(404).json({ message: 'বাস খুঁজে পাওয়া যায়নি' });
                }

                res.json(bus);
            } catch (error) {
                console.error('Error fetching bus:', error);
                res.status(500).json({ message: 'বাসের তথ্য আনতে সমস্যা হয়েছে' });
            }
        });

        // ✅ POST: Add a new bus
        app.post('/buses', async (req, res) => {
            const newBus = req.body;
            const result = await busCollection.insertOne(newBus);
            res.send(result);
        });

        // ✅ DELETE a bus
        app.delete('/buses/:id', async (req, res) => {
            const id = req.params.id;
            const result = await busCollection.deleteOne({ _id: new ObjectId(id) });
            res.send(result);
        });

        // ✅ PUT: Update a bus
        app.put('/buses/:id', async (req, res) => {
            const id = req.params.id;
            const updatedBus = req.body;
            const result = await busCollection.updateOne(
                { _id: new ObjectId(id) },
                { $set: updatedBus }
            );
            res.send(result);
        });

        // 📥 Add New Courier
        app.post("/couriers", async (req, res) => {
            try {
                const newCourier = req.body;
                const result = await courierCollection.insertOne(newCourier);
                res.status(201).send(result);
            } catch (error) {
                res.status(500).send({ message: "Failed to add courier", error });
            }
        });

        // 📤 Get All Couriers (return all without district filter)
        app.get("/couriers", async (req, res) => {
            const couriers = await courierCollection.find().toArray();
            res.send(couriers);
        });

        // 📄 Get Single Courier (optional)
        app.get("/couriers/:id", async (req, res) => {
            const id = req.params.id;
            const courier = await courierCollection.findOne({ _id: new ObjectId(id) });
            res.send(courier);
        });

        // ✏️ Update Courier
        app.put("/couriers/:id", async (req, res) => {
            const id = req.params.id;
            const updatedData = req.body;
            const result = await courierCollection.updateOne(
                { _id: new ObjectId(id) },
                { $set: updatedData }
            );
            res.send(result);
        });

        // ❌ Delete Courier
        app.delete("/couriers/:id", async (req, res) => {
            const id = req.params.id;
            const result = await courierCollection.deleteOne({ _id: new ObjectId(id) });
            res.send(result);
        });

        // 🔹 Get all institutions
        app.get("/educations", async (req, res) => {
            try {
                const result = await educationCollection.find().toArray();
                res.status(200).json({
                    success: true,
                    message: "All education data fetched successfully",
                    data: result,
                });
            } catch (error) {
                console.error("GET /educations Error:", error);
                res.status(500).json({ success: false, message: "Failed to fetch data" });
            }
        });

        // 🔹 Get single institution by ID
        app.get("/educations/:id", async (req, res) => {
            try {
                const id = req.params.id;
                const result = await educationCollection.findOne({ _id: new ObjectId(id) });
                if (result) {
                    res.status(200).json({ success: true, data: result });
                } else {
                    res.status(404).json({ success: false, message: "Not found" });
                }
            } catch (error) {
                console.error("GET /educations/:id Error:", error);
                res.status(500).json({ success: false, message: "Failed to fetch single data" });
            }
        });

        // 🔹 Add a new institution
        app.post("/educations", async (req, res) => {
            try {
                const newInstitute = req.body;
                const result = await educationCollection.insertOne(newInstitute);
                res.status(201).json({
                    success: true,
                    message: "Institute added successfully",
                    insertedId: result.insertedId,
                });
            } catch (error) {
                console.error("POST /educations Error:", error);
                res.status(500).json({ success: false, message: "Failed to add institute" });
            }
        });

        // 🔹 Update an institution
        app.put("/educations/:id", async (req, res) => {
            try {
                const { id } = req.params;
                const updateData = req.body;
                const result = await educationCollection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: updateData }
                );

                if (result.modifiedCount > 0) {
                    res.status(200).json({
                        success: true,
                        message: "Institute updated successfully",
                    });
                } else {
                    res.status(404).json({ success: false, message: "Institute not found or not modified" });
                }
            } catch (error) {
                console.error("PUT /educations/:id Error:", error);
                res.status(500).json({ success: false, message: "Failed to update institute" });
            }
        });

        // 🔹 Delete an institution
        app.delete("/educations/:id", async (req, res) => {
            try {
                const { id } = req.params;
                const result = await educationCollection.deleteOne({ _id: new ObjectId(id) });

                if (result.deletedCount > 0) {
                    res.status(200).json({
                        success: true,
                        message: "Institute deleted successfully",
                    });
                } else {
                    res.status(404).json({ success: false, message: "Institute not found" });
                }
            } catch (error) {
                console.error("DELETE /educations/:id Error:", error);
                res.status(500).json({ success: false, message: "Failed to delete institute" });
            }
        });

        // 🔹 Get all
        app.get('/electricities', async (req, res) => {
            try {
                const result = await electricityCollection.find().toArray();
                res.status(200).json({ success: true, data: result });
            } catch (error) {
                res.status(500).json({ success: false, message: 'Failed to fetch' });
            }
        });

        // 🔹 Get single
        app.get('/electricities/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const result = await electricityCollection.findOne({ _id: new ObjectId(id) });
                result
                    ? res.status(200).json({ success: true, data: result })
                    : res.status(404).json({ success: false, message: 'Not found' });
            } catch (error) {
                res.status(500).json({ success: false, message: 'Error fetching single data' });
            }
        });

        // 🔹 Add
        app.post('/electricities', async (req, res) => {
            try {
                const data = req.body;
                const result = await electricityCollection.insertOne(data);
                res.status(201).json({ success: true, insertedId: result.insertedId });
            } catch (error) {
                res.status(500).json({ success: false, message: 'Failed to add data' });
            }
        });

        // 🔹 Update
        app.put('/electricities/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const data = req.body;
                const result = await electricityCollection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: data }
                );
                result.modifiedCount > 0
                    ? res.status(200).json({ success: true, message: 'Updated successfully' })
                    : res.status(404).json({ success: false, message: 'Not modified or not found' });
            } catch (error) {
                res.status(500).json({ success: false, message: 'Update failed' });
            }
        });

        // 🔹 Delete
        app.delete('/electricities/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const result = await electricityCollection.deleteOne({ _id: new ObjectId(id) });
                result.deletedCount > 0
                    ? res.status(200).json({ success: true, message: 'Deleted successfully' })
                    : res.status(404).json({ success: false, message: 'Not found' });
            } catch (error) {
                res.status(500).json({ success: false, message: 'Delete failed' });
            }
        });

        // 🔹 Get all providers
        app.get('/internet-providers', async (req, res) => {
            try {
                const result = await internetCollection.find().toArray();
                res.status(200).json({ success: true, data: result });
            } catch (error) {
                res.status(500).json({ success: false, message: 'Fetch failed' });
            }
        });

        // 🔹 Get single provider
        app.get('/internet-providers/:id', async (req, res) => {
            try {
                const result = await internetCollection.findOne({ _id: new ObjectId(req.params.id) });
                result
                    ? res.status(200).json({ success: true, data: result })
                    : res.status(404).json({ success: false, message: 'Not found' });
            } catch (err) {
                res.status(500).json({ success: false, message: 'Error fetching single data' });
            }
        });

        // 🔹 Add new provider
        app.post('/internet-providers', async (req, res) => {
            try {
                const data = req.body;
                const result = await internetCollection.insertOne(data);
                res.status(201).json({ success: true, insertedId: result.insertedId });
            } catch (err) {
                res.status(500).json({ success: false, message: 'Insert failed' });
            }
        });

        // 🔹 Update provider
        app.put('/internet-providers/:id', async (req, res) => {
            try {
                const result = await internetCollection.updateOne(
                    { _id: new ObjectId(req.params.id) },
                    { $set: req.body }
                );
                result.modifiedCount > 0
                    ? res.status(200).json({ success: true, message: 'Updated' })
                    : res.status(404).json({ success: false, message: 'Not updated' });
            } catch (err) {
                res.status(500).json({ success: false, message: 'Update failed' });
            }
        });

        // 🔹 Delete provider
        app.delete('/internet-providers/:id', async (req, res) => {
            try {
                const result = await internetCollection.deleteOne({ _id: new ObjectId(req.params.id) });
                result.deletedCount > 0
                    ? res.status(200).json({ success: true, message: 'Deleted' })
                    : res.status(404).json({ success: false, message: 'Not found' });
            } catch (err) {
                res.status(500).json({ success: false, message: 'Delete failed' });
            }
        });

        // নিউজ রুটস
        // 1. সব নিউজ লিস্ট
        app.get("/news", async (req, res) => {
            try {
                const newsList = await newsCollection.find().toArray();
                res.json(newsList);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: "Server error" });
            }
        });

        // 2. একক নিউজ ডিটেইল (ID দিয়ে)
        app.get("/news/:id", async (req, res) => {
            try {
                const id = req.params.id;
                if (!ObjectId.isValid(id)) {
                    return res.status(400).json({ error: "Invalid news ID" });
                }
                const news = await newsCollection.findOne({ _id: new ObjectId(id) });
                if (!news) {
                    return res.status(404).json({ error: "News not found" });
                }
                res.json(news);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: "Server error" });
            }
        });

        // 3. নিউজ যোগ করা (Create)
        app.post("/news", async (req, res) => {
            try {
                const newsData = req.body;

                // প্রয়োজনীয় ফিল্ড ভ্যালিডেশন (আপনার প্রয়োজন অনুযায়ী বাড়াতে পারেন)
                if (!newsData.title || !newsData.content || !newsData.category || !newsData.author) {
                    return res.status(400).json({ error: "Required fields are missing" });
                }

                // publishDate সেট না থাকলে এখনকার সময় সেট করুন
                if (!newsData.publishDate) {
                    newsData.publishDate = new Date();
                } else {
                    newsData.publishDate = new Date(newsData.publishDate);
                }

                // tags যদি স্ট্রিং হয়, তাহলে অ্যারে তে রূপান্তর করুন
                if (newsData.tags && typeof newsData.tags === "string") {
                    newsData.tags = newsData.tags.split(",").map(tag => tag.trim()).filter(Boolean);
                }

                const result = await newsCollection.insertOne(newsData);
                res.status(201).json(result);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: "Server error" });
            }
        });

        // 4. নিউজ আপডেট (Update - patch)
        app.patch("/news/:id", async (req, res) => {
            try {
                const id = req.params.id;
                const updateData = req.body;

                if (!ObjectId.isValid(id)) {
                    return res.status(400).json({ error: "Invalid news ID" });
                }

                // publishDate আপডেট থাকলে Date টাইপে কনভার্ট
                if (updateData.publishDate) {
                    updateData.publishDate = new Date(updateData.publishDate);
                }

                // tags যদি স্ট্রিং হয় তাহলে অ্যারে তে কনভার্ট করুন
                if (updateData.tags && typeof updateData.tags === "string") {
                    updateData.tags = updateData.tags.split(",").map(tag => tag.trim()).filter(Boolean);
                }

                const result = await newsCollection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: updateData }
                );

                if (result.matchedCount === 0) {
                    return res.status(404).json({ error: "News not found" });
                }

                res.json(result);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: "Server error" });
            }
        });

        // 5. নিউজ ডিলিট (Delete)
        app.delete("/news/:id", async (req, res) => {
            try {
                const id = req.params.id;
                if (!ObjectId.isValid(id)) {
                    return res.status(400).json({ error: "Invalid news ID" });
                }
                const result = await newsCollection.deleteOne({ _id: new ObjectId(id) });
                if (result.deletedCount === 0) {
                    return res.status(404).json({ error: "News not found" });
                }
                res.json({ message: "News deleted successfully" });
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: "Server error" });
            }
        });

        // Get all notices
        app.get("/notices", async (req, res) => {
            const notices = await noticesCollection.find().sort({ publishDate: -1 }).toArray();
            res.json(notices);
        });

        // Add notice
        app.post("/notices", async (req, res) => {
            const data = req.body;
            if (!data.title || !data.description) {
                return res.status(400).json({ error: "Title and Description required" });
            }
            if (data.publishDate) data.publishDate = new Date(data.publishDate);
            else data.publishDate = new Date();

            const result = await noticesCollection.insertOne(data);
            res.status(201).json({ message: "Notice added", insertedId: result.insertedId });
        });

        // Update notice
        app.patch("/notices/:id", async (req, res) => {
            const id = req.params.id;
            if (!ObjectId.isValid(id)) return res.status(400).json({ error: "Invalid ID" });
            const data = req.body;
            if (data.publishDate) data.publishDate = new Date(data.publishDate);

            const result = await noticesCollection.updateOne(
                { _id: new ObjectId(id) },
                { $set: data }
            );
            if (result.matchedCount === 0) return res.status(404).json({ error: "Notice not found" });

            res.json({ message: "Notice updated" });
        });

        // Delete notice
        app.delete("/notices/:id", async (req, res) => {
            const id = req.params.id;
            if (!ObjectId.isValid(id)) return res.status(400).json({ error: "Invalid ID" });

            const result = await noticesCollection.deleteOne({ _id: new ObjectId(id) });
            if (result.deletedCount === 0) return res.status(404).json({ error: "Notice not found" });

            res.json({ message: "Notice deleted" });
        });

        // Get single notice by ID
        app.get("/notices/:id", async (req, res) => {
            const id = req.params.id;

            if (!ObjectId.isValid(id)) {
                return res.status(400).json({ error: "Invalid notice ID" });
            }

            try {
                const notice = await noticesCollection.findOne({ _id: new ObjectId(id) });
                if (!notice) {
                    return res.status(404).json({ error: "Notice not found" });
                }
                res.json(notice);
            } catch (error) {
                console.error("Error fetching notice:", error);
                res.status(500).json({ error: "Server error" });
            }
        });

        // GET all e-services
        app.get("/esheba", async (req, res) => {
            const result = await eshebaCollection.find().toArray();
            res.send(result);
        });

        // GET single e-service (optional if needed)
        app.get("/esheba/:id", async (req, res) => {
            const id = req.params.id;
            const result = await eshebaCollection.findOne({ _id: new ObjectId(id) });
            res.send(result);
        });

        // POST new e-service
        app.post("/esheba", async (req, res) => {
            const data = req.body;
            const result = await eshebaCollection.insertOne(data);
            res.send(result);
        });

        // PATCH update e-service
        app.patch("/esheba/:id", async (req, res) => {
            const id = req.params.id;
            const updated = req.body;
            const result = await eshebaCollection.updateOne(
                { _id: new ObjectId(id) },
                { $set: updated }
            );
            res.send(result);
        });

        // DELETE e-service
        app.delete("/esheba/:id", async (req, res) => {
            const id = req.params.id;
            const result = await eshebaCollection.deleteOne({ _id: new ObjectId(id) });
            res.send(result);
        });

        // ✅ Get all unions
        app.get("/unions", async (req, res) => {
            const unions = await unionsCollection.find().toArray();
            res.send(unions);
        });

        // ✅ Get one union by ID
        app.get("/unions/:id", async (req, res) => {
            const id = req.params.id;
            const union = await unionsCollection.findOne({ _id: new ObjectId(id) });
            res.send(union);
        });

        // ✅ Add new union
        app.post("/unions", async (req, res) => {
            const unionData = req.body;
            const result = await unionsCollection.insertOne(unionData);
            res.send(result);
        });

        // ✅ Update union by ID
        app.put("/unions/:id", async (req, res) => {
            const id = req.params.id;
            const updateDoc = {
                $set: req.body,
            };
            const result = await unionsCollection.updateOne(
                { _id: new ObjectId(id) },
                updateDoc
            );
            res.send(result);
        });

        // ✅ Delete union by ID
        app.delete("/unions/:id", async (req, res) => {
            const id = req.params.id;
            const result = await unionsCollection.deleteOne({ _id: new ObjectId(id) });
            res.send(result);
        });

        // সকল গ্যাস ও পানি অফিসের তথ্য আনা
        app.get("/water-offices", async (req, res) => {
            try {
                const offices = await waterOfficesCollection.find().toArray();
                res.json(offices);
            } catch (error) {
                console.error("গ্যাস ও পানি অফিস ডাটা ফেচিং ত্রুটি:", error);
                res.status(500).json({ message: "সার্ভার ত্রুটি হয়েছে" });
            }
        });

        // নির্দিষ্ট অফিসের তথ্য আনা (details page)
        app.get("/water-offices/:id", async (req, res) => {
            try {
                const id = req.params.id;
                const office = await waterOfficesCollection.findOne({ _id: new ObjectId(id) });
                if (!office) return res.status(404).json({ message: "অফিস পাওয়া যায়নি" });
                res.json(office);
            } catch (error) {
                console.error("অফিস ডিটেইলস রিড ত্রুটি:", error);
                res.status(500).json({ message: "সার্ভার ত্রুটি" });
            }
        });

        // নতুন গ্যাস ও পানি অফিস যোগ করা
        app.post("/water-offices", async (req, res) => {
            try {
                const officeData = req.body;
                officeData.createdAt = new Date();
                const result = await waterOfficesCollection.insertOne(officeData);
                res.json(result);
            } catch (error) {
                console.error("অফিস যোগ করার ত্রুটি:", error);
                res.status(500).json({ message: "অফিস যোগ করতে সমস্যা হয়েছে" });
            }
        });

        // অফিসের তথ্য আপডেট
        app.put("/water-offices/:id", async (req, res) => {
            try {
                const id = req.params.id;
                const updateData = { $set: req.body };
                const result = await waterOfficesCollection.updateOne({ _id: new ObjectId(id) }, updateData);
                res.json(result);
            } catch (error) {
                console.error("অফিস আপডেট ত্রুটি:", error);
                res.status(500).json({ message: "অফিস আপডেট করতে সমস্যা হয়েছে" });
            }
        });

        // অফিস মুছে ফেলা
        app.delete("/water-offices/:id", async (req, res) => {
            try {
                const id = req.params.id;
                const result = await waterOfficesCollection.deleteOne({ _id: new ObjectId(id) });
                res.json(result);
            } catch (error) {
                console.error("অফিস ডিলিট ত্রুটি:", error);
                res.status(500).json({ message: "অফিস মুছতে সমস্যা হয়েছে" });
            }
        });

        // ✅ সকল পৌরসভার তথ্য আনুন
        app.get("/municipalities", async (req, res) => {
            try {
                const municipalities = await municipalityCollection.find().sort({ name: 1 }).toArray();
                res.json(municipalities);
            } catch (error) {
                console.error("❌ Fetch Error:", error);
                res.status(500).json({ message: "সার্ভার ত্রুটি হয়েছে" });
            }
        });

        // ✅ নির্দিষ্ট পৌরসভার তথ্য আনুন
        app.get("/municipalities/:id", async (req, res) => {
            try {
                const id = req.params.id;
                const municipality = await municipalityCollection.findOne({ _id: new ObjectId(id) });
                if (!municipality) {
                    return res.status(404).json({ message: "পৌরসভা খুঁজে পাওয়া যায়নি" });
                }
                res.json(municipality);
            } catch (error) {
                console.error("❌ Details Error:", error);
                res.status(500).json({ message: "সার্ভার ত্রুটি" });
            }
        });

        // ✅ নতুন পৌরসভা যোগ করুন
        app.post("/municipalities", async (req, res) => {
            try {
                const data = req.body;
                data.createdAt = new Date();
                const result = await municipalityCollection.insertOne(data);
                res.json(result);
            } catch (error) {
                console.error("❌ Insert Error:", error);
                res.status(500).json({ message: "পৌরসভা যোগ করতে সমস্যা হয়েছে" });
            }
        });

        // ✅ পৌরসভা আপডেট করুন
        app.put("/municipalities/:id", async (req, res) => {
            try {
                const id = req.params.id;
                const updatedData = req.body;
                const result = await municipalityCollection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: updatedData }
                );
                res.json(result);
            } catch (error) {
                console.error("❌ Update Error:", error);
                res.status(500).json({ message: "পৌরসভা আপডেট করতে সমস্যা হয়েছে" });
            }
        });

        // ✅ পৌরসভা ডিলিট করুন
        app.delete("/municipalities/:id", async (req, res) => {
            try {
                const id = req.params.id;
                const result = await municipalityCollection.deleteOne({ _id: new ObjectId(id) });
                res.json(result);
            } catch (error) {
                console.error("❌ Delete Error:", error);
                res.status(500).json({ message: "পৌরসভা মুছতে সমস্যা হয়েছে" });
            }
        });

        // ✅ সকল রেস্টুরেন্ট দেখুন
        app.get("/restaurants", async (req, res) => {
            try {
                const result = await restaurantsCollection.find().sort({ name: 1 }).toArray();
                res.json(result);
            } catch (err) {
                console.error("❌ Fetch Error:", err);
                res.status(500).json({ message: "রেস্টুরেন্ট ফেচ করতে সমস্যা হয়েছে" });
            }
        });

        // ✅ নির্দিষ্ট রেস্টুরেন্ট ডিটেইলস
        app.get("/restaurants/:id", async (req, res) => {
            try {
                const restaurant = await restaurantsCollection.findOne({ _id: new ObjectId(req.params.id) });
                if (!restaurant) return res.status(404).json({ message: "রেস্টুরেন্ট পাওয়া যায়নি" });
                res.json(restaurant);
            } catch (err) {
                console.error("❌ Details Error:", err);
                res.status(500).json({ message: "ডিটেইলস লোড করতে সমস্যা হয়েছে" });
            }
        });

        // ✅ নতুন রেস্টুরেন্ট যোগ করুন
        app.post("/restaurants", async (req, res) => {
            try {
                const data = req.body;
                data.createdAt = new Date();
                const result = await restaurantsCollection.insertOne(data);
                res.json(result);
            } catch (err) {
                console.error("❌ Insert Error:", err);
                res.status(500).json({ message: "রেস্টুরেন্ট যোগ করতে সমস্যা হয়েছে" });
            }
        });

        // ✅ রেস্টুরেন্ট আপডেট করুন
        app.put("/restaurants/:id", async (req, res) => {
            try {
                const updated = await restaurantsCollection.updateOne(
                    { _id: new ObjectId(req.params.id) },
                    { $set: req.body }
                );
                res.json(updated);
            } catch (err) {
                console.error("❌ Update Error:", err);
                res.status(500).json({ message: "আপডেট করতে সমস্যা হয়েছে" });
            }
        });

        // ✅ রেস্টুরেন্ট ডিলিট করুন
        app.delete("/restaurants/:id", async (req, res) => {
            try {
                const result = await restaurantsCollection.deleteOne({ _id: new ObjectId(req.params.id) });
                res.json(result);
            } catch (err) {
                console.error("❌ Delete Error:", err);
                res.status(500).json({ message: "ডিলিট করতে সমস্যা হয়েছে" });
            }
        });

        // ✅ সব ইভেন্ট দেখুন
        app.get("/events", async (req, res) => {
            const result = await eventsCollection.find().sort({ date: 1 }).toArray();
            res.json(result);
        });

        // ✅ নির্দিষ্ট ইভেন্ট
        app.get("/events/:id", async (req, res) => {
            const id = req.params.id;
            const event = await eventsCollection.findOne({ _id: new ObjectId(id) });
            if (!event) return res.status(404).json({ message: "ইভেন্ট খুঁজে পাওয়া যায়নি" });
            res.json(event);
        });

        // ✅ ইভেন্ট যোগ করুন
        app.post("/events", async (req, res) => {
            const data = req.body;
            data.createdAt = new Date();
            const result = await eventsCollection.insertOne(data);
            res.json(result);
        });

        // ✅ ইভেন্ট আপডেট
        app.put("/events/:id", async (req, res) => {
            const id = req.params.id;
            const updated = await eventsCollection.updateOne(
                { _id: new ObjectId(id) },
                { $set: req.body }
            );
            res.json(updated);
        });

        // ✅ ইভেন্ট ডিলিট
        app.delete("/events/:id", async (req, res) => {
            const id = req.params.id;
            const result = await eventsCollection.deleteOne({ _id: new ObjectId(id) });
            res.json(result);
        });

        // সমস্ত গাড়ির তথ্য আনা
        app.get("/rent-cars", async (req, res) => {
            try {
                const cars = await rentCarsCollection.find().toArray();
                res.json(cars);
            } catch (error) {
                console.error("গাড়ি তথ্য আনার ত্রুটি:", error);
                res.status(500).json({ message: "সার্ভার ত্রুটি" });
            }
        });

        // নির্দিষ্ট গাড়ির তথ্য আনা
        app.get("/rent-cars/:id", async (req, res) => {
            try {
                const id = req.params.id;
                const car = await rentCarsCollection.findOne({ _id: new ObjectId(id) });
                if (!car) return res.status(404).json({ message: "গাড়ি পাওয়া যায়নি" });
                res.json(car);
            } catch (error) {
                console.error("গাড়ি তথ্য আনার ত্রুটি:", error);
                res.status(500).json({ message: "সার্ভার ত্রুটি" });
            }
        });

        // নতুন গাড়ি যোগ করা
        app.post("/rent-cars", async (req, res) => {
            try {
                const carData = req.body;
                carData.createdAt = new Date();
                const result = await rentCarsCollection.insertOne(carData);
                res.json(result);
            } catch (error) {
                console.error("গাড়ি যোগ করার ত্রুটি:", error);
                res.status(500).json({ message: "গাড়ি যোগ করতে সমস্যা হয়েছে" });
            }
        });

        // গাড়ির তথ্য আপডেট করা
        app.put("/rent-cars/:id", async (req, res) => {
            try {
                const id = req.params.id;
                const updateData = { $set: req.body };
                const result = await rentCarsCollection.updateOne({ _id: new ObjectId(id) }, updateData);
                res.json(result);
            } catch (error) {
                console.error("গাড়ি আপডেট করার ত্রুটি:", error);
                res.status(500).json({ message: "গাড়ি আপডেট করতে সমস্যা হয়েছে" });
            }
        });

        // গাড়ি মুছে ফেলা
        app.delete("/rent-cars/:id", async (req, res) => {
            try {
                const id = req.params.id;
                const result = await rentCarsCollection.deleteOne({ _id: new ObjectId(id) });
                res.json(result);
            } catch (error) {
                console.error("গাড়ি মুছে ফেলার ত্রুটি:", error);
                res.status(500).json({ message: "গাড়ি মুছতে সমস্যা হয়েছে" });
            }
        });

        // সব ব্লগ আনা
        app.get("/blogs", async (req, res) => {
            try {
                const blogs = await blogCollection.find().sort({ createdAt: -1 }).toArray();
                res.json(blogs);
            } catch (error) {
                console.error("ব্লগ তথ্য আনার ত্রুটি:", error);
                res.status(500).json({ message: "সার্ভার ত্রুটি হয়েছে" });
            }
        });

        // নির্দিষ্ট ব্লগের বিস্তারিত আনা
        app.get("/blogs/:id", async (req, res) => {
            try {
                const id = req.params.id;
                const blog = await blogCollection.findOne({ _id: new ObjectId(id) });
                if (!blog) return res.status(404).json({ message: "ব্লগ পাওয়া যায়নি" });
                res.json(blog);
            } catch (error) {
                console.error("ব্লগ ডিটেইলস আনার ত্রুটি:", error);
                res.status(500).json({ message: "সার্ভার ত্রুটি হয়েছে" });
            }
        });

        // নতুন ব্লগ তৈরি
        app.post("/blogs", async (req, res) => {
            try {
                const blogData = req.body;
                blogData.createdAt = new Date();
                const result = await blogCollection.insertOne(blogData);
                res.json(result);
            } catch (error) {
                console.error("ব্লগ যোগ করার ত্রুটি:", error);
                res.status(500).json({ message: "ব্লগ যোগ করতে সমস্যা হয়েছে" });
            }
        });

        // ব্লগ আপডেট
        app.put("/blogs/:id", async (req, res) => {
            try {
                const id = req.params.id;
                const updateData = { $set: req.body };
                const result = await blogCollection.updateOne({ _id: new ObjectId(id) }, updateData);
                res.json(result);
            } catch (error) {
                console.error("ব্লগ আপডেট ত্রুটি:", error);
                res.status(500).json({ message: "ব্লগ আপডেট করতে সমস্যা হয়েছে" });
            }
        });

        // ব্লগ মুছে ফেলা
        app.delete("/blogs/:id", async (req, res) => {
            try {
                const id = req.params.id;
                const result = await blogCollection.deleteOne({ _id: new ObjectId(id) });
                res.json(result);
            } catch (error) {
                console.error("ব্লগ মুছে ফেলার ত্রুটি:", error);
                res.status(500).json({ message: "ব্লগ মুছতে সমস্যা হয়েছে" });
            }
        });
        // ব্লগে লাইক বা আনলাইক
app.post("/blogs/:id/like", async (req, res) => {
    try {
        const id = req.params.id;
        const { action } = req.body;

        if (!["like", "unlike"].includes(action)) {
            return res.status(400).json({ message: "Invalid action" });
        }

        const blog = await blogCollection.findOne({ _id: new ObjectId(id) });
        if (!blog) return res.status(404).json({ message: "ব্লগ পাওয়া যায়নি" });

        let likes = blog.likes || 0;

        if (action === "like") {
            likes += 1;
        } else if (action === "unlike" && likes > 0) {
            likes -= 1;
        }

        await blogCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { likes } }
        );

        res.json({ success: true, likes });
    } catch (error) {
        console.error("লাইক আপডেট ত্রুটি:", error);
        res.status(500).json({ message: "সার্ভার ত্রুটি হয়েছে" });
    }
});

// নির্দিষ্ট ব্লগের কমেন্ট লোড
app.get("/blogs/:id/comments", async (req, res) => {
    try {
        const id = req.params.id;
        const blog = await blogCollection.findOne({ _id: new ObjectId(id) }, { projection: { comments: 1 } });
        if (!blog) return res.status(404).json({ message: "ব্লগ পাওয়া যায়নি" });

        res.json(blog.comments || []);
    } catch (error) {
        console.error("কমেন্ট আনার ত্রুটি:", error);
        res.status(500).json({ message: "সার্ভার ত্রুটি হয়েছে" });
    }
});

// নতুন কমেন্ট যোগ
app.post("/blogs/:id/comments", async (req, res) => {
    try {
        const id = req.params.id;
        const { text, author } = req.body;

        if (!text || !author) {
            return res.status(400).json({ message: "টেক্সট এবং লেখকের নাম প্রয়োজন" });
        }

        const newComment = {
            _id: new ObjectId(),
            author,
            text,
            createdAt: new Date()
        };

        const result = await blogCollection.updateOne(
            { _id: new ObjectId(id) },
            { $push: { comments: newComment } }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "ব্লগ পাওয়া যায়নি" });
        }

        res.status(201).json(newComment);
    } catch (error) {
        console.error("কমেন্ট যোগ করার ত্রুটি:", error);
        res.status(500).json({ message: "সার্ভার ত্রুটি হয়েছে" });
    }
});

        // ✅ Get all famous people
        app.get("/famous", async (req, res) => {
            try {
                const people = await famousCollection.find().toArray();
                res.send(people);
            } catch (error) {
                console.error("Failed to get famous people:", error);
                res.status(500).send({ error: "Failed to get famous people" });
            }
        });

        // ✅ Get single person by ID
        app.get("/famous/:id", async (req, res) => {
            try {
                const id = req.params.id;
                const person = await famousCollection.findOne({ _id: new ObjectId(id) });
                if (!person) return res.status(404).send({ error: "Person not found" });
                res.send(person);
            } catch (error) {
                console.error("Failed to get person:", error);
                res.status(500).send({ error: "Failed to get person" });
            }
        });

        // ✅ Add new person
        app.post("/famous", async (req, res) => {
            try {
                const personData = req.body;
                const result = await famousCollection.insertOne(personData);
                res.send(result);
            } catch (error) {
                console.error("Failed to add person:", error);
                res.status(500).send({ error: "Failed to add person" });
            }
        });

        // ✅ Update person by ID

        app.put("/famous/:id", async (req, res) => {
            try {
                const id = req.params.id;
                if (!ObjectId.isValid(id)) {
                    return res.status(400).send({ error: "Invalid ID format" });
                }
                const updatedData = req.body;
                const result = await famousCollection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: updatedData }
                );
                if (result.matchedCount === 0) {
                    return res.status(404).send({ error: "Person not found" });
                }
                res.send(result);
            } catch (error) {
                console.error("Failed to update person:", error);
                res.status(500).send({ error: "Failed to update person" });
            }
        });
        // ✅ Delete person by ID
        app.delete("/famous/:id", async (req, res) => {
            try {
                const id = req.params.id;
                const result = await famousCollection.deleteOne({ _id: new ObjectId(id) });
                res.send(result);
            } catch (error) {
                console.error("Failed to delete person:", error);
                res.status(500).send({ error: "Failed to delete person" });
            }
        });

        // ✅ Get all contact messages
        app.get("/contacts", async (req, res) => {
            try {
                const contacts = await contactsCollection.find().sort({ createdAt: -1 }).toArray();
                res.send(contacts);
            } catch (err) {
                console.error("❌ Error fetching contacts:", err);
                res.status(500).send({ error: "❌ Failed to fetch contact messages" });
            }
        });

        // ✅ Get single contact message by ID
        app.get("/contacts/:id", async (req, res) => {
            try {
                const id = req.params.id;
                
                if (!ObjectId.isValid(id)) {
                    return res.status(400).send({ error: "❌ Invalid contact ID format" });
                }
                
                const contact = await contactsCollection.findOne({ _id: new ObjectId(id) });
                
                if (!contact) {
                    return res.status(404).send({ error: "❌ Contact message not found" });
                }
                
                res.send(contact);
            } catch (err) {
                console.error("❌ Error fetching contact:", err);
                res.status(500).send({ error: "❌ Failed to fetch contact message" });
            }
        });

        // ✅ Add a new contact message
        app.post("/contacts", async (req, res) => {
            const newMessage = req.body;
            try {
                // Add current date and time to the message
                newMessage.createdAt = new Date();
                newMessage.timestamp = Date.now();
                
                const result = await contactsCollection.insertOne(newMessage);
                res.send(result);
            } catch (err) {
                console.error("❌ Error saving contact:", err);
                res.status(500).send({ error: "❌ Failed to save contact message" });
            }
        });

        // ✅ Delete contact message by ID
        app.delete("/contacts/:id", async (req, res) => {
            try {
                const id = req.params.id;
                
                if (!ObjectId.isValid(id)) {
                    return res.status(400).send({ error: "❌ Invalid contact ID format" });
                }
                
                const result = await contactsCollection.deleteOne({ _id: new ObjectId(id) });
                
                if (result.deletedCount === 0) {
                    return res.status(404).send({ error: "❌ Contact message not found" });
                }
                
                res.send({ 
                    message: "✅ Contact message deleted successfully",
                    deletedCount: result.deletedCount 
                });
            } catch (err) {
                console.error("❌ Error deleting contact:", err);
                res.status(500).send({ error: "❌ Failed to delete contact message" });
            }
        });

        // ✅ GET all ads
        app.get('/ads', async (req, res) => {
            try {
                const ads = await adsCollection.find().toArray();
                res.send(ads);
            } catch (error) {
                res.status(500).send({ error: 'Failed to fetch ads' });
            }
        });

        // ✅ GET single ad
        app.get('/ads/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const ad = await adsCollection.findOne({ _id: new ObjectId(id) });
                res.send(ad);
            } catch (error) {
                res.status(500).send({ error: 'Failed to fetch the ad' });
            }
        });

        // ✅ POST new ad
        app.post('/ads', async (req, res) => {
            try {
                const adData = req.body;
                const result = await adsCollection.insertOne(adData);
                res.send(result);
            } catch (error) {
                res.status(500).send({ error: 'Failed to add ad' });
            }
        });

        // ✅ PUT update ad
        app.put('/ads/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const updateData = req.body;
                const result = await adsCollection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: updateData }
                );
                res.send(result);
            } catch (error) {
                res.status(500).send({ error: 'Failed to update ad' });
            }
        });

        // ✅ DELETE ad
        app.delete('/ads/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const result = await adsCollection.deleteOne({ _id: new ObjectId(id) });
                res.send(result);
            } catch (error) {
                res.status(500).send({ error: 'Failed to delete ad' });
            }
        });

        // ✅ Get all creators
        app.get('/content-creators', async (req, res) => {
            try {
                const creators = await contentCreatorsCollection.find().toArray();
                res.send(creators);
            } catch (error) {
                res.status(500).send({ error: 'Failed to fetch content creators' });
            }
        });

        // ✅ Get single creator by ID
        app.get('/content-creators/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const creator = await contentCreatorsCollection.findOne({ _id: new ObjectId(id) });
                res.send(creator);
            } catch (error) {
                res.status(500).send({ error: 'Failed to fetch creator' });
            }
        });

        // ✅ Add new creator
        app.post('/content-creators', async (req, res) => {
            try {
                const adData = req.body;
                const result = await contentCreatorsCollection.insertOne(adData);
                res.send(result);
            } catch (error) {
                res.status(500).send({ error: 'Failed to add content creator' });
            }
        });

        // ✅ Update creator
        app.put('/content-creators/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const updateData = req.body;
                const result = await contentCreatorsCollection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: updateData }
                );
                res.send(result);
            } catch (error) {
                res.status(500).send({ error: 'Failed to update content creator' });
            }
        });

        // ✅ Delete creator
        app.delete('/content-creators/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const result = await contentCreatorsCollection.deleteOne({ _id: new ObjectId(id) });
                res.send(result);
            } catch (error) {
                res.status(500).send({ error: 'Failed to delete content creator' });
            }
        });



        // ✅ Get all sliders
        app.get("/sliders", async (req, res) => {
            try {
                const sliders = await slidersCollection.find().toArray();
                res.send(sliders);
            } catch (err) {
                res.status(500).send({ error: "❌ Failed to fetch sliders" });
            }
        });

        // ✅ Add a new slider
        app.post("/sliders", async (req, res) => {
            const newSlider = req.body;
            try {
                const result = await slidersCollection.insertOne(newSlider);
                res.send(result);
            } catch (err) {
                res.status(500).send({ error: "❌ Failed to add slider" });
            }
        });

        // ✅ Update an existing slider
        app.put("/sliders/:id", async (req, res) => {
            const id = req.params.id;
            const updatedData = req.body;

            try {
                const result = await slidersCollection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: updatedData }
                );
                res.send(result);
            } catch (err) {
                res.status(500).send({ error: "❌ Failed to update slider" });
            }
        });

        // ✅ Delete a slider
        app.delete("/sliders/:id", async (req, res) => {
            const id = req.params.id;

            try {
                const result = await slidersCollection.deleteOne({ _id: new ObjectId(id) });
                res.send(result);
            } catch (err) {
                res.status(500).send({ error: "❌ Failed to delete slider" });
            }
        });

      // POST - Create partner
      app.post('/partners', async (req, res) => {
        try {
          const now = new Date();
          const body = req.body || {};
          const partnerDoc = {
            name: body.name,
            logo: body.logo,
            link: body.link || '',
            isActive: body.isActive !== false,
            order: typeof body.order === 'number' ? body.order : 0,
            createdAt: now,
            updatedAt: now,
          };
          const result = await partnersCollection.insertOne(partnerDoc);
          res.status(201).json({ insertedId: result.insertedId });
        } catch (err) {
          res.status(400).json({ message: 'Error creating partner', error: err.message });
        }
      });
     // GET - All partners (list)
app.get('/partners', async (req, res) => {
    try {
      const partners = await partnersCollection.find({}).sort({ order: 1, createdAt: -1 }).toArray();
      res.json(partners);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching partners', error: err.message });
    }
  });
  
  // GET - Single partner by ID
  app.get('/partners/:id', async (req, res) => {
    try {
      const id = req.params.id;
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid partner ID' });
      }
      const partner = await partnersCollection.findOne({ _id: new ObjectId(id) });
      if (!partner) {
        return res.status(404).json({ message: 'Partner not found' });
      }
      res.json(partner);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching partner', error: err.message });
    }
  });
  
  // PUT - Update partner (full update)
  app.put('/partners/:id', async (req, res) => {
    try {
      const result = await partnersCollection.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: req.body }
      );
      if (result.matchedCount === 0) return res.status(404).json({ message: 'Partner not found' });
      res.json({ message: 'Partner updated successfully' });
    } catch (err) {
      res.status(400).json({ message: 'Error updating partner', error: err.message });
    }
  });
  
  // PATCH - Partial update
  app.patch('/partners/:id', async (req, res) => {
    try {
      const result = await partnersCollection.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: req.body }
      );
      if (result.matchedCount === 0) return res.status(404).json({ message: 'Partner not found' });
      res.json({ message: 'Partner patched successfully' });
    } catch (err) {
      res.status(400).json({ message: 'Error patching partner', error: err.message });
    }
  });
  
  // DELETE - Remove partner
  app.delete('/partners/:id', async (req, res) => {
    try {
      const result = await partnersCollection.deleteOne({ _id: new ObjectId(req.params.id) });
      if (result.deletedCount === 0) return res.status(404).json({ message: 'Partner not found' });
      res.json({ message: 'Partner deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error deleting partner', error: err.message });
    }
  });

  // POST - Create new report
app.post('/disaster-reports', async (req, res) => {
    try {
      const newReport = req.body;
      newReport.createdAt = new Date();
      const result = await disasterReportsCollection.insertOne(newReport);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create report', error });
    }
  });
  
  // GET - All reports with pagination
app.get('/disaster-reports', async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1; // current page (default 1)
      const limit = parseInt(req.query.limit) || 10; // per page (default 10)
      const skip = (page - 1) * limit;
  
      const totalReports = await disasterReportsCollection.countDocuments();
      const reports = await disasterReportsCollection
        .find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();
  
      res.json({
        total: totalReports,
        page,
        limit,
        totalPages: Math.ceil(totalReports / limit),
        reports
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch reports', error });
    }
  });
  
  
  // GET - Single report by ID
  app.get('/disaster-reports/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const report = await disasterReportsCollection.findOne({ _id: new ObjectId(id) });
      if (!report) {
        return res.status(404).json({ message: 'Report not found' });
      }
      res.json(report);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch report', error });
    }
  });
  
  // PATCH - Update report status
  app.patch('/disaster-reports/:id/status', async (req, res) => {
    try {
      const id = req.params.id;
      const { status } = req.body;
      const result = await disasterReportsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { status: status, updatedAt: new Date() } }
      );
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update status', error });
    }
  });
  
  // DELETE - Remove report
  app.delete('/disaster-reports/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const result = await disasterReportsCollection.deleteOne({ _id: new ObjectId(id) });
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete report', error });
    }
  });
  
  

    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error.message);
    }
}

run();

app.listen(port, () => {
    console.log(`🌐 Server running at http://localhost:${port}`);
});
