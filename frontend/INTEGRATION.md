# Frontend-Backend Integration

This document describes the integration between the frontend and backend for the Certificate Authentication System.

## API Endpoints Used

### Backend API (Node.js - Port 3000)
- `GET /health` - Health check
- `POST /api/ocr/extract` - Extract OCR data from uploaded file
- `POST /api/ocr/extract-all` - Extract OCR from all files in directory
- `GET /api/ocr/:id` - Get OCR result by ID
- `POST /api/ai/verify` - Verify file with AI
- `POST /api/ai/verify-all` - Verify all files with AI
- `GET /api/ai/:id` - Get AI result by ID
- `GET /api/graduation` - Get graduation data
- `GET /api/identity` - Get identity data
- `GET /api/internships` - Get internship data
- `POST /api/auth/login` - User authentication

### Python API (Port 8000)
- `GET /health` - Health check
- `POST /ocr/extract` - Extract OCR data
- `POST /ai/verify` - AI verification

## Features Implemented

### 1. Image Upload
- Supports multiple image formats: JPEG, PNG, SVG, WebP
- Drag and drop functionality
- File validation and error handling
- Progress indicators during upload

### 2. Certificate Analysis Flow
1. User uploads image files
2. Files are sent to OCR API for text extraction
3. Files are sent to AI API for verification
4. Database validation against graduation, identity, and internship data
5. Results are displayed in the Analyze page

### 3. Results Display
- Overview tab with verification status
- OCR data tab with extracted text
- AI analysis tab with verification results
- Database validation tab with cross-referenced data
- Image previews for uploaded certificates

### 4. State Management
- UploadContext for managing file uploads and analysis results
- Error handling and loading states
- Navigation between upload and analysis pages

## File Structure

```
frontend/src/
├── components/
│   └── hero.jsx (updated with upload functionality)
├── context/
│   └── UploadContext.jsx (new - state management)
├── pages/
│   ├── analyze.jsx (new - results display)
│   └── landing.jsx (existing)
├── services/
│   └── api.js (new - API service functions)
└── App.jsx (updated with routing)
```

## Usage

1. Start the backend server (Node.js on port 3000)
2. Start the Python API server (port 8000)
3. Start the frontend development server (`npm run dev`)
4. Navigate to the landing page
5. Upload certificate images
6. Click "Verify with Blockchain & AI"
7. View results on the analyze page

## Error Handling

- Network errors are caught and displayed to the user
- File validation ensures only image files are accepted
- Loading states provide feedback during processing
- Error messages are user-friendly and actionable

## Future Enhancements

- Add file size limits
- Implement batch processing for multiple files
- Add export functionality for results
- Implement real-time progress updates
- Add certificate type detection
- Implement blockchain verification display
