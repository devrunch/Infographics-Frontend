import star from '../assets/star.svg'
import arrow from '../assets/arrow.svg'
import arrow2 from '../assets/arrow2.svg'
import BigCard from '../components/BigCard'
import goldstar from '../assets/goldstar.svg'
import Trending from '../components/Sections/Trending'
import { Link } from 'react-router-dom'
import Common from '../components/Sections/Common'
import img from '../assets/12.png'
import { useState } from 'react'
import { useEffect } from 'react'
import TopPicks from '../components/Sections/TopPicks'
import imagess from '../assets/imagess.png'
const Home = () => {
    const [infographics, setInfographics] = useState([]);
    const fetchInfographics = async () => {
        try {
            const response = await fetch('https://utility.caclouddesk.com/infographics/categories');
            const data = await response.json();
            setInfographics(data);
        } catch (error) {
            console.error('Error fetching infographics:', error);
        }
    };
    useEffect(() => {
        fetchInfographics();
    }, []);
    return (
        <>
            <section className='w-full h-[90vh] flex items-center justify-around'>
                <div className="w-1/4 lg:flex hidden flex-col items-end space-y-10">
                    <div className='w-44'>
                        <div className='bg-primary2 w-40 overflow-hidden rounded-xl flex justify-center items-center'>
                            <img src={img} alt="" />
                        </div>
                        <p className='font-manrope px-1'>How it Works</p>
                        <p className='text-xs text-paragraph px-1'>2 mins</p>
                    </div>
                    <div className='w-60 space-y-3'>
                        <div className='flex'>
                            {
                                Array(5).fill().map((item, index) => (
                                    <img src={star} alt="star" key={index} className='w-6' />))
                            }
                        </div>
                        <p className='text-paragraph font-manrope'>
                            &quot;These infographic templates have transformed how I present complex financial data to clients. Easy to use and highly professional!&quot;
                        </p>
                        <div className='flex items-center gap-x-2'>
                            <div className='w-10 h-10 rounded-full bg-primary2'></div>
                            <div>
                                <p className='font-bold font-manrope '>Priya S</p>
                                <p className='text-xs font-dmsans text-paragraph'>Chartered Accountant</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="lg:w-1/2 text-center space-y-10">
                    <h2 className="text-primary font-manrope font-semibold uppercase">Professional Infographic Templates</h2>
                    <h1 className="lg:text-7xl text-5xl font-bold font-ubuntu ">Engage Clients with Infographics</h1>
                    <p className="text-paragraph font-manrope lg:px-20">Use our expertly crafted infographic templates to boost client engagement and retention. Perfect for accountants and tax professionals, our templates turn complex information into engaging visuals.</p>
                    <div className="mx-auto">
                        <Link to="/search" className="px-5 py-4 bg-secondary text-white hover:bg-secondaryhover transition-colors rounded-full"> Join For Free</Link>
                        <Link to="#" className="text-secondary hover:underline px-5 py-4">Learn More</Link>
                    </div>
                </div>
                <div className="w-1/4 lg:flex hidden flex-col  space-y-10">
                    <img src={arrow} alt="" className='w-52' />
                    <div className='w-48 m-auto'>
                        <div className='w-48  rounded-xl bg-primary2 overflow-hidden '>
                            <img src="https://utility.caclouddesk.com/uploads/1720813804805-689974353.png" alt="" className='object-cover' />
                        </div>
                        <div className='px-1 flex justify-between items-start'>
                            <div className='flex items-center gap-x-1'>
                                <p className='text-paragraph uppercase'> 4.8 </p>
                                <img src={star} alt="" />
                                <p className='font-dmsans text-xs text-paragraph uppercase'>(10K+)</p>
                            </div>
                            <div className='text-center'>
                                <p>ITR Filing</p>
                                <p className='text-xs px-2 py-1 bg-green-200 text-green-700 font-semibold rounded-full'>Accounting</p>
                            </div>
                        </div>
                    </div>

                </div >
            </section>
            <section className='bg-background py-10 space-y-5'>
                <h2 className="text-primary font-manrope font-semibold uppercase text-center">Explore Our Categories</h2>
                <h1 className='text-center text-5xl font-manrope font-bold'>Discover Diverse Infographic Templates</h1>
                <p className='text-paragraph text-base text-center '>Browse through our extensive collection of infographic templates designed to cater to<br /> various needs of accountants, tax professionals, and more.</p>
                <div className='flex flex-wrap gap-3 justify-center items-stretch overflow-hidden lg:gap-x-16 lg:px-16'>
                    {infographics && infographics.slice(0, 6).map((infographic, index) => (
                        <BigCard
                            key={index}
                            imgSrc={infographic.image}
                            link={`/infographic/${infographic._id}`}
                            category={infographic.tags[0]}
                            description={infographic.description}
                        />
                    ))}
                </div>
                <div className='flex justify-center'>
                    <Link to="/search" className="px-5 py-4 bg-secondary text-white hover:bg-secondaryhover transition-colors rounded-full"> Explore All Templates</Link>
                </div>
            </section>
            <TopPicks/>
            <section className='flex justify-center items-center py-10 flex-wrap'>
                <div className='lg:w-1/2 flex flex-col items-center justify-center gap-y-5' >
                     
                    <img src={imagess} className='h-full ' alt="" />
                    
                    {/* <div className='bg-slate-200 flex w-9/12 p-4 rounded-2xl gap-x-5 items-center justify-between'>
                        <img src={goldstar} alt="" />
                        <p className='font-manrope font-semibold text-base'>Stay ahead with regularly updated templates reflecting the latest trends and standards in the industry.</p>
                    </div> */}
                </div>
                <div className='lg:w-1/2 space-y-10 lg:pr-36 px-3 lg:text-left text-center'>
                    <h2 className="text-primary font-manrope font-semibold uppercase">Why Choose us?</h2>
                    <h1 className="text-5xl font-bold font-ubuntu ">Why Our Infographic Templates Stand Out?</h1>
                    <p className="text-paragraph font-manrope text-lg">Our infographic templates are designed to help accountants and tax professionals communicate more effectively. With easy customization, high-quality designs, and user-friendly features, our templates make your work more efficient and impactful.</p>
                    <div className='mt-24 space-y-8 text-left'>
                        <div className='flex items-center gap-x-4'>
                            <img src={arrow2} alt="" />
                            <div>
                                <p className='font-semibold text-lg font-manrope'>Customizable Templates</p>
                                <p className='text-sm text-paragraph font-manrope'>Tailor each infographic to match your firm’s branding and client needs.</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-x-4'>
                            <img src={arrow2} alt="" />
                            <div>
                                <p className='font-semibold text-lg font-manrope'>Easy-to-Use</p>
                                <p className='text-sm text-paragraph font-manrope'>User-friendly interface designed for professionals with limited design experience.</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-x-4'>
                            <img src={arrow2} alt="" />
                            <div>
                                <p className='font-semibold text-lg font-manrope'>Customizable Templates</p>
                                <p className='text-sm text-paragraph font-manrope'>Professionally crafted templates ensuring clarity and visual appeal.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Trending />
            <Common />
        </>
    )
}

export default Home
