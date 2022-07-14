/* eslint-disable react/prop-types */
import React from 'react';
import styles from './Modal.module.css';
import { Button, Divider } from '@aws-amplify/ui-react';

const Modal = ({ setIsOpen, info, title }) => {
  return (
    <>
      <div className={styles.darkBG} onClick={() => setIsOpen(false)} />
      <div className={styles.centered}>
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <h5 className={styles.heading}>{title}</h5>
          </div>
          <Divider size="small" />
          {/* <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
            <IconClose style={{ marginBottom: "-3px" }} />
          </button> */}
          <div className={styles.modalContent}>{info}</div>
          <div className={styles.modalActions}>
            <div className={styles.actionsContainer}>
              <Button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
