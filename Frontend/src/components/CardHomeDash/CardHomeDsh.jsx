import React from 'react'
import {Bs0Square} from "react-icons/bs";

function CardHomeDsh({ icon: Icon, TitleAtas, SubJudul, bgColor }) {
    return (
      <div className="relative">
        <div className="box1 w-72 px-2 relative bg-white py-2 rounded-xl">
          <div className="flex justify-between">
            <div
              className={`box1 absolute px-6 py-4 left-6 rounded-xl top-[20px] text-white ${bgColor} `}
            >
              <Icon size={36} />
            </div>
            <div className="flex w-full justify-end pr-8 py-5">
              <div className="flex flex-col">
                <h1 className="text-md font-light">{TitleAtas}</h1>
                <h1 className="text-2xl font-bold">{SubJudul}</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  

export default CardHomeDsh