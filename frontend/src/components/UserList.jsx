import React,{useEffect,useState} from "react";
import { createPrivateChat } from "../../services/chatService";
import { getUsers } from "../../services/userService";

const UserList = ({currentUserId,onChatCreated}) => {
    const [users,setUsers]=useState([]);
    useEffect(()=> {
        getUsers().then(setUsers);
    },[]);

    const handleStartChat =async(targetUserId)=>{
        try{
            const result =await createPrivateChat(currentUserId,targetUserId);
            onChatCreated(result.id);
        }catch(error){
            console.error("Error creating chat:",error);
        }
    };

    return(
        <div className="user-list">
            <h3>Select a user to start a chat:</h3>
            {users.filter((u)=>u.id !==currentUserId).map((user)=> (
                <div
                key={user.id}
                onClick={()=>handleStartChat(user.id)}
                className="user-item"
                >
                    {user.usename}
                </div>
            ))}
        </div>
    );
};

export default UserList;