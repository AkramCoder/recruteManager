
import React from 'react'
import { Modal, Button } from "react-bootstrap";
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';

const DeleteConfirmationModal = ({ showModal, hideModal, confirmModal,type, id, message }) => {

    return (
        <Modal show={showModal} onHide={hideModal}>
            <Modal.Header closeButton>
                <Modal.Title>Delete {type} Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="alert alert-danger">{message}</div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={hideModal}>
                    Annuler
                </Button>
                <Button variant="danger" onClick={() => confirmModal(type,id)}>
                    Supprimer
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default DeleteConfirmationModal;