import GroupParticipants from './GroupParticipants';
import { IoIosPeople } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { IoMdExit } from "react-icons/io";
import LoadingButton from '../miscellaneous/LoadingButton';



const GroupInfo = () => {
const {setShowMenu , setCreateChat , currentChat , user , setShowGroupInfo  , chats , setChats , setCurrentChat , setShowAddMembers , showToast} = useAppContext() 
const[leaveGroupLoader , setLeaveGroupLoader] = useState<boolean>(false)
const[deleteGroupLoader , setDeleteGroupLoader] = useState<boolean>(false)

async function leaveGroupHandler(){
  setLeaveGroupLoader(true)
  try{
    const data = await fetch(`${process.env.REACT_APP_BACKEND_URL}chat/leave-group`, {
      method:"POST" ,
      headers:{
        "content-type":"application/json" ,
        "Authorization":`Bearer ${localStorage.getItem("token")}`
      }
       , body:JSON.stringify({group:currentChat?._id })
    }) 
    if(!chats){
      return 
    }
      const newChats = chats.filter((chat)=>chat._id!==currentChat?._id)
      setShowGroupInfo(false)

      setChats(newChats)
      setCurrentChat(null) 

  }catch(err){
    showToast("Error Occured")
  } finally{
    setLeaveGroupLoader(false)
  }


}

async function deleteGroupHandler(){
  try{
    setDeleteGroupLoader(true)
    const data = await fetch(`${process.env.REACT_APP_BACKEND_URL}chat/delete-group`, {
      method:"POST" ,
      headers:{
        "content-type":"application/json" ,
        "Authorization":`Bearer ${localStorage.getItem("token")}`
      }
       , body:JSON.stringify({group:currentChat?._id })
    }) 
    const resp = await data.json()
    if(!chats){
      return 
    }
    if(resp.success){
      const newChats = chats.filter((chat)=>chat._id!==currentChat?._id)
      setShowGroupInfo(false)

      setChats(newChats)
      setCurrentChat(null) 

    }else{
      showToast(resp.message)
    }
      

  }catch(err){
    showToast("Error Occured")
  }finally{
    setDeleteGroupLoader(true)
  }

}

  return (
    <div className="w-full h-full flex flex-col bg-[#262729] text-white relative">
      <p className='absolute top-4 left-2 hover:cursor-pointer' onClick={() => {
          setShowMenu(false);
      }}>
        <p onClick={()=>{setShowGroupInfo(false)}}>
        <IoMdClose className='h-8 w-8' />
        </p>
      </p>

      <div className="flex flex-col items-center p-4">
        <img src="group.png.png" className="w-16 h-16" alt="Group logo" />
        <p className="text-2xl mt-2">{currentChat?.name}</p>
        <p className="text-sm">{`Group : ${currentChat?.members.length} participants`}</p>
      </div>

      <div className="flex-grow flex flex-col px-4 overflow-hidden">
        <div className="flex items-center mb-4 border-b-[0.1px] border-b-slate-700">
          <IoIosPeople className="w-8 h-8 mr-2" />
          <p>{`${currentChat?.members.length} participants`}</p>
        </div>

        <div className="flex-grow overflow-y-auto mb-4 bg-[#262729]">
          {currentChat?.members.map((member)=><GroupParticipants member={member} isAdmin={currentChat.admin?._id === user?._id}></GroupParticipants>)}
        
        </div>

        <div className="flex flex-col space-y-2">
          
        {currentChat?.admin?._id===user?._id ? ( 

          <><button className="bg-indigo-500 text-white py-2 px-4 rounded" onClick={()=>{setCreateChat(true) ;setShowAddMembers(true) }}>
            Add Participant
          </button>
          <button className="bg-slate-700 text-white py-2 px-4 rounded flex items-center justify-center" onClick={deleteGroupHandler}>
            <MdDeleteForever className="mr-2" />
            {deleteGroupLoader ? <LoadingButton></LoadingButton>:"Delete Group"}
          </button>
          </>) : ( <><button className="bg-slate-700 text-white py-2 px-4 rounded flex items-center justify-center" onClick={leaveGroupHandler} disabled={leaveGroupLoader}>
            <IoMdExit className="mr-2" />
            {leaveGroupLoader ? <LoadingButton/> :"Leave Group"}
          </button>
          </>)
}

        </div>
      </div>
      <p className='w-full text-center bg-[#262729] sm:h-auto h-24'></p>

    </div>
  );
};

export default GroupInfo;
