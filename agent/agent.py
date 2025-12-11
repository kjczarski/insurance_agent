import os
import signal
import time
from typing import Any, Dict

from fastapi import FastAPI, BackgroundTasks, HTTPException
from pydantic import BaseModel
from elevenlabs.client import ElevenLabs
from elevenlabs.conversational_ai.conversation import Conversation, ConversationInitiationData, ClientTools
from elevenlabs.conversational_ai.default_audio_interface import DefaultAudioInterface

# --- CONFIGURATION ---
app = FastAPI(title="ClaimReclaimer Agent API")

# Load from environment variables
AGENT_ID = os.getenv("AGENT_ID")
API_KEY = os.getenv("API_KEY")

if not AGENT_ID or not API_KEY:
    raise ValueError("AGENT_ID and API_KEY must be set in environment variables")

client = ElevenLabs(api_key=API_KEY)

# --- DATA MODELS ---
class CallRequest(BaseModel):
    patient_name: str
    claim_id: str
    cpt_code: str
    denial_amount: str

# --- THE TOOLS (RCM Logic) ---

def check_realtime_status(params: Dict[str, Any]) -> str:
    """Simulates checking the hospital's RCM system API."""
    print(f"\n[TOOL LOG] 🔍 Agent is checking status...")
    # Simulate API latency
    time.sleep(1.5) 
    print(f"[TOOL LOG] ✅ Status found: 'Denied - Medical Necessity'")
    return "The system shows the claim was received on Jan 1st but denied for 'Lack of Medical Necessity'."

def send_appeal_document(params: Dict[str, Any]) -> str:
    """Simulates sending a fax/email via an integration like Phaxio or SendGrid."""
    print(f"\n[TOOL LOG] 📤 Agent is generating appeal packet...")
    time.sleep(1.0)
    print(f"[TOOL LOG] 📨 Faxing to Payer...")
    print(f"[TOOL LOG] ✅ Transmission Successful: Batch #FAX-9988")
    return "The Letter of Medical Necessity has been successfully faxed. Confirmation ID is FAX-9988."

def trigger_human_handoff(params: Dict[str, Any]) -> str:
    """Handles logic when the AI gives up."""
    reason = params.get('reason', 'Unknown')
    print(f"\n[TOOL LOG] ⚠️ ESCALATION TRIGGERED: {reason}")
    print(f"[TOOL LOG] 📞 Bridging call to Senior Biller (SIP Transfer)...")
    return "Transferring the call to a senior specialist now."

# --- AGENT LOGIC ---

def start_agent_session(claim_data: dict):
    """
    Starts the audio session on the server/machine running this code.
    In a real telephony deployment, this would trigger a Twilio outbound call.
    """
    print(f"\n>>> 🚀 STARTING CALL FOR: {claim_data['Patient_Name']} <<<\n")

    # Create ClientTools and register the tools
    client_tools = ClientTools()
    client_tools.register(tool_name="check_realtime_status", handler=check_realtime_status)
    client_tools.register(tool_name="send_appeal_document", handler=send_appeal_document)
    client_tools.register(tool_name="trigger_human_handoff", handler=trigger_human_handoff)

    # Initialize the Conversation with Dynamic Variables
    conversation = Conversation(
        client=client,
        agent_id=AGENT_ID,
        requires_auth=True,
        audio_interface=DefaultAudioInterface(),
        config=ConversationInitiationData(
            dynamic_variables=claim_data
        ),
        client_tools=client_tools,
        callback_agent_response=lambda response: print(f"🤖 Agent: {response}"),
        callback_user_transcript=lambda transcript: print(f"👤 User: {transcript}"),
    )

    # Start the session
    conversation.start_session()

    # Wait for completion (this blocks the thread, which is why we use BackgroundTasks)
    conversation.wait_for_session_end()
    print("\n>>> 🏁 CALL ENDED <<<")

# --- API ENDPOINTS ---

@app.post("/start-call")
async def trigger_call(request: CallRequest, background_tasks: BackgroundTasks):
    """
    API Endpoint to kick off the agent.
    Send a JSON body with the claim details.
    """
    
    # 1. Prepare the Dynamic Context (Mapping your API request to Prompt Vars)
    # Note: We hardcode the 'static' provider details here
    agent_context = {
        "Provider": "Apex Cardiology Group",
        "Payer_Name": "Blue Cross Blue Shield",
        "Provider_NPI": "1234567890",
        "Provider_TIN": "98-7654321",
        "Member_ID": "HGS-9988-7766",
        "DOS": "2024-01-15",
        "Patient_DOB": "1984-05-12",
        
        # Dynamic fields from the request
        "Patient_Name": request.patient_name,
        "Claim_ID": request.claim_id,
        "Amount": request.denial_amount,
        
        # Both variable keys for safety
        "CPT_Code": request.cpt_code,
        "CPT__Code_": request.cpt_code
    }

    # 2. Run the agent in the background so the API returns immediately
    background_tasks.add_task(start_agent_session, agent_context)

    return {
        "status": "initiated", 
        "message": f"Agent is calling about Claim {request.claim_id}"
    }

@app.get("/health")
def health_check():
    return {"status": "online"}

# --- RUN INSTRUCTION ---
# Run with: uvicorn app:app --reload