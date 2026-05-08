---
name: lexvault-upload
description: Decentralized document storage via Pinata IPFS.
---

# LexVault Upload Skill

## Overview
Handles the secure upload of legal documents to the decentralized IPFS network using Pinata.

## Triggers
- When modifying `backend/server.js` upload routes.
- When `VaultPage.jsx` fails to show upload history.
- When `PINATA_API_KEY` errors occur.

## Workflow
1. **Multipart Upload:** React sends file to Express via Multer.
2. **Metadata Injection:** Case Title and Case Number are injected into IPFS metadata.
3. **Pinning:** File is sent to `https://api.pinata.cloud/pinning/pinFileToIPFS`.
4. **Cleanup:** Temporary file in `backend/uploads/` must be deleted after pinning.

## Validation
Verify success by checking the `ipfsHash` in the response and viewing the file at `https://gateway.pinata.cloud/ipfs/<hash>`.
