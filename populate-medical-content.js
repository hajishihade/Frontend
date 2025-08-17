const axios = require('axios');

// Configuration
const API_BASE = 'http://127.0.0.1:3002/api/v1';
const timestamp = Date.now();
const ADMIN_USER = {
  email: `admin${timestamp}@example.com`,
  username: `admin${timestamp}`,
  password: 'AdminPass123!',
  firstName: 'Admin',
  lastName: 'User'
};

let authToken = '';
let userId = '';

// Content IDs we'll create
const contentIds = {
  subjects: {},
  chapters: {},
  lectures: {},
  sections: {},
  points: {},
  spoints: []
};

// Axios instance
const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

// Add auth token to requests
api.interceptors.request.use(config => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

// Helper to log results
function log(message, data = null) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📍 ${message}`);
  if (data) {
    console.log(JSON.stringify(data, null, 2));
  }
}

// Helper to handle errors
async function handleRequest(promise, description) {
  try {
    const response = await promise;
    log(`✅ ${description}`, response.data.data);
    return response.data.data;
  } catch (error) {
    log(`❌ ${description} FAILED`, {
      error: error.response?.data || error.message
    });
    throw error;
  }
}

// Main population script
async function populateDatabase() {
  try {
    console.log('\n🏥 MEDICAL CONTENT POPULATION SCRIPT');
    console.log('====================================');
    console.log('Creating comprehensive medical content hierarchy...\n');

    // Step 1: Register admin user
    const userData = await handleRequest(
      api.post('/auth/register', ADMIN_USER),
      'Admin registration'
    );
    userId = userData.user.id;

    // Step 2: Login
    const loginData = await handleRequest(
      api.post('/auth/login', {
        emailOrUsername: ADMIN_USER.email,
        password: ADMIN_USER.password
      }),
      'Admin login'
    );
    authToken = loginData.token;

    // Step 3: Create Medicine subject
    const medicineSubject = await handleRequest(
      api.post('/subjects', {
        name: 'Medicine',
        description: 'Comprehensive medical education curriculum',
        orderIndex: 1,
        visibility: 'personal'
      }),
      'Create Medicine subject'
    );
    contentIds.subjects.medicine = medicineSubject.id;

    // Step 4: Create Endocrinology chapter
    const endoChapter = await handleRequest(
      api.post('/chapters', {
        name: 'Endocrinology',
        description: 'Study of the endocrine system and hormonal disorders',
        orderIndex: 1,
        visibility: 'personal'
      }),
      'Create Endocrinology chapter'
    );
    contentIds.chapters.endocrinology = endoChapter.id;

    // Link chapter to subject
    await handleRequest(
      api.post(`/subjects/${contentIds.subjects.medicine}/chapters/${contentIds.chapters.endocrinology}`),
      'Link Endocrinology to Medicine'
    );

    // Step 5: Create Diabetes Mellitus lecture
    const diabetesLecture = await handleRequest(
      api.post('/lectures', {
        name: 'Diabetes Mellitus',
        description: 'Comprehensive study of diabetes types, pathophysiology, and management',
        orderIndex: 1,
        visibility: 'personal',
        chapterId: contentIds.chapters.endocrinology
      }),
      'Create Diabetes lecture'
    );
    contentIds.lectures.diabetes = diabetesLecture.id;

    // Step 6: Create sections for Diabetes
    const sections = [
      {
        name: 'Pathophysiology of Diabetes',
        description: 'Understanding the mechanisms of diabetes development',
        orderIndex: 1
      },
      {
        name: 'Type 1 Diabetes',
        description: 'Autoimmune destruction of pancreatic beta cells',
        orderIndex: 2
      },
      {
        name: 'Type 2 Diabetes',
        description: 'Insulin resistance and relative insulin deficiency',
        orderIndex: 3
      },
      {
        name: 'Diabetes Complications',
        description: 'Acute and chronic complications of diabetes',
        orderIndex: 4
      },
      {
        name: 'Diabetes Management',
        description: 'Treatment strategies and monitoring',
        orderIndex: 5
      }
    ];

    for (const sectionData of sections) {
      const section = await handleRequest(
        api.post('/sections', {
          ...sectionData,
          visibility: 'personal',
          lectureId: contentIds.lectures.diabetes
        }),
        `Create section: ${sectionData.name}`
      );
      contentIds.sections[sectionData.name] = section.id;
    }

    // Step 7: Create points and spoints for Pathophysiology section
    const pathophysiologyPoints = [
      {
        point: {
          name: 'Insulin Secretion and Action',
          description: 'Normal insulin physiology and its disruption in diabetes',
          orderIndex: 1
        },
        spoints: [
          'Beta cells in pancreatic islets produce insulin',
          'Insulin promotes glucose uptake in muscle and adipose tissue',
          'Insulin inhibits hepatic glucose production',
          'Insulin resistance occurs when cells fail to respond to insulin',
          'Chronic hyperglycemia leads to beta cell dysfunction'
        ]
      },
      {
        point: {
          name: 'Glucose Homeostasis',
          description: 'Regulation of blood glucose levels',
          orderIndex: 2
        },
        spoints: [
          'Normal fasting glucose is 70-100 mg/dL',
          'Postprandial glucose should be <140 mg/dL',
          'Glucagon opposes insulin action',
          'The liver stores glucose as glycogen',
          'Gluconeogenesis produces glucose from non-carbohydrate sources'
        ]
      },
      {
        point: {
          name: 'Diagnostic Criteria',
          description: 'Laboratory values for diabetes diagnosis',
          orderIndex: 3
        },
        spoints: [
          'Fasting glucose ≥126 mg/dL indicates diabetes',
          'HbA1c ≥6.5% confirms diabetes diagnosis',
          'Random glucose ≥200 mg/dL with symptoms indicates diabetes',
          'OGTT 2-hour glucose ≥200 mg/dL confirms diabetes',
          'Prediabetes: fasting glucose 100-125 mg/dL'
        ]
      }
    ];

    // Create points and spoints
    for (const pointData of pathophysiologyPoints) {
      // Create point
      const point = await handleRequest(
        api.post('/points', {
          ...pointData.point,
          visibility: 'personal',
          sectionId: contentIds.sections['Pathophysiology of Diabetes']
        }),
        `Create point: ${pointData.point.name}`
      );
      contentIds.points[pointData.point.name] = point.id;

      // Create spoints for this point
      for (let i = 0; i < pointData.spoints.length; i++) {
        const spoint = await handleRequest(
          api.post('/spoints', {
            defaultContent: pointData.spoints[i],
            orderIndex: i + 1,
            visibility: 'personal',
            pointId: point.id
          }),
          `Create spoint: ${pointData.spoints[i].substring(0, 30)}...`
        );
        contentIds.spoints.push(spoint.id);
      }
    }

    // Step 8: Create more detailed content for Type 2 Diabetes section
    const type2Points = [
      {
        point: {
          name: 'Risk Factors',
          description: 'Factors that increase T2DM risk',
          orderIndex: 1
        },
        spoints: [
          'Obesity is the strongest risk factor for T2DM',
          'Family history increases risk 2-6 fold',
          'Physical inactivity contributes to insulin resistance',
          'Age >45 years increases risk',
          'Gestational diabetes history increases future T2DM risk'
        ]
      },
      {
        point: {
          name: 'Clinical Presentation',
          description: 'Signs and symptoms of T2DM',
          orderIndex: 2
        },
        spoints: [
          'Polyuria (excessive urination) due to osmotic diuresis',
          'Polydipsia (excessive thirst) secondary to dehydration',
          'Polyphagia (excessive hunger) despite hyperglycemia',
          'Unexplained weight loss despite normal appetite',
          'Blurred vision from lens swelling'
        ]
      }
    ];

    // Create Type 2 Diabetes content
    for (const pointData of type2Points) {
      const point = await handleRequest(
        api.post('/points', {
          ...pointData.point,
          visibility: 'personal',
          sectionId: contentIds.sections['Type 2 Diabetes']
        }),
        `Create point: ${pointData.point.name}`
      );

      for (let i = 0; i < pointData.spoints.length; i++) {
        const spoint = await handleRequest(
          api.post('/spoints', {
            defaultContent: pointData.spoints[i],
            orderIndex: i + 1,
            visibility: 'personal',
            pointId: point.id
          }),
          `Create spoint: ${pointData.spoints[i].substring(0, 30)}...`
        );
        contentIds.spoints.push(spoint.id);
      }
    }

    // Step 9: Summary
    console.log('\n✅ DATABASE POPULATION COMPLETE!');
    console.log('================================');
    console.log(`Created content hierarchy:`);
    console.log(`- 1 Subject (Medicine)`);
    console.log(`- 1 Chapter (Endocrinology)`);
    console.log(`- 1 Lecture (Diabetes Mellitus)`);
    console.log(`- ${Object.keys(contentIds.sections).length} Sections`);
    console.log(`- ${Object.keys(contentIds.points).length} Points`);
    console.log(`- ${contentIds.spoints.length} SPoints`);
    console.log('\nContent is ready for Story feature testing!');
    
    // Save content IDs for use in other scripts
    const fs = require('fs');
    fs.writeFileSync('content-ids.json', JSON.stringify({
      adminUser: ADMIN_USER,
      authToken,
      userId,
      contentIds
    }, null, 2));
    console.log('\n📝 Content IDs saved to content-ids.json');

  } catch (error) {
    console.error('\n❌ Population script failed:', error.message);
    process.exit(1);
  }
}

// Run the script
populateDatabase();