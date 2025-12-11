export const claimsData = [
    {
        id: "CLM-2024-001",
        patient: { name: "John Doe", dob: "1985-03-15", insuranceId: "BCBS-8847291", policy: "PPO Gold" },
        insurance: { provider: "Blue Cross Blue Shield", phone: "1-800-262-2583" },
        procedure: { code: "70553", name: "MRI Brain w/ Contrast", icd10: "G43.909" },
        diagnosis: "Chronic migraine, unspecified",
        status: "speaking",
        submittedAt: "2024-12-11T14:23:00",
        estimatedCost: 2850,
        documents: [
            { id: "DOC-1", name: "Referral_Letter.pdf", type: "pdf", date: "2024-12-10" },
            { id: "DOC-2", name: "Clinical_Notes_Nov.pdf", type: "pdf", date: "2024-11-28" }
        ],
        transcript: [
            { time: "14:23:05", speaker: "agent", text: "Calling Blue Cross Blue Shield for pre-authorization..." },
            { time: "14:23:45", speaker: "system", text: "Navigating IVR menu: Press 1 for providers..." },
            { time: "14:24:12", speaker: "system", text: "Connected to representative queue. Estimated wait: 3 minutes" },
            { time: "14:27:33", speaker: "rep", text: "Thank you for calling Blue Cross, this is Maria. How can I help?" },
            { time: "14:27:45", speaker: "agent", text: "Hi Maria, I'm calling on behalf of Dr. Smith at Metro Health regarding a pre-authorization for member ID BCBS-8847291..." },
        ]
    },
    {
        id: "CLM-2024-002",
        patient: { name: "Sarah Johnson", dob: "1972-08-22", insuranceId: "AET-3392847", policy: "HMO Standard" },
        insurance: { provider: "Aetna", phone: "1-800-872-3862" },
        procedure: { code: "27447", name: "Total Knee Replacement", icd10: "M17.11" },
        diagnosis: "Primary osteoarthritis, right knee",
        status: "approved",
        submittedAt: "2024-12-11T09:15:00",
        estimatedCost: 45000,
        referenceNumber: "AUTH-9928374",
        resolvedAt: "2024-12-11T09:42:00",
        documents: [
            { id: "DOC-3", name: "XRay_Right_Knee.jpg", type: "image", date: "2024-12-09" }
        ],
        transcript: []
    },
    {
        id: "CLM-2024-003",
        patient: { name: "Michael Chen", dob: "1990-11-03", insuranceId: "UHC-5583921", policy: "EPO Plus" },
        insurance: { provider: "UnitedHealthcare", phone: "1-800-328-5979" },
        procedure: { code: "43239", name: "Upper GI Endoscopy w/ Biopsy", icd10: "K21.0" },
        diagnosis: "Gastro-esophageal reflux disease with esophagitis",
        status: "on_hold",
        submittedAt: "2024-12-11T13:45:00",
        estimatedCost: 3200,
        holdTime: "00:12:34",
        documents: [],
        transcript: [
            { time: "13:45:10", speaker: "agent", text: "Initiating call to UnitedHealthcare..." },
            { time: "13:46:02", speaker: "system", text: "IVR navigation complete. Transferred to pre-authorization department." },
            { time: "13:46:15", speaker: "system", text: "On hold. Playing hold music..." },
        ]
    },
    {
        id: "CLM-2024-004",
        patient: { name: "Emily Rodriguez", dob: "1968-05-30", insuranceId: "CIG-7712039", policy: "Open Access Plus" },
        insurance: { provider: "Cigna", phone: "1-800-244-6224" },
        procedure: { code: "93306", name: "Echocardiogram Complete", icd10: "I25.10" },
        diagnosis: "Atherosclerotic heart disease",
        status: "denied",
        submittedAt: "2024-12-10T16:30:00",
        estimatedCost: 1800,
        denialReason: "Prior conservative treatment required. Patient must complete 6 weeks of medication therapy before imaging.",
        resolvedAt: "2024-12-10T17:05:00",
        documents: [
            { id: "DOC-4", name: "Cardiology_Report.pdf", type: "pdf", date: "2024-12-10" }
        ],
        transcript: []
    },
    {
        id: "CLM-2024-005",
        patient: { name: "Robert Williams", dob: "1955-12-08", insuranceId: "HUM-4429183", policy: "Medicare Advantage" },
        insurance: { provider: "Humana", phone: "1-800-457-4708" },
        procedure: { code: "64483", name: "Lumbar Epidural Injection", icd10: "M54.5" },
        diagnosis: "Low back pain",
        status: "pending",
        submittedAt: "2024-12-11T15:10:00",
        estimatedCost: 2100,
        documents: [],
        transcript: []
    },
    {
        id: "CLM-2024-006",
        patient: { name: "Lisa Thompson", dob: "1983-07-19", insuranceId: "BCBS-2938471", policy: "PPO Silver" },
        insurance: { provider: "Blue Cross Blue Shield", phone: "1-800-262-2583" },
        procedure: { code: "58558", name: "Hysteroscopy with Biopsy", icd10: "N92.0" },
        diagnosis: "Excessive and frequent menstruation",
        status: "needs_info",
        submittedAt: "2024-12-11T11:20:00",
        estimatedCost: 4500,
        missingInfo: "Recent lab results (CBC, coagulation panel) required within last 30 days",
        documents: [
            { id: "DOC-5", name: "Previous_Labs.pdf", type: "pdf", date: "2024-10-15" }
        ],
        transcript: []
    },
    {
        id: "CLM-2024-007",
        patient: { name: "David Kim", dob: "1978-02-14", insuranceId: "AET-8827364", policy: "HMO Select" },
        insurance: { provider: "Aetna", phone: "1-800-872-3862" },
        procedure: { code: "29881", name: "Knee Arthroscopy", icd10: "M23.20" },
        diagnosis: "Derangement of meniscus",
        status: "calling",
        submittedAt: "2024-12-11T15:25:00",
        estimatedCost: 8500,
        documents: [
            { id: "DOC-6", name: "MRI_Report.pdf", type: "pdf", date: "2024-12-01" }
        ],
        transcript: [
            { time: "15:25:05", speaker: "agent", text: "Dialing Aetna pre-authorization line..." },
            { time: "15:25:18", speaker: "system", text: "Call connected. Listening for IVR prompts..." },
        ]
    },
];
