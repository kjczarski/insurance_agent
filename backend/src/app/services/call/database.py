import json
from datetime import datetime, timezone
from pathlib import Path

import aiosqlite
from loguru import logger

from app.services.call.models import CallTranscript


class TranscriptRepository:
    def __init__(self, db_path: str | Path = "data/transcripts.db") -> None:
        self.db_path = Path(db_path)
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
    
    async def initialize(self) -> None:
        async with aiosqlite.connect(self.db_path) as db:
            await db.execute("""
                CREATE TABLE IF NOT EXISTS transcripts (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    conversation_id TEXT UNIQUE NOT NULL,
                    agent_id TEXT NOT NULL,
                    status TEXT NOT NULL,
                    transcript TEXT,
                    metadata TEXT,
                    analysis TEXT,
                    user_id TEXT,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                )
            """)
            await db.execute("""
                CREATE INDEX IF NOT EXISTS idx_conversation_id 
                ON transcripts(conversation_id)
            """)
            await db.execute("""
                CREATE INDEX IF NOT EXISTS idx_created_at 
                ON transcripts(created_at)
            """)
            await db.commit()
            logger.info(f"Database initialized at {self.db_path}")
    
    async def save_transcript(self, transcript: CallTranscript) -> None:
        now = datetime.now(timezone.utc).isoformat()
        
        async with aiosqlite.connect(self.db_path) as db:
            await db.execute("""
                INSERT INTO transcripts (
                    conversation_id, agent_id, status, transcript, 
                    metadata, analysis, user_id, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(conversation_id) DO UPDATE SET
                    status = excluded.status,
                    transcript = excluded.transcript,
                    metadata = excluded.metadata,
                    analysis = excluded.analysis,
                    user_id = excluded.user_id,
                    updated_at = excluded.updated_at
            """, (
                transcript.conversation_id,
                transcript.agent_id,
                transcript.status,
                json.dumps(transcript.transcript) if transcript.transcript else None,
                json.dumps(transcript.metadata) if transcript.metadata else None,
                json.dumps(transcript.analysis) if transcript.analysis else None,
                transcript.user_id,
                now,
                now,
            ))
            await db.commit()
            logger.info(f"Saved transcript for conversation {transcript.conversation_id}")
    
    async def get_transcript(self, conversation_id: str) -> CallTranscript | None:
        async with aiosqlite.connect(self.db_path) as db:
            db.row_factory = aiosqlite.Row
            async with db.execute(
                "SELECT * FROM transcripts WHERE conversation_id = ?",
                (conversation_id,)
            ) as cursor:
                row = await cursor.fetchone()
                if not row:
                    return None
                
                return CallTranscript(
                    conversation_id=row["conversation_id"],
                    agent_id=row["agent_id"],
                    status=row["status"],
                    transcript=json.loads(row["transcript"]) if row["transcript"] else None,
                    metadata=json.loads(row["metadata"]) if row["metadata"] else None,
                    analysis=json.loads(row["analysis"]) if row["analysis"] else None,
                    user_id=row["user_id"],
                )
    
    async def list_transcripts(self, limit: int = 100, offset: int = 0) -> list[CallTranscript]:
        async with aiosqlite.connect(self.db_path) as db:
            db.row_factory = aiosqlite.Row
            async with db.execute(
                """
                SELECT * FROM transcripts 
                ORDER BY created_at DESC 
                LIMIT ? OFFSET ?
                """,
                (limit, offset)
            ) as cursor:
                rows = await cursor.fetchall()
                
                return [
                    CallTranscript(
                        conversation_id=row["conversation_id"],
                        agent_id=row["agent_id"],
                        status=row["status"],
                        transcript=json.loads(row["transcript"]) if row["transcript"] else None,
                        metadata=json.loads(row["metadata"]) if row["metadata"] else None,
                        analysis=json.loads(row["analysis"]) if row["analysis"] else None,
                        user_id=row["user_id"],
                    )
                    for row in rows
                ]


def create_transcript_repository(db_path: str | Path = "data/transcripts.db") -> TranscriptRepository:
    return TranscriptRepository(db_path)
