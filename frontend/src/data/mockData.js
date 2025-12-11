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

// Transformed Data from patients.json
export const claimsData = [
    {
        id: "C2025-1001",
        patient: { name: "Patricia Smith", dob: "1993-11-22", insuranceId: "UDR-1571-4971", policy: "HMO Compass" },
        insurance: { provider: "UnitedHealthcare", phone: "1-800-842-8000" },
        procedure: { code: "99214", name: getProcedureName("99214"), icd10: "I10" },
        diagnosis: "Essential (primary) hypertension",
        status: "denied",
        submittedAt: "2025-03-15T10:30:00",
        estimatedCost: 150.00,
        denialReason: "Policy Exclusion/Limit: Patient has not met the yearly preventative visit limit; routine screening.",
        provider: {
            name: "Prime Orthopedic Institute",
            npi: "1787846414",
            tin: "78-568437247",
            status: "In-Network"
        },
        financial: {
            billed: "150.00",
            allowed: "120.00",
            deductibleStatus: "$0.00 met of $1000.00"
        },
        documents: [],
        transcript: []
    },
    {
        id: "C2025-1002",
        patient: { name: "Linda Brown", dob: "1985-07-20", insuranceId: "AUD-3799-4050", policy: "PPO Choice" },
        insurance: { provider: "Aetna", phone: "1-800-872-3862" },
        procedure: { code: "94640", name: getProcedureName("94640"), icd10: "J45.909" },
        diagnosis: "Unspecified asthma, uncomplicated",
        status: "approved",
        submittedAt: "2025-04-01T14:15:00",
        estimatedCost: 350.00,
        provider: {
            name: "St. Jude General Hospital",
            npi: "3563451924",
            tin: "59-672909845",
            status: "In-Network"
        },
        financial: {
            billed: "350.00",
            allowed: "320.00",
            deductibleStatus: "$1000.00 met of $1000.00"
        },
        documents: [
            { id: "DOC-1002", name: "Pulmonary_Function_Test.pdf", type: "pdf", date: "2025-03-30" }
        ],
        transcript: []
    },
    {
        id: "C2025-1003",
        patient: { name: "Michael Martinez", dob: "1963-12-12", insuranceId: "YXX-8641-1579", policy: "Humana Gold" },
        insurance: { provider: "Humana", phone: "1-800-457-4708" },
        procedure: { code: "17106", name: getProcedureName("17106"), icd10: "L70.0" },
        diagnosis: "Acne vulgaris",
        status: "denied",
        submittedAt: "2025-05-10T09:45:00",
        estimatedCost: 4500.00,
        denialReason: "Not Medically Necessary: Procedure considered cosmetic; specifically excluded by policy.",
        provider: {
            name: "Kids First Pediatrics",
            npi: "5537253172",
            tin: "68-839303731",
            status: "In-Network"
        },
        financial: {
            billed: "4,500.00",
            allowed: "3,800.00",
            deductibleStatus: "$1000.00 met of $1000.00"
        },
        documents: [],
        transcript: []
    },
    {
        id: "C2025-1004",
        patient: { name: "Joseph Johnson", dob: "1992-06-13", insuranceId: "DGN-8925-5597", policy: "Blue Choice" },
        insurance: { provider: "Blue Cross Blue Shield", phone: "1-800-262-2583" },
        procedure: { code: "90837", name: getProcedureName("90837"), icd10: "F32.9" },
        diagnosis: "Major depressive disorder, single episode, unspecified",
        status: "needs_info",
        submittedAt: "2025-06-20T11:20:00",
        estimatedCost: 180.00,
        missingInfo: "Awaiting updated documentation for final payment.",
        provider: {
            name: "Riverside Dermatology Clinic",
            npi: "8395928407",
            tin: "27-362149307",
            status: "In-Network"
        },
        financial: {
            billed: "180.00",
            allowed: "150.00",
            deductibleStatus: "$50.00 met of $1000.00"
        },
        documents: [],
        transcript: []
    },
    {
        id: "C2025-1006",
        patient: { name: "David Rodriguez", dob: "2002-06-26", insuranceId: "EJS-1477-6821", policy: "Aetna Select" },
        insurance: { provider: "Aetna", phone: "1-800-872-3862" },
        procedure: { code: "99283", name: getProcedureName("99283"), icd10: "R10.9" },
        diagnosis: "Abdominal pain, unspecified",
        status: "denied",
        submittedAt: "2025-08-12T22:15:00",
        estimatedCost: 550.00,
        denialReason: "Out-of-Network: Service performed by a non-contracted provider. Patient is fully liable.",
        provider: {
            name: "Mountain View Labs",
            npi: "3652062880",
            tin: "40-276790359",
            status: "Out-of-Network"
        },
        financial: {
            billed: "550.00",
            allowed: "N/A",
            deductibleStatus: "$1050.00 met of $1000.00"
        },
        documents: [],
        transcript: []
    },
    {
        id: "C2025-1007",
        patient: { name: "Elizabeth Rodriguez", dob: "1952-05-26", insuranceId: "IKW-4216-6448", policy: "Humana Medicare" },
        insurance: { provider: "Humana", phone: "1-800-457-4708" },
        procedure: { code: "80061", name: getProcedureName("80061"), icd10: "E11.9" },
        diagnosis: "Type 2 diabetes mellitus without complications",
        status: "pending",
        submittedAt: "2025-09-01T08:30:00",
        estimatedCost: 95.00,
        provider: {
            name: "Apex Cardiology Group",
            npi: "5325316860",
            tin: "74-224613411",
            status: "In-Network"
        },
        financial: {
            billed: "95.00",
            allowed: "85.00",
            deductibleStatus: "$0.00 met of $1000.00"
        },
        transcript: [
            { time: "09:05:00", speaker: "agent", text: "Checking status for claim C2025-1007..." },
            { time: "09:05:30", speaker: "system", text: "Claim is currently under internal review." }
        ],
        documents: []
    },
    {
        id: "C2025-1010",
        patient: { name: "David Jones", dob: "1975-06-25", insuranceId: "ECK-8035-9820", policy: "Cigna OAP" },
        insurance: { provider: "Cigna", phone: "1-800-244-6224" },
        procedure: { code: "43239", name: getProcedureName("43239"), icd10: "K21.9" },
        diagnosis: "Gastro-esophageal reflux disease without esophagitis",
        status: "denied",
        submittedAt: "2025-12-01T13:00:00",
        estimatedCost: 2500.00,
        denialReason: "Exceeds UCR: Paid $2,500 (Allowed Amount). Denied for the remaining $1,000 billed by the provider.",
        provider: {
            name: "Harbor View Radiology",
            npi: "5684118973",
            tin: "75-148473455",
            status: "In-Network"
        },
        financial: {
            billed: "3,500.00",
            allowed: "2,500.00",
            deductibleStatus: "$1050.00 met of $1000.00"
        },
        documents: [
            { id: "DOC-1010", name: "Procedure_Report.pdf", type: "pdf", date: "2025-11-28" }
        ],
        transcript: []
    }
];
