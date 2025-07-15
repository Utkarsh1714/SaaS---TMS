import { Button } from '@/components/ui/button'
import React from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import { MdEdit } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

const TaskDetails = () => {
    const navigate = useNavigate();
  return (
    <div className='w-full'>
        <div className="w-full flex items-start justify-between">
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          className="bg-slate-200 cursor-pointer"
        >
          <IoIosArrowBack className="mr-1" /> Back
        </Button>
      </div>
    </div>
  )
}

export default TaskDetails