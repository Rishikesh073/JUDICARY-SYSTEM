import json
import cloudinary
import cloudinary.uploader
import time
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv(dotenv_path="../.env")

# Configure Cloudinary
cloudinary.config(
    cloud_name = os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key = os.getenv('CLOUDINARY_API_KEY'),
    api_secret = os.getenv('CLOUDINARY_API_SECRET')
)

def bulk_upload(json_file):
    if not os.path.exists(json_file):
        print(f"❌ Error: {json_file} not found. Run bulk_extractor.py first.")
        return

    with open(json_file, 'r', encoding='utf-8') as f:
        cases = json.load(f)

    print(f"🚀 Found {len(cases)} cases in master dataset.")
    print("Starting background upload to Cloudinary. This will take significant time...")

    uploaded_count = 0
    for index, case in enumerate(cases, 1):
        # Skip if already uploaded
        if 'cloudinary_url' in case and case['cloudinary_url']:
            continue

        local_path = case.get('local_path')
        if not local_path or not os.path.exists(local_path):
            print(f"⚠️  File not found locally: {case.get('filename')}")
            continue
            
        try:
            # Upload as raw resource for PDFs
            response = cloudinary.uploader.upload(
                local_path, 
                resource_type="raw", 
                folder="lexagent_historical",
                use_filename=True,
                unique_filename=False
            )
            case['cloudinary_url'] = response['secure_url']
            uploaded_count += 1
            
            if uploaded_count % 5 == 0:
                print(f"✅ Progress: {index}/{len(cases)} uploaded. Latest: {case['filename'][:20]}...")

            # Save progress incrementally every 10 uploads
            if uploaded_count % 10 == 0:
                with open(json_file, 'w', encoding='utf-8') as out_f:
                    json.dump(cases, out_f, ensure_ascii=False, indent=4)

        except Exception as e:
            print(f"❌ Failed to upload {case['filename']}: {e}")
            if "Rate limit" in str(e):
                print("⏳ Rate limit hit. Sleeping for 30 seconds...")
                time.sleep(30)
            continue

    # Final save
    with open(json_file, 'w', encoding='utf-8') as out_f:
        json.dump(cases, out_f, ensure_ascii=False, indent=4)

    print(f"\n🎉 Bulk upload complete. Total uploaded in this session: {uploaded_count}")

if __name__ == "__main__":
    bulk_upload('master_judicial_dataset.json')
