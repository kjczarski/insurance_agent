

import rawPatientsData from '../../../data/patients.json';

// Policy Document Text
export const policyText = `
## Page 1

This is Your
# HEALTH MAINTENANCE ORGANIZATION CONTRACT

Issued by
## UnitedHealthcare of New York, Inc.

<watermark>SAMPLE</watermark>

This is Your individual direct payment Contract for health maintenance organization coverage issued by UnitedHealthcare of New York, Inc. This Contract, together with the attached Schedule of Benefits, applications and any amendment or rider amending the terms of this Contract, constitute the entire agreement between You and Us.

You have the right to return this Contract. Examine it carefully. If You are not satisfied, You may return this Contract to Us and ask Us to cancel it.

**Renewability.** The renewal date for this Contract is January 1 of each year.

## Page 2

**In-Network Benefits.** This Contract only covers in-network benefits. To receive in-network benefits You must receive care exclusively from Participating Providers in Our HMO Compass Network.

**Cost-Sharing:** Amounts You must pay for Covered Services, expressed as Copayments, Deductibles and/or Coinsurance.

**Deductible:** The amount You owe before We begin to pay for Covered Services. The Deductible applies before any Copayments or Coinsurance are applied.

## Page 3: Benefits Table

| Service | Benefit |
| :--- | :--- |
| **Primary Care Visit** | $20 Copay |
| **Specialist Visit** | $50 Copay |
| **Emergency Room** | $250 Copay (waived if admitted) |
| **Inpatient Hospital** | 20% Coinsurance after Deductible |
| **Outpatient Surgery** | 20% Coinsurance after Deductible |

(Full policy text available upon request)
`;

// Helper for procedure names
const getProcedureName = (cpt) => {
    const map = {
        "99214": "Office Visit (Level 4)",
        "94640": "Inhalation Treatment",
        "17106": "Destruction of Lesions",
        "90837": "Psychotherapy (60 min)",
        "27766": "Treat Ankle Fracture",
        "99283": "Emergency Dept Visit",
        "80061": "Lipid Panel",
        "99395": "Preventive Visit (Established)",
        "93970": "Extremity Vein Study",
        "43239": "EGD Biopsy",
        "99203": "Office Visit (New Patient)",
        "82465": "Cholesterol Serum",
        "92557": "Comprehensive Hearing Test",
        "59400": "Obstetrical Care",
        "95812": "EEG Monitoring",
        "16030": "Burn Dressing",
        "52353": "Cystourethroscopy",
        "93306": "Echocardiogram",
        "99213": "Office Visit (Level 3)",
        "43260": "ERCP with Lithotripsy"
    };
    return map[cpt] || "Medical Procedure";
};

const mapStatus = (status) => {
    const s = status?.toUpperCase();
    if (s?.includes('DENIED')) return 'denied';
    if (s?.includes('ACCEPTED')) return 'approved'; // Map accepted to approved for consistency with badge logic which typically expects approved/denied/pending
    if (s?.includes('PENDING')) return 'pending';
    if (s?.includes('REQUIRES DOCUMENTATION') || s?.includes('NEEDS INFO')) return 'needs_info'; // Catch-all for info needed
    return 'pending';
};

// Transform raw JSON data to App Schema
export const claimsData = rawPatientsData.map(patient => {
    const claimParams = patient.Claim_Details || {};
    const statusParams = patient.Claim_Status_Details || {};
    const providerParams = patient.Provider_Info || {};

    // Check specific specific status strings if needed to map to needs_info
    let status = mapStatus(statusParams.Status);
    if (statusParams.Status?.includes('Requires Documentation')) {
        status = 'needs_info';
    }

    return {
        id: claimParams.Claim_ID || `UNK-${Math.random().toString(36).substr(2, 5)}`,
        serviceDate: claimParams.DOS || "2025-01-01",
        patient: {
            name: patient.Patient_Name,
            dob: patient.Patient_DOB,
            insuranceId: patient.Member_ID,
            policy: "Standard Policy" // Default if not in JSON
        },
        insurance: {
            provider: patient.Payer_Name,
            phone: "1-800-INS-HELP" // Placeholder
        },
        procedure: {
            code: claimParams.CPT_Code,
            name: getProcedureName(claimParams.CPT_Code),
            icd10: claimParams.Diagnosis_Code_ICD10
        },
        diagnosis: "Diagnosis details not specified", // Could be mapped if ICD description available
        status: status,
        submittedAt: `${claimParams.DOS}T09:00:00`, // Approximation
        estimatedCost: parseFloat(claimParams.Amount_Billed?.replace(/,/g, '') || 0),
        denialReason: statusParams.Reason,
        missingInfo: status === 'needs_info' ? statusParams.Reason : null,
        provider: {
            name: providerParams.Provider,
            npi: providerParams.Provider_NPI,
            tin: providerParams.Provider_TIN,
            status: providerParams.Provider_Status
        },
        financial: {
            billed: claimParams.Amount_Billed,
            allowed: claimParams.Amount_Allowed || "N/A",
            deductibleStatus: statusParams.Deductible_Status_Prior
        },
        documents: [], // JSON doesn't strictly have docs list, keeping empty for now
        transcript: [] // JSON doesn't have transcript
    };
});

