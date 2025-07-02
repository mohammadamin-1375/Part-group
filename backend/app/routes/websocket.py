from fastapi import APIRouter , WebSocket , WebSocketDisconnect , Depends
from typing import List , Dict
from uuid import UUID
from app.db.database import get_db
from sqlalchemy.orm import Session
from app.models.chat import Message
from datetime import datetime
router = APIRouter()

active_connections: Dict[str , List[WebSocket]]={}

#new connection
@router.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket:WebSocket , room_id:str , db:Session=Depends(get_db)):
    await websocket.accept()

    if room_id not in active_connections:
        active_connections[room_id]=[]
    
    active_connections[room_id].append(websocket)

    try:
        while (1):
            data = await websocket.receive_json()
            sender_id = data["sender_id"]
            content=data["content"]
            media_url=data.get("media_url",None)

            msg = Message(
                id=str(UUID()),
                sender_id=sender_id,
                content=content,
                media_url=media_url,
                chat_room_id=room_id,
                created_at=datetime.utcnow()
            )
            db.add(msg)
            db.commit()

            #send all user chat
            for connection in active_connections[room_id]:
                await connection.send_json({
                    "sender_id":sender_id,
                    "content":content,
                    "media_url":media_url,
                    "timestamp":msg.created_at.isoformat()
                })
    except WebSocketDisconnect:
        active_connections[room_id].remove(websocket)
