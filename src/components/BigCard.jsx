import { Link } from 'react-router-dom'
import page from '../assets/page.svg'
const Card = () => {
  return (
    <>
      <div className='bg-white md:w-auto w-[46%] p-2 rounded-md space-y-4 pb-4'>
        <div className='lg:w-72 h-64 bg-primary2 rounded-md'></div>
        <div className='lg:w-72 flex items-center justify-between px-1'>
          <p className='text-xs px-2 py-1 bg-green-200 text-green-700 font-semibold rounded-full'>Accounting</p>
          <p className='flex text-paragraph text-sm'> <img src={page} alt="" />10k posters</p>
        </div>
        <div className='lg:w-72'>
          <h1 className='font-manrope font-bold'>Visual aids for financial reporting and analysis.</h1>
        </div>
        <div className='flex justify-center'>
          <Link href="#" className="w-full text-center py-1 bg-secondary text-white hover:bg-secondaryhover transition-colors rounded-full"> Join For Free</Link>
        </div>
      </div>
    </>
  )
}

export default Card
