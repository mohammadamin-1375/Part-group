from sqlalchemy import Column, String, ForeignKey, DateTime, Boolean, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from app.db.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class PrivateChat(Base):
    __tablename__ = "private_chats"

    id = Column(String, primary_key=True, default=generate_uuid)
    user1_id = Column(String, ForeignKey("users.id"))
    user2_id = Column(String, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user1 = relationship("User", foreign_keys=[user1_id])
    user2 = relationship("User", foreign_keys=[user2_id])
    messages = relationship("Message", back_populates="private_chat")

class ChatRoom(Base):
    __tablename__ = "chat_rooms"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    is_group = Column(Boolean, default=True)
    create_by = Column(String, ForeignKey("users.id"))
    create_at = Column(DateTime(timezone=True), server_default=func.now())

    members = relationship("ChatRoomMember", back_populates="chat_room")
    messages = relationship("Message", back_populates="chat_room")

class ChatRoomMember(Base):
    __tablename__ = "chat_room_members"

    id = Column(String, primary_key=True, default=generate_uuid)
    chat_room_id = Column(String, ForeignKey("chat_rooms.id"))  # ← fixed here
    user_id = Column(String, ForeignKey("users.id"))
    is_admin = Column(Boolean, default=False)
    joined_at = Column(DateTime(timezone=True), server_default=func.now())

    chat_room = relationship("ChatRoom", back_populates="members")
    user = relationship("User", back_populates="chat_rooms")

class Message(Base):
    __tablename__ = "message"

    id = Column(String, primary_key=True, default=generate_uuid)
    sender_id = Column(String, ForeignKey("users.id"), nullable=False)
    content = Column(Text, nullable=True)
    media_url = Column(String, nullable=True)
    content_at = Column(DateTime(timezone=True), server_default=func.now())

    private_chat_id = Column(String, ForeignKey("private_chats.id"), nullable=True)
    chat_room_id = Column(String, ForeignKey("chat_rooms.id"), nullable=True)

    sender = relationship("User", back_populates="message_sent")
    private_chat = relationship("PrivateChat", back_populates="messages")
    chat_room = relationship("ChatRoom", back_populates="messages")
