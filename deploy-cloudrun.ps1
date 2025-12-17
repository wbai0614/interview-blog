$ProjectID = "interview-blog"  # Replace with your GCP project ID
$ServiceName = "interview-blog"
$Region = "us-central1"

Write-Host "`n=== Setting GCP Project ==="
gcloud config set project $ProjectID

Write-Host "`n=== Enabling required APIs ==="
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

Write-Host "`n=== Building Docker image with Cloud Build ==="
gcloud builds submit . --tag gcr.io/$ProjectID/$ServiceName

Write-Host "`n=== Deploying to Cloud Run ==="
gcloud run deploy $ServiceName `
    --image gcr.io/$ProjectID/$ServiceName `
    --platform managed `
    --allow-unauthenticated `
    --region $Region

Write-Host "`n=== Deployment complete! ==="
Write-Host "Your blog URL will be printed above by Cloud Run."
