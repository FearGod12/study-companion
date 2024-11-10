import React from 'react'

const TaskList = () => {
  return (
      <div className="flex flex-col gap-4 py-6 px-6">
          <h1 className="font-bold text-sm">Tasks for today</h1>
          <div className="bg-[#0242C04D] px-2 py-2 rounded-lg">
              <h2 className='font-bold'>Mathematics</h2>
              <p className='text-sm'>Lorem ipsum dolor sit amet consectetur.</p>
          </div>
          <div className="bg-[#5A02704D] px-2 py-2 rounded-lg">
              <h2 className='font-bold'>Chemistry</h2>
              <p className='text-sm'>Lorem ipsum dolor sit amet consectetur.</p>
          </div>
          <div className="bg-[#EEAE084D] px-2 py-2 rounded-lg">
              <h2 className='font-bold'>Vet Medicine</h2>
              <p className='text-sm'>Lorem ipsum dolor sit amet consectetur.</p>
          </div>
      </div>
  );
}

export default TaskList