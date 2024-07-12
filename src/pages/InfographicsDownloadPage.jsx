/* eslint-disable react/no-unknown-property */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Trending from '../components/Sections/Trending';
import ShareButton from '../components/Sharebutton';
import { toast } from 'react-toastify';
const colors = [
  { name: 'red', hex: '#f87171' },
  { name: 'green', hex: '#34d399' },
  { name: 'blue', hex: '#60a5fa' },
  { name: 'yellow', hex: '#fbbf24' },
  { name: 'purple', hex: '#a78bfa' }
];

const InfographicDownloadPage = () => {
  const { id } = useParams();
  const [infographic, setInfographic] = useState(null);
  const [selectedColor, setSelectedColor] = useState(colors[0].name);

  useEffect(() => {
    fetchInfographic();
  }, [id]);

  const fetchInfographic = async () => {
    try {
      const response = await fetch(`https://utility.caclouddesk.com/infographics/${id}`); // Replace with your API endpoint
      const data = await response.json();
      setInfographic(data);
    } catch (error) {
      toast.error('INVALID INFOGRAPHIC LINK');
      console.error('Error fetching infographic:', error);
    }
  };

  if (!infographic) {
    return <div>Loading...</div>;
  }
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    formData.forEach((value, key) => {
      console.log(key, value);
    });

    const file = formData.get('logo');
    const convertToBase64 = (file) => {

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    };

    try {
      const logoBase64 = await convertToBase64(file);

      const response = await fetch(`https://utility.caclouddesk.com/infographics/${id}/download`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          info: {
            name: formData.get('name'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            website: formData.get('website'),
            logoBase64: logoBase64,
          },
          bgColor: selectedColor,

        })
      });
      const arrayBuffer = await response.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: 'image/png' }); // adjust the type as needed

      // Create a link element and trigger a download
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'downloaded_image.png'; // adjust the filename as needed
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    catch (error) {
      console.error('Error downloading infographic:', error);
    }


      // alert('Downloaded');
    };
    return (
      <>
        <div className="container mx-auto my-10 p-4">
          <div className="container mx-auto p-4 flex flex-col lg:flex-row items-center lg:items-start">
            <div className="w-full lg:w-1/2">
              <img src={`https://utility.caclouddesk.com/uploads/footer-${infographic.image}`} alt="Infographic" className="m-auto rounded-md shadow-lg h-[450px]" />

            </div>
            <div className="w-full lg:w-1/2 mt-4 lg:mt-0 lg:ml-4 p-4 bg-white rounded-md">
              <h1 className="text-2xl font-bold mb-4 capitalize"> {infographic.title}</h1>
              <form action="" onSubmit={handleSubmit}>
                <div className='grid grid-cols-4 w-[80%] gap-y-3 grid-rows-4 justify-start font-manrope'>
                  <label className=' col-span-1' htmlFor="">Firm Name<span className='text-red-600'>*</span></label>
                  <input type="text" className='border border-gray-400 rounded-md ml-2 col-span-3' name='name' />
                  <label className=' col-span-1' htmlFor="">Phone<span className='text-red-600'>*</span></label>
                  <input type="text" className='border border-gray-400 rounded-md ml-2 col-span-3' name="phone" />
                  <label className=' col-span-1' htmlFor="">E-mail<span className='text-red-600'>*</span></label>
                  <input type="text" className='border border-gray-400 rounded-md ml-2 col-span-3' name="email" />
                  <label className=' col-span-1' htmlFor="">Website<span className='text-red-600'>*</span></label>
                  <input type="text" className='border border-gray-400 rounded-md ml-2 col-span-3' name="website" />
                  <label className=' col-span-1' htmlFor="">Logo Upload<span className='text-red-600'>*</span></label>
                  <input type="file" className='border border-gray-400 rounded-md ml-2 col-span-3' name='logo' />
                </div>

                <h1 className='mt-10 mb-5 font-manrope font-bold'>Select Colour</h1>
                <div className="flex space-x-4">
                  {colors.map((color) => (
                    <label key={color.name} className="cursor-pointer">
                      <input
                        type="radio"
                        name="color"
                        value={color.hex}
                        checked={selectedColor === color.hex}
                        onChange={() => setSelectedColor(color.hex)}
                        className="hidden"
                      />
                      <span
                        className={`inline-block w-8 h-8 rounded-full border-4 box-content ${selectedColor === color.hex ? 'border-blue-500 shadow-cyan-500 shadow-2xl' : 'border-transparent'
                          }`}
                        style={{ backgroundColor: color.hex }}
                      ></span>
                    </label>
                  ))}
                </div>
                <div className='flex justify-center gap-x-2'>
                  <button type='submit' className='bg-[#31A6C7] font-bold text-white px-8 py-2 mt-5 rounded-md hover:text-secondary hover:bg-white hover:border-secondary border-2 border-transparent transition-all'>Download</button>
                  <ShareButton title={infographic.title} shareUrl={`https://utility.caclouddesk.com/uploads/${infographic.image}`} />

                </div>
              </form>
            </div>
          </div>
        </div>
        <Trending />
      </>
    );
  };

  export default InfographicDownloadPage;