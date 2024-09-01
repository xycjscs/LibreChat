import React from 'react';
import { Transition } from '@headlessui/react';
import { cn } from '~/utils/';

// Define the TokenModal component
function TokenModal({ open, onClose }) {
  return (
    // Use a Transition to apply enter and leave animations
    <Transition show={open}>
      {/* Modal backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black bg-opacity-50"
        onClick={onClose} // Close the modal when clicking the backdrop
        role="button" // Add a semantic role
        tabIndex="0" // Make it focusable
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {onClose();} // Handle Enter or Space key
        }}
      />

      {/* Modal window */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <Transition.Child
          enter="transition ease-out duration-300 transform"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-200 transform"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
          className="mx-auto max-w-md rounded-lg bg-white shadow-lg"
        >
          {/* Modal content */}
          <div
            style={{ textAlign: 'center' }}
            className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6 sm:align-middle"
          >
            {/* Close button */}
            <button
              aria-label="Close"
              onClick={onClose}
              className={cn(
                'absolute right-2 top-2',
                'rounded transition-colors hover:bg-gray-200',
              )}
            >
              &times;
            </button>

            <h3 className="text-lg font-medium leading-6 text-gray-900">兑换通用Token</h3>
            <div className="mt-2">
              <p className="text-lg text-gray-500" style={{ color: 'red' }}>
                支付时请将邮箱补充到“添加备注”
              </p>
              <p className="text-sm text-gray-500">
                微信扫码支付任意金额，100元可兑换1000万Token。
              </p>
              <img
                src="/assets/token-image.jpg"
                alt="QR code for WeChat payment"
                style={{ width: '200px', display: 'block', margin: 'auto' }}
              />
              <p className="text-sm text-gray-500">5分钟内到账，如遇问题联系公众号miml_ai。</p>
            </div>
          </div>
        </Transition.Child>
      </div>
    </Transition>
  );
}

export default TokenModal;
