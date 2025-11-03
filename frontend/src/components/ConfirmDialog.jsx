import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'

export default function ConfirmDialog({ open, title, description, confirmLabel = 'Confirmar', cancelLabel = 'Cancelar', onConfirm, onCancel }) {
  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="modal-root" onClose={onCancel}>
        <Transition.Child
          as={Fragment}
          enter="transition-opacity duration-150"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="modal-overlay" />
        </Transition.Child>
        <div className="modal-container">
          <Transition.Child
            as={Fragment}
            enter="transition-transform duration-200"
            enterFrom="opacity-0 translate-y-2 scale-95"
            enterTo="opacity-100 translate-y-0 scale-100"
            leave="transition-transform duration-150"
            leaveFrom="opacity-100 translate-y-0 scale-100"
            leaveTo="opacity-0 translate-y-2 scale-95"
          >
            <Dialog.Panel className="modal">
              <Dialog.Title className="modal-title">{title}</Dialog.Title>
              {description ? <Dialog.Description className="modal-desc">{description}</Dialog.Description> : null}
              <div className="modal-actions">
                <button className="btn" onClick={onCancel}>{cancelLabel}</button>
                <button className="btn danger" onClick={onConfirm}>{confirmLabel}</button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}
