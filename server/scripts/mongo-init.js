// MongoDB initialization script
db = db.getSiblingDB('certifypro');

// Create collections with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'email', 'password', 'role'],
      properties: {
        name: {
          bsonType: 'string',
          minLength: 1,
          maxLength: 50
        },
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
        },
        password: {
          bsonType: 'string',
          minLength: 6
        },
        role: {
          bsonType: 'string',
          enum: ['admin', 'staff']
        },
        isActive: {
          bsonType: 'bool'
        }
      }
    }
  }
});

db.createCollection('certificatetemplates', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['title', 'fields', 'backgroundImageURL', 'createdBy'],
      properties: {
        title: {
          bsonType: 'string',
          minLength: 1,
          maxLength: 100
        },
        description: {
          bsonType: 'string',
          maxLength: 500
        },
        fields: {
          bsonType: 'array',
          items: {
            bsonType: 'object',
            required: ['name', 'x', 'y'],
            properties: {
              name: { bsonType: 'string' },
              x: { bsonType: 'number', minimum: 0 },
              y: { bsonType: 'number', minimum: 0 },
              fontSize: { bsonType: 'number', minimum: 8, maximum: 72 },
              color: { bsonType: 'string' }
            }
          }
        },
        backgroundImageURL: { bsonType: 'string' },
        createdBy: { bsonType: 'objectId' },
        isActive: { bsonType: 'bool' },
        usageCount: { bsonType: 'number', minimum: 0 }
      }
    }
  }
});

db.createCollection('issuedcertificates', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['recipientName', 'recipientEmail', 'templateId', 'downloadURL', 'serialNumber', 'issuedBy'],
      properties: {
        recipientName: {
          bsonType: 'string',
          minLength: 1,
          maxLength: 100
        },
        recipientEmail: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
        },
        templateId: { bsonType: 'objectId' },
        issueDate: { bsonType: 'date' },
        downloadURL: { bsonType: 'string' },
        fileName: { bsonType: 'string' },
        serialNumber: { bsonType: 'string' },
        customData: { bsonType: 'object' },
        issuedBy: { bsonType: 'objectId' },
        status: {
          bsonType: 'string',
          enum: ['issued', 'downloaded', 'expired']
        },
        downloadCount: { bsonType: 'number', minimum: 0 }
      }
    }
  }
});

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });
db.users.createIndex({ isActive: 1 });

db.certificatetemplates.createIndex({ createdBy: 1, isActive: 1 });
db.certificatetemplates.createIndex({ title: 'text', description: 'text' });

db.issuedcertificates.createIndex({ serialNumber: 1 }, { unique: true });
db.issuedcertificates.createIndex({ recipientEmail: 1 });
db.issuedcertificates.createIndex({ templateId: 1 });
db.issuedcertificates.createIndex({ issuedBy: 1 });
db.issuedcertificates.createIndex({ issueDate: -1 });
db.issuedcertificates.createIndex({ status: 1 });

print('Database initialized successfully');
