import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

function TokenModal({ open, onClose }) {
  return (
    <Transition show={open} as={Fragment}>
      <Dialog open={open} onClose={onClose} className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>
          <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              style={{ textAlign: 'center' }}
              className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6 sm:align-middle"
            >
              <h3 className="text-lg font-medium leading-6 text-gray-900">兑换通用Token</h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  微信扫码支付任意金额，100元可兑换1000万Token。
                </p>
                <p className="text-sm text-gray-500" style={{ color: 'red' }}>
                  务必备注邮箱，核对收款人（**超）
                </p>
                <img
                  src="/assets/token-image-min.jpg"
                  alt="Token Image"
                  style={{ width: '200px', display: 'block', margin: 'auto' }}
                />
                <p className="text-sm text-gray-500">5分钟内到账，如遇问题联系公众号miml_ai。</p>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}

export default TokenModal;
