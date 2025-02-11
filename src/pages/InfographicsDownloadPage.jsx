/* eslint-disable react/no-unknown-property */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Trending from '../components/Sections/Trending';
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
  const [blobs, setBlobs] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    website: ''
  });

  const [warnings, setWarnings] = useState({
    name: '',
    phone: '',
    email: '',
    website: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (value.length > 20) {
      setWarnings({ ...warnings, [name]: 'Warning: Input length may affect the output' });
    } else {
      setWarnings({ ...warnings, [name]: '' });
    }
  };
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
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this Infographic!',
          text: 'Here is an Infographic I generated using CA CloudDesk Infographics.',
          files: [blobs], // Link to the infographic image
        });
        toast.success('Shared successfully!');
      } catch (error) {
        console.error('Error sharing:', error);
        toast.error('Error sharing the infographic.');
      }
    } else {
      toast.error('Web Share API not supported in this browser.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGenerating(true);
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
      const filess = new File([blob], 'downloaded_image.png', { type: 'image/png' });
      setBlobs(filess);
      console.log(filess)
      const link = URL.createObjectURL(blob);
      setDownloadLink(link);
      setShowModal(true);
      setGenerating(false);
    } catch (error) {
      toast.error('Error downloading infographic.');
      setGenerating(false);
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
                <label className='col-span-1' htmlFor="name">Firm Name<span className='text-red-600'>*</span></label>
                <div className="col-span-3">
                  <input
                    type="text"
                    className='border border-gray-400 rounded-md ml-2 w-full'
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  {warnings.name && <span className='m-2 text-xs text-yellow-600'>{warnings.name}</span>}
                </div>

                <label className='col-span-1' htmlFor="phone">Phone<span className='text-red-600'>*</span></label>
                <div className="col-span-3">
                  <input
                    type="text"
                    className='border border-gray-400 rounded-md ml-2 w-full'
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                  {warnings.phone && <span className='m-2 text-xs text-yellow-600'>{warnings.phone}</span>}
                </div>

                <label className='col-span-1' htmlFor="email">E-mail<span className='text-red-600'>*</span></label>
                <div className="col-span-3">
                  <input
                    type="email"
                    className='border border-gray-400 rounded-md ml-2 w-full'
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  {warnings.email && <span className='m-2 text-xs text-yellow-600'>{warnings.email}</span>}
                </div>

                <label className='col-span-1' htmlFor="website">Website<span className='text-red-600'>*</span></label>
                <div className="col-span-3">
                  <input
                    type="text"
                    className='border border-gray-400 rounded-md ml-2 w-full'
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    required
                  />
                  {warnings.website && <span className=' m-2 text-xs text-yellow-600'>{warnings.website}</span>}
                </div>
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
                      <img src={logo.url} alt={logo.name} className={`w-12 h-12 rounded-full p-1 ${selectedLogo == logo.url ? " border-black border-2" : ""}`} />
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
                    <img src={customLogo ? URL.createObjectURL(customLogo) : upload} alt='custom logo' className={`w-12 h-12 rounded-full p-1 ${customLogo ? 'border-2 border-black' : ''} `} />
                    <input
                      type="file"
                      className={`absolute w-12 h-12  rounded-full file:bg-transparent file:text-transparent file:border-none file:text-opacity-0`}
                      name='customLogo'
                      onChange={(e) => { setCustomLogo(e.target.files[0]); setSelectedLogo(''); }}
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
              <div >
                <button type='submit' disabled={generating} className='bg-[#31A6C7] font-bold text-white px-8 py-2 mt-5 rounded-md hover:text-secondary hover:bg-white hover:border-secondary border-2 border-transparent transition-all'>Generate</button>
              </div>
            </form>
          </div>
        </div>
        <Trending />
        <Common />
      </div>

      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        contentLabel="Image Preview"
        className="fixed inset-0 flex items-center justify-center z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full flex flex-col justify-center items-center">
          <div className='w-full flex items-center justify-between'>
            <h2 className="text-xl font-semibold mb-1">Hooray! Your infographics is ready</h2>
            <button onClick={() => setShowModal(false)}>
              <svg width="30" height="30" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M28.5 9.5L9.5 28.5" stroke="#7D7D7D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M9.5 9.5L28.5 28.5" stroke="#7D7D7D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>

          </div>
          <img src={downloadLink} alt="Infographic Preview" className="h-[70vh] mb-4" />
          <div className='w-full flex justify-end gap-x-5'>

            <button
              onClick={handleDownload}
              className="bg-[#31A6C7] text-white px-4 py-2 rounded-md hover:text-secondary hover:bg-white hover:border-secondary border-2 border-transparent transition-all"
            >
              Download
            </button>
            <button
              onClick={handleShare}
              className=" flex items-center bg-white text-black px-4 py-2 rounded-md hover:text-secondary hover:bg-white hover:border-secondary border-2 border-gray-700 transition-all"
            >
              Share
              <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.7394 8.26091C18.2522 8.26091 19.4785 7.03456 19.4785 5.52178C19.4785 4.009 18.2522 2.78265 16.7394 2.78265C15.2266 2.78265 14.0002 4.009 14.0002 5.52178C14.0002 7.03456 15.2266 8.26091 16.7394 8.26091Z" stroke="#3C4242" stroke-width="1.82609" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M5.78283 14.6522C7.29561 14.6522 8.52196 13.4259 8.52196 11.9131C8.52196 10.4003 7.29561 9.17395 5.78283 9.17395C4.27005 9.17395 3.0437 10.4003 3.0437 11.9131C3.0437 13.4259 4.27005 14.6522 5.78283 14.6522Z" stroke="#3C4242" stroke-width="1.82609" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M16.7394 21.0435C18.2522 21.0435 19.4785 19.8172 19.4785 18.3044C19.4785 16.7916 18.2522 15.5652 16.7394 15.5652C15.2266 15.5652 14.0002 16.7916 14.0002 18.3044C14.0002 19.8172 15.2266 21.0435 16.7394 21.0435Z" stroke="#3C4242" stroke-width="1.82609" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M8.14771 13.2917L14.3838 16.9257" stroke="#3C4242" stroke-width="1.82609" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M14.3747 6.90045L8.14771 10.5344" stroke="#3C4242" stroke-width="1.82609" stroke-linecap="round" stroke-linejoin="round" />
              </svg>

            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default InfographicDownloadPage;
