import  { useState } from 'react';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon
} from 'react-share';
import Modal from './Modal';

const ShareButton = ({ shareUrl, title }) => {
    console.log(navigator.canShare)
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div>
      <button onClick={openModal} className=" bg-[#31A6C7] font-bold text-white px-8 py-2 mt-5 rounded-md hover:text-secondary hover:bg-white hover:border-secondary border-2 border-transparent transition-all">
        Share Infographic
      </button>
      <Modal isOpen={modalIsOpen} onClose={closeModal}>
        <h2 className="text-xl font-bold mb-4">Share this infographic</h2>
        <div className="flex space-x-4 justify-center">
          <FacebookShareButton url={shareUrl} quote={title}>
            <FacebookIcon size={40} round />
          </FacebookShareButton>
          <TwitterShareButton url={shareUrl} title={title}>
            <TwitterIcon size={40} round />
          </TwitterShareButton>
          <LinkedinShareButton url={shareUrl} title={title}>
            <LinkedinIcon size={40} round />
          </LinkedinShareButton>
          <WhatsappShareButton url={shareUrl} title={title}>
            <WhatsappIcon size={40} round />
          </WhatsappShareButton>
        </div>
        
      </Modal>
    </div>
  );
};

export default ShareButton;
