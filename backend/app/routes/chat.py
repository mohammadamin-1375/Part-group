from fastapi import APIRouter , Depends , HTTPException , status
from sqlalchemy.orm import Session
from uuid import uuid4
from app.db.database import SessionLocal
from app.models.chat import PrivateChat,ChatRoom,ChatRoomMember,Message
from app.schemas.chat import (
    PrivateChatCreate,PrivateChatResponse,ChatRoomCreate,ChatRoomMemberCreate,ChatRoomResponse,
    ChatRoomMemberResponse ,MessageCreate,MessageResponse
)
from datetime import datetime
from app.dependencies.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix = "/chat" , tags=["Chat"])
def get_db():
    db = SessionLocal()
    try :
        yield db
    finally:
        db.close()

#private chat
@router.post("/private",response_model=PrivateChatResponse)
def create_private_chat(data:PrivateChatCreate , db:Session=Depends(get_db)):
    # if chte on or off
    existing_chat = db.query(PrivateChat).filter(
        ((PrivateChat.user1_id==data.user1_id) & (PrivateChat.user2_id==data.user2_id)) | ((PrivateChat.user1_id==data.user2_id) & (PrivateChat.user2_id==data.user1_id))
    ).first()
    if existing_chat:
        return existing_chat
    chat=PrivateChat(
        id=str(uuid4()),
        user1_id=data.user1_id,
        user2_id=data.user2_id,
        created_at=datetime.utcnow())
    db.add(chat)
    db.commit()
    db.refresh(chat)
    return chat

#create group chat
@router.post("/group",response_model=ChatRoomResponse)
def create_chat_room(data :ChatRoomCreate , db: Session=Depends(get_db)):
    chat_room=ChatRoom(
        id=str(uuid4()),
        name=data.name,
        description=data.description,
        created_by=data.create_by,
        created_at=datetime.utcnow()
    )
    db.add(chat_room)
    db.commit()
    db.refresh(chat_room)
    return chat_room

# add user for group
@router.post("/group/add-member",response_model=ChatRoomMemberResponse)
def add_member_to_group(data:ChatRoomMemberCreate , db:Session=Depends(get_db)):
    member=ChatRoomMember(
        id=str(uuid4()),
        chat_room_id = data.chat_room_id,
        user_id=data.user_id,
        is_admin=data.is_admin,
        joined_at=datetime.utcnow()
    )
    db.add(member)
    db.commit()
    db.refresh(member)
    return member

#send chat
@router.post("/send-message", response_model=MessageResponse)
def send_message(data: MessageCreate, db: Session = Depends(get_db), current_user:User=Depends(get_current_user)):
    if not data.private_chat_id and not data.chat_room_id:
        raise HTTPException(status_code=400, detail="Either private_chat_id or chat_room_id must be provided.")

    msg = Message(
        id=str(uuid4()),
        content=data.content,
        media_url=data.media_url,
        private_chat_id=data.private_chat_id,
        chat_room_id=data.chat_room_id,
        sender_id=str(current_user.id), 
        content_at=datetime.utcnow()
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg


#resive private chat
@router.get("/private/{chat_id}/messages",response_model=list[MessageResponse])
def get_private_messages(chat_id:str ,db:Session=Depends(get_db)):
    return db.query(Message).filter(Message.private_chat_id == chat_id).order_by(Message.created_at).all()

#resive group chat
@router.get("/group/{room_id}/messages",response_model=list[MessageResponse])
def get_group_messages(room_id:str ,db:Session=Depends(get_db)):
    return db.query(Message).filter(Message.chat_room_id ==room_id).order_by(Message.created_at).all()

@router.get("/private", response_model=list[PrivateChatResponse])
def get_all_private_chats(user_id: str, db: Session = Depends(get_db)):
    chats = db.query(PrivateChat).filter(
        (PrivateChat.user1_id == user_id) | (PrivateChat.user2_id == user_id)
    ).all()
    return chats
@router.get("/group", response_model=list[ChatRoomResponse])
def get_all_chat_rooms(db: Session = Depends(get_db)):
    return db.query(ChatRoom).all()