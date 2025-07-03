import React,{useEffect , useState} from "react";
import axios from "axios";

const StartPrivateChat =({ currentUserId , onChatCreated}) => {
    const [users,setUsers] = useState([]);
    const [selectedUserId ,setSelectedChatId] =useState("");
    useEffect(() => {
        axios.get("http://localhost:8000/users",{
            headers:{
                Authorization:`Bearer ${localStorage.getItem("token")}`,
            },
        }).catch((err)=> {
            console.error("Cannot load users",err);
        });
    },[]);

    const srtartChat = () => {
        if (!selectedUserId) return;
        axios.post("http://localhost:8000/chat/private",{
            user1_id:currentUserId,
            user2_id: selectedUserId,
        },
    {
        headers:{
            Authorization:`Bearer ${localStorage.getItem("token")}`,
        },
    }).then((res) => {
        onChatCreated(res.data);
    }).catch((err) => {
        console.error("Cannot start chat:",err);
    });
    };

    return(
        <div className="p-4 boarder rounded">
            <h2 className="text-lg font-bold mb-2">Start New Chat</h2>
            <select 
            value={selectedUserId}
            onClick={(e) => setSelectedChatId(e.target.value)}
            className="w-full boarder p-2 rounded mb-4"
            >
                <option value="">Select User</option>
                {users.map((u) => (
                    <option key={u.id} value={u.id}>
                        {u.username} ({users.email})
                    </option>
                ))
                }
            </select>
            <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={startChat}
            >
                Start Chat
            </button>
        </div>
    );
};
export default StartPrivateChat;