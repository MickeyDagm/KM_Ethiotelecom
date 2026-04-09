import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User, { UserRole } from './models/User';
import Document from './models/Document';
import ContextTag, { TagCategory } from './models/ContextTag';

dotenv.config();

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ukg-ethio');
        console.log('Connected to MongoDB for seeding');

        // Clear existing data
        await User.deleteMany({});
        await Document.deleteMany({});
        await ContextTag.deleteMany({});

        // 1. Create Context Tags (Contextual Registry)
        const regions = ['Addis Ababa', 'North', 'South', 'East', 'West', 'Somali'].map(name => ({ name, category: TagCategory.Region }));
        const technologies = ['Backbone', '4G/5G', 'International Gateway'].map(name => ({ name, category: TagCategory.Technology }));
        const hardware = ['Huawei', 'ZTE'].map(name => ({ name, category: TagCategory.HardwareState }));
        const events = ['Root Cause Analysis', 'New Tech Adoption', 'Weekly Presentations'].map(name => ({ name, category: TagCategory.Event }));

        const insertedTags = await ContextTag.insertMany([...regions, ...technologies, ...hardware, ...events]);
        const tagMap: Record<string, mongoose.Types.ObjectId> = {};
        insertedTags.forEach(tag => {
            tagMap[tag.name] = tag._id as mongoose.Types.ObjectId;
        });

        // 2. Create Users (3-Tier Expertise Hierarchy)
        const passwordHash = await bcrypt.hash('password123', 10);

        const adminUser = new User({ name: 'System Admin', email: 'admin@ethiotelecom.et', passwordHash, role: UserRole.Admin, department: 'IT O&M' });

        // Core Experts
        const expert1 = new User({ name: 'Abebe Bikila', email: 'abebe.b@ethiotelecom.et', passwordHash, role: UserRole.Expert, department: 'Backbone Transmission' });
        const expert2 = new User({ name: 'Tirunesh Dibaba', email: 'tirunesh.d@ethiotelecom.et', passwordHash, role: UserRole.Expert, department: 'IT O&M' });

        // Advanced Support
        const advSupport1 = new User({ name: 'Kenenisa Bekele', email: 'kenenisa.b@ethiotelecom.et', passwordHash, role: UserRole.AdvancedSupport, department: 'Addis Ababa Support' });

        // International Gateway
        const igwSpecialist = new User({ name: 'Haile Gebrselassie', email: 'haile.g@ethiotelecom.et', passwordHash, role: UserRole.InternationalGateway, department: 'International Gateway Team' });

        // Regional Technicians
        const regTechSomali = new User({ name: 'Fatuma Roba', email: 'fatuma.r@ethiotelecom.et', passwordHash, role: UserRole.RegionalTechnician, department: 'Somali Region' });

        await Promise.all([adminUser.save(), expert1.save(), expert2.save(), advSupport1.save(), igwSpecialist.save(), regTechSomali.save()]);

        // 3. Create Documents (Crown Jewels)
        const doc1 = new Document({
            title: 'Somali Region Power Failure - Huawei OLT Recovery',
            content: '<p>Immediate fix for repeated power fluctuations crashing Huawei OLTs in the Somali region. Reset the power module using syntax XYZ-123.</p>',
            author: expert1._id,
            type: 'Root Cause Analysis',
            technologyVersion: 'Huawei Connect 2.4',
            tags: [tagMap['Somali'], tagMap['Huawei'], tagMap['Root Cause Analysis']],
            views: 120,
            localPerformanceLayers: [
                {
                    note: 'Confirmed fix works, but requires rebooting the secondary link manually afterwards due to high temperature delays.',
                    authorId: regTechSomali._id,
                    createdAt: new Date()
                }
            ]
        });

        const doc2 = new Document({
            title: 'ZTE Backbone Migration Weekly Presentation',
            content: '<h3>Key Takeaways</h3><ul><li>Shifted 20% traffic to ZTE core.</li><li>Latency improved by 15ms internally.</li></ul>',
            author: expert2._id,
            type: 'Weekly Presentations',
            technologyVersion: 'ZTE Core v19',
            tags: [tagMap['Addis Ababa'], tagMap['ZTE'], tagMap['Backbone'], tagMap['Weekly Presentations']],
            views: 345,
        });

        const doc3 = new Document({
            title: 'New Tech Adoption: 5G Massive MIMO Configuration',
            content: '<h2>Wiki-Sprint Output</h2><p>Initial discovery on handling the 5G MIMO antennae configuration in high-altitude terrain (North). Adjust tilt by 2 degrees downwards.</p>',
            author: advSupport1._id,
            type: 'New Tech Adoption',
            technologyVersion: '5G Standard Rev.2',
            tags: [tagMap['North'], tagMap['4G/5G'], tagMap['New Tech Adoption']],
            views: 89,
        });

        await Promise.all([doc1.save(), doc2.save(), doc3.save()]);

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seedDatabase();
