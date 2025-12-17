$ProjectID = "interview-blog"
$ServiceName = "interview-blog"
$Region = "us-central1"

gcloud config set project $ProjectID
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

gcloud builds submit . --tag gcr.io/$ProjectID/$ServiceName
gcloud run deploy $ServiceName `
    --image gcr.io/$ProjectID/$ServiceName `
    --platform managed `
    --allow-unauthenticated `
    --region $Region
