import { useState, useCallback } from 'react';
import { ModalType, ModalButton } from '../components/AppModal';

interface ModalState {
  visible: boolean;
  type: ModalType;
  title: string;
  message?: string;
  buttons?: ModalButton[];
}

const initial: ModalState = {
  visible: false,
  type: 'info',
  title: '',
};

export function useModal() {
  const [modal, setModal] = useState<ModalState>(initial);

  const showModal = useCallback((
    type: ModalType,
    title: string,
    message?: string,
    buttons?: ModalButton[],
  ) => {
    setModal({ visible: true, type, title, message, buttons });
  }, []);

  const hideModal = useCallback(() => {
    setModal(prev => ({ ...prev, visible: false }));
  }, []);

  // Convenience helpers
  const showSuccess = useCallback((title: string, message?: string) =>
    showModal('success', title, message), [showModal]);

  const showError = useCallback((title: string, message?: string) =>
    showModal('error', title, message), [showModal]);

  const showInfo = useCallback((title: string, message?: string) =>
    showModal('info', title, message), [showModal]);

  return { modal, showModal, hideModal, showSuccess, showError, showInfo };
}
