from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


# --------- Chat ---------
class MessageBase(BaseModel):
    content: Optional[str] = None
    media_url: Optional[str] = None


class MessageCreate(MessageBase):
    private_chat_id: Optional[str] = None
    chat_room_id: Optional[str] = None


class MessageResponse(MessageBase):
    id: str
    sender_id: str
    content_at: datetime

    class Config:
        orm_mode = True


# --------- Private Chat ---------
class PrivateChatCreate(BaseModel):
    user1_id: str
    user2_id: str


class PrivateChatResponse(BaseModel):
    id: str
    user1_id: str
    user2_id: str
    created_at: datetime

    class Config:
        orm_mode = True


# --------- group chat---------
class ChatRoomCreate(BaseModel):
    name: str
    description: Optional[str] = None
    created_by: str


class ChatRoomResponse(BaseModel):
    id: str
    name: str
    description: Optional[str]
    created_by: str
    created_at: datetime

    class Config:
        orm_mode = True


# --------- member group ---------
class ChatRoomMemberCreate(BaseModel):
    chat_room_id: str
    user_id: str
    is_admin: Optional[bool] = False


class ChatRoomMemberResponse(BaseModel):
    id: str
    chat_room_id: str
    user_id: str
    is_admin: bool
    joined_at: datetime

    class Config:
        orm_mode = True
