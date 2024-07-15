/* eslint-disable react/no-unknown-property */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Trending from '../components/Sections/Trending';
import ShareButton from '../components/Sharebutton';
import { toast } from 'react-toastify';
import { logo1, logo2, logo3 } from '../components/base64';
import upload from '../assets/upload.svg';
import Modal from 'react-modal';
import Common from '../components/Sections/Common';

const colors = [
  { name: 'red', hex: '#f87171' },
  { name: 'green', hex: '#34d399' },
  { name: 'blue', hex: '#60a5fa' },
  { name: 'yellow', hex: '#fbbf24' },
  { name: 'purple', hex: '#a78bfa' }
];

const predefinedLogos = [
  { name: 'Logo 1', url: logo1 },
  { name: 'Logo 2', url: logo2 },
  { name: 'Logo 3', url: logo3 }
];

const InfographicDownloadPage = () => {
  const { id } = useParams();
  const [infographic, setInfographic] = useState(null);
  const [selectedColor, setSelectedColor] = useState(colors[0].hex);
  const [selectedLogo, setSelectedLogo] = useState('');
  const [customLogo, setCustomLogo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [downloadLink, setDownloadLink] = useState('');

  useEffect(() => {
    fetchInfographic();
  }, [id]);

  const fetchInfographic = async () => {
    try {
      const response = await fetch(`https://utility.caclouddesk.com/infographics/${id}`);
      const data = await response.json();
      setInfographic(data);
    } catch (error) {
      toast.error('INVALID INFOGRAPHIC LINK');
      console.error('Error fetching infographic:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    if (!selectedLogo && !customLogo) {
      toast.error('Please select a logo');
      return;
    }
    let logoBase64 = selectedLogo;
    if (customLogo) {
      logoBase64 = await convertToBase64(customLogo);
    }

    try {
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
      const blob = new Blob([arrayBuffer], { type: 'image/png' });

      const link = URL.createObjectURL(blob);
      setDownloadLink(link);
      setShowModal(true);
    } catch (error) {
      console.error('Error downloading infographic:', error);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = downloadLink;
    link.download = 'downloaded_image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowModal(false);
  };

  if (!infographic) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="container mx-auto my-10 p-4">
        <div className="container mx-auto p-4 flex flex-col lg:flex-row items-center lg:items-start">
          <div className="w-full lg:w-1/2">
            <img src={`https://utility.caclouddesk.com/uploads/footer-${infographic.image}`} alt="Infographic" className="m-auto rounded-md shadow-lg h-[450px]" />
          </div>
          <div className="w-full lg:w-1/2 mt-4 lg:mt-0 lg:ml-4 p-4 bg-white rounded-md">
            <h1 className="text-2xl font-bold mb-4 capitalize">{infographic.title}</h1>
            <form onSubmit={handleSubmit}>
              <div className='grid grid-cols-4 w-[80%] gap-y-3 grid-rows-4 justify-start font-manrope'>
                <label className=' col-span-1' htmlFor="name">Firm Name<span className='text-red-600'>*</span></label>
                <input type="text" className='border border-gray-400 rounded-md ml-2 col-span-3' name='name' required />
                <label className=' col-span-1' htmlFor="phone">Phone<span className='text-red-600'>*</span></label>
                <input type="text" className='border border-gray-400 rounded-md ml-2 col-span-3' name="phone" required />
                <label className=' col-span-1' htmlFor="email">E-mail<span className='text-red-600'>*</span></label>
                <input type="email" className='border border-gray-400 rounded-md ml-2 col-span-3' name="email" required />
                <label className=' col-span-1' htmlFor="website">Website<span className='text-red-600'>*</span></label>
                <input type="text" className='border border-gray-400 rounded-md ml-2 col-span-3' name="website" required />
                <label className=' col-span-1' htmlFor="logo">Logo Upload<span className='text-red-600'>*</span></label>
                <div className='col-span-3 flex items-center gap-5 '>
                  {predefinedLogos.map((logo) => (
                    <label key={logo.name} className="flex items-center mb-2">
                      <input
                        type="radio"
                        name="logo"
                        value={logo.url}
                        checked={selectedLogo === logo.url}
                        onChange={() => {
                          setSelectedLogo(logo.url);
                          setCustomLogo(null);
                        }}
                        className="mr-2"
                        hidden
                      />
                      <img src={logo.url} alt={logo.name} className={`w-12 h-12 rounded-full p-1 ${selectedLogo==logo.url?" border-black border-2":""}`} />
                    </label>
                  ))}
                  <p className='text-paragraph font-ubuntu'>or</p>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="logo"
                      value="custom"
                      checked={customLogo !== null}
                      onChange={() => {
                        setSelectedLogo('');
                        setCustomLogo(null);
                      }}
                      className="mr-2"
                      hidden
                    />
                    <input
                      type="file"
                      className={`w-12 h-12  rounded-full file:bg-transparent file:text-transparent file:border-none file:text-opacity-0`}
                      style={{backgroundImage: `url(${customLogo ? URL.createObjectURL(customLogo) : upload})`, backgroundSize: 'cover'}}
                      name='customLogo'
                      onChange={(e) => {setCustomLogo(e.target.files[0]);setSelectedLogo('');}}
                    />
                  </label>
                </div>
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
                      className={`inline-block w-8 h-8 rounded-full border-4 box-content ${selectedColor === color.hex ? 'border-blue-500 shadow-cyan-500 shadow-2xl' : 'border-transparent'}`}
                      style={{ backgroundColor: color.hex }}
                    ></span>
                  </label>
                ))}
              </div>
              <div className='flex justify-center gap-x-2'>
                <button type='submit' className='bg-[#31A6C7] font-bold text-white px-8 py-2 mt-5 rounded-md hover:text-secondary hover:bg-white hover:border-secondary border-2 border-transparent transition-all'>Download</button>
                <ShareButton title={`https://caclouddesk.com/infographics/download/${id}`} />
              </div>
            </form>
          </div>
        </div>
        <Trending />
        <Common/>
      </div>

      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        contentLabel="Image Preview"
        className="fixed inset-0 flex items-center justify-center z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
          <h2 className="text-xl font-semibold mb-4">Hooray! Your infographics is ready</h2>
          <img src={downloadLink} alt="Infographic Preview" className="h-[70vh] mb-4" />
          <button
            onClick={handleDownload}
            className="bg-[#31A6C7] text-white px-4 py-2 rounded-md hover:text-secondary hover:bg-white hover:border-secondary border-2 border-transparent transition-all"
          >
            Download
          </button>
        </div>
      </Modal>
    </>
  );
};

export default InfographicDownloadPage;
